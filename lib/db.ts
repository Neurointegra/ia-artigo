// For a real application, use environment variables for connection string
// const connectionString = process.env.DATABASE_URL;

// Mock database client for demonstration
class MockDB {
  private data: { [key: string]: any[] } = {
    articles: [],
    article_authors: [],
    reviews: [],
    users: [
      {
        id: "user-123",
        email: "author@example.com",
        role: "author",
        name: "John Doe",
        password_hash: "hashed_password",
      },
      {
        id: "user-456",
        email: "reviewer@example.com",
        role: "reviewer",
        name: "Jane Smith",
        password_hash: "hashed_password",
      },
      {
        id: "user-789",
        email: "admin@example.com",
        role: "admin",
        name: "Admin User",
        password_hash: "hashed_password",
      },
    ],
  }
  private nextId = 1

  async query(sql: string, params?: any[]): Promise<{ rows: any[] }> {
    console.log("Mock DB Query:", sql, params)

    // Basic mock for INSERT into articles
    if (sql.includes("INSERT INTO articles")) {
      const newArticle = {
        id: `article-${this.nextId++}`,
        title: params?.[0],
        author_id: params?.[1],
        status: params?.[2],
        created_at: new Date(),
        updated_at: new Date(),
        portuguese_abstract: params?.[3],
        english_abstract: params?.[4],
        objectives: params?.[5],
        keywords: params?.[6],
        article_type: params?.[7],
        has_collected_data: params?.[8],
        collected_data_path: params?.[9],
        generate_graphs: params?.[10],
        graph_parameters: params?.[11],
        has_figures: params?.[12],
        figures_path: params?.[13],
        transform_thesis: params?.[14],
        thesis_dissertation_path: params?.[15],
        introduction_central_theme: params?.[16],
        introduction_justification: params?.[17],
        introduction_theoretical_framework: params?.[18],
        introduction_general_objective: params?.[19],
        introduction_specific_objectives: params?.[20],
        introduction_hypotheses: params?.[21],
        introduction_problem_question: params?.[22],
        methodology_research_type: params?.[23],
        methodology_instruments: params?.[24],
        methodology_population_sample: params?.[25],
        methodology_inclusion_exclusion_criteria: params?.[26],
        methodology_collection_procedures: params?.[27],
        methodology_analysis_procedures: params?.[28],
        methodology_ethics_approved: params?.[29],
        results_raw_data_path: params?.[30],
        results_graphs_tables_path: params?.[31],
        results_statistical_analyses: params?.[32],
        discussion_comparison: params?.[33],
        discussion_implications: params?.[34],
        discussion_limitations: params?.[35],
        discussion_suggestions: params?.[36],
        conclusion_revisit_objectives: params?.[37],
        conclusion_main_findings: params?.[38],
        conclusion_relevance: params?.[39],
        conclusion_recommendations: params?.[40],
        generated_full_content: null,
        exported_pdf_path: null,
        exported_word_path: null, // NEW: exported_word_path
      }
      this.data.articles.push(newArticle)
      return { rows: [newArticle] }
    }

    // Basic mock for INSERT into article_authors
    if (sql.includes("INSERT INTO article_authors")) {
      const newAuthorEntry = {
        article_id: params?.[0],
        user_id: params?.[1],
        author_order: params?.[2],
        is_corresponding_author: params?.[3],
      }
      this.data.article_authors.push(newAuthorEntry)
      return { rows: [newAuthorEntry] }
    }

    // Basic mock for SELECT articles
    if (sql.includes("SELECT * FROM articles") && !params) {
      return { rows: this.data.articles }
    }
    if (
      sql.includes("SELECT a.* FROM articles a JOIN article_authors aa ON a.id = aa.article_id WHERE aa.user_id = $1")
    ) {
      const userId = params?.[0]
      const userArticles = this.data.articles.filter((article) =>
        this.data.article_authors.some((aa) => aa.article_id === article.id && aa.user_id === userId),
      )
      return { rows: userArticles }
    }
    if (sql.includes("SELECT a.* FROM articles a JOIN reviews r ON a.id = r.article_id WHERE r.reviewer_id = $1")) {
      const reviewerId = params?.[0]
      const reviewedArticles = this.data.articles.filter((article) =>
        this.data.reviews.some((review) => review.article_id === article.id && review.reviewer_id === reviewerId),
      )
      return { rows: reviewedArticles }
    }
    if (sql.includes("SELECT * FROM articles WHERE id = $1")) {
      const articleId = params?.[0]
      const article = this.data.articles.find((a) => a.id === articleId)
      return { rows: article ? [article] : [] }
    }
    if (sql.includes("SELECT author_id FROM articles WHERE id = $1")) {
      const articleId = params?.[0]
      const article = this.data.articles.find((a) => a.id === articleId)
      return { rows: article ? [{ author_id: article.author_id }] : [] }
    }
    if (sql.includes("SELECT author_id, generated_full_content FROM articles WHERE id = $1")) {
      const articleId = params?.[0]
      const article = this.data.articles.find((a) => a.id === articleId)
      return {
        rows: article ? [{ author_id: article.author_id, generated_full_content: article.generated_full_content }] : [],
      }
    }
    if (sql.includes("SELECT id FROM reviews WHERE article_id = $1 AND reviewer_id = $2")) {
      const [articleId, reviewerId] = params || []
      const review = this.data.reviews.find((r) => r.article_id === articleId && r.reviewer_id === reviewerId)
      return { rows: review ? [review] : [] }
    }

    // Basic mock for UPDATE articles
    if (sql.includes("UPDATE articles SET") && sql.includes("WHERE id = $1")) {
      const articleId = params?.[0]
      const updates = params?.slice(1)
      const articleIndex = this.data.articles.findIndex((a) => a.id === articleId)
      if (articleIndex !== -1) {
        const updatedArticle = { ...this.data.articles[articleIndex] }
        const fields = sql
          .split("SET ")[1]
          .split(" WHERE")[0]
          .split(", ")
          .map((f) => f.split(" = ")[0])
        fields.forEach((field, index) => {
          if (field !== "updated_at") {
            // updated_at is handled by NOW()
            ;(updatedArticle as any)[field] = updates[index]
          }
        })
        updatedArticle.updated_at = new Date()
        this.data.articles[articleIndex] = updatedArticle
        return { rows: [updatedArticle] }
      }
      return { rows: [] }
    }

    // Basic mock for DELETE articles
    if (sql.includes("DELETE FROM articles WHERE id = $1")) {
      const articleId = params?.[0]
      const initialLength = this.data.articles.length
      this.data.articles = this.data.articles.filter((a) => a.id !== articleId)
      return { rows: initialLength > this.data.articles.length ? [{ id: articleId }] : [] }
    }

    return { rows: [] } // Default empty response for unhandled queries
  }
}

export const db = new MockDB() // Use this for local development/mocking

// For a real production setup with Neon:
// import { neon } from '@neondatabase/serverless';
// export const sql = neon(process.env.DATABASE_URL!);
// export const db = {
//   query: async (text: string, params?: any[]) => {
//     const result = await sql(text, params);
//     return { rows: result };
//   }
// };

// For a real production setup with Supabase:
// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// export const db = {
//   query: async (text: string, params?: any[]) => {
//     // This would require parsing SQL or using Supabase's query builder
//     // For simplicity, you'd typically use Supabase's client methods directly
//     // e.g., supabase.from('articles').select('*').eq('id', params[0])
//     console.warn('Supabase client does not directly support raw SQL query method like this mock. Adapt your queries.');
//     return { rows: [] };
//   }
// };
