import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ferreteria-System',
  description: '',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/business.svg" />
      </head>
      <body>{children}</body>
    </html>
  )
}
