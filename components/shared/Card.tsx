import { ReactNode } from 'react'
export default function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`card p-4 ${onClick ? 'cursor-pointer active:opacity-70 transition-opacity' : ''} ${className}`} onClick={onClick}>{children}</div>
}
