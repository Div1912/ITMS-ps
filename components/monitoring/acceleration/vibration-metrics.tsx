"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react"

// ⭐ IMPORTANT: Replace tunnel URL whenever Cloudflare changes it
const API_URL = "https://defined-running-lucy-retain.trycloudflare.com"

// Threshold limits (you can tune these anytime)
const LIMITS = {
  vertical: 1.0,
  lateral: 0.8,
  longitudinal: 0.5,
}

// Status level detection
const getStatus = (value: number, limit: number) => {
  if (value > limit) return "critical"
  if (value > limit * 0.8) return "warning"
  return "good"
}

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "good":
      return "text-green-400 bg-green-500/10 border-green-500/20"
    case "warning":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    case "critical":
      return "text-red-400 bg-red-500/10 border-red-500/20"
    default:
      return "text-muted-foreground bg-muted/10 border-border"
  }
}

// Trend detection logic
const getTrend = (current: number, previous: number) => {
  if (current > previous) return "up"
  if (current < previous) return "down"
  return "stable"
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

export function VibrationMetrics() {
  const [acc, setAcc] = useState({
    vertical: 0,
    lateral: 0,
    longitudinal: 0,
  })

  const [prevAcc, setPrevAcc] = useState({
    vertical: 0,
    lateral: 0,
    longitudinal: 0,
  })

  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch(${API_URL}/metrics, { cache: "no-store" })

        // ⭐ Prevent crash if Cloudflare returns HTML or empty response
        const json = await res.json().catch(() => null)
        if (!json) {
          setIsMoving(false)
          setAcc({ vertical: 0, lateral: 0, longitudinal: 0 })
          return
        }

        const x = json.longitudinalAcceleration
        const y = json.lateralAcceleration
        const z = json.verticalAcceleration

        // ⭐ Motion detection using gravity-corrected RMS
        const motion = Math.sqrt(
          x * x + y * y + (z - 9.8) * (z - 9.8)
        )

        const moving = motion > 0.25 // stable threshold
        setIsMoving(moving)

        // ⭐ Save TRUE snapshot BEFORE updating acc
        setPrevAcc({
          vertical: acc.vertical,
          lateral: acc.lateral,
          longitudinal: acc.longitudinal,
        })

        // ❌ If stationary → zero values
        if (!moving) {
          setAcc({ vertical: 0, lateral: 0, longitudinal: 0 })
          return
        }

        // ✅ Update values when moving
        setAcc({
          vertical: Math.abs(z),
          lateral: Math.abs(y),
          longitudinal: Math.abs(x),
        })

      } catch (err) {
        console.log("Failed to fetch live data", err)
      }
    }

    // Start polling every 200ms
    fetchLive()
    const interval = setInterval(fetchLive, 200)
    return () => clearInterval(interval)
  }, []) // DO NOT MODIFY

  const metrics = [
    {
      title: "Vertical Acceleration",
      value: acc.vertical.toFixed(2),
      unit: "m/s²",
      limit: LIMITS.vertical,
      percentage: Math.min((acc.vertical / LIMITS.vertical) * 100, 100),
      status: getStatus(acc.vertical, LIMITS.vertical),
      trend: getTrend(acc.vertical, prevAcc.vertical),
    },
    {
      title: "Lateral Acceleration",
      value: acc.lateral.toFixed(2),
      unit: "m/s²",
      limit: LIMITS.lateral,
      percentage: Math.min((acc.lateral / LIMITS.lateral) * 100, 100),
      status: getStatus(acc.lateral, LIMITS.lateral),
      trend: getTrend(acc.lateral, prevAcc.lateral),
    },
    {
      title: "Longitudinal Acceleration",
      value: acc.longitudinal.toFixed(2),
      unit: "m/s²",
      limit: LIMITS.longitudinal,
      percentage: Math.min((acc.longitudinal / LIMITS.longitudinal) * 100, 100),
      status: getStatus(acc.longitudinal, LIMITS.longitudinal),
      trend: getTrend(acc.longitudinal, prevAcc.longitudinal),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Vibration & Acceleration Metrics
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          {isMoving ? "📡 Updating live (device moving)" : "⚠ Waiting for motion…"}
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-card/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">
                  {metric.title}
                </h3>
                {getTrendIcon(metric.trend)}
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {metric.unit}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {metric.limit}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={getStatusColor(metric.status)}
                    >
                      {metric.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {metric.percentage.toFixed(0)}%
                    </span>
                  </div>

                  <Progress value={metric.percentage} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
