import { CardsClient } from './cards-client'

import { getCardSamples } from '@/lib/card-data'

interface CardsPageProps {
  searchParams?: {
    bare?: string
  }
}

export default function CardsPage({ searchParams }: CardsPageProps) {
  const samples = getCardSamples()
  const hideControls = searchParams?.bare === '1'
  return <CardsClient samples={samples} hideControls={hideControls} />
}
