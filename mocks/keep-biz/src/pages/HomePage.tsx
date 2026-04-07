import { House } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3">
          <House size={48} weight="duotone" className="text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            KeepBiz
          </h1>
        </div>
        <p className="max-w-md text-lg text-muted-foreground">
          Suite completa para PMEs — automatize seus processos com agentes inteligentes.
        </p>
        <Button size="lg">Começar agora</Button>
      </div>
    </div>
  )
}
