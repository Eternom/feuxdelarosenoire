import { readFile } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

// Force le rendu dynamique pour éviter la mise en cache de 404
export const dynamic = 'force-dynamic'
export const revalidate = 0

const UPLOAD_DIR = existsSync("/app/uploads") 
  ? "/app/uploads" 
  : join(process.cwd(), "public", "uploads")

export async function GET(req: Request, { params }: { params: any }) {
  try {
    // Gestion universelle pour Next.js 14, 15 et +
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const filename = resolvedParams.filename
    
    // Décodage au cas où le nom contienne des caractères spéciaux (%)
    const decodedFilename = decodeURIComponent(filename)
    const filePath = join(UPLOAD_DIR, decodedFilename)

    if (!existsSync(filePath)) {
      console.error("Image non trouvée sur le disque:", filePath)
      return new Response("Not Found", { 
        status: 404,
        headers: { 'X-Debug-Path': filePath } 
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

    // Utilisation de Response au lieu de NextResponse pour un contrôle total
    return new Response(file, {
      headers: { 
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Served-By': 'NextJS-Dynamic-Route'
      }
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return new Response("Not Found", { status: 404 })
  }
}
