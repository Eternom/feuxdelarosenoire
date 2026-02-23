import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createPartnerSchema } from "@/lib/validations/partner"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(partners)
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await request.json()
  const parsed = createPartnerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const partner = await prisma.partner.create({ data: parsed.data })
  return NextResponse.json(partner, { status: 201 })
}
