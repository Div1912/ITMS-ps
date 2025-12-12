"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Ruler, CheckCircle, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const CLOUD_URL = "https://images-malpractice-acid-checked.trycloudflare.com/geometry"

export function GeometryMetrics() {
  const [data, setData] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [error, setError] = useState(false)
  const supabase = createClient()

  const saveToDatabase = async (geometryData: any) => {
    try {
      const { error } = await supabase.from("geometry_data").insert({
        lateral_deviation: geometryData.lateralDeviation || 0,
        vertical_deviation: geometryData.verticalDeviation || 0,
        gauge: geometryData.gauge || 1435,
        twist: geometryData.twist || 0,
        curvature: geometryData.curvature || 0,
        cant: geometryData.crossLevel || 0,
      })

      if (error) {
        console.error("[v0] Error saving geometry data:", error)
      } else {
        console.log("[v0] Geometry data saved successfully")
      }
    } catch (err) {
      console.error("[v0] Database save failed:", err)
    }
  }

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

        await saveToDatabase(json)
      } catch (err) {
        console.log("[v0] Fetch failed:", err)
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
    { id: "curvature", name: "Curvature", value: data.curvature, unit: "°", max: 2.5 },
  ]

  const getStatus = (metric: any) => {
    if (typeof metric.value !== "number") return "normal"
    if (metric.nominal) {
      const deviation = Math.abs(metric.value - metric.nominal)
      if (deviation > metric.tolerance * 2) return "critical"
      if (deviation > metric.tolerance) return "warning"
      return "normal"
    }
    if (metric.max) {
      const percentage = (metric.value / metric.max) * 100
      if (percentage > 90) return "critical"
      if (percentage > 70) return "warning"
      return "normal"
    }
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500"
      case "warning":
        return "text-yellow-500"
      default:
        return "text-green-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />
    }
  }

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
          {metrics.map((metric) => {
            const status = getStatus(metric)
            return (
              <div key={metric.id} className="p-4 rounded-lg border bg-background/50">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{metric.name}</h4>
                  {getStatusIcon(status)}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${getStatusColor(status)}`}>
                    {Number(metric.value ?? 0).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>

                {metric.max && (
                  <>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>
                        Limit: {metric.max}
                        {metric.unit}
                      </span>
                      <span>{((metric.value / metric.max) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(metric.value / metric.max) * 100} className="h-1 mt-1" />
                  </>
                )}

                {metric.nominal && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Nominal: {metric.nominal}±{metric.tolerance}
                    {metric.unit}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
