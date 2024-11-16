import { Anthropic } from '@anthropic-ai/sdk';

export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        // Using pdf.js to extract text
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer)
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise
        
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ')
          fullText += pageText + '\n'
        }
        
        resolve(fullText)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export async function chatWithAI(message: string, pdfBase64: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': '*'
      },
      referrerPolicy: 'no-referrer',
      credentials: 'omit',
      body: JSON.stringify({
        message,
        pdfBase64,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `Error: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('Chat API error:', error)
    throw error
  }
} 