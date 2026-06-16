/* Tiny hand-drawn stroke icon set, rendered inline so nodes and cards
   stay crisp at any size with zero dependencies. */

import type { ReactNode } from 'react'

const PATHS: Record<string, ReactNode> = {
  chat: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h-1A2.5 2.5 0 0 1 4 13.5z" />
      <path d="M8 9h8M8 12.5h5" />
    </>
  ),
  hub: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v3.4M12 17.8v3.4M2.8 12h3.4M17.8 12h3.4M5.5 5.5l2.4 2.4M16.1 16.1l2.4 2.4M18.5 5.5l-2.4 2.4M7.9 16.1l-2.4 2.4" />
    </>
  ),
  worker: (
    <>
      <rect x="5" y="4" width="14" height="10" rx="1.6" />
      <path d="M9 18h6M12 14v4M8 8.5l2 2 4-4" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="5" width="14" height="9.5" rx="1.4" />
      <path d="M3 18.5h18l-1.6-3H4.6z" />
    </>
  ),
  vault: (
    <>
      <path d="M6.5 3.5h11l2 4.5-7.5 12.5L4.5 8z" />
      <path d="M4.5 8h15M9.5 8 12 20.5M14.5 8 12 20.5M9.5 8l2.5-4.5M14.5 8 12 3.5" />
    </>
  ),
  house: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6.5 10v9h11v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.7 2.3 4 5.2 4 8.5s-1.3 6.2-4 8.5c-2.7-2.3-4-5.2-4-8.5s1.3-6.2 4-8.5z" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 6.5a4 4 0 0 1 5-1l-3 3 .8 2.7 2.7.8 3-3a4 4 0 0 1-6 4.5l-7.5 7.5a2 2 0 0 1-2.8-2.8L14.2 10a4 4 0 0 1 .3-3.5z" transform="scale(0.82) translate(2.4 2.4)" />
    </>
  ),
  quill: (
    <>
      <path d="M19.5 4.5c-6 .5-10.5 3-13 9.5L5 20l1.5-.5C13 17 18.5 12 19.5 4.5z" />
      <path d="M6.5 17.5C9 12 13 8.5 17 6.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7.5h8" />
    </>
  ),
  forge: (
    <>
      <path d="M5 19h14" />
      <path d="M7 19v-6l5-4 5 4v6" />
      <path d="M9.5 19v-4h5v4" />
      <path d="M8 9.5 5.5 7l2-2 2.5 2.5M16 9.5 18.5 7l-2-2-2.5 2.5" />
      <path d="M12 9V4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  browser: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9h17M7 6.8h.01M9.5 6.8h.01M12 6.8h.01" />
    </>
  ),
  flame: (
    <path d="M12 3c1 3-3.5 5-3.5 9a5.5 5.5 0 0 0 11 0c0-2.5-1.5-4-2.5-5 0 1.5-.5 2.5-1.5 3C16 7 15 4.5 12 3zM12 21a3 3 0 0 1-2-5.2c.4 1 1 1.5 2 1.7-.3-1.2 0-2.3 1.2-3.2A3 3 0 0 1 12 21z" />
  ),
  files: (
    <>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4M10 12h5M10 15.5h5" />
    </>
  ),
  terminal: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M7 9.5l3 2.5-3 2.5M12.5 15H17" />
    </>
  ),
  branch: (
    <>
      <circle cx="7" cy="6" r="2.2" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M7 8.2v7.6M17 11.2c0 3.5-4 3-7.4 4.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  cartridge: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8.5 3.5v4h7v-4M8.5 12h7M8.5 15.5h4.5" />
    </>
  ),
  send: (
    <>
      <path d="M20.5 3.5 3.5 10.8l6.4 2.8 2.8 6.4z" />
      <path d="M20.5 3.5 9.9 13.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.5 3 7.7 7 9.5 4-1.8 7-5 7-9.5V6z" />
      <path d="M9 11.8l2.2 2.2L15.5 9.5" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20.5S4.5 16.2 4.5 9.8A4.1 4.1 0 0 1 12 7.5a4.1 4.1 0 0 1 7.5 2.3c0 6.4-7.5 10.7-7.5 10.7z" />
      <path d="M8.5 12h2l1-2.3 2 5 1-2.7h1.8" />
    </>
  ),
}

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.hub}
    </svg>
  )
}
