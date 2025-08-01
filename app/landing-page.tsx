import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, FileText, TrendingUp } from "lucide-react" // Icons for features

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-gray-900">
            Por que o iArtigo é <span className="text-blue-600">Revolucionário</span>?
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Descubra como nossa IA está transformando a pesquisa científica mundial
          </p>
          <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Artigo sendo gerado por IA"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-semibold">
              iArtigo - AI Article Generator
            </div>
          </div>
        </div>
      </section>

      {/* Statistics/Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center justify-center p-0 pb-4">
                <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-5xl font-bold text-blue-600">2M+</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-2">Artigos Analisados</h3>
                <p className="text-gray-600">
                  Nossa inteligência artificial foi treinada com mais de 2 milhões de artigos científicos de alta
                  qualidade das principais revistas mundiais.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center justify-center p-0 pb-4">
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-5xl font-bold text-green-600">90%</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-2">Menos Tempo</h3>
                <p className="text-gray-600">
                  O que levava semanas para escrever, agora leva apenas algumas horas. Foque na pesquisa, deixe a
                  redação conosco.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center justify-center p-0 pb-4">
                <FileText className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-5xl font-bold text-purple-600">1000+</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-2">Formatos</h3>
                <p className="text-gray-600">
                  Formatação automática para mais de 1000 revistas científicas. Citações corretas, estrutura perfeita,
                  qualidade acadêmica.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center justify-center p-0 pb-4">
                <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle className="text-5xl font-bold text-orange-600">300%</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-2">Mais Produtivo</h3>
                <p className="text-gray-600">
                  Pesquisadores que usam o iArtigo publicam 3x mais artigos por ano. Acelere sua carreira acadêmica.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Powerful Features Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Recursos Poderosos para Pesquisadores</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
            Tudo que você precisa para criar artigos científicos de qualidade internacional
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold">IA Avançada</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                Geração automática de conteúdo científico com qualidade acadêmica. Nossa IA foi treinada com milhares de
                artigos científicos de alta qualidade.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold">Literatura Inteligente</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                Sugestões automáticas de referências relevantes por área, ajudando você a construir uma base sólida.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold">Gráficos e Tabelas</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                Visualizações profissionais geradas automaticamente a partir dos seus dados, prontas para publicação.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold">Múltiplos Formatos</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                Exportação em PDF, Word, LaTeX e mais, garantindo compatibilidade com todas as suas necessidades.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Como Funciona</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
            Três passos simples para seu artigo científico
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 pb-4">
                <div className="text-5xl font-bold text-blue-600 mb-4">1.</div>
                <CardTitle className="text-xl font-semibold">Configure</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                Insira título, resumo, palavras-chave e dados dos autores. Escolha a área de estudo e revista alvo.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 pb-4">
                <div className="text-5xl font-bold text-blue-600 mb-4">2.</div>
                <CardTitle className="text-xl font-semibold">Literatura</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                Nossa IA sugere referências relevantes baseadas no seu tema. Revise e selecione as mais adequadas.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 pb-4">
                <div className="text-5xl font-bold text-blue-600 mb-4">3.</div>
                <CardTitle className="text-xl font-semibold">Gere</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-600">
                Clique em gerar e receba seu artigo completo com formatação profissional, gráficos e referências.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Planos para Todos os Pesquisadores</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
            Escolha o plano ideal para suas necessidades acadêmicas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Por Artigo Plan */}
            <Card className="p-6 shadow-lg border-2 border-gray-200 flex flex-col">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-2xl font-bold mb-2">Por Artigo</CardTitle>
                <p className="text-4xl font-extrabold text-blue-600">
                  R$ 15<span className="text-xl text-gray-600">/artigo</span>
                </p>
              </CardHeader>
              <CardContent className="p-0 flex-grow text-gray-700 text-left">
                <p className="mb-4">Ideal para uso esporádico e testes</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Pagamento por artigo gerado
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Formatação básica (APA, ABNT)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Suporte por email
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Exportação PDF
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Sem compromisso mensal
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Gerar Artigo</Button>
              </CardContent>
            </Card>

            {/* Profissional Plan */}
            <Card className="p-6 shadow-lg border-2 border-blue-600 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Mais Popular
              </div>
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-2xl font-bold mb-2">Profissional</CardTitle>
                <p className="text-4xl font-extrabold text-blue-600">
                  R$ 79<span className="text-xl text-gray-600">/mês</span>
                </p>
              </CardHeader>
              <CardContent className="p-0 flex-grow text-gray-700 text-left">
                <p className="mb-4">Para pesquisadores ativos</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 5 artigos por mês
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Todos os estilos de citação
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Sugestões de literatura
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Gráficos e tabelas avançados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Exportação em todos os formatos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Suporte prioritário
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Começar Grátis</Button>
              </CardContent>
            </Card>

            {/* Institucional Plan */}
            <Card className="p-6 shadow-lg border-2 border-gray-200 flex flex-col">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-2xl font-bold mb-2">Institucional</CardTitle>
                <p className="text-4xl font-extrabold text-blue-600">
                  R$ 199<span className="text-xl text-gray-600">/mês</span>
                </p>
              </CardHeader>
              <CardContent className="p-0 flex-grow text-gray-700 text-left">
                <p className="mb-4">Para universidades - Pacote 12 meses</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Artigos ilimitados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Múltiplos usuários (até 10)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Contrato anual (12 meses)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> API personalizada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Integração com bases científicas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Relatórios de uso
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Suporte dedicado 24/7
                  </li>
                </ul>
                <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">Contatar Vendas</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} iArtigo. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Transformando a pesquisa científica com inteligência artificial.</p>
        </div>
      </footer>
    </div>
  )
}
