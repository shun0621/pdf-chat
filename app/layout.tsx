import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDF Chat App',
  description: 'Chat with your PDFs using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js" async></script>
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
          `
        }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 