"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import ArticleGeneratorForm from "@/components/article-generator-form"

interface Article {
  id: string
  title: string
  status: string
  author_id: string
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        const response = await fetch("/api/articles")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch articles")
        }
        const data: Article[] = await response.json()
        setArticles(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <p className="ml-2 text-gray-700">Carregando artigos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-red-500">
        <p>Erro ao carregar artigos: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {" "}
      {/* Added subtle background and vertical padding */}
      <main className="container mx-auto px-4">
        {" "}
        {/* Centralized content with horizontal padding */}
        {/* Logo Section */}
        <div className="flex justify-center mb-10">
          {" "}
          {/* Increased bottom margin */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%201%20de%20ago.%20de%202025%2C%2002_14_36-YRWoSnr5UjzVH3TiJbNjHHANCKqK5c.png"
            alt="IA artigo logo"
            className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
          />
        </div>
        <h1 className="mb-8 text-4xl font-extrabold text-center text-gray-900">Meus Artigos</h1>{" "}
        {/* Larger, bolder title */}
        <ArticleGeneratorForm />
        {articles.length === 0 ? (
          <p className="text-gray-600 text-center mt-12 text-lg">Nenhum artigo encontrado. Crie um novo!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {" "}
            {/* Increased gap and top margin */}
            {articles.map((article) => (
              <Card key={article.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                {" "}
                {/* Added shadow and hover effect */}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">{article.title}</CardTitle>{" "}
                  {/* Styled title */}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Status: {article.status}</p>
                  <p className="text-sm text-gray-600">ID do Autor: {article.author_id}</p>
                  <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">Ver Detalhes</Button>{" "}
                  {/* Styled button */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
