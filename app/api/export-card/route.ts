import { Buffer } from 'buffer'
import { promises as fs } from 'fs'
import path from 'path'

import { NextRequest, NextResponse } from 'next/server'

const OUTPUT_DIR = path.join(process.cwd(), 'exported_cards')

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function extractImagePayload(dataUrl: string) {
  const match = dataUrl.match(/^data:image\/(png|jpeg);base64,(.+)$/)
  if (!match) {
    return null
  }

  return {
    mime: match[1] === 'png' ? 'image/png' : 'image/jpeg',
    buffer: Buffer.from(match[2], 'base64')
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { filename, dataUrl, imageData } = body as { filename?: string; dataUrl?: string; imageData?: string }
  const imagePayload = imageData || dataUrl

  if (!filename || !imagePayload) {
    return NextResponse.json({ error: 'Missing filename or image data' }, { status: 400 })
  }

  const payload = extractImagePayload(imagePayload)

  if (!payload) {
    return NextResponse.json({ error: 'Unsupported image data' }, { status: 400 })
  }

  const safeName = sanitizeFileName(filename.endsWith('.png') ? filename : `${filename}.png`)
  const targetPath = path.join(OUTPUT_DIR, safeName)

  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  await fs.writeFile(targetPath, payload.buffer)

  return NextResponse.json({ success: true, path: path.relative(process.cwd(), targetPath) })
}
