"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"
import { findUpcomingLandmarks } from "@/lib/railway-database"

interface SpeedRestriction {
  psrLimit: number
  reason: string
  section: string
  severity: "critical" | "warning" | "normal"
}

export function SpeedRestrictionOverlay() {
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [restriction, setRestriction] = useState<SpeedRestriction>({
    psrLimit: 80,
    reason: "Standard Section",
    section: "KM 125.0 - KM 130.5",
    severity: "normal",
  })
  const [gpsSpeed, setGpsSpeed] = useState(0)

  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const speed = position.coords.speed ? position.coords.speed * 3.6 : 0 // Convert m/s to km/h

        setGpsSpeed(speed)
        setCurrentSpeed(speed)

        // Find upcoming landmarks with speed restrictions
        const landmarks = findUpcomingLandmarks(latitude, longitude, 2000)
        if (landmarks.length > 0 && landmarks[0].speedRestriction) {
          const nextLandmark = landmarks[0]
          setRestriction({
            psrLimit: nextLandmark.speedRestriction,
            reason: nextLandmark.name,
            section: `KM ${nextLandmark.km.toFixed(1)}`,
            severity:
              speed > nextLandmark.speedRestriction * 1.2
                ? "critical"
                : speed > nextLandmark.speedRestriction
                  ? "warning"
                  : "normal",
          })
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const speedStatus = currentSpeed <= restriction.psrLimit ? "safe" : "violation"
  const speedDifference = Math.abs(currentSpeed - restriction.psrLimit)

  const getStatusColor = () => {
    if (speedStatus === "safe") {
      return {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        text: "text-green-400",
        badge: "bg-green-500/20 text-green-400",
      }
    } else {
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        badge: "bg-red-500/20 text-red-400",
      }
    }
  }

  const statusColor = getStatusColor()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-yellow-400" />⚡ Speed Restriction (PSR)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* PSR Limit Display */}
          <div className={`${statusColor.bg} border ${statusColor.border} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Permanent Speed Restriction</p>
                <p className={`text-2xl font-bold ${statusColor.text}`}>{restriction.psrLimit} km/h</p>
                <p className="text-xs text-muted-foreground mt-1">{restriction.reason}</p>
              </div>
              <Badge className={`${statusColor.badge} text-xs py-1 px-2`}>{restriction.section}</Badge>
            </div>
          </div>

          {/* Current Speed vs PSR Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-2">Current Speed</p>
              <p className="text-2xl font-bold text-blue-400">{currentSpeed.toFixed(1)}</p>
              <p className="text-xs text-blue-400/60 mt-1">km/h</p>
            </div>
            <div className={`${statusColor.bg} border ${statusColor.border} rounded-lg p-3`}>
              <p className="text-xs text-muted-foreground mb-2">Status</p>
              <p className={`text-xl font-bold ${statusColor.text}`}>
                {speedStatus === "safe" ? "✓ OK" : "✗ VIOLATION"}
              </p>
              {speedStatus === "violation" && (
                <p className="text-xs text-red-400 mt-1">{speedDifference.toFixed(1)} km/h over limit</p>
              )}
            </div>
          </div>

          {/* Speed Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Speed Progress</span>
              <span className={statusColor.text}>
                {((currentSpeed / restriction.psrLimit) * 100).toFixed(0)}% of limit
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full border border-border overflow-hidden">
              <div
                className={`h-full transition-all ${
                  speedStatus === "safe"
                    ? "bg-gradient-to-r from-blue-500 to-green-500"
                    : "bg-gradient-to-r from-orange-500 to-red-500"
                }`}
                style={{ width: `${Math.min(100, (currentSpeed / restriction.psrLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Alert if violating */}
          {speedStatus === "violation" && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-400">
                <p className="font-bold">Speed Violation!</p>
                <p className="text-xs mt-1">
                  Reduce speed to {restriction.psrLimit} km/h in {restriction.reason}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
