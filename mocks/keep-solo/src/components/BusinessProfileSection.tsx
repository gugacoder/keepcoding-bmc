import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Buildings, Plus, Trash, FloppyDisk, Check } from '@phosphor-icons/react'
import { useSoloProfile } from '@/contexts/ProfileContext'
import type { ToneOfVoice } from '@/data/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const SEGMENT_IDS = [
  'saude',
  'tecnologia',
  'varejo',
  'servicos-b2b',
  'educacao',
  'alimentacao',
  'financas',
  'industria',
] as const

const TONE_VALUES: ToneOfVoice[] = [
  'formal',
  'casual',
  'técnico',
  'inspiracional',
  'amigável',
]

const ALL_PLATFORMS = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Twitter',
  'WhatsApp',
  'Pinterest',
] as const

const SOCIAL_PLATFORMS = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Twitter',
  'WhatsApp',
  'Pinterest',
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialLink {
  platform: string
  handle: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseSocialLinks(urls: string[]): SocialLink[] {
  return urls.map((url) => {
    const lower = url.toLowerCase()
    let platform = 'Instagram'
    if (lower.includes('facebook.com')) platform = 'Facebook'
    else if (lower.includes('linkedin.com')) platform = 'LinkedIn'
    else if (lower.includes('tiktok.com')) platform = 'TikTok'
    else if (lower.includes('youtube.com')) platform = 'YouTube'
    else if (lower.includes('twitter.com') || lower.includes('x.com')) platform = 'Twitter'
    else if (lower.includes('whatsapp.com')) platform = 'WhatsApp'
    else if (lower.includes('pinterest.com')) platform = 'Pinterest'

    const withoutProto = url.replace(/https?:\/\/[^/]+\//, '')
    const segments = withoutProto.replace(/\/$/, '').split('/')
    const handle = segments[segments.length - 1] || ''

    return { platform, handle }
  })
}

// ─── Completeness ─────────────────────────────────────────────────────────────

function computeCompleteness(
  businessName: string,
  segment: string,
  targetAudience: string,
  statement: string,
  tone: string,
  platforms: string[],
  socialLinks: SocialLink[]
): number {
  const filled = [
    businessName.trim() !== '',
    segment.trim() !== '',
    targetAudience.trim() !== '',
    statement.trim() !== '',
    tone.trim() !== '',
    platforms.length > 0,
    socialLinks.some((l) => l.handle.trim() !== ''),
  ].filter(Boolean).length

  return Math.round((filled / 7) * 100)
}

function completenessColor(pct: number): string {
  if (pct < 50) return 'bg-red-500'
  if (pct < 80) return 'bg-yellow-500'
  return 'bg-green-500'
}

function completenessTextColor(pct: number): string {
  if (pct < 50) return 'text-red-500'
  if (pct < 80) return 'text-yellow-500'
  return 'text-green-500'
}

// ─── BusinessProfileSection ───────────────────────────────────────────────────

interface Props {
  onSave?: () => void
}

export function BusinessProfileSection({ onSave }: Props) {
  const { t } = useTranslation()
  const { profile, updateProfile } = useSoloProfile()

  // Local form state, pre-filled from context
  const [businessName, setBusinessName] = useState(profile.identity.businessName)
  const [segment, setSegment] = useState(profile.niche.segment)
  const [targetAudience, setTargetAudience] = useState(profile.niche.targetAudience)
  const [statement, setStatement] = useState(profile.positioning.statement)
  const [tone, setTone] = useState<ToneOfVoice>(profile.tone.primary)
  const [platforms, setPlatforms] = useState<string[]>(profile.platforms)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    parseSocialLinks(profile.identity.socialLinks)
  )
  const [saved, setSaved] = useState(false)

  const completeness = computeCompleteness(businessName, segment, targetAudience, statement, tone, platforms, socialLinks)

  const handleTogglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const handleAddSocialLink = () => {
    setSocialLinks((prev) => [...prev, { platform: 'Instagram', handle: '' }])
  }

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSocialLinkChange = (index: number, field: 'platform' | 'handle', value: string) => {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    )
  }

  const handleSave = () => {
    updateProfile({
      identity: {
        ...profile.identity,
        businessName,
        socialLinks: socialLinks.map(({ platform, handle }) => `https://${platform.toLowerCase()}.com/${handle}`),
      },
      niche: {
        ...profile.niche,
        segment,
        targetAudience,
      },
      positioning: {
        ...profile.positioning,
        statement,
      },
      tone: {
        ...profile.tone,
        primary: tone,
      },
      platforms,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    onSave?.()
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
        <span className="text-primary">
          <Buildings size={16} weight="duotone" />
        </span>
        <h2 className="font-semibold text-foreground">{t('businessProfile.title')}</h2>
        <div className="ml-auto flex items-center gap-2.5">
          <span className={`text-xs font-semibold tabular-nums ${completenessTextColor(completeness)}`}>
            {completeness}%
          </span>
          <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${completenessColor(completeness)}`}
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="p-5 space-y-5">

        {/* 1. Nome do negócio */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {t('businessProfile.businessNameLabel')}
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={t('businessProfile.businessNamePlaceholder')}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-card border border-border/80 focus:border-primary/50 outline-none transition-colors"
          />
        </div>

        {/* 2. Segmento */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {t('businessProfile.segmentLabel')}
          </label>
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-card border border-border/80 focus:border-primary/50 outline-none transition-colors appearance-none cursor-pointer"
          >
            {SEGMENT_IDS.map((id) => (
              <option key={id} value={id}>
                {t(`businessProfile.segments.${id}`)}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Público-alvo */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {t('businessProfile.targetAudienceLabel')}
          </label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder={t('businessProfile.targetAudiencePlaceholder')}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-card border border-border/80 focus:border-primary/50 outline-none transition-colors"
          />
        </div>

        {/* 4. Posicionamento */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {t('businessProfile.positioningLabel')}
          </label>
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            rows={3}
            placeholder={t('businessProfile.positioningPlaceholder')}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-card border border-border/80 focus:border-primary/50 outline-none transition-colors resize-none"
          />
        </div>

        {/* 5. Tom de voz */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {t('businessProfile.toneLabel')}
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneOfVoice)}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-card border border-border/80 focus:border-primary/50 outline-none transition-colors appearance-none cursor-pointer"
          >
            {TONE_VALUES.map((v) => (
              <option key={v} value={v}>
                {t(`businessProfile.tones.${v}`)}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Plataformas ativas */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {t('businessProfile.platformsLabel')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_PLATFORMS.map((p) => (
              <label
                key={p}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={platforms.includes(p)}
                  onChange={() => handleTogglePlatform(p)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {p}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 7. Redes sociais (repeater) */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {t('businessProfile.socialNetworksLabel')}
          </label>
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm text-foreground bg-card border border-border/80 focus:border-primary/50 outline-none transition-colors appearance-none cursor-pointer w-36 shrink-0"
                >
                  {SOCIAL_PLATFORMS.map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={link.handle}
                  onChange={(e) => handleSocialLinkChange(index, 'handle', e.target.value)}
                  placeholder={t('businessProfile.socialHandlePlaceholder')}
                  className="flex-1 px-3 py-2 rounded-xl text-sm text-foreground bg-card border border-border/80 focus:border-primary/50 outline-none transition-colors"
                />
                <button
                  onClick={() => handleRemoveSocialLink(index)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  aria-label={t('businessProfile.removeAriaLabel')}
                >
                  <Trash size={14} weight="duotone" />
                </button>
              </div>
            ))}

            <button
              onClick={handleAddSocialLink}
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mt-1"
            >
              <Plus size={14} weight="bold" />
              {t('businessProfile.addSocial')}
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-1">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            {saved ? (
              <>
                <Check size={14} weight="bold" />
                {t('businessProfile.saved')}
              </>
            ) : (
              <>
                <FloppyDisk size={14} weight="duotone" />
                {t('businessProfile.save')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
