import { useState } from 'react'
import { Image, MegaphoneSimple, VideoCamera, Newspaper } from '@phosphor-icons/react'
import type { ContentType } from '@/data/types'

const TYPE_ICON: Record<ContentType, React.ReactNode> = {
  post: <Image size={20} weight="duotone" />,
  short: <VideoCamera size={20} weight="duotone" />,
  campanha: <MegaphoneSimple size={20} weight="duotone" />,
  criativo: <Newspaper size={20} weight="duotone" />,
}

const TYPE_COLOR: Record<ContentType, string> = {
  post: 'bg-info/10 text-info',
  short: 'bg-violet/10 text-violet',
  campanha: 'bg-orange/10 text-orange',
  criativo: 'bg-success/10 text-success',
}

interface ContentThumbnailProps {
  thumbnail?: string
  type: ContentType
  title: string
  className?: string
}

export function ContentThumbnail({ thumbnail, type, title, className = '' }: ContentThumbnailProps) {
  const [imgError, setImgError] = useState(false)

  if (thumbnail && !imgError) {
    return (
      <img
        src={thumbnail}
        alt={title}
        className={`object-cover w-full h-full ${className}`}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${TYPE_COLOR[type]} ${className}`}
      title={title}
    >
      {TYPE_ICON[type]}
    </div>
  )
}
