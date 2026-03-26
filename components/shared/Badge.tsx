interface BadgeProps {
  icon: string
  name: string
  unlocked: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function Badge({ icon, name, unlocked, size = 'md', onClick }: BadgeProps) {
  const sizes = {
    sm: 'w-14 h-14 text-xl',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-24 h-24 text-3xl',
  }

  return (
    <div
      className={`flex flex-col items-center gap-2 tap-active ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center transition-all ${
          unlocked
            ? 'bg-secondary-container shadow-sm'
            : 'bg-surface-container-high opacity-60 grayscale border-2 border-dashed border-outline-variant'
        }`}
      >
        {icon}
      </div>
      <span className={`text-[10px] font-headline font-bold text-center leading-tight uppercase ${
        unlocked ? 'text-on-surface' : 'text-on-surface-variant'
      }`}>
        {name}
      </span>
      {unlocked && (
        <span className="text-[9px] font-bold text-primary uppercase">Unlocked</span>
      )}
    </div>
  )
}
