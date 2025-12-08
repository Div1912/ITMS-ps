"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import { useState, useEffect } from "react"

interface TrackProgressProps {
  currentKm?: number
  totalKm?: number
}

export function TrackProgressBar({ currentKm = 128.6, totalKm = 150 }: TrackProgressProps) {
  const [position, setPosition] = useState(currentKm)

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((pos) => {
        const baseKm = 125.0
        const kmOffset = (pos.coords.latitude - 40.7128) * 111.0
        setPosition(baseKm + Math.max(0, kmOffset))
      })
      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const progressPercent = (position / totalKm) * 100
  const kmRemaining = totalKm - position
  const chainage = (position % 1) * 1000

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          Track Progress & Coverage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">Inspection Progress</p>
                <p className="text-xs text-muted-foreground">
                  KM {position.toFixed(2)} / KM {totalKm}
                </p>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400">{progressPercent.toFixed(1)}%</Badge>
            </div>

            {/* Progress bar with current position marker */}
            <div className="relative h-8 bg-gray-800 rounded-lg border border-border overflow-hidden">
              {/* Background fill */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-transparent rounded-lg transition-all"
                style={{ width: `${progressPercent}%` }}
              />

              {/* Position marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-10 bg-cyan-400 rounded shadow-lg shadow-cyan-400/50 transition-all"
                style={{ left: `${progressPercent}%` }}
              />

              {/* Start and End labels */}
              <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                <span className="text-xs font-medium text-gray-600">KM {125}</span>
                <span className="ml-auto text-xs font-medium text-gray-600">KM {totalKm}</span>
              </div>
            </div>
          </div>

          {/* Statistics grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Covered</p>
              <p className="text-lg font-bold text-green-400">{(position - 125).toFixed(1)} km</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Remaining</p>
              <p className="text-lg font-bold text-orange-400">{kmRemaining.toFixed(1)} km</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Chainage</p>
              <p className="text-lg font-bold text-purple-400">{chainage.toFixed(0)} m</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
