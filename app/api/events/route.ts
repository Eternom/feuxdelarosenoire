import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: "asc" },
  })
  return NextResponse.json(events)
}
