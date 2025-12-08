"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { findUpcomingLandmarks, type RailwayLandmark } from "@/lib/railway-database"

export function LandmarkAwareness() {
  const [landmarks, setLandmarks] = useState<RailwayLandmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        const upcomingLandmarks = findUpcomingLandmarks(latitude, longitude, 5000)
        setLandmarks(upcomingLandmarks)
        setLoading(false)
      },
      () => setLoading(false),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const getLandmarkIcon = (type: string) => {
    switch (type) {
      case "LC_GATE":
        return "🚪"
      case "CURVE":
        return "↪️"
      case "BRIDGE":
        return "🌉"
      case "TUNNEL":
        return "🚇"
      case "LEVEL_CROSSING":
        return "⚠️"
      case "GRADIENT":
        return "📈"
      default:
        return "📍"
    }
  }

  const getLandmarkColor = (type: string) => {
    switch (type) {
      case "LC_GATE":
        return "bg-red-500/20 border-red-500/40 text-red-400"
      case "CURVE":
        return "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
      case "BRIDGE":
        return "bg-purple-500/20 border-purple-500/40 text-purple-400"
      case "TUNNEL":
        return "bg-blue-500/20 border-blue-500/40 text-blue-400"
      default:
        return "bg-blue-500/20 border-blue-500/40 text-blue-400"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Loading landmarks...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />🎯 Landmark Awareness
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-2">Upcoming track features and restrictions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {landmarks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No landmarks ahead</p>
          ) : (
            landmarks.slice(0, 4).map((landmark, idx) => {
              const distance = landmark.km * 1000 // Convert km to approximate meters
              const colorClass = getLandmarkColor(landmark.type)

              return (
                <div key={idx} className={`border rounded-lg p-3 space-y-2 transition-all ${colorClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                      <span className="text-xl mt-0.5">{getLandmarkIcon(landmark.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{landmark.name}</p>
                        {landmark.radius && <p className="text-xs text-muted-foreground">Radius: {landmark.radius}m</p>}
                        {landmark.speedRestriction && (
                          <p className="text-xs text-muted-foreground">PSR: {landmark.speedRestriction} km/h</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="whitespace-nowrap text-xs font-bold">
                        {distance < 1000 ? `${distance.toFixed(0)}m` : `${(distance / 1000).toFixed(2)} km`}
                      </Badge>
                    </div>
                  </div>

                  {distance < 200 && (
                    <div className="flex items-center gap-1 text-xs bg-black/40 rounded px-2 py-1">
                      <Zap className="w-3 h-3" />
                      APPROACHING - Caution required
                    </div>
                  )}
                </div>
              )
            })
          )}

          {landmarks.length > 4 && (
            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
              <p>+{landmarks.length - 4} more landmarks ahead</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
