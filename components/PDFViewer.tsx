"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Upload, FileText } from "lucide-react"
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { extractTextFromPDF } from '@/lib/api'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PDFViewerProps {
  onPDFContent: (content: string) => void
}

export default function PDFViewer({ onPDFContent }: PDFViewerProps) {
  const [pdfFile, setPdfFile] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setPdfFile(URL.createObjectURL(file))
      setFileName(file.name)

      try {
        const text = await extractTextFromPDF(file)
        onPDFContent(text)
      } catch (error) {
        console.error('Failed to extract PDF text:', error)
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 rounded-lg">
      {/* Header section with file info and upload button */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {fileName || "No file selected"}
            </span>
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload">
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-gray-100 transition-colors"
              asChild
            >
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* PDF Viewer section */}
      <div className="flex-1 overflow-hidden p-4">
        {!pdfFile ? (
          // Empty state with clickable area
          <label 
            htmlFor="pdf-upload" 
            className="h-full flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors border-2 border-dashed border-gray-300"
          >
            <FileText className="h-16 w-16 mb-4" />
            <p className="text-lg font-medium mb-2">No PDF file selected</p>
            <p className="text-sm">Click here or drag and drop a PDF file</p>
          </label>
        ) : (
          // PDF Viewer
          <div className="h-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfFile}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={1.2}
              />
            </Worker>
          </div>
        )}
      </div>
    </div>
  )
} 