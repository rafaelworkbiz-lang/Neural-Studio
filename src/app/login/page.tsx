'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Brain } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, resetPassword } = useAuth()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError('E-mail ou senha incorretos')
    } else {
      toast.success('Login realizado com sucesso!')
    }
    
    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Digite seu e-mail para recuperar a senha')
      return
    }

    setIsLoading(true)
    const { error } = await resetPassword(email)
    
    if (error) {
      setError('Erro ao enviar e-mail de recuperação')
    } else {
      toast.success('E-mail de recuperação enviado!')
      setShowResetPassword(false)
    }
    
    setIsLoading(false)
  }

  return (
    <div className=\"min-h-screen bg-gray-950 flex items-center justify-center p-4\">
      <Card className=\"w-full max-w-md bg-gray-900 border-gray-800\">
        <CardHeader className=\"text-center space-y-4\">
          <div className=\"flex justify-center\">
            <div className=\"p-3 bg-blue-600 rounded-full\">
              <Brain className=\"w-8 h-8 text-white\" />
            </div>
          </div>
          <div>
            <CardTitle className=\"text-2xl font-bold text-white\">Neural Studio</CardTitle>
            <CardDescription className=\"text-gray-400\">
              {showResetPassword ? 'Recuperar senha' : 'Acesse sua conta'}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className=\"space-y-4\">
          {error && (
            <Alert className=\"bg-red-900/20 border-red-800 text-red-400\">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={showResetPassword ? handleResetPassword : handleSignIn} className=\"space-y-4\">
            <div className=\"space-y-2\">
              <Label htmlFor=\"email\" className=\"text-gray-300\">E-mail</Label>
              <Input
                id=\"email\"
                type=\"email\"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=\"seu@email.com\"
                required
                className=\"bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12\"
              />
            </div>

            {!showResetPassword && (
              <div className=\"space-y-2\">
                <Label htmlFor=\"password\" className=\"text-gray-300\">Senha</Label>
                <Input
                  id=\"password\"
                  type=\"password\"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=\"••••••••\"
                  required
                  className=\"bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12\"
                />
              </div>
            )}

            <Button
              type=\"submit\"
              disabled={isLoading}
              className=\"w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium\"
            >
              {isLoading ? (
                <Loader2 className=\"w-4 h-4 animate-spin\" />
              ) : showResetPassword ? (
                'Enviar e-mail de recuperação'
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className=\"text-center\">
            <button
              type=\"button\"
              onClick={() => {
                setShowResetPassword(!showResetPassword)
                setError('')
              }}
              className=\"text-sm text-blue-400 hover:text-blue-300 transition-colors\"
            >
              {showResetPassword ? 'Voltar ao login' : 'Esqueci minha senha'}
            </button>
          </div>

          <div className=\"text-center pt-4 border-t border-gray-800\">
            <p className=\"text-xs text-gray-500\">
              Acesso exclusivo para clientes que compraram via Hubla
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}