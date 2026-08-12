import type { Metadata } from 'next'
import { Space_Grotesk, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const body = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Damgaard Estrik · Fugtgennemgang og udtørring af gulvkonstruktioner',
  description:
    'Book en fugtgennemgang med kernemåling. Damgaard Estrik tørrer vandskadede gulvkonstruktioner ud og lægger nyt afretningslag eller ny estrik, inden for 75 km fra Lemvig. Fiktivt firma, byggeøvelse.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
