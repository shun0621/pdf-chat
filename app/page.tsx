'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ChatInterface from '@/components/ChatInterface'

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false
})

export default function Home() {
  const [pdfContent, setPDFContent] = useState<string | null>(null)

  return (
    <main className="flex h-screen bg-gray-100">
      <div className="w-1/2 p-4">
        <div className="h-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <PDFViewer onPDFContent={setPDFContent} />
        </div>
      </div>
      <div className="w-1/2 p-4">
        <div className="h-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <ChatInterface pdfBase64={pdfContent} />
        </div>
      </div>
    </main>
  )
}