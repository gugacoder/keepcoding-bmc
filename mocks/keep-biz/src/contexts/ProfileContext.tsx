import { createContext, useContext, useState, type ReactNode } from 'react'
import { profiles as initialProfiles } from '@/data/profiles'
import type { Profile } from '@/data/types'

interface ProfileContextValue {
  profiles: Profile[]
  activeProfileId: string | null
  hasProfiles: boolean
  setActiveProfileId: (id: string | null) => void
  addProfile: (profile: Profile) => void
  removeProfile: (id: string) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export { ProfileContext }

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(() => {
    return localStorage.getItem('keepbiz-active-profile') ?? null
  })

  const setActiveProfileId = (id: string | null) => {
    if (id === null) {
      localStorage.removeItem('keepbiz-active-profile')
    } else {
      localStorage.setItem('keepbiz-active-profile', id)
    }
    setActiveProfileIdState(id)
  }

  const addProfile = (profile: Profile) => {
    setProfiles((prev) => [...prev, profile])
  }

  const removeProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
    if (activeProfileId === id) {
      setActiveProfileId(null)
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfileId,
        hasProfiles: profiles.length > 0,
        setActiveProfileId,
        addProfile,
        removeProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfiles(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfiles must be used within ProfileProvider')
  return ctx
}
