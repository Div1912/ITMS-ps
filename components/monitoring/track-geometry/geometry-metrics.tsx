"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Ruler, AlertTriangle, CheckCircle } from "lucide-react"

// ⭐ IMPORTANT — UPDATE THIS EVERY TIME YOU RUN CLOUDFLARED
const CLOUD_URL ="https://classification-column-enable-seconds.trycloudflare.com/geometry"



export function GeometryMetrics() {
  const [data, setData] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(CLOUD_URL, { cache: "no-store" })
        if (!res.ok) throw new Error(`Bad response ${res.status}`)

        const json = await res.json()
        if (!json || typeof json !== "object") throw new Error("Invalid JSON")

        setData(json)
        setLastUpdate(new Date())
        setError(false)
      } catch (err) {
        console.log("FETCH FAILED:", err)
        setError(true)
      }
    }

    // Fetch immediately
    fetchData()

    // Fetch every 1s
    const interval = setInterval(fetchData, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!data) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-8 text-center text-muted-foreground">
        Connecting to Raspberry Pi TGMS sensor...
      </Card>
    )
  }

  const metrics = [
    { id: "lateralDeviation", name: "Lateral Deviation", value: data.lateralDeviation, unit: "mm", max: 5.0 },
    { id: "verticalDeviation", name: "Vertical Deviation", value: data.verticalDeviation, unit: "mm", max: 4.0 },
    { id: "gauge", name: "Track Gauge", value: data.gauge, unit: "mm", nominal: 1435, tolerance: 3 },
    { id: "twist", name: "Track Twist", value: data.twist, unit: "mm/m", max: 2.0 },
    { id: "crossLevel", name: "Cross Level", value: data.crossLevel, unit: "mm", max: 3.0 },
    { id: "curvature", name: "Curvature", value: data.curvature, unit: "°", max: 2.5 }
  ]

  const getStatusColor = () => "text-green-400"
  const getStatusIcon = () => <CheckCircle className="w-4 h-4 text-green-400" />

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-400" />
            <div>
              <CardTitle className="text-xl">Geometry Measurements</CardTitle>
              <CardDescription>Real-time TGMS geometry from Raspberry Pi</CardDescription>
            </div>
          </div>

          <div className="text-right text-sm text-muted-foreground">
            <p>Last Update: {lastUpdate.toLocaleTimeString("en-IN")}</p>
            {error && <p className="text-red-400">OFFLINE</p>}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map(metric => (
            <div key={metric.id} className="p-4 rounded-lg border bg-background/50">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{metric.name}</h4>
                {getStatusIcon()}
              </div>

              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${getStatusColor()}`}>
                  {Number(metric.value ?? 0).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>

              {metric.max && (
                <>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Limit: {metric.max}{metric.unit}</span>
                    <span>{((metric.value / metric.max) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(metric.value / metric.max) * 100} className="h-1" />
                </>
              )}

              {metric.nominal && (
                <div className="text-xs text-muted-foreground">
                  Nominal: {metric.nominal}±{metric.tolerance}{metric.unit}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
