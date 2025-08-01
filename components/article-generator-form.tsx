"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function ArticleGeneratorForm() {
  const [title, setTitle] = useState("")
  const [centralTheme, setCentralTheme] = useState("")
  const [justification, setJustification] = useState("")
  const [objectives, setObjectives] = useState("")
  const [keywords, setKeywords] = useState("")
  const [articleType, setArticleType] = useState<string>("article")
  const [hasCollectedData, setHasCollectedData] = useState(false)
  const [collectedDataFile, setCollectedDataFile] = useState<File | null>(null)
  const [generateGraphs, setGenerateGraphs] = useState(false)
  const [graphParameters, setGraphParameters] = useState("")
  const [hasFigures, setHasFigures] = useState(false)
  const [figureFile, setFigureFile] = useState<File | null>(null)

  const [transformThesis, setTransformThesis] = useState(false)
  const [thesisDissertationFile, setThesisDissertationFile] = useState<File | null>(null)

  const [exportToPdf, setExportToPdf] = useState(true)
  const [exportToWord, setExportToWord] = useState(false)
  // NEW: State for sending PDF to email
  const [sendPdfToEmail, setSendPdfToEmail] = useState(false)

  const [loading, setLoading] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(null)
  const [exportedPdfUrl, setExportedPdfUrl] = useState<string | null>(null)
  const [exportedWordUrl, setExportedWordUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFigureFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFigureFile(event.target.files[0])
    } else {
      setFigureFile(null)
    }
  }

  const handleCollectedDataFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCollectedDataFile(event.target.files[0])
    } else {
      setCollectedDataFile(null)
    }
  }

  const handleThesisDissertationFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setThesisDissertationFile(event.target.files[0])
    } else {
      setThesisDissertationFile(null)
    }
  }

  const handleGenerateFullArticle = async () => {
    setLoading(true)
    setExportedPdfUrl(null)
    setExportedWordUrl(null)
    try {
      // Step 1: Create or get an Article ID
      let currentArticleId = articleId
      if (!currentArticleId) {
        const createResponse = await fetch("/api/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title || "Artigo Gerado Automaticamente",
            introduction_central_theme: centralTheme,
            introduction_justification: justification,
            objectives,
            keywords,
            article_type: articleType,
            has_collected_data: hasCollectedData,
            collected_data_path: hasCollectedData && collectedDataFile ? `/uploads/${collectedDataFile.name}` : null,
            generate_graphs: generateGraphs,
            graph_parameters: generateGraphs ? graphParameters : null,
            has_figures: hasFigures,
            figures_path: hasFigures && figureFile ? `/uploads/${figureFile.name}` : null,
            transform_thesis: transformThesis,
            thesis_dissertation_path:
              transformThesis && thesisDissertationFile ? `/uploads/${thesisDissertationFile.name}` : null,
          }),
        })

        if (!createResponse.ok) {
          const errorData = await createResponse.json()
          throw new Error(errorData.message || "Falha ao criar o artigo.")
        }
        const newArticle = await createResponse.json()
        currentArticleId = newArticle.id
        setArticleId(currentArticleId)
        toast({
          title: "Artigo Criado!",
          description: `Artigo "${newArticle.title}" (ID: ${newArticle.id}) criado com sucesso.`,
        })
      }

      // Step 2: Generate Full Article using the article ID
      toast({
        title: "Gerando Artigo Completo...",
        description: "Isso pode levar alguns instantes. Por favor, aguarde.",
      })
      const generateResponse = await fetch(`/api/articles/${currentArticleId}/generate-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "full_article",
          prompt_input: {
            title,
            centralTheme,
            justification,
            objectives,
            keywords,
            articleType,
            hasCollectedData,
            collectedDataFileName: collectedDataFile?.name,
            generateGraphs,
            graphParameters,
            hasFigures,
            figureFileName: figureFile?.name,
            transformThesis,
            thesisDissertationFileName: thesisDissertationFile?.name,
          },
        }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.message || "Falha ao gerar o artigo completo.")
      }

      const data = await generateResponse.json()
      toast({
        title: "Artigo Gerado!",
        description: "O artigo completo foi gerado com sucesso. Agora você pode exportá-lo.",
      })

      // Step 3: Trigger PDF Export (if selected)
      if (exportToPdf) {
        toast({
          title: "Exportando para PDF...",
          description: "Preparando seu artigo para download.",
        })
        const exportPdfResponse = await fetch(`/api/articles/${currentArticleId}/export`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ format: "pdf", sendToEmail: sendPdfToEmail }), // Pass sendToEmail flag
        })

        if (!exportPdfResponse.ok) {
          const errorData = await exportPdfResponse.json()
          throw new Error(errorData.message || "Falha ao exportar para PDF.")
        }

        const exportPdfData = await exportPdfResponse.json()
        setExportedPdfUrl(exportPdfData.pdfUrl)
        toast({
          title: "PDF Pronto!",
          description: "Seu artigo está pronto para download em PDF.",
        })
      }

      // Step 4: Trigger Word Export (if selected)
      if (exportToWord) {
        toast({
          title: "Exportando para Word...",
          description: "Preparando seu artigo para download.",
        })
        const exportWordResponse = await fetch(`/api/articles/${currentArticleId}/export`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ format: "word" }),
        })

        if (!exportWordResponse.ok) {
          const errorData = await exportWordResponse.json()
          throw new Error(errorData.message || "Falha ao exportar para Word.")
        }

        const exportWordData = await exportWordResponse.json()
        setExportedWordUrl(exportWordData.wordUrl)
        toast({
          title: "Word Pronto!",
          description: "Seu artigo está pronto para download em Word.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro na Geração/Exportação",
        description: error.message,
        variant: "destructive",
      })
      console.error("Erro ao gerar/exportar artigo:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gerador de Artigos iArtigo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Artigo</Label>
            <Input
              id="title"
              placeholder="Ex: Impacto da IA na Educação"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="articleType">Tipo de Artigo</Label>
            <Select value={articleType} onValueChange={setArticleType} disabled={loading}>
              <SelectTrigger id="articleType">
                <SelectValue placeholder="Selecione o tipo de artigo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Artigo Científico</SelectItem>
                <SelectItem value="systematic_review">Revisão Sistemática</SelectItem>
                <SelectItem value="ethnography">Etnografia</SelectItem>
                <SelectItem value="case_study">Estudo de Caso</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="centralTheme">Tema Central da Pesquisa</Label>
            <Textarea
              id="centralTheme"
              placeholder="Ex: A influência da inteligência artificial na personalização do aprendizado em escolas de ensino fundamental."
              value={centralTheme}
              onChange={(e) => setCentralTheme(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="justification">Justificativa da Pesquisa</Label>
            <Textarea
              id="justification"
              placeholder="Ex: A crescente adoção de tecnologias de IA na educação exige uma análise aprofundada de seus benefícios e desafios para otimizar a experiência de aprendizado."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objectives">Objetivos da Pesquisa</Label>
            <Textarea
              id="objectives"
              placeholder="Ex: Objetivo geral: Analisar o impacto da IA na personalização. Objetivos específicos: 1. Identificar ferramentas de IA; 2. Avaliar a eficácia; 3. Propor diretrizes."
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
            <Input
              id="keywords"
              placeholder="Ex: Inteligência Artificial, Educação, Personalização, Aprendizado"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="text-lg font-semibold">Dados e Mídia</h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="transformThesis"
                checked={transformThesis}
                onCheckedChange={(checked) => {
                  setTransformThesis(!!checked)
                  if (!checked) setThesisDissertationFile(null)
                }}
                disabled={loading}
              />
              <Label htmlFor="transformThesis">Quero transformar minha tese ou dissertação neste artigo.</Label>
            </div>
            {transformThesis && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="thesisDissertationFile">Anexar Tese/Dissertação (PDF, DOCX)</Label>
                <Input
                  id="thesisDissertationFile"
                  type="file"
                  onChange={handleThesisDissertationFileChange}
                  disabled={loading}
                  className="file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:py-1 file:px-2"
                />
                {thesisDissertationFile && (
                  <p className="text-sm text-gray-500">Arquivo selecionado: {thesisDissertationFile.name}</p>
                )}
                <p className="text-xs text-gray-500">
                  (Em uma aplicação real, este arquivo seria enviado para um serviço de armazenamento e seu conteúdo
                  processado para a IA sintetizar o artigo.)
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCollectedData"
                checked={hasCollectedData}
                onCheckedChange={(checked) => {
                  setHasCollectedData(!!checked)
                  if (!checked) setCollectedDataFile(null)
                }}
                disabled={loading}
              />
              <Label htmlFor="hasCollectedData">Tenho dados coletados para inserir na pesquisa.</Label>
            </div>
            {hasCollectedData && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="collectedDataFile">Anexar Dados Coletados (CSV, Excel, TXT)</Label>
                <Input
                  id="collectedDataFile"
                  type="file"
                  onChange={handleCollectedDataFileChange}
                  disabled={loading}
                  className="file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:py-1 file:px-2"
                />
                {collectedDataFile && (
                  <p className="text-sm text-gray-500">Arquivo selecionado: {collectedDataFile.name}</p>
                )}
                <p className="text-xs text-gray-500">
                  (Em uma aplicação real, este arquivo seria enviado para um serviço de armazenamento como Vercel Blob e
                  processado para extrair informações relevantes para a IA.)
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="generateGraphs"
                checked={generateGraphs}
                onCheckedChange={(checked) => setGenerateGraphs(!!checked)}
                disabled={loading}
              />
              <Label htmlFor="generateGraphs">Desejo geração de gráficos a partir dos dados.</Label>
            </div>
            {generateGraphs && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="graphParameters">
                  Parâmetros para Geração de Gráficos (ex: "comparar média de idade por grupo", "distribuição de notas")
                </Label>
                <Textarea
                  id="graphParameters"
                  placeholder="Descreva os parâmetros ou tipos de gráficos desejados."
                  value={graphParameters}
                  onChange={(e) => setGraphParameters(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasFigures"
                checked={hasFigures}
                onCheckedChange={(checked) => {
                  setHasFigures(!!checked)
                  if (!checked) setFigureFile(null)
                }}
                disabled={loading}
              />
              <Label htmlFor="hasFigures">Tenho figuras/imagens para anexar.</Label>
            </div>
            {hasFigures && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="figureFile">Anexar Figura</Label>
                <Input
                  id="figureFile"
                  type="file"
                  onChange={handleFigureFileChange}
                  disabled={loading}
                  className="file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:py-1 file:px-2"
                />
                {figureFile && <p className="text-sm text-gray-500">Arquivo selecionado: {figureFile.name}</p>}
                <p className="text-xs text-gray-500">
                  (Em uma aplicação real, este arquivo seria enviado para um serviço de armazenamento como Vercel Blob.)
                </p>
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="space-y-2 border p-4 rounded-md">
            <h3 className="text-lg font-semibold">Opções de Exportação</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exportToPdf"
                checked={exportToPdf}
                onCheckedChange={(checked) => setExportToPdf(!!checked)}
                disabled={loading}
              />
              <Label htmlFor="exportToPdf">Exportar para PDF</Label>
            </div>
            {exportToPdf && ( // Only show email option if PDF export is selected
              <div className="flex items-center space-x-2 ml-6">
                <Checkbox
                  id="sendPdfToEmail"
                  checked={sendPdfToEmail}
                  onCheckedChange={(checked) => setSendPdfToEmail(!!checked)}
                  disabled={loading}
                />
                <Label htmlFor="sendPdfToEmail">Enviar PDF para o e-mail cadastrado</Label>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exportToWord"
                checked={exportToWord}
                onCheckedChange={(checked) => setExportToWord(!!checked)}
                disabled={loading}
              />
              <Label htmlFor="exportToWord">Exportar para Word (Editável)</Label>
            </div>
          </div>

          <Button
            onClick={handleGenerateFullArticle}
            disabled={loading || !title || !centralTheme || !objectives || !keywords || (!exportToPdf && !exportToWord)}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando Artigo Completo...
              </>
            ) : (
              "Gerar Artigo Completo"
            )}
          </Button>

          {(exportedPdfUrl || exportedWordUrl) && (
            <div className="space-y-2">
              <Label>Artigo Gerado e Exportado!</Label>
              {exportedPdfUrl && (
                <a href={exportedPdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Baixar Artigo em PDF
                  </Button>
                </a>
              )}
              {exportedWordUrl && (
                <a href={exportedWordUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Baixar Artigo em Word
                  </Button>
                </a>
              )}
              <p className="text-sm text-gray-500 mt-2">
                (Estes são arquivos de exemplo. Em uma aplicação real, o conteúdo gerado seria formatado e convertido.)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
