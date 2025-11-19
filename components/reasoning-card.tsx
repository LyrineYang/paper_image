"use client"

import { Download, Sparkles } from 'lucide-react'
import Image from "next/image"
import { useRef } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

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
  tsr?: number
}

export function ReasoningCard({
  prompt = "Zoom in on the black bag with the Apple logo to focus on the logo's color. Static shot.",
  inputImage = "/placeholder.svg?height=100&width=150",
  videoFrames = Array(4).fill("/placeholder.svg?height=100&width=150"),
  difficulty = "Modeling",
  modelName = "GPT-4V-Turbo",
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
  tsr = 35.30
}: Partial<ReasoningCardProps>) {
  const cardRef = useRef<HTMLDivElement>(null)

  const chartConfig = {
    score: {
      label: "Score",
      color: "#A4BEC2", // Updated to user's requested color
    },
  } satisfies ChartConfig

  const handleExport = async () => {
    if (!cardRef.current) return
    
    try {
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      })
      
      const link = document.createElement('a')
      link.download = `reasoning-card-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    }
  }

  return (
    <div className="relative">
      <Button
        onClick={handleExport}
        size="sm"
        variant="outline"
        className="absolute -top-12 right-0 z-10 gap-2"
      >
        <Download className="w-4 h-4" />
        导出图片
      </Button>

      <div ref={cardRef} className="w-full max-w-6xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
        <div className="px-4 pt-3 pb-2 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col gap-2 w-full md:w-[45%] flex-shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs font-serif font-semibold text-gray-700">Prompt</h2>
                <div className="flex items-center gap-2 scale-90 origin-left">
                  <div 
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
                    style={difficulty === 'Modeling' || difficulty === 'Moderate' ? {
                      backgroundColor: 'rgba(164, 190, 194, 0.15)', // Light version of #A4BEC2
                      color: '#526D72', // Darker version for readability
                      borderColor: 'rgba(164, 190, 194, 0.5)'
                    } : {}}
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
                <h3 className="text-xs font-serif font-semibold text-gray-700">Checklist Scores (R1-R10)</h3>
              </div>
              <ChartContainer config={chartConfig} className="h-[100px] w-full">
                <BarChart data={scores} margin={{ top: 5, right: 0, bottom: 0, left: 0 }} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="module" 
                    tick={{ fontSize: 9, fill: '#6b7280' }} 
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }} 
                    interval={0}
                  />
                  <YAxis 
                    hide
                    domain={[0, 10]} 
                    ticks={[0, 2, 4, 6, 8, 10]}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#A4BEC2" // Using the requested color for bars
                    radius={[0, 0, 0, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="flex flex-col justify-between flex-shrink-0 h-[100px] min-w-[120px]">
              <div className="h-full w-full border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-white shadow-sm overflow-hidden">
                <div className="w-full py-1.5 border-b border-gray-100 bg-gray-50/50 flex justify-center">
                  <h3 className="text-xs font-serif font-semibold text-gray-700">Final Score</h3>
                </div>
                <div className="flex flex-col items-center justify-center flex-grow w-full py-1 gap-1.5 px-2">
                  <div className="flex items-center justify-center w-full gap-1">
                    <span className="text-[11px] text-gray-500 font-serif font-medium">Score =</span>
                    <span className="text-sm font-bold text-gray-900">{totalScore.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400 font-medium">/10</span>
                  </div>
                  <div className="w-16 h-px bg-gray-100"></div>
                  <div className="flex items-center justify-center w-full gap-1">
                    <span className="text-[11px] text-gray-500 font-serif font-medium">TSR =</span>
                    <span className="text-sm font-bold text-gray-900">{tsr.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-row gap-4 md:gap-6 items-center pb-2 md:pb-0">
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-serif font-semibold text-gray-700">Input Image</h3>
              </div>
              <div className="relative group">
                <div className="overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
                  <Image
                    src={inputImage || "/placeholder.svg"}
                    alt="Input"
                    width={120}
                    height={90}
                    className="object-cover w-[120px] h-[90px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1 pt-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
                  <Image 
                    src={modelIcon || "/placeholder.svg?height=40&width=40"} 
                    alt="Model Icon" 
                    width={40} 
                    height={40} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <div className="w-8 h-0.5 bg-gray-200"></div>
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-gray-300"></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-grow min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-serif font-semibold text-gray-700">Generated Video</h3>
                <span className="text-[10px] text-gray-400 font-mono">4 frames • 00:06</span>
              </div>
              
              <div className="flex gap-2">
                {videoFrames.slice(0, 4).map((frame, index) => (
                  <div key={index} className="relative group flex-shrink-0">
                    <div className="overflow-hidden rounded-md border-2 border-gray-200 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-blue-300 hover:z-10 bg-gray-50">
                      <Image
                        src={frame || "/placeholder.svg"}
                        alt={`Frame ${index + 1}`}
                        width={120}
                        height={90}
                        className="object-cover w-[120px] h-[90px]"
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] text-white font-mono font-semibold">
                      {index + 1}
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
