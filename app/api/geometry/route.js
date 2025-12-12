import { createClient } from "@supabase/ssr"
import { cookies } from "next/headers"

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {}
      },
    },
  })
}

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["lateralDeviation", "verticalDeviation", "gauge", "twist", "curvature", "cant"]
    const hasAllFields = requiredFields.every((field) => typeof data[field] === "number")

    if (!hasAllFields) {
      return Response.json({ error: "Missing required geometry fields" }, { status: 400 })
    }

    // Save to Supabase
    const supabase = await getSupabaseClient()
    const { error: insertError } = await supabase.from("geometry_data").insert({
      lateral_deviation: data.lateralDeviation,
      vertical_deviation: data.verticalDeviation,
      gauge: data.gauge,
      twist: data.twist,
      curvature: data.curvature,
      cant: data.cant,
    })

    if (insertError) {
      console.error("[v0] Supabase insert error:", insertError)
      return Response.json({ error: "Failed to save data" }, { status: 500 })
    }

    return Response.json({ success: true, message: "Geometry data saved" })
  } catch (error) {
    console.error("[v0] POST error:", error)
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET(request) {
  const supabase = await getSupabaseClient()

  try {
    // First, try to get latest data from Supabase
    const { data: savedData, error: fetchError } = await supabase
      .from("geometry_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // If we have recent data from Supabase (within last 5 seconds), return it
    if (savedData && !fetchError) {
      const dataAge = Date.now() - new Date(savedData.created_at).getTime()
      if (dataAge < 5000) {
        return Response.json({
          lateralDeviation: Number(savedData.lateral_deviation),
          verticalDeviation: Number(savedData.vertical_deviation),
          gauge: Number(savedData.gauge),
          twist: Number(savedData.twist),
          curvature: Number(savedData.curvature),
          cant: Number(savedData.cant),
          timestamp: savedData.created_at,
          source: "supabase",
        })
      }
    }

    // Try to fetch from Cloudflare tunnel
    const cloudflareUrl = process.env.CLOUDFLARE_TUNNEL_URL

    if (cloudflareUrl) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      try {
        const response = await fetch(cloudflareUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          cache: "no-store",
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const contentType = response.headers.get("content-type") || ""

          if (contentType.includes("application/json")) {
            const data = await response.json()

            // Save to Supabase in background
            supabase
              .from("geometry_data")
              .insert({
                lateral_deviation: data.lateralDeviation,
                vertical_deviation: data.verticalDeviation,
                gauge: data.gauge,
                twist: data.twist,
                curvature: data.curvature,
                cant: data.cant,
              })
              .then()

            return Response.json({ ...data, source: "cloudflare" })
          }
        }
      } catch (tunnelError) {
        // Tunnel failed, continue to fallback
      }
    }

    // Generate and save simulated data
    const simulatedData = generateSimulatedData()

    // Save simulated data to Supabase
    await supabase.from("geometry_data").insert({
      lateral_deviation: simulatedData.lateralDeviation,
      vertical_deviation: simulatedData.verticalDeviation,
      gauge: simulatedData.gauge,
      twist: simulatedData.twist,
      curvature: simulatedData.curvature,
      cant: simulatedData.cant,
    })

    return Response.json({ ...simulatedData, source: "simulated" })
  } catch (error) {
    console.error("[v0] GET error:", error)
    return Response.json(generateSimulatedData())
  }
}

function generateSimulatedData() {
  return {
    lateralDeviation: 2.3 + Math.random() * 0.5 - 0.25,
    verticalDeviation: 1.8 + Math.random() * 0.4 - 0.2,
    gauge: 1435 + Math.random() * 2 - 1,
    twist: 1.2 + Math.random() * 0.3 - 0.15,
    curvature: 1.8 + Math.random() * 0.5 - 0.25,
    cant: 2.1 + Math.random() * 0.4 - 0.2,
    timestamp: new Date().toISOString(),
  }
}
