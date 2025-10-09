import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hotel Elefante - San Lorenzo, Salta',
  description:
    'Hotel Elefante, tu destino ideal en San Lorenzo, Salta. Cerca del Cerro Elefante. Reservá tu habitación online.',
  keywords: 'hotel, salta, san lorenzo, cerro elefante, reservas, turismo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script 
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          async
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
