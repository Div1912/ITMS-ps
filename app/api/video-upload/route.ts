import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("video") as File

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob with unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `railway-inspection-${timestamp}.webm`

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    console.log("[v0] Video uploaded to Blob:", blob.url)

    return NextResponse.json({
      url: blob.url,
      size: file.size,
      contentType: file.type,
    })
  } catch (error) {
    console.error("[v0] Video upload error:", error)
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
  }
}
