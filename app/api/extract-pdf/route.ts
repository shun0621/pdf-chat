import { NextResponse } from 'next/server'
import { PDFExtract } from 'pdf.js-extract'

export async function POST(request: Request) {
     console.log("---------------------------------------------------------")
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const pdfExtract = new PDFExtract()
    const buffer = await file.arrayBuffer()
    const result = await pdfExtract.extractBuffer(buffer)
    
    const text = result.pages
      .map(page => page.content.map(item => item.str).join(' '))
      .join('\n')

    return new NextResponse(text)
  } catch (error) {
    console.error('PDF extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract PDF text' },
      { status: 500 }
    )
  }
} 