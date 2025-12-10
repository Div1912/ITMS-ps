let latestGeometry = {
  lateralDeviation: 2.3,
  verticalDeviation: 1.8,
  gauge: 1435.2,
  twist: 0.9,
  crossLevel: 1.5,
  curvature: 1.2,
  timestamp: new Date().toISOString(),
}

function generateSimulationData() {
  // Generate slight variations to simulate live sensor data
  return {
    lateralDeviation: 2.3 + (Math.random() - 0.5) * 0.5,
    verticalDeviation: 1.8 + (Math.random() - 0.5) * 0.4,
    gauge: 1435.2 + (Math.random() - 0.5) * 0.8,
    twist: 0.9 + (Math.random() - 0.5) * 0.3,
    crossLevel: 1.5 + (Math.random() - 0.5) * 0.4,
    curvature: 1.2 + (Math.random() - 0.5) * 0.3,
    timestamp: new Date().toISOString(),
  }
}

export async function POST(req) {
  try {
    const body = await req.json()

    const requiredFields = ["lateralDeviation", "verticalDeviation", "gauge", "twist", "crossLevel", "curvature"]
    const hasAllFields = requiredFields.every((field) => typeof body[field] === "number")

    if (!hasAllFields) {
      console.error("[v0] POST validation failed - missing required fields:", body)
      return Response.json({ status: "error", message: "Missing required geometry fields" }, { status: 400 })
    }

    latestGeometry = {
      ...body,
      timestamp: body.timestamp || new Date().toISOString(),
    }
    console.log("[v0] Geometry data received from sensor:", latestGeometry)
    return Response.json({ status: "ok" })
  } catch (error) {
    console.error("[v0] POST error:", error.message)
    return Response.json({ status: "error", message: error.message }, { status: 400 })
  }
}

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/api/geometry`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })

        if (res.ok) {
          try {
            const data = await res.json()
            if (data && typeof data === "object") {
              latestGeometry = {
                ...data,
                timestamp: data.timestamp || new Date().toISOString(),
              }
              return Response.json(latestGeometry)
            }
          } catch (jsonError) {
            console.error("[v0] Backend JSON parse error:", jsonError.message)
          }
        }
      } catch (fetchError) {
        console.error("[v0] Backend fetch error:", fetchError.message)
      }
    }
  } catch (error) {
    console.error("[v0] Unexpected error in GET:", error.message)
  }

  latestGeometry = generateSimulationData()
  return Response.json(latestGeometry)
}
