import { useState } from 'react'
import { Image, VideoCamera, Article, PenNib } from '@phosphor-icons/react'
import type { ContentType } from '@/data/types'

const TYPE_ICON: Record<ContentType, React.ReactNode> = {
  post: <Image size={20} weight="duotone" />,
  short: <VideoCamera size={20} weight="duotone" />,
  artigo: <Article size={20} weight="duotone" />,
  criativo: <PenNib size={20} weight="duotone" />,
}

const TYPE_COLOR: Record<ContentType, string> = {
  post: 'bg-amber-50 text-amber-500',
  short: 'bg-orange-50 text-orange-500',
  artigo: 'bg-rose-50 text-rose-500',
  criativo: 'bg-yellow-50 text-yellow-600',
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
