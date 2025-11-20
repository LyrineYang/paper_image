"use client"

import { Download, Save } from 'lucide-react'
import Image from "next/image"
import { useRef, useState } from 'react'

import { Button } from "@/components/ui/button"

const CATEGORY_COLORS: Record<string, string> = {
  perception: "#EAA3B1",
  modeling: "#A4BEC2",
  manipulation: "#F2C399",
  reasoning: "#B0A3C7"
}

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) {
    return hex
  }
  const bigint = parseInt(normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface ModuleScore {
  module: string
  score: number
}

interface ReasoningCardProps {
  prompt: string
  inputImage: string
  videoFrames: string[]
  difficulty: string
  modelName?: string
  modelIcon?: string
  scores?: ModuleScore[]
  totalScore?: number
  checklistLength?: number
  tsr?: number
  showActionButtons?: boolean
  cardId?: string
  transparentIcon?: boolean
}

export function ReasoningCard({
  prompt = "Zoom in on the black bag with the Apple logo to focus on the logo's color. Static shot.",
  inputImage = "/placeholder.svg?height=100&width=150",
  videoFrames = Array(8).fill("/placeholder.svg?height=100&width=150"),
  difficulty = "Modeling",
  modelName = "Sora 2",
  modelIcon = "/placeholder.svg?height=40&width=40",
  scores = [
    { module: "R1", score: 8 },
    { module: "R2", score: 6 },
    { module: "R3", score: 7 },
    { module: "R4", score: 9 },
    { module: "R5", score: 5 },
    { module: "R6", score: 8 },
    { module: "R7", score: 7 },
    { module: "R8", score: 6 },
    { module: "R9", score: 9 },
    { module: "R10", score: 7 },
  ],
  totalScore = 7.33,
  checklistLength = scores.length,
  tsr = 35.30,
  showActionButtons = true,
  cardId,
  transparentIcon = false
}: Partial<ReasoningCardProps>) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const difficultyKey = difficulty.toLowerCase?.() || "modeling"
  const categoryColor = CATEGORY_COLORS[difficultyKey] || CATEGORY_COLORS.modeling
  const difficultyBg = hexToRgba(categoryColor, 0.15)
  const difficultyBorder = hexToRgba(categoryColor, 0.5)

  const finalScore = (() => {
    if (typeof totalScore === "number" && checklistLength) {
      return totalScore / checklistLength
    }

    if (scores.length) {
      const sum = scores.reduce((acc, item) => acc + (item.score || 0), 0)
      return sum / scores.length
    }

    return 0
  })()

  const captureCard = async () => {
    if (!cardRef.current) return null

    const html2canvas = (await import('html2canvas')).default

    return html2canvas(cardRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
    })
  }

  const handleExport = async () => {
    try {
      const canvas = await captureCard()
      if (!canvas) return

      const link = document.createElement('a')
      link.download = `reasoning-card-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    }
  }

  const handleServerExport = async () => {
    if (isSaving) return
    try {
      setIsSaving(true)
      const canvas = await captureCard()
      if (!canvas) return

      const dataUrl = canvas.toDataURL('image/png')
      const response = await fetch('/api/export-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageData: dataUrl,
          filename: `reasoning-card-${Date.now()}.png`
        })
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      const result = await response.json()
      alert(`已保存至 ${result.path}`)
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative" data-card-id={cardId}>
      {showActionButtons && (
        <div className="absolute -top-12 right-0 z-10 flex flex-col gap-2">
          <Button
            onClick={handleExport}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            导出图片
          </Button>
          <Button
            onClick={handleServerExport}
            size="sm"
            variant="default"
            className="gap-2"
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? '保存中...' : '保存到项目'}
          </Button>
        </div>
      )}

      <div ref={cardRef} className="w-full max-w-[1600px] mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
        <div className="px-4 pt-3 pb-2 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
          <div className="flex flex-row gap-4 justify-between items-center">
            <div className="flex flex-col gap-2 w-full md:w-[50%] flex-shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs font-serif font-semibold text-gray-700">Prompt</h2>
                <div className="flex items-center gap-2 scale-90 origin-left">
                  <div 
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
                    style={{
                      backgroundColor: difficultyBg,
                      color: categoryColor,
                      borderColor: difficultyBorder
                    }}
                  >
                    <span className="font-mono">{difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                    <span className="font-mono">{modelName}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed font-medium whitespace-normal break-words">
                "{prompt}"
              </p>
            </div>

            <div className="flex flex-col gap-1 flex-grow min-w-0 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-serif font-semibold text-gray-700">Checklist Scores</h3>
              </div>
              <div className="h-[100px] w-full relative mt-1">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[10, 8, 6, 4, 2, 0].map((tick) => (
                    <div key={tick} className="w-full border-b border-dashed border-gray-200 h-0" />
                  ))}
                </div>
                
                <div className="absolute inset-0 flex items-end justify-between px-2 pb-[1px]">
                  {scores.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-1 flex-1 group">
                      <div className="relative w-full flex justify-center h-[85px] items-end">
                        <div 
                          className="w-[12px] transition-all duration-300 group-hover:opacity-80"
                          style={{
                            height: `${(item.score / 10) * 100}%`,
                            backgroundColor: categoryColor
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {item.score}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-500 font-medium">{item.module}</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute bottom-[18px] left-0 right-0 border-b border-gray-200"></div>
              </div>
            </div>

            <div className="flex flex-col justify-between flex-shrink-0 h-[100px] min-w-[120px]">
              <div className="h-full w-full border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-white shadow-sm overflow-hidden">
                <div className="w-full py-1.5 border-b border-gray-100 bg-gray-50/50 flex justify-center">
                  <h3 className="text-xs font-serif font-semibold text-gray-700">Final Score</h3>
                </div>
                <div className="flex flex-col items-center justify-center flex-grow w-full py-1 gap-1.5 px-2">
                  <div className="flex items-center justify-center w-full gap-1">
                    <span className="text-[11px] text-gray-500 font-serif font-medium">Score =</span>
                    <span className="text-sm font-bold text-gray-900">{finalScore.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400 font-medium">/10</span>
                  </div>
                  <div className="w-16 h-px bg-gray-100"></div>
                  <div className="flex items-center justify-center w-full gap-1">
                    <span className="text-[11px] text-gray-500 font-serif font-medium">TSR =</span>
                    <span className="text-sm font-bold text-gray-900">{tsr?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-row gap-4 items-end">
            <div className="flex flex-col gap-1.5 flex-shrink-0" style={{ width: 'calc((100% - 64px) / 9)' }}>
              <h3 className="text-xs font-serif font-semibold text-gray-700 whitespace-nowrap">Input Image</h3>
              <div className="relative group">
                <div className="overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm hover:border-blue-300 transition-colors bg-gray-100">
                  <Image
                    src={inputImage || "/placeholder.svg"}
                    alt="Input"
                    width={160}
                    height={120}
                    unoptimized
                    className="object-cover w-full h-auto aspect-[4/3]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-end flex-shrink-0 gap-1 pb-2 w-16">
              <div className="relative group">
                {!transparentIcon && (
                  <div className="absolute inset-0 bg-blue-100 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity"></div>
                )}
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                    transparentIcon
                      ? 'bg-transparent border border-transparent shadow-none'
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}
                >
                  <Image 
                    src={modelIcon || "/placeholder.svg"} 
                    alt="Model Icon" 
                    width={40} 
                    height={40} 
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-0.5 w-full">
                <div className="h-[2px] w-full bg-gray-300"></div>
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-gray-400"></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-grow">
              <h3 className="text-xs font-serif font-semibold text-gray-700 whitespace-nowrap">Generated Video</h3>
              <div className="grid grid-cols-8 gap-1.5">
                {videoFrames.slice(0, 8).map((frame, index) => (
                  <div key={index} className="relative group">
                    <div className="overflow-hidden rounded-md border-2 border-gray-200 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-blue-300 hover:z-10 bg-gray-50">
                      <Image
                        src={frame || "/placeholder.svg"}
                        alt={`Frame ${index + 1}`}
                        width={160}
                        height={120}
                        unoptimized
                        className="object-cover w-full h-auto aspect-[4/3]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
