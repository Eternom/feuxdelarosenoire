import { readFile } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

// Force le rendu dynamique pour éviter la mise en cache de 404
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Tentative de détection du dossier d'upload
const UPLOAD_DIR = existsSync("/app/uploads") 
  ? "/app/uploads" 
  : join(process.cwd(), "public", "uploads")

console.log(`[IMAGE_SERVE] Initialization - UPLOAD_DIR: ${UPLOAD_DIR}`)

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const pathArray = resolvedParams.path
    
    const filename = Array.isArray(pathArray) ? pathArray.join('/') : pathArray

    if (!filename) {
      console.error("[IMAGE_SERVE] Path missing in params")
      return new Response("Path missing", { status: 400 })
    }
    
    const decodedFilename = decodeURIComponent(filename)
    const filePath = join(UPLOAD_DIR, decodedFilename)

    console.log(`[IMAGE_SERVE] Request for: ${decodedFilename}`)
    console.log(`[IMAGE_SERVE] Absolute path: ${filePath}`)

    if (!existsSync(filePath)) {
      console.error(`[IMAGE_SERVE] File not found: ${filePath}`)
      return new Response("Not Found", { 
        status: 404,
        headers: { 
          'X-Debug-Path': filePath,
          'X-Debug-Exists-Dir': existsSync(UPLOAD_DIR).toString()
        } 
      })
    }

    const file = await readFile(filePath)
    const ext = decodedFilename.split('.').pop()?.toLowerCase() || ''
    
    const contentTypes: Record<string, string> = {
      'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
      'png': 'image/png', 'webp': 'image/webp',
      'svg': 'image/svg+xml', 'gif': 'image/gif',
      'avif': 'image/avif'
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'
    console.log(`[IMAGE_SERVE] Serving ${decodedFilename} as ${contentType} (${file.length} bytes)`)

    return new Response(file, {
      headers: { 
        'Content-Type': contentType,
        'Content-Length': file.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Served-By': 'NextJS-Dynamic-Route'
      }
    })
  } catch (error: any) {
    console.error("[IMAGE_SERVE] Critical error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
