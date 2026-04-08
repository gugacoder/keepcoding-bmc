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
  post: 'bg-secondary text-primary',
  short: 'bg-orange-50 text-orange-500 dark:bg-orange-950/30 dark:text-orange-400',
  artigo: 'bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400',
  criativo: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400',
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
