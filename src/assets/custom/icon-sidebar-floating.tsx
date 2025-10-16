import { type SVGProps } from 'react'

export function IconSidebarFloating(props: SVGProps<SVGSVGElement>) {
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
      <rect x="2" y="3" width="3" height="10" rx="0.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}