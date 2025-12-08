"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Activity, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

interface FusionData {
  mode: "GPS" | "IMU" | "Encoder" | "Hybrid"
  driftCompensation: number
  confidenceLevel: number
  lastSync: string
  reSyncAlerts: number
  imuDrift: number
  encoderError: number
}

export function GpsImuFusion() {
  const [fusionData, setFusionData] = useState<FusionData>({
    mode: "Hybrid",
    driftCompensation: 0.3,
    confidenceLevel: 98.5,
    lastSync: new Date().toLocaleTimeString(),
    reSyncAlerts: 0,
    imuDrift: 0.12,
    encoderError: 0.08,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setFusionData((prev) => ({
        ...prev,
        driftCompensation: Math.max(0, prev.driftCompensation + (Math.random() - 0.5) * 0.1),
        confidenceLevel: Math.min(99.9, Math.max(95, prev.confidenceLevel + (Math.random() - 0.5) * 0.5)),
        lastSync: new Date().toLocaleTimeString(),
        imuDrift: Math.max(0, prev.imuDrift + (Math.random() - 0.5) * 0.05),
        encoderError: Math.max(0, prev.encoderError + (Math.random() - 0.5) * 0.03),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "GPS":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20"
      case "IMU":
        return "bg-purple-500/20 text-purple-400 border-purple-500/20"
      case "Encoder":
        return "bg-orange-500/20 text-orange-400 border-orange-500/20"
      case "Hybrid":
        return "bg-green-500/20 text-green-400 border-green-500/20"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/20"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 98) return "text-green-400"
    if (confidence >= 95) return "text-yellow-400"
    return "text-orange-400"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          GPS & IMU Fusion Status
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">Real-time sensor fusion monitoring and accuracy tracking</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Primary Mode Display */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Current Mode</p>
              <Badge className={`${getModeColor(fusionData.mode)} border text-sm px-3 py-1`}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {fusionData.mode}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Fusion Confidence</p>
              <div className={`text-2xl font-bold ${getConfidenceColor(fusionData.confidenceLevel)}`}>
                {fusionData.confidenceLevel.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Sensor Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Drift Compensation */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Drift Compensation</p>
              <div className="space-y-1">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-medium text-purple-400">
                    {(fusionData.driftCompensation * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full border border-border overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                    style={{ width: `${Math.min(100, fusionData.driftCompensation * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* IMU Drift */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">IMU Drift</p>
              <div className="space-y-1">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-medium text-blue-400">{(fusionData.imuDrift * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full border border-border overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                    style={{ width: `${Math.min(100, fusionData.imuDrift * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Encoder Error */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Encoder Error</p>
              <div className="space-y-1">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-medium text-orange-400">
                    {(fusionData.encoderError * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full border border-border overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                    style={{ width: `${Math.min(100, fusionData.encoderError * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Last Sync */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Last Sync</p>
              <p className="text-sm font-medium text-cyan-400">{fusionData.lastSync}</p>
            </div>
          </div>

          {/* Re-Sync Alerts */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-muted-foreground">Re-Sync Alerts</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 text-sm">{fusionData.reSyncAlerts}</Badge>
            </div>
            {fusionData.reSyncAlerts === 0 && (
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                All sensors synchronized
              </p>
            )}
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-muted-foreground">GPS Lock</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-muted-foreground">IMU Active</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <span className="text-muted-foreground">Encoder Feed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
