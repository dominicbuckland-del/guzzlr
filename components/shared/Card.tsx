import { ReactNode } from 'react'

export default function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`card p-4 ${onClick ? 'tap-active cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
