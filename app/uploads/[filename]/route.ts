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

export async function GET(req: Request, { params }: { params: any }) {
  try {
    // Gestion universelle des paramètres (Next.js 14, 15 et +)
    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const pathArray = resolvedParams.path
    
    // Si on utilise [...path], pathArray est un tableau
    const filename = Array.isArray(pathArray) ? pathArray.join('/') : pathArray

    if (!filename) {
      console.error("[IMAGE_SERVE] Nom de fichier manquant dans les paramètres")
      return new Response("Nom de fichier manquant", { status: 400 })
    }
    
    // Décodage au cas où le nom contienne des caractères spéciaux (%)
    const decodedFilename = decodeURIComponent(filename)
    const filePath = join(UPLOAD_DIR, decodedFilename)

    if (!existsSync(filePath)) {
      console.error(`[IMAGE_SERVE] Image non trouvée sur le disque: ${filePath}`)
      // En production, on peut aussi lister le contenu du dossier pour débugger
      // const files = existsSync(UPLOAD_DIR) ? readdirSync(UPLOAD_DIR) : []
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

    return new Response(file, {
      headers: { 
        'Content-Type': contentType,
        'Content-Length': file.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Served-By': 'NextJS-Dynamic-Route'
      }
    })
  } catch (error: any) {
    console.error("[IMAGE_SERVE] Erreur lors du service de l'image:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
