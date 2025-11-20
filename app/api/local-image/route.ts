import { promises as fs } from 'fs'
import path from 'path'

import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ROOTS = ['first_frames', 'extracted_frames']

function isPathAllowed(resolvedPath: string, root: string) {
  const normalizedRoot = path.join(process.cwd(), root)
  return resolvedPath.startsWith(normalizedRoot)
}

function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
    default:
      return 'image/jpeg'
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const requestedPath = url.searchParams.get('path')

  if (!requestedPath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
  }

  const normalized = path.posix.normalize(requestedPath.replace(/\\/g, '/'))
  const segments = normalized.split('/').filter(Boolean)

  if (segments.length === 0 || !ALLOWED_ROOTS.includes(segments[0])) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  const resolvedPath = path.join(process.cwd(), ...segments)

  if (!isPathAllowed(resolvedPath, segments[0])) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  try {
    const fileBuffer = await fs.readFile(resolvedPath)
    const contentType = getMimeType(resolvedPath)
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60'
      }
    })
  } catch (error) {
    console.error('Failed to read image', error)
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }
}
