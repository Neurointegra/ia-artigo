import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const { id } = params

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Ensure user is an author and owns the article
    const articleResult = await db.query(
      "SELECT author_id, title, portuguese_abstract, english_abstract, keywords, introduction_central_theme, introduction_justification, objectives, article_type, has_collected_data, collected_data_path, generate_graphs, graph_parameters, has_figures, figures_path, transform_thesis, thesis_dissertation_path FROM articles WHERE id = $1",
      [id],
    )
    if (articleResult.rows.length === 0 || articleResult.rows[0].author_id !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const article = articleResult.rows[0]
    const { section, prompt_input } = await request.json()
    const {
      title,
      centralTheme,
      justification,
      objectives,
      keywords,
      articleType,
      hasCollectedData,
      collectedDataFileName,
      generateGraphs,
      graphParameters,
      hasFigures,
      figureFileName,
      transformThesis, // NEW
      thesisDissertationFileName, // NEW
    } = prompt_input

    let generatedContent = ""
    let fullPrompt = ""
    let updateField = ""

    // Construct prompt based on the requested section
    switch (section) {
      case "full_article":
        fullPrompt = `Generate a complete academic article based on the following research details.
        The article should include: Title, Abstract (Portuguese and English), Keywords, Introduction, Methodology, Results, Discussion, and Conclusion.
        Format the output clearly with headings for each section.

        Research Details:
        Article Type: ${articleType}
        Title: ${title}
        Central Theme: ${centralTheme}
        Justification: ${justification}
        Objectives: ${objectives}
        Keywords: ${keywords}
        ${
          transformThesis
            ? `The user has provided a thesis/dissertation file named "${thesisDissertationFileName}". Synthesize the core content, arguments, and findings from this thesis/dissertation into the academic article. Assume you have full access to its content.`
            : ""
        }
        ${
          hasCollectedData
            ? `The research involves collected data, provided in a file named "${collectedDataFileName || "unspecified data file"}". Please suggest how results might be presented based on this.`
            : ""
        }
        ${generateGraphs ? `The user wants to generate graphs based on data, with parameters: "${graphParameters}". Suggest relevant data visualizations.` : ""}
        ${hasFigures ? `The user plans to include figures, such as: ${figureFileName || "unspecified figure"}. Mention where figures might be relevant.` : ""}

        Consider the typical structure and academic tone for a ${articleType} article.
        `
        updateField = "generated_full_content"
        break
      case "introduction":
        fullPrompt = `Generate a detailed introduction for an academic article.
        Article Type: ${articleType}
        Article Title: ${title}
        Central Theme: ${centralTheme}
        Justification: ${justification}
        Objectives: ${objectives}
        Keywords: ${keywords}
        ${
          transformThesis
            ? `This introduction should be based on a thesis/dissertation file named "${thesisDissertationFileName}". Synthesize its introduction.`
            : ""
        }
        ${hasCollectedData ? `The research involves collected data, provided in a file named "${collectedDataFileName || "unspecified data file"}".` : ""}
        ${generateGraphs ? `The user wants to generate graphs with parameters: ${graphParameters}.` : ""}
        ${hasFigures ? `The user plans to include figures, such as: ${figureFileName || "unspecified figure"}.` : ""}
        Ensure the introduction flows logically, sets the stage for the research, and aligns with the specified article type and research parameters.`
        updateField = "introduction_theoretical_framework"
        break
      case "abstract_pt":
        fullPrompt = `Generate a concise abstract in Portuguese for an academic article.
        Article Title: ${article.title}
        Main content/summary: ${prompt_input || article.introduction_central_theme || article.portuguese_abstract || "Not specified"}
        Keywords: ${article.keywords || ""}
        Focus on objective, methodology, main results, and conclusion.`
        updateField = "portuguese_abstract"
        break
      case "abstract_en":
        fullPrompt = `Generate a concise abstract in English for an academic article.
        Article Title: ${article.title}
        Main content/summary: ${prompt_input || article.introduction_central_theme || article.english_abstract || "Not specified"}
        Keywords: ${article.keywords || ""}
        Focus on objective, methodology, main results, and conclusion.`
        updateField = "english_abstract"
        break
      default:
        return NextResponse.json({ message: "Invalid section for generation" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using GPT-4o as per AI SDK documentation [^2]
      prompt: fullPrompt,
    })
    generatedContent = text

    if (updateField) {
      await db.query(`UPDATE articles SET ${updateField} = $1, updated_at = NOW() WHERE id = $2`, [
        generatedContent,
        id,
      ])
    }

    return NextResponse.json({ generatedContent })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
