"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

const VIB_URL = "https://asia-threshold-controls-inns.trycloudflare.com/vibration"

export function VibrationMetrics() {
  const [data, setData] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const supabase = createBrowserClient()

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(VIB_URL, { cache: "no-store" })
        const json = await res.json()
        setData(json)
        setLastUpdate(new Date())

        const vertical = json.accel_filtered_m_s2?.vertical ?? 0
        const lateral = json.accel_filtered_m_s2?.lateral ?? 0
        const longitudinal = json.accel_filtered_m_s2?.longitudinal ?? 0
        const rmsVib = json.metrics?.rms_vibration_mm_s ?? 0
        const peakVib = json.metrics?.peak_vibration_mm_s ?? 0
        const rqi = json.metrics?.rqi ?? 0

        await supabase.from("acceleration_data").insert({
          vertical_accel: vertical,
          lateral_accel: lateral,
          longitudinal_accel: longitudinal,
          rms_vibration: rmsVib,
          peak_vibration: peakVib,
          ride_quality_index: rqi,
        })
      } catch {}
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!data) {
    return <Card className="p-6 text-center text-muted-foreground">Connecting to vibration sensors...</Card>
  }

  const vertical = data.accel_filtered_m_s2?.vertical ?? 0
  const lateral = data.accel_filtered_m_s2?.lateral ?? 0
  const longitudinal = data.accel_filtered_m_s2?.longitudinal ?? 0

  const rmsVib = data.metrics?.rms_vibration_mm_s ?? 0
  const peakVib = data.metrics?.peak_vibration_mm_s ?? 0
  const rqi = data.metrics?.rqi ?? 0

  const metrics = [
    {
      title: "Vertical Acceleration",
      value: vertical,
      unit: "m/s²",
      limit: 1.0,
    },
    {
      title: "Lateral Acceleration",
      value: lateral,
      unit: "m/s²",
      limit: 0.8,
    },
    {
      title: "Longitudinal Acceleration",
      value: longitudinal,
      unit: "m/s²",
      limit: 0.5,
    },
    {
      title: "RMS Vibration",
      value: rmsVib,
      unit: "mm/s",
      limit: 3.5,
    },
    {
      title: "Peak Vibration",
      value: peakVib,
      unit: "mm/s",
      limit: 12.0,
    },
    {
      title: "Ride Quality Index",
      value: rqi,
      unit: "RQI",
      limit: 4.0,
    },
  ]

  const toPercent = (value: number, limit: number) => Math.min(100, (value / limit) * 100)

  const getStatus = (value: number, limit: number) => {
    const pct = value / limit
    if (pct < 0.6) return "good"
    if (pct < 0.85) return "warning"
    return "critical"
  }

  const statusStyles = {
    good: "text-green-400 bg-green-500/10 border-green-500/20",
    warning: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    critical: "text-red-400 bg-red-500/10 border-red-500/20",
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-400" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Vibration Metrics (Live)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">Last update: {lastUpdate.toLocaleTimeString("en-IN")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m, i) => {
            const status = getStatus(m.value, m.limit)
            const pct = toPercent(m.value, m.limit)

            return (
              <div key={i} className="p-4 rounded-lg border bg-card/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-foreground">{m.title}</h3>
                  {getTrendIcon("stable")}
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{m.value.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                    <span className="text-xs text-muted-foreground">/ {m.limit}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={statusStyles[status]}>
                      {status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{pct.toFixed(0)}%</span>
                  </div>

                  <Progress value={pct} className="h-2" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
