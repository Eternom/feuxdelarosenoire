import { writeFile, mkdir, readdir, stat } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import { nanoid } from "nanoid"

const UPLOAD_DIR = existsSync("/app/uploads") ? "/app/uploads" : join(process.cwd(), "public", "uploads")
const ALLOWED     = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
const MAX_SIZE_MB = 5

/** GET /api/admin/upload — liste les images uploadées */
export async function GET() {
  await mkdir(UPLOAD_DIR, { recursive: true })
  const files = await readdir(UPLOAD_DIR)

  const images = await Promise.all(
    files
      .filter((f) => /\.(jpe?g|png|webp|gif|svg)$/i.test(f))
      .map(async (f) => {
        const s = await stat(join(UPLOAD_DIR, f))
        return {
          key:          f,
          url:          `/uploads/${f}`,
          size:         s.size,
          lastModified: s.mtime.toISOString(),
        }
      })
  )

  images.sort((a, b) => b.lastModified.localeCompare(a.lastModified))
  return Response.json(images)
}

/** POST /api/admin/upload — upload un fichier */
export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file") as File | null

  if (!file)                          return Response.json({ error: "Fichier manquant" },                   { status: 400 })
  if (!ALLOWED.includes(file.type))   return Response.json({ error: "Type de fichier non autorisé" },       { status: 400 })
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
                                      return Response.json({ error: `Max ${MAX_SIZE_MB} Mo` },               { status: 400 })

  await mkdir(UPLOAD_DIR, { recursive: true })
  const ext      = file.name.split(".").pop() ?? "jpg"
  const filename = `${nanoid()}.${ext}`
  await writeFile(join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()))

  return Response.json({ key: filename, url: `/uploads/${filename}` })
}
