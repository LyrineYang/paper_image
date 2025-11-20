import rawData from "@/data/card_data_merged.json"

export type ScoreEntry = {
  id?: string
  raw_score?: number
}

export type CardEntry = {
  video_name: string
  video_path: string
  inputImage?: string
  videoFrames?: string[]
  scores?: ScoreEntry[]
  sample_score?: number
  total_score?: number
  categories?: {
    category1?: string
    category2?: string
    category3?: string | null
  }
  prompt_text?: string
  strict_prompt?: string
  relax_prompt?: string
  prompt_type?: "relax" | "strict"
  generation_model?: string
  checklist_length?: number
  eval_method?: string
  judge_model?: string
  id?: number
}

export type ModuleScore = {
  module: string
  score: number
}

export type CardSample = {
  id: number
  prompt: string
  promptType: "relax" | "strict"
  difficulty: string
  modelName: string
  modelIcon?: string
  transparentIcon?: boolean
  inputImage?: string
  videoFrames: string[]
  scores: ModuleScore[]
  totalScore: number
  tsr: number
  checklistLength: number
  videoName: string
  cardId: string
}

const cards = rawData as CardEntry[]

const MODEL_ICON_MAP: Record<string, string> = {
  'sora_2': '/icons/dark-mode-icon.png',
  'sora2pro': '/icons/dark-mode-icon.png',
  'veo3.1': '/icons/veo.png',
  'kling': '/icons/kling.png',
  'kling-start-end-frame': '/icons/kling.png',
  'hailuo2.3': '/icons/hailuo.jpeg',
  'hunyuan': '/icons/hunyuan.png',
  'seedance': '/icons/seedance.png',
  'ltx': '/icons/ltx.png',
  'longcat': '/icons/longcat.png',
  'cosmos-predict-2b': '/icons/cosmos.png',
  'wan_2.5': '/icons/wan.png',
  'wan2.1-14b': '/icons/wan.png',
  'wan2.2-14b': '/icons/wan.png',
  'chronoedit': '/icons/chrono.png'
}

const TRANSPARENT_ICON_MODELS = new Set([
  'veo3.1',
  'kling',
  'kling-start-end-frame',
  'longcat',
  'ltx',
  'wan_2.5',
  'wan2.1-14b',
  'wan2.2-14b'
])

const formatModelName = (model?: string) => {
  if (!model) return "Unknown"
  return model
    .replace(/_/g, " ")
    .replace(/\b(\w)/g, (match) => match.toUpperCase())
}

const selectPrompt = (entry: CardEntry) => {
  if (entry.prompt_type === "strict") {
    return entry.strict_prompt || entry.prompt_text || ""
  }
  return entry.relax_prompt || entry.prompt_text || ""
}

const buildScores = (entry: CardEntry): ModuleScore[] => {
  return (entry.scores || []).map((score) => ({
    module: score.id || "R?",
    score: typeof score.raw_score === "number" ? score.raw_score : 0
  }))
}

const getCardId = (entry: CardEntry) => {
  const base = entry.video_name?.replace(/\.[^/.]+$/, "") || `card-${entry.id}`
  const suffix = entry.prompt_type ? `-${entry.prompt_type}` : ""
  return `${base}${suffix}`
}

const getModelIcon = (model?: string) => {
  if (!model) return undefined
  const key = model.toLowerCase()
  return MODEL_ICON_MAP[key]
}

const isTransparentIconModel = (model?: string) => {
  if (!model) return false
  const key = model.toLowerCase()
  return TRANSPARENT_ICON_MODELS.has(key)
}

export const getCardSamples = () => {
  return cards.map((entry, index) => {
    const scores = buildScores(entry)
    const checklistLength = entry.checklist_length || scores.length || 1
    const totalScore = typeof entry.total_score === "number"
      ? entry.total_score
      : scores.reduce((acc, item) => acc + item.score, 0)

    return {
      id: entry.id ?? index + 1,
      prompt: selectPrompt(entry),
      promptType: entry.prompt_type || "relax",
      difficulty: entry.categories?.category1 || "modeling",
      modelName: formatModelName(entry.generation_model),
      modelIcon: getModelIcon(entry.generation_model),
      transparentIcon: isTransparentIconModel(entry.generation_model),
      inputImage: entry.inputImage,
      videoFrames: entry.videoFrames || [],
      scores,
      totalScore,
      tsr: entry.sample_score || 0,
      checklistLength,
      videoName: entry.video_name,
      cardId: getCardId(entry)
    } satisfies CardSample
  })
}
