import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold text-foreground">KeepBiz</h1>
      <p className="text-lg text-muted-foreground text-center max-w-md">
        Sua equipe de agentes de IA. Pronta para trabalhar.
      </p>
      <div className="flex gap-4">
        <Link
          to="/register"
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Começar Grátis
        </Link>
        <Link
          to="/login"
          className="px-5 py-2.5 border border-border text-foreground rounded-md text-sm font-medium hover:bg-accent transition-colors"
        >
          Entrar
        </Link>
      </div>
    </div>
  )
}
