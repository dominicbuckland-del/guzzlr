interface BadgeProps {
  icon: string
  name: string
  unlocked: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function Badge({ icon, name, unlocked, size = 'md', onClick }: BadgeProps) {
  const sizes = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  }

  return (
    <div
      className={`flex flex-col items-center gap-1 ${onClick ? 'tap-active cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div
        className={`${sizes[size]} rounded-2xl flex items-center justify-center ${
          unlocked
            ? 'bg-surface border border-primary/30 shadow-[0_0_12px_rgba(0,255,106,0.2)]'
            : 'bg-surface/50 border border-surface-border opacity-40 grayscale'
        }`}
      >
        {icon}
      </div>
      <span className={`text-[10px] font-medium text-center leading-tight ${
        unlocked ? 'text-text-primary' : 'text-text-secondary'
      }`}>
        {name}
      </span>
    </div>
  )
}
