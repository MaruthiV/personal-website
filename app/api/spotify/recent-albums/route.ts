import { getShelfItems } from "@/lib/spotify"
import { NextResponse } from "next/server"

// Always hit Spotify fresh — never serve a cached/stale shelf.
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const items = await getShelfItems(15)
    return NextResponse.json(
      { items },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    )
  } catch (error) {
    console.error("Error building shelf items:", error)
    return NextResponse.json({ items: [] })
  }
}
