"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Ruler, AlertTriangle, CheckCircle } from "lucide-react"

function getMetricStatus(value: number, limit: number) {
  if (value >= limit) return "critical"
  if (value >= limit * 0.7) return "warning"
  return "normal"
}

function getGaugeStatus(value: number, nominal: number, tolerance: number) {
  if (value < nominal - tolerance || value > nominal + tolerance) return "critical"
  if (Math.abs(value - nominal) > tolerance * 0.7) return "warning"
  return "normal"
}

const statusColor: any = {
  normal: "text-green-400",
  warning: "text-yellow-400",
  critical: "text-red-400",
}

const statusIcon: any = {
  normal: <CheckCircle className="w-4 h-4 text-green-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  critical: <AlertTriangle className="w-4 h-4 text-red-400" />,
}

// ⭐⭐ THIS IS THE IMPORTANT EXPORT ⭐⭐
export function GeometryMetrics({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/geometry")
        const json = await res.json()

        if (
          json &&
          typeof json.lateralDeviation === "number" &&
          typeof json.verticalDeviation === "number" &&
          typeof json.gauge === "number" &&
          typeof json.twist === "number" &&
          typeof json.crossLevel === "number" &&
          typeof json.curvature === "number"
        ) {
          setData(json)
          setLastUpdate(new Date())
        } else {
          console.warn("[v0] Invalid geometry data format:", json)
        }
      } catch (err) {
        console.error("[v0] Fetch error:", err)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  if (!data || typeof data.lateralDeviation !== "number") {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center">
        <h2 className="text-muted-foreground">Waiting for sensor data...</h2>
        <p className="text-xs text-muted-foreground mt-2">Ensure Pi script is running and sending to this URL</p>
      </Card>
    )
  }

  const metrics = [
    {
      id: "lateral",
      name: "Lateral Deviation",
      value: data.lateralDeviation ?? 0,
      unit: "mm",
      max: 5.0,
      status: getMetricStatus(data.lateralDeviation ?? 0, 5.0),
      description: "Horizontal track alignment",
    },
    {
      id: "vertical",
      name: "Vertical Deviation",
      value: data.verticalDeviation ?? 0,
      unit: "mm",
      max: 4.0,
      status: getMetricStatus(data.verticalDeviation ?? 0, 4.0),
      description: "Vertical track profile",
    },
    {
      id: "gauge",
      name: "Track Gauge",
      value: data.gauge ?? 1435,
      unit: "mm",
      nominal: 1435,
      tolerance: 3,
      status: getGaugeStatus(data.gauge ?? 1435, 1435, 3),
      description: "Distance between rails",
    },
    {
      id: "twist",
      name: "Track Twist",
      value: data.twist ?? 0,
      unit: "mm",
      max: 2.0,
      status: getMetricStatus(data.twist ?? 0, 2.0),
      description: "Rail rotation difference",
    },
    {
      id: "crosslevel",
      name: "Cross Level",
      value: data.crossLevel ?? 0,
      unit: "mm",
      max: 3.0,
      status: getMetricStatus(data.crossLevel ?? 0, 3.0),
      description: "Rail height difference",
    },
    {
      id: "curvature",
      name: "Curvature",
      value: data.curvature ?? 0,
      unit: "mm",
      max: 2.5,
      status: getMetricStatus(data.curvature ?? 0, 2.5),
      description: "Track curve radius deviation",
    },
  ]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-400" />
            <div>
              <CardTitle className="text-xl">Geometry Measurements</CardTitle>
              <CardDescription>Real-time track geometry parameters</CardDescription>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Last Update: {lastUpdate.toLocaleTimeString("en-IN")}</p>
            <p>KM 245.8 - Section A-B</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="p-4 rounded-lg border border-border/50 bg-background/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{metric.name}</h4>
                {statusIcon[metric.status]}
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${statusColor[metric.status]}`}>
                    {(metric.value ?? 0).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>

                {metric.max && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Limit: {metric.max}
                        {metric.unit}
                      </span>
                      <span>{((metric.value / metric.max) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(metric.value / metric.max) * 100} className="h-1" />
                  </div>
                )}

                {metric.nominal && (
                  <div className="text-xs text-muted-foreground">
                    Nominal: {metric.nominal}±{metric.tolerance}
                    {metric.unit}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
