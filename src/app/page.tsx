'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, LogOut, Sparkles, MessageSquare, Code, Image, Music } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

// Dados de exemplo dos prompts
const examplePrompts = [
  {
    id: 1,
    title: "Copywriter Persuasivo",
    description: "Crie textos de vendas irresistíveis que convertem visitantes em clientes",
    category: "Marketing",
    icon: MessageSquare,
    color: "bg-blue-600",
    preview: "Você é um copywriter especialista em vendas..."
  },
  {
    id: 2,
    title: "Desenvolvedor Full-Stack",
    description: "Assistente para desenvolvimento web completo com melhores práticas",
    category: "Programação",
    icon: Code,
    color: "bg-green-600",
    preview: "Você é um desenvolvedor sênior especializado em..."
  },
  {
    id: 3,
    title: "Designer de UI/UX",
    description: "Crie interfaces intuitivas e experiências de usuário excepcionais",
    category: "Design",
    icon: Image,
    color: "bg-purple-600",
    preview: "Você é um designer de UX/UI com 10 anos de experiência..."
  },
  {
    id: 4,
    title: "Compositor Musical",
    description: "Crie letras e melodias originais para diferentes estilos musicais",
    category: "Criativo",
    icon: Music,
    color: "bg-pink-600",
    preview: "Você é um compositor musical talentoso..."
  }
]

export default function HomePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48 bg-gray-800" />
            <Skeleton className="h-10 w-24 bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecionamento em andamento
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Neural Studio</h1>
                <p className="text-sm text-gray-400">Hub de Prompts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-300">Bem-vindo!</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Prompts Disponíveis</h2>
          </div>
          <p className="text-gray-400 text-lg">
            Explore nossa coleção exclusiva de prompts profissionais para IA
          </p>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examplePrompts.map((prompt) => {
            const IconComponent = prompt.icon
            return (
              <Card key={prompt.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${prompt.color}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      {prompt.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-white">{prompt.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {prompt.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Preview:</p>
                    <p className="text-sm text-gray-300 truncate">
                      {prompt.preview}
                    </p>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Ver Prompt Completo
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 text-center">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Mais prompts em breve!</h3>
            <p className="text-gray-400">
              Estamos constantemente adicionando novos prompts profissionais à nossa biblioteca.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}