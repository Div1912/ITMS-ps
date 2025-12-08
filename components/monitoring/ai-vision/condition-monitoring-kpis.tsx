"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, TrendingUp, Activity } from "lucide-react"

export function ConditionMonitoringKpis() {
  const kpis = [
    {
      label: "KM Inspected Today",
      value: "256.4",
      unit: "km",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      icon: TrendingUp,
    },
    {
      label: "Critical Defects",
      value: "12",
      unit: "found",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      icon: AlertCircle,
      alert: true,
    },
    {
      label: "Major Defects",
      value: "28",
      unit: "found",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      icon: AlertCircle,
    },
    {
      label: "Minor Defects",
      value: "45",
      unit: "found",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      icon: AlertCircle,
    },
    {
      label: "Track Health Score",
      value: "87",
      unit: "/100",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      icon: CheckCircle2,
    },
    {
      label: "AI Confidence Level",
      value: "96.8",
      unit: "%",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      icon: Activity,
    },
    {
      label: "Sensor Status",
      value: "Healthy",
      unit: "8/8",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      icon: CheckCircle2,
    },
    {
      label: "Data Sync Status",
      value: "Cloud",
      unit: "synced",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className={`${kpi.bgColor} border ${kpi.borderColor}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{kpi.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</span>
                    <span className={`text-sm ${kpi.color}`}>{kpi.unit}</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${kpi.bgColor} ${kpi.alert ? "animate-pulse" : ""}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
