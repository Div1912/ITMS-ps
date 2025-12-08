"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react"

export function VibrationMetrics() {
  const metrics = [
    {
      title: "Vertical Acceleration",
      value: "0.85",
      unit: "m/s²",
      limit: "1.0",
      percentage: 85,
      status: "warning",
      trend: "up",
    },
    {
      title: "Lateral Acceleration",
      value: "0.42",
      unit: "m/s²",
      limit: "0.8",
      percentage: 53,
      status: "good",
      trend: "stable",
    },
    {
      title: "Longitudinal Acceleration",
      value: "0.28",
      unit: "m/s²",
      limit: "0.5",
      percentage: 56,
      status: "good",
      trend: "down",
    },
    {
      title: "RMS Vibration",
      value: "2.34",
      unit: "mm/s",
      limit: "3.5",
      percentage: 67,
      status: "good",
      trend: "up",
    },
    {
      title: "Peak Vibration",
      value: "8.92",
      unit: "mm/s",
      limit: "12.0",
      percentage: 74,
      status: "good",
      trend: "stable",
    },
    {
      title: "Ride Quality Index",
      value: "2.8",
      unit: "RQI",
      limit: "4.0",
      percentage: 70,
      status: "good",
      trend: "up",
    },
  ]

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
          Vibration Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">{metric.title}</h3>
                {getTrendIcon(metric.trend)}
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  <span className="text-xs text-muted-foreground">/ {metric.limit}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getStatusColor(metric.status)}>
                      {metric.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{metric.percentage}%</span>
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
