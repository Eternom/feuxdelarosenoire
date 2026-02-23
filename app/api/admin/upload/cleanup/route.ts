import { readdir, unlink } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/prisma"

const UPLOAD_DIR = process.env.NODE_ENV === "production" ? "/app/uploads" : join(process.cwd(), "public", "uploads")

/** POST /api/admin/upload/cleanup — supprime les images orphelines */
export async function POST() {
  const files = await readdir(UPLOAD_DIR).catch(() => [] as string[])
  if (files.length === 0) return Response.json({ deleted: 0 })

  const [events, partners] = await Promise.all([
    prisma.event.findMany({ select: { imageUrl: true } }),
    prisma.partner.findMany({ select: { logoUrl: true } }),
  ])

  const usedFilenames = new Set<string>()
  for (const e of events)   if (e.imageUrl) usedFilenames.add(e.imageUrl.split("/").pop()!)
  for (const p of partners) if (p.logoUrl)  usedFilenames.add(p.logoUrl.split("/").pop()!)

  const orphans = files.filter((f) => !usedFilenames.has(f))
  await Promise.all(orphans.map((f) => unlink(join(UPLOAD_DIR, f))))

  return Response.json({ deleted: orphans.length })
}
