import { createContext, useContext, useState, type ReactNode } from 'react'
import { soloProfile as initialProfile, profileConfigured } from '@/data/profiles'
import type { Profile } from '@/data/types'

interface SoloProfileContextValue {
  profile: Profile
  isConfigured: boolean
  completeOnboarding: () => void
  updateProfile: (data: Partial<Profile>) => void
}

const SoloProfileContext = createContext<SoloProfileContextValue | null>(null)

export { SoloProfileContext }

export function SoloProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [isConfigured, setIsConfigured] = useState<boolean>(() => {
    const stored = localStorage.getItem('keepsolo-profile-configured')
    if (stored !== null) return stored === 'true'
    return profileConfigured
  })

  const completeOnboarding = () => {
    localStorage.setItem('keepsolo-profile-configured', 'true')
    setIsConfigured(true)
  }

  const updateProfile = (data: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }

  return (
    <SoloProfileContext.Provider
      value={{
        profile,
        isConfigured,
        completeOnboarding,
        updateProfile,
      }}
    >
      {children}
    </SoloProfileContext.Provider>
  )
}

export function useSoloProfile(): SoloProfileContextValue {
  const ctx = useContext(SoloProfileContext)
  if (!ctx) throw new Error('useSoloProfile must be used within SoloProfileProvider')
  return ctx
}
