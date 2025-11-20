import { ReasoningCard } from "@/components/reasoning-card"
import { getCardSamples } from "@/lib/card-data"

const buildMediaPath = (path?: string) => {
  if (!path) return "/placeholder.svg"
  return path.startsWith("/") ? path : `/${path}`
}

const buildOptionalPath = (path?: string) => {
  if (!path) return undefined
  return path.startsWith("/") ? path : `/${path}`
}

export default function Page() {
  const cards = getCardSamples()

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl mx-auto mb-10 text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Video Reasoning Model Cards</h1>
        <p className="text-gray-500">Rendering {cards.length} evaluated generations with prompts, scores, and frames.</p>
      </div>

      <div className="flex flex-col gap-12">
        {cards.map((sample) => (
          <ReasoningCard
            key={sample.cardId}
            prompt={sample.prompt}
            inputImage={buildMediaPath(sample.inputImage)}
            videoFrames={sample.videoFrames.map((frame) => buildMediaPath(frame))}
            difficulty={sample.difficulty}
            modelName={sample.modelName}
            scores={sample.scores}
            totalScore={sample.totalScore}
            checklistLength={sample.checklistLength}
            tsr={sample.tsr}
            modelIcon={buildOptionalPath(sample.modelIcon)}
            transparentIcon={sample.transparentIcon}
            cardId={sample.cardId}
          />
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-gray-400">
        <p>Model Evaluation Dashboard • v2.4.0</p>
      </div>
    </div>
  )
}
