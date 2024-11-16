import { NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  // Add CORS headers

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const { message, pdfBase64 } = await request.json()

    console.log("message::::::", message)

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Missing API key' },
        { status: 500 }
      )
    }

    // Initialize Anthropic client with all necessary headers
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,

    })
    const requestInit = {
      headers: {
        'Origin': '*'
      },
      // Remove referrer
      referrerPolicy: 'no-referrer',
      credentials: 'omit',
      
    };

    // Log request details (without sensitive data)
    console.log('Request details:', {
      messageLength: message?.length,
      pdfSize: pdfBase64?.length,
      apiKeyPresent: !!process.env.ANTHROPIC_API_KEY
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      betas: ["pdfs-2024-09-25"],
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64
              }
            },
            {
              type: 'text',
              text: message
            }
          ]
        }
      ]
    }, requestInit)

    debugger

    console.log('Anthropic response:', {
      status: 'success',
      contentLength: response?.content?.[0]?.text?.length
    })
    console.log("hahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log("response::::::", response)
    return response

  } catch (error) {
    console.log("error::::::", error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Anthropic API error: ${error.message}` },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}
