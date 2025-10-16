import { type SVGProps } from 'react'

export function IconSidebarInset(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="1" y="2" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="4" width="3" height="8" rx="0.5" fill="currentColor" />
      <line x1="6.5" y1="4" x2="6.5" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}