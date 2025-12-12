export async function GET(request) {
  try {
    const cloudflareUrl =
      process.env.CLOUDFLARE_TUNNEL_URL || "https://divisions-relying-engagement-santa.trycloudflare.com/geometry"

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(cloudflareUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.log("[v0] Tunnel returned error, using simulated data")
      return Response.json(generateSimulatedData())
    }

    const contentType = response.headers.get("content-type") || ""
    let data

    if (contentType.includes("application/json")) {
      data = await response.json()
    } else {
      console.log("[v0] Tunnel returned " + contentType + ", using simulated data")
      return Response.json(generateSimulatedData())
    }

    return Response.json(data)
  } catch (error) {
    return Response.json(generateSimulatedData())
  }
}

function generateSimulatedData() {
  return {
    lateralDeviation: 2.3 + Math.random() * 0.5,
    verticalDeviation: 1.8 + Math.random() * 0.4,
    gauge: 1435 + Math.random() * 2 - 1,
    twist: 1.2 + Math.random() * 0.3,
    crossLevel: 2.1 + Math.random() * 0.4,
    curvature: 1.8 + Math.random() * 0.5,
    timestamp: new Date().toISOString(),
  }
}
