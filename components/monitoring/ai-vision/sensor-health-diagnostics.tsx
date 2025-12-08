"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

export function SensorHealthDiagnostics() {
  const sensorData = [
    {
      name: "Camera System - Front",
      status: "healthy",
      metrics: [
        { label: "Focus Quality", value: "98%", status: "green" },
        { label: "Illumination", value: "Perfect", status: "green" },
        { label: "Blur Index", value: "0.2%", status: "green" },
      ],
    },
    {
      name: "LiDAR System",
      status: "healthy",
      metrics: [
        { label: "Signal Quality", value: "97%", status: "green" },
        { label: "Scan Completeness", value: "100%", status: "green" },
        { label: "Point Density", value: "High", status: "green" },
      ],
    },
    {
      name: "GPS Module",
      status: "warning",
      metrics: [
        { label: "Lock Quality", value: "85%", status: "yellow" },
        { label: "Satellites", value: "11/14", status: "yellow" },
        { label: "Position Error", value: "±1.2m", status: "yellow" },
      ],
    },
    {
      name: "System Storage",
      status: "healthy",
      metrics: [
        { label: "Storage Used", value: "67%", status: "green" },
        { label: "Data Throughput", value: "240 Mbps", status: "green" },
        { label: "Sync Status", value: "Cloud OK", status: "green" },
      ],
    },
    {
      name: "Environmental Sensors",
      status: "healthy",
      metrics: [
        { label: "Temperature", value: "42°C", status: "green" },
        { label: "Vibration", value: "Normal", status: "green" },
        { label: "Humidity", value: "35%", status: "green" },
      ],
    },
    {
      name: "Calibration Status",
      status: "degraded",
      metrics: [
        { label: "Camera Calibration", value: "Due in 3 days", status: "yellow" },
        { label: "LiDAR Calibration", value: "OK", status: "green" },
        { label: "GPS Calibration", value: "REQUIRED", status: "red" },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "degraded":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-muted-foreground bg-muted/10"
    }
  }

  const getMetricColor = (status: string) => {
    switch (status) {
      case "green":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "yellow":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "red":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-muted-foreground bg-muted/10"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Sensor Health & Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorData.map((sensor, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(sensor.status)} space-y-3`}>
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground text-sm">{sensor.name}</h4>
                <Badge variant="outline" className={getStatusColor(sensor.status)}>
                  {sensor.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                {sensor.metrics.map((metric, idx) => (
                  <div key={idx} className={`p-2 rounded border ${getMetricColor(metric.status)} bg-opacity-5`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{metric.label}</span>
                      <span className="text-xs font-medium text-foreground">{metric.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
