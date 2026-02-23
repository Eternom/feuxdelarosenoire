import { readFile } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"

const UPLOAD_DIR = process.env.NODE_ENV === "production" 
  ? "/app/uploads" 
  : join(process.cwd(), "public", "uploads")

export async function GET(req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  const filePath = join(UPLOAD_DIR, filename)

  try {
    const file = await readFile(filePath)
    const ext = filename.split('.').pop()?.toLowerCase()
    
    const contentTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'gif': 'image/gif',
      'avif': 'image/avif'
    }

    const contentType = contentTypes[ext || ''] || 'application/octet-stream'

    return new NextResponse(file, {
      headers: { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable' 
      }
    })
  } catch {
    return new NextResponse("Image non trouvée", { status: 404 })
  }
}
