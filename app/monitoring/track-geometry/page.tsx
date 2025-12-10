"use client"

import { useState, useEffect } from "react"
import { GeometryMetrics } from "@/components/monitoring/track-geometry/geometry-metrics"
import { Card } from "@/components/ui/card"

export default function TrackGeometryMonitoring() {
  const [geometry, setGeometry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGeometry = async () => {
      try {
        const res = await fetch("/api/geometry")
        const json = await res.json()

        if (json && json.timestamp) {
          setGeometry(json)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching geometry:", error)
      }
    }

    // Initial fetch
    fetchGeometry()

    // Poll for updates every 500ms
    const interval = setInterval(fetchGeometry, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Track Geometry Monitoring</h1>
      <p className="text-muted-foreground">Real-time track alignment & geometry analysis</p>

      {loading ? (
        <Card className="w-full p-8">
          <div className="text-center text-muted-foreground text-lg">Waiting for live geometry data…</div>
        </Card>
      ) : (
        <GeometryMetrics initialData={geometry} />
      )}
    </div>
  )
}
