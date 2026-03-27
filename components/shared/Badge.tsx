interface BadgeProps {
  icon: string
  name: string
  unlocked: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function Badge({ icon, name, unlocked, size = 'md', onClick }: BadgeProps) {
  const sizes = { sm: 'w-12 h-12 text-xl', md: 'w-16 h-16 text-2xl', lg: 'w-20 h-20 text-3xl' }

  return (
    <div className={`flex flex-col items-center gap-1 ${onClick ? 'tap-active cursor-pointer' : ''}`} onClick={onClick}>
      <div className={`${sizes[size]} rounded-full flex items-center justify-center ${
        unlocked ? 'bg-surface-high border border-white/20' : 'bg-surface-high border border-surface-border opacity-30 grayscale'
      }`}>
        {icon}
      </div>
      <span className={`text-[10px] font-medium text-center leading-tight ${unlocked ? 'text-white' : 'text-text-muted'}`}>
        {name}
      </span>
    </div>
  )
}
