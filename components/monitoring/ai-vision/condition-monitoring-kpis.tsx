"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, TrendingUp, MapPin, Satellite } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export function ConditionMonitoringKpis() {
  const [gpsData, setGpsData] = useState({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    speed: 0,
  })
  const [defectCounts, setDefectCounts] = useState({
    critical: 0,
    major: 0,
    minor: 0,
  })
  const [kmInspected, setKmInspected] = useState(0)

  const supabase = createBrowserClient()

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setGpsData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
          })
        },
        (error) => {
          console.error("GPS error:", error)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        },
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  useEffect(() => {
    const fetchDefects = async () => {
      const { data: geometryData } = await supabase
        .from("geometry_data")
        .select("lateral_deviation, vertical_deviation")
        .order("created_at", { ascending: false })
        .limit(1000)

      if (geometryData) {
        const critical = geometryData.filter(
          (d) => Math.abs(Number(d.lateral_deviation)) > 5 || Math.abs(Number(d.vertical_deviation)) > 5,
        ).length
        const major = geometryData.filter(
          (d) =>
            Math.abs(Number(d.lateral_deviation)) > 3 &&
            Math.abs(Number(d.lateral_deviation)) <= 5 &&
            Math.abs(Number(d.vertical_deviation)) > 3 &&
            Math.abs(Number(d.vertical_deviation)) <= 5,
        ).length
        const minor = geometryData.filter(
          (d) =>
            Math.abs(Number(d.lateral_deviation)) > 1 &&
            Math.abs(Number(d.lateral_deviation)) <= 3 &&
            Math.abs(Number(d.vertical_deviation)) > 1 &&
            Math.abs(Number(d.vertical_deviation)) <= 3,
        ).length

        setDefectCounts({ critical, major, minor })
        setKmInspected((geometryData.length * 0.1) / 1000) // Assuming 0.1m per reading
      }
    }

    fetchDefects()
    const interval = setInterval(fetchDefects, 5000)

    return () => clearInterval(interval)
  }, [supabase])

  const kpis = [
    {
      label: "Current GPS Position",
      value: `${gpsData.latitude.toFixed(6)}`,
      unit: `${gpsData.longitude.toFixed(6)}`,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      icon: MapPin,
    },
    {
      label: "GPS Accuracy",
      value: gpsData.accuracy.toFixed(1),
      unit: "meters",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      icon: Satellite,
    },
    {
      label: "Current Speed",
      value: (gpsData.speed * 3.6).toFixed(1),
      unit: "km/h",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      icon: TrendingUp,
    },
    {
      label: "KM Inspected Today",
      value: kmInspected.toFixed(2),
      unit: "km",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      icon: TrendingUp,
    },
    {
      label: "Critical Defects",
      value: defectCounts.critical.toString(),
      unit: "found",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      icon: AlertCircle,
      alert: defectCounts.critical > 0,
    },
    {
      label: "Major Defects",
      value: defectCounts.major.toString(),
      unit: "found",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      icon: AlertCircle,
    },
    {
      label: "Minor Defects",
      value: defectCounts.minor.toString(),
      unit: "found",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      icon: AlertCircle,
    },
    {
      label: "Sensor Status",
      value: "Healthy",
      unit: "4/4",
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
