"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Route } from "lucide-react"
import { useState, useEffect } from "react"

interface SectionProgress {
  sectionName: string
  startKm: number
  endKm: number
  totalDistance: number
  currentPosition: number
  progress: number
}

export function SectionProgressVisualization() {
  const [section, setSection] = useState<SectionProgress>({
    sectionName: "Kuppam → Bangarapet",
    startKm: 125.0,
    endKm: 156.0,
    totalDistance: 31.0,
    currentPosition: 3.6,
    progress: 11.6,
  })

  useEffect(() => {
    // Simulate progress through section
    const interval = setInterval(() => {
      setSection((prev) => {
        const newPosition = Math.min(prev.totalDistance, prev.currentPosition + Math.random() * 0.15)
        return {
          ...prev,
          currentPosition: newPosition,
          progress: (newPosition / prev.totalDistance) * 100,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const distanceRemaining = section.totalDistance - section.currentPosition
  const estimatedTimeRemaining = (distanceRemaining / 40) * 60 // Assume 40 km/h average

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="w-5 h-5 text-indigo-400" />📊 Section Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Section Name and Distance */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Current Section</p>
            <p className="text-lg font-bold text-indigo-400">{section.sectionName}</p>
            <p className="text-xs text-indigo-400/60 mt-1">
              KM {section.startKm} → KM {section.endKm} ({section.totalDistance.toFixed(1)} km)
            </p>
          </div>

          {/* Main Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-foreground">Progress in Section</div>
              <Badge className="bg-indigo-500/20 text-indigo-400 text-xs">{section.progress.toFixed(1)}%</Badge>
            </div>

            {/* Visual progress bar with sections */}
            <div className="relative h-10 bg-gray-800 rounded-lg border border-border overflow-hidden">
              {/* Background segments */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-gray-700 last:border-r-0"
                    style={{
                      backgroundColor: (i / 10) * 100 < section.progress ? "rgba(99, 102, 241, 0.3)" : "transparent",
                    }}
                  />
                ))}
              </div>

              {/* Progress fill */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500/40 via-indigo-400/40 to-transparent rounded-lg transition-all"
                style={{ width: `${section.progress}%` }}
              />

              {/* Current position marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-400 rounded shadow-lg shadow-indigo-400/50 transition-all"
                style={{ left: `${section.progress}%` }}
              />

              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                <span className="text-xs font-medium text-gray-500">KM {section.startKm}</span>
                <span className="text-xs font-bold text-indigo-400">
                  {section.currentPosition.toFixed(1)} km covered
                </span>
                <span className="text-xs font-medium text-gray-500">KM {section.endKm}</span>
              </div>
            </div>
          </div>

          {/* Progress Statistics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Covered</p>
              <p className="text-lg font-bold text-green-400">{section.currentPosition.toFixed(1)} km</p>
              <p className="text-xs text-green-400/60">({section.progress.toFixed(1)}%)</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Remaining</p>
              <p className="text-lg font-bold text-orange-400">{distanceRemaining.toFixed(1)} km</p>
              <p className="text-xs text-orange-400/60">({(100 - section.progress).toFixed(1)}%)</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Est. Time</p>
              <p className="text-lg font-bold text-cyan-400">{estimatedTimeRemaining.toFixed(0)} min</p>
              <p className="text-xs text-cyan-400/60">@ 40 km/h avg</p>
            </div>
          </div>

          {/* Section Status */}
          <div className="pt-2 border-t border-border text-xs text-muted-foreground">
            <p>
              Currently in <span className="text-indigo-400 font-bold">{section.sectionName}</span>
              {section.progress > 90 ? " — Approaching end of section" : " — Mid-section operation"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
