import { ReasoningCard } from "@/components/reasoning-card"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-4xl mb-8 text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Video Generation Reasoning</h1>
        <p className="text-gray-500">Visualizing the transformation from static input to temporal consistency.</p>
      </div>
      
      <ReasoningCard
        prompt="Zoom in on the black bag with the Apple logo to focus on the logo's color. Static shot."
        inputImage="/placeholder.svg?height=120&width=160&text=Input"
        videoFrames={[
          "/placeholder.svg?height=80&width=120&text=Frame+1",
          "/placeholder.svg?height=80&width=120&text=Frame+2",
          "/placeholder.svg?height=80&width=120&text=Frame+3",
          "/placeholder.svg?height=80&width=120&text=Frame+4",
          "/placeholder.svg?height=80&width=120&text=Frame+5",
          "/placeholder.svg?height=80&width=120&text=Frame+6",
          "/placeholder.svg?height=80&width=120&text=Frame+7",
          "/placeholder.svg?height=80&width=120&text=Frame+8",
        ]}
        difficulty="Modeling"
        modelName="Sora-2"
        modelIcon="/placeholder.svg?height=40&width=40&text=Model"
        scores={[
          { module: "R1", score: 10 },
          { module: "R2", score: 10 },
          { module: "R3", score: 7 },
          { module: "R4", score: 8 },
          { module: "R5", score: 6 },
          { module: "R6", score: 9 },
          { module: "R7", score: 8 },
          { module: "R8", score: 7 },
          { module: "R9", score: 5 },
          { module: "R10", score: 1 },
        ]}
        totalScore={7.33}
        tsr={35.30}
      />
      
      <div className="mt-12 text-center text-sm text-gray-400">
        <p>Model Evaluation Dashboard • v2.4.0</p>
      </div>
    </div>
  )
}
