import { NextResponse } from "next/server"
import { auth } from "@/lib/auth" // Assuming you have an auth utility
import { db } from "@/lib/db" // Assuming you have a database client utility

// Helper function to check user role
const checkRole = (user: any, requiredRole: string) => {
  if (!user || user.role !== requiredRole) {
    return false
  }
  return true
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let articles
    if (session.user.role === "admin") {
      articles = await db.query("SELECT * FROM articles")
    } else if (session.user.role === "author") {
      articles = await db.query(
        "SELECT a.* FROM articles a JOIN article_authors aa ON a.id = aa.article_id WHERE aa.user_id = $1",
        [session.user.id],
      )
    } else if (session.user.role === "reviewer") {
      articles = await db.query(
        "SELECT a.* FROM articles a JOIN reviews r ON a.id = r.article_id WHERE r.reviewer_id = $1",
        [session.user.id],
      )
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(articles.rows)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!checkRole(session?.user, "author")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { title, ...articleData } = await request.json()

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 })
    }

    const newArticle = await db.query(
      `INSERT INTO articles (title, author_id, status, created_at, updated_at,
        portuguese_abstract, english_abstract, objectives, keywords, article_type, has_collected_data, collected_data_path, generate_graphs, graph_parameters, has_figures, figures_path,
        transform_thesis, thesis_dissertation_path,
        introduction_central_theme, introduction_justification, introduction_theoretical_framework, introduction_general_objective,
        introduction_specific_objectives, introduction_hypotheses, introduction_problem_question,
        methodology_research_type, methodology_instruments, methodology_population_sample,
        methodology_inclusion_exclusion_criteria, methodology_collection_procedures,
        methodology_analysis_procedures, methodology_ethics_approved, results_raw_data_path,
        results_graphs_tables_path, results_statistical_analyses, discussion_comparison,
        discussion_implications, discussion_limitations, discussion_suggestions,
        conclusion_revisit_objectives, conclusion_main_findings, conclusion_relevance,
        conclusion_recommendations)
       VALUES ($1, $2, 'draft', NOW(), NOW(), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41)
       RETURNING *`,
      [
        title,
        session.user.id,
        articleData.portuguese_abstract || null,
        articleData.english_abstract || null,
        articleData.objectives || null,
        articleData.keywords || null,
        articleData.article_type || "article",
        articleData.has_collected_data || false,
        articleData.collected_data_path || null,
        articleData.generate_graphs || false,
        articleData.graph_parameters || null,
        articleData.has_figures || false,
        articleData.figures_path || null,
        articleData.transform_thesis || false, // NEW: transform_thesis
        articleData.thesis_dissertation_path || null, // NEW: thesis_dissertation_path
        articleData.introduction_central_theme || null,
        articleData.introduction_justification || null,
        articleData.introduction_theoretical_framework || null,
        articleData.introduction_general_objective || null,
        articleData.introduction_specific_objectives || null,
        articleData.introduction_hypotheses || null,
        articleData.introduction_problem_question || null,
        articleData.methodology_research_type || null,
        articleData.methodology_instruments || null,
        articleData.methodology_population_sample || null,
        articleData.methodology_inclusion_exclusion_criteria || null,
        articleData.methodology_collection_procedures || null,
        articleData.methodology_analysis_procedures || null,
        articleData.methodology_ethics_approved || false,
        articleData.results_raw_data_path || null,
        articleData.results_graphs_tables_path || null,
        articleData.results_statistical_analyses || null,
        articleData.discussion_comparison || null,
        articleData.discussion_implications || null,
        articleData.discussion_limitations || null,
        articleData.discussion_suggestions || null,
        articleData.conclusion_revisit_objectives || null,
        articleData.conclusion_main_findings || null,
        articleData.conclusion_relevance || null,
        articleData.conclusion_recommendations || null,
      ],
    )

    // Add the current user as an author
    await db.query(
      "INSERT INTO article_authors (article_id, user_id, author_order, is_corresponding_author) VALUES ($1, $2, 1, TRUE)",
      [newArticle.rows[0].id, session.user.id],
    )

    return NextResponse.json(newArticle.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
