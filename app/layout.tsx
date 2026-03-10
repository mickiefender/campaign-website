import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dr. Charles Dwamena - NPP Campaign',
  description: 'Leading Ghana Forward with integrity, innovation, and inclusive leadership. Support Dr. Charles Dwamena\'s vision for a prosperous Ghana.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <html lang="en">
      <head>
        {mapsApiKey && (
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}`}
            async
            defer
          />
        )}
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        
      </body>
    </html>
  )
}
