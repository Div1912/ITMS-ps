"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"

export function TrackStripView() {
  const [hoveredDefect, setHoveredDefect] = useState<string | null>(null)

  const trackDefects = [
    { id: "DEF-001", km: 125.4, type: "Missing Rail Clip", severity: "critical", confidence: 96 },
    { id: "DEF-002", km: 126.8, type: "Misaligned Sleeper", severity: "major", confidence: 94 },
    { id: "DEF-003", km: 127.2, type: "Cracked Sleeper", severity: "critical", confidence: 89 },
    { id: "DEF-004", km: 128.1, type: "Excessive Joint Gap", severity: "major", confidence: 92 },
    { id: "DEF-005", km: 129.5, type: "Ballast Degradation", severity: "minor", confidence: 87 },
    { id: "DEF-006", km: 130.2, type: "Rail Surface Defect", severity: "critical", confidence: 91 },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#EF4444"
      case "major":
        return "#F59E0B"
      case "minor":
        return "#FBBF24"
      default:
        return "#3B82F6"
    }
  }

  const minKm = 125
  const maxKm = 131
  const rangeKm = maxKm - minKm

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Track Strip View - Defect Distribution Map
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Visual representation of all detected defects along the inspected route. Hover for details.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main track strip */}
          <div className="relative h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg border border-border overflow-hidden">
            {/* Track visualization */}
            <div className="absolute inset-0 flex items-center px-4">
              <div className="relative w-full h-2 bg-gray-600 rounded-full">
                {/* Defect markers */}
                {trackDefects.map((defect) => {
                  const position = ((defect.km - minKm) / rangeKm) * 100
                  return (
                    <div
                      key={defect.id}
                      className="absolute group"
                      style={{ left: `${position}%`, transform: "translateX(-50%)" }}
                      onMouseEnter={() => setHoveredDefect(defect.id)}
                      onMouseLeave={() => setHoveredDefect(null)}
                    >
                      {/* Defect marker dot */}
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white cursor-pointer transition-all hover:scale-125"
                        style={{ backgroundColor: getSeverityColor(defect.severity) }}
                      />

                      {/* Hover tooltip */}
                      {hoveredDefect === defect.id && (
                        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-border rounded p-3 w-48 shadow-lg z-10">
                          <p className="font-medium text-white text-sm">{defect.type}</p>
                          <p className="text-xs text-muted-foreground mt-1">KM {defect.km}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge
                              className="text-xs"
                              style={{
                                backgroundColor: `${getSeverityColor(defect.severity)}20`,
                                color: getSeverityColor(defect.severity),
                              }}
                            >
                              {defect.severity.toUpperCase()}
                            </Badge>
                            <Badge className="text-xs bg-blue-500/20 text-blue-400">{defect.confidence}%</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{defect.id}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* KM labels */}
            <div className="absolute inset-0 flex items-end px-4 pb-1 pointer-events-none">
              <div className="relative w-full">
                <div className="absolute left-0 text-xs text-muted-foreground">KM {minKm}</div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                  KM {(minKm + maxKm) / 2}
                </div>
                <div className="absolute right-0 text-xs text-muted-foreground">KM {maxKm}</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-muted-foreground">Major</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-muted-foreground">Minor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">Info</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {trackDefects.filter((d) => d.severity === "critical").length}
              </p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {trackDefects.filter((d) => d.severity === "major").length}
              </p>
              <p className="text-xs text-muted-foreground">Major</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {trackDefects.filter((d) => d.severity === "minor").length}
              </p>
              <p className="text-xs text-muted-foreground">Minor</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{trackDefects.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
