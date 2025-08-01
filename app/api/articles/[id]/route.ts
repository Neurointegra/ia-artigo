import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// Helper function to check user role and ownership
const checkAccess = async (user: any, articleId: string, requiredRole = "author") => {
  if (!user) return false

  if (user.role === "admin") return true

  const article = await db.query("SELECT author_id FROM articles WHERE id = $1", [articleId])
  if (article.rows.length === 0) return false

  if (requiredRole === "author" && article.rows[0].author_id === user.id) return true
  if (requiredRole === "reviewer") {
    const review = await db.query("SELECT id FROM reviews WHERE article_id = $1 AND reviewer_id = $2", [
      articleId,
      user.id,
    ])
    return review.rows.length > 0
  }
  return false
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const { id } = params

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Admins can view any article, authors can view their own, reviewers can view assigned ones
    const hasAccess = await checkAccess(session.user, id, session.user.role)
    if (!hasAccess && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const article = await db.query("SELECT * FROM articles WHERE id = $1", [id])

    if (article.rows.length === 0) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article.rows[0])
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const { id } = params

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const hasAccess = await checkAccess(session.user, id, "author")
    if (!hasAccess) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const updates = await request.json()
    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")
    const values = Object.values(updates)

    const updatedArticle = await db.query(
      `UPDATE articles SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values],
    )

    if (updatedArticle.rows.length === 0) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(updatedArticle.rows[0])
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const { id } = params

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const hasAccess = await checkAccess(session.user, id, "author") // Only author or admin can delete
    if (!hasAccess && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const deletedArticle = await db.query("DELETE FROM articles WHERE id = $1 RETURNING id", [id])

    if (deletedArticle.rows.length === 0) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
