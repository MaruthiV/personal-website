import { getNowPlayingItem } from "@/lib/spotify"
import { NextResponse } from "next/server"

export async function GET() {
  const response = await getNowPlayingItem()
  return NextResponse.json(response)
} 