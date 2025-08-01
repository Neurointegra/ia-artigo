import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const { id } = params

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Ensure user is an author and owns the article, or is an admin
    const articleResult = await db.query("SELECT author_id, generated_full_content FROM articles WHERE id = $1", [id])
    if (
      articleResult.rows.length === 0 ||
      (articleResult.rows[0].author_id !== session.user.id && session.user.role !== "admin")
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const article = articleResult.rows[0]
    const { format, sendToEmail } = await request.json() // Get sendToEmail flag

    if (!article.generated_full_content) {
      return NextResponse.json({ message: "No content generated for this article yet." }, { status: 400 })
    }

    let fileUrl = ""
    let updateField = ""
    let responseKey = ""

    if (format === "pdf") {
      fileUrl = `/placeholder.pdf?articleId=${id}&format=pdf&query=academic article example`
      updateField = "exported_pdf_path"
      responseKey = "pdfUrl"

      // NEW: Simulate sending email if requested
      if (sendToEmail && session.user.email) {
        console.log(`Simulating sending PDF for article ID ${id} to ${session.user.email}`)
        // In a real application, you would integrate with an email service here:
        // import nodemailer from 'nodemailer'; // or Resend, SendGrid, etc.
        // const transporter = nodemailer.createTransport(...);
        // await transporter.sendMail({
        //   from: 'no-reply@iartigo.com',
        //   to: session.user.email,
        //   subject: `Seu Artigo iArtigo: ${article.title}`,
        //   html: `<p>Olá,</p><p>Seu artigo "${article.title}" está pronto e anexado.</p><p>Atenciosamente,<br/>Equipe iArtigo</p>`,
        //   attachments: [{
        //     filename: `artigo-${id}.pdf`,
        //     path: fileUrl, // This would be the actual path to the generated PDF file
        //     contentType: 'application/pdf'
        //   }]
        // });
      }
    } else if (format === "word") {
      fileUrl = `/placeholder.docx?articleId=${id}&format=word&query=editable academic article example`
      updateField = "exported_word_path"
      responseKey = "wordUrl"
    } else {
      return NextResponse.json({ message: "Unsupported export format" }, { status: 400 })
    }

    // Update the database with the simulated file path
    await db.query(`UPDATE articles SET ${updateField} = $1, updated_at = NOW() WHERE id = $2`, [fileUrl, id])

    return NextResponse.json({ [responseKey]: fileUrl })
  } catch (error) {
    console.error("Error exporting article:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
