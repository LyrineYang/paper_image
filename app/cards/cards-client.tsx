"use client"

import { useMemo, useRef, useState } from 'react'

import { ReasoningCard } from '@/components/reasoning-card'
import type { CardSample } from '@/lib/card-data'

interface CardsClientProps {
  samples: CardSample[]
  hideControls?: boolean
}

export function CardsClient({ samples, hideControls = false }: CardsClientProps) {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [exporting, setExporting] = useState(false)
  const [processed, setProcessed] = useState(0)
  const [status, setStatus] = useState<string | null>(null)

  const total = samples.length

  const sampleData = useMemo(() => {
    const buildUrl = (relativePath?: string) => {
      if (!relativePath) return "/placeholder.svg"
      return relativePath.startsWith('/') ? relativePath : `/${relativePath}`
    }

    const buildOptionalUrl = (relativePath?: string) => {
      if (!relativePath) return undefined
      return relativePath.startsWith('/') ? relativePath : `/${relativePath}`
    }

    return samples.map((sample) => ({
      ...sample,
      inputImageUrl: buildUrl(sample.inputImage),
      frameUrls: sample.videoFrames.map(buildUrl),
      iconUrl: buildOptionalUrl(sample.modelIcon)
    }))
  }, [samples])

  const handleExportAll = async () => {
    if (exporting) return

    setExporting(true)
    setProcessed(0)
    setStatus('开始导出...')

    try {
      const html2canvas = (await import('html2canvas')).default

      for (let i = 0; i < sampleData.length; i += 1) {
        const sample = sampleData[i]
        const cardElement = cardRefs.current[sample.cardId]

        if (!cardElement) {
          continue
        }

        const canvas = await html2canvas(cardElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true
        })

        const dataUrl = canvas.toDataURL('image/png')
        const filename = `${String(sample.id).padStart(3, '0')}_${sample.videoName.replace(/\.[^/.]+$/, '')}.png`

        const response = await fetch('/api/export-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, imageData: dataUrl })
        })

        if (!response.ok) {
          throw new Error('导出接口返回错误')
        }

        setProcessed(i + 1)
        setStatus(`已导出 ${i + 1}/${total}`)
      }

      setStatus('导出完成，文件位于 exported_cards 目录')
    } catch (error) {
      console.error('批量导出失败', error)
      setStatus('导出失败，请查看控制台日志')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8">
      {!hideControls && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reasoning Cards</h1>
            <p className="text-sm text-gray-500">共 {total} 条样本</p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <button
              type="button"
              onClick={handleExportAll}
              disabled={exporting}
              className={`px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors ${exporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {exporting ? '导出中...' : '一键导出 PNG'}
            </button>
            {status && (
              <p className="text-xs text-gray-500">{status}</p>
            )}
            {exporting && (
              <div className="w-full md:w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(processed / total) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-10">
        {sampleData.map((sample) => (
          <div
            key={sample.cardId}
            data-card-id={sample.cardId}
            ref={(el) => {
              cardRefs.current[sample.cardId] = el
            }}
          >
            <ReasoningCard
              prompt={sample.prompt}
              inputImage={sample.inputImageUrl}
              videoFrames={sample.frameUrls}
              difficulty={sample.difficulty}
              modelName={sample.modelName}
              scores={sample.scores}
              totalScore={sample.totalScore}
              checklistLength={sample.checklistLength}
              tsr={sample.tsr}
              showActionButtons={false}
              cardId={sample.cardId}
              modelIcon={sample.iconUrl}
              transparentIcon={sample.transparentIcon}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
