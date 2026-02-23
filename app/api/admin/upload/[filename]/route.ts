import { readFile } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = "/app/uploads"

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filePath = join(UPLOAD_DIR, params.filename)
    const file = await readFile(filePath)

    const ext = params.filename.split(".").pop()?.toLowerCase()

    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
    }

    return new Response(file, {
      headers: {
        "Content-Type": contentTypeMap[ext || ""] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}