import { Plus, Trash } from '@phosphor-icons/react'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SocialLink {
  platform: string
  handle: string
}

export interface IdentityData {
  businessName: string
  websiteUrl: string
  socialLinks: SocialLink[]
}

const PLATFORMS = [
  'Instagram',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Twitter/X',
  'Facebook',
  'WhatsApp',
  'Google Meu Negócio',
] as const

const MAX_SOCIAL_LINKS = 5

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  data: IdentityData
  onChange: (data: IdentityData) => void
}

export function WizardStepIdentity({ data, onChange }: Props) {
  function setField<K extends keyof IdentityData>(key: K, value: IdentityData[K]) {
    onChange({ ...data, [key]: value })
  }

  function addSocialLink() {
    if (data.socialLinks.length >= MAX_SOCIAL_LINKS) return
    setField('socialLinks', [...data.socialLinks, { platform: 'Instagram', handle: '' }])
  }

  function removeSocialLink(index: number) {
    setField(
      'socialLinks',
      data.socialLinks.filter((_, i) => i !== index),
    )
  }

  function updateSocialLink(index: number, field: keyof SocialLink, value: string) {
    const updated = data.socialLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link,
    )
    setField('socialLinks', updated)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Seu Negócio</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Conte-nos sobre o seu negócio para começarmos a construir o seu perfil.
        </p>
      </div>

      {/* Business name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Nome do negócio <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={data.businessName}
          onChange={(e) => setField('businessName', e.target.value)}
          placeholder="Ex: Processa Sistemas"
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
        />
        {data.businessName.trim() === '' && (
          <p className="text-xs text-muted-foreground">Campo obrigatório para avançar.</p>
        )}
      </div>

      {/* Website URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          URL do site <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
        </label>
        <input
          type="url"
          value={data.websiteUrl}
          onChange={(e) => setField('websiteUrl', e.target.value)}
          placeholder="https://seusite.com.br"
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
        />
      </div>

      {/* Social links repeater */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Redes sociais{' '}
            <span className="text-xs text-muted-foreground font-normal">(opcional, até 5)</span>
          </label>
          {data.socialLinks.length < MAX_SOCIAL_LINKS && (
            <button
              type="button"
              onClick={addSocialLink}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-80 transition-opacity"
            >
              <Plus size={14} weight="bold" />
              Adicionar rede
            </button>
          )}
        </div>

        {data.socialLinks.length === 0 && (
          <p className="text-xs text-muted-foreground py-2">
            Nenhuma rede social adicionada ainda.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {data.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              {/* Platform select */}
              <select
                value={link.platform}
                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                className="flex-shrink-0 w-44 px-2 py-2 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>

              {/* Handle / URL */}
              <input
                type="text"
                value={link.handle}
                onChange={(e) => updateSocialLink(index, 'handle', e.target.value)}
                placeholder="@handle ou URL"
                className="flex-1 min-w-0 px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="flex-shrink-0 p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>

        {data.socialLinks.length >= MAX_SOCIAL_LINKS && (
          <p className="text-xs text-muted-foreground">
            Limite de {MAX_SOCIAL_LINKS} redes sociais atingido.
          </p>
        )}
      </div>
    </div>
  )
}
