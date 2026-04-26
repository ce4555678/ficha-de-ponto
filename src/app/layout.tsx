import { Geist_Mono, Roboto } from "next/font/google"
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import "./globals.css"
import { cn } from "@/lib/utils";

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: {
    default: "Ficha de Ponto - Controle de Horários",
    template: "%s | Ficha de Ponto"
  },
  description: "Sistema completo para controle de ponto e gestão de horários de trabalho. Gerencie cadastros, registre horários e imprima relatórios mensais de forma simples e eficiente.",
  keywords: ["ponto", "horário", "trabalho", "registro", "folha de ponto", "controle de jornada", "relatório"],
  authors: [{ name: "Sistema de Ficha de Ponto" }],
  creator: "Sistema de Ficha de Ponto",
  publisher: "Sistema de Ficha de Ponto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'http://localhost:3000',
    title: 'Ficha de Ponto - Controle de Horários',
    description: 'Sistema completo para controle de ponto e gestão de horários de trabalho.',
    siteName: 'Ficha de Ponto',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ficha de Ponto - Controle de Horários',
    description: 'Sistema completo para controle de ponto e gestão de horários de trabalho.',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: 'white' },
  { media: '(prefers-color-scheme: dark)', color: 'black' },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", roboto.variable)}
    >
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
