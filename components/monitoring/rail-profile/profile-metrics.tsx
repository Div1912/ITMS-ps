"use client"

import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"

export function ProfileMetrics() {
  const [metrics, setMetrics] = useState([
    {
      title: "Rail Head Width",
      value: 68.2,
      unit: "mm",
      target: 70.0,
      deviation: -1.8,
      status: "warning",
      trend: "down",
    },
    {
      title: "Rail Height",
      value: 172.8,
       unit: "mm",
      target: 173.0,
      deviation: -0.2,
      status: "good",
      trend: "stable",
    },
    {
      title: "Gauge Face Angle",
      value: 68.5,
       unit: "°",
      target: 70.0,
      deviation: -1.5,
      status: "warning",
      trend: "down",
    },
    {
      title: "Web Thickness",
      value: 16.2,
       unit: "mm",
      target: 16.5,
      deviation: -0.3,
      status: "good",
      trend: "stable",
    },
    {
      title: "Flange Width",
      value: 150.1,
       unit: "mm",
      target: 150.0,
      deviation: 0.1,
      status: "good",
      trend: "up",
    },
    {
      title: "Overall Wear Index",
      value: 23.4,
      unit: "%",
      target:  30,
      deviation: 0,
      status: "good",
      trend: "up",
    },
  ]);

  useEffect(() => {
  const interval = setInterval(() => {
    setMetrics(prev =>
      prev.map(metric => ({
        ...metric,
        value: Number((metric.value + (Math.random() - 0.5) * 0.4).toFixed(2)),
      }))
    );
  }, 1000);

  return () => clearInterval(interval);
}, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-muted-foreground bg-muted/10 border-gray-200 dark:border-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          Rail Profile Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">{metric.title}</h3>
                {getTrendIcon(metric.trend)}
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold ">{metric.value}{metric.unit}</span>
                  <span className="text-sm text-muted-foreground">/ {metric.target}{metric.unit}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getStatusColor(metric.status)}>
                    {metric.status.toUpperCase()}
                  </Badge>
                  {metric.deviation !== 0 && (
                    <span className={`text-sm ${metric.deviation > 0 ? "text-red-400" : "text-green-400"}`}>
                      {metric.deviation > 0 ? "+" : ""}
                      {metric.deviation}mm
                    </span>
                  )}
                </div>

                <Progress
                  value={metric.status === "good" ? 85 : metric.status === "warning" ? 65 : 35}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
