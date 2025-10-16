import { type SVGProps } from 'react'

export function IconThemeLight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.657 3.343l-1.414 1.414M4.757 11.243l-1.414 1.414M12.657 12.657l-1.414-1.414M4.757 4.757L3.343 3.343" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}