"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Badge } from "@/components/ui/badge"

const API_URL = "https://museum-pod-doom-cheese.trycloudflare.com/geometry"

export function DeviationCharts() {
  const [data, setData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("lateral")
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const fetchData = async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch")

        const json = await res.json()

        if (!json || typeof json !== "object") {
          throw new Error("Invalid data format")
        }

        const newPoint = {
          distance: (245.0 + data.length * 0.1).toFixed(1),
          time: new Date().toLocaleTimeString("en-IN", {
            hour12: false,
            minute: "2-digit",
            second: "2-digit",
          }),
          lateral: Number(json.lateralDeviation) || 0,
          vertical: Number(json.verticalDeviation) || 0,
          gauge: Number(json.gauge) || 1435,
          twist: Number(json.twist) || 0,
        }

        setData((prev) => [...prev.slice(-49), newPoint])
        setIsLive(true)
        console.log("[v0] Deviation data updated:", newPoint)
      } catch (err) {
        setIsLive(false)
        // Silent retry - no console spam
      }
    }

    fetchData()
    interval = setInterval(fetchData, 1000)

    return () => clearInterval(interval)
  }, [data.length])

  const chartConfigs: any = {
    lateral: {
      dataKey: "lateral",
      color: "#3b82f6",
      name: "Lateral Deviation (mm)",
      limits: { upper: 5, lower: -5 },
      unit: "mm",
    },
    vertical: {
      dataKey: "vertical",
      color: "#10b981",
      name: "Vertical Deviation (mm)",
      limits: { upper: 4, lower: -4 },
      unit: "mm",
    },
    gauge: {
      dataKey: "gauge",
      color: "#f59e0b",
      name: "Track Gauge (mm)",
      limits: { upper: 1438, lower: 1432 },
      nominal: 1435,
      unit: "mm",
    },
    twist: {
      dataKey: "twist",
      color: "#8b5cf6",
      name: "Track Twist (mm)",
      limits: { upper: 2, lower: -2 },
      unit: "mm",
    },
  }

  const currentConfig = chartConfigs[activeTab]
  const latest = data[data.length - 1] || {}

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Deviation Analysis</CardTitle>
            <CardDescription>Real-time track geometry deviations along the route</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              isLive
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-gray-500/10 text-gray-400 border-gray-500/20"
            }
          >
            {isLive ? "Live" : "Offline"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lateral">Lateral</TabsTrigger>
            <TabsTrigger value="vertical">Vertical</TabsTrigger>
            <TabsTrigger value="gauge">Gauge</TabsTrigger>
            <TabsTrigger value="twist">Twist</TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
            <div>
              <span className="text-sm text-muted-foreground">{currentConfig.name}</span>
              <div className="text-2xl font-bold" style={{ color: currentConfig.color }}>
                {latest[currentConfig.dataKey]?.toFixed(2) ?? "0.00"} {currentConfig.unit}
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Position: KM {latest.distance}</p>
              <p>Time: {latest.time}</p>
            </div>
          </div>

          {Object.entries(chartConfigs).map(([key, config]: any) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                    <XAxis dataKey="distance" stroke="rgb(var(--muted-foreground))" />
                    <YAxis stroke="rgb(var(--muted-foreground))" />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(var(--card))",
                        border: "1px solid rgb(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => [`${value.toFixed(2)} ${config.unit}`, config.name]}
                    />

                    <ReferenceLine y={config.limits.upper} stroke="#ef4444" strokeDasharray="5 5" />
                    <ReferenceLine y={config.limits.lower} stroke="#ef4444" strokeDasharray="5 5" />

                    {config.nominal && <ReferenceLine y={config.nominal} stroke="#10b981" strokeDasharray="3 3" />}

                    <Line type="monotone" dataKey={config.dataKey} stroke={config.color} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
