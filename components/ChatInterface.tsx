"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Send, Bot, User } from "lucide-react"
import { chatWithAI } from '@/lib/api'

interface ChatInterfaceProps {
  pdfBase64: string | null
}

interface Message {
  content: string
  role: "user" | "assistant"
}

export default function ChatInterface({ pdfBase64 }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || !pdfBase64) return

    const newMessage: Message = {
      content: input,
      role: "user",
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await chatWithAI(input, pdfBase64)
      
      if (response.error) {
        throw new Error(response.error)
      }

      setMessages(prev => [...prev, {
        content: response.content,
        role: "assistant"
      }])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      setMessages(prev => [...prev, {
        content: error instanceof Error ? error.message : 'Failed to get response from AI',
        role: "assistant"
      }])
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700">Chat Assistant</h2>
        <p className="text-sm text-gray-500">Ask questions about your PDF</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Bot className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm text-center">Start a conversation by sending a message</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${
                message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }`}>
                {message.role === "user" ? 
                  <User className="h-5 w-5 text-blue-600" /> : 
                  <Bot className="h-5 w-5 text-gray-600" />
                }
              </div>
              <div
                className={`p-4 rounded-2xl max-w-[80%] ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-12 text-base rounded-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button 
            onClick={handleSend}
            className="h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
} 