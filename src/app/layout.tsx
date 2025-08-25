import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'

// Optimized font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Performance Optimized App - Manjhunath',
  description: 'A high-performance web application with comprehensive optimizations',
  keywords: ['performance', 'optimization', 'web app', 'fast loading'],
  authors: [{ name: 'Manjhunath' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Performance Optimized App - Manjhunath',
    description: 'A high-performance web application with comprehensive optimizations',
    siteName: 'Manjhunath Performance App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Performance Optimized App - Manjhunath',
    description: 'A high-performance web application with comprehensive optimizations',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {/* Resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <PerformanceMonitor />
        <div id="root">
          {children}
        </div>
        {/* Prevent layout shift with loading placeholder */}
        <div id="loading-placeholder" style={{ display: 'none' }} />
      </body>
    </html>
  )
}