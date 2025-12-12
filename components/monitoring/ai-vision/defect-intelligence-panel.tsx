"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock, Download, WrenchIcon } from "lucide-react"
import { useState } from "react"

export function DefectIntelligencePanel() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const defects = [
    {
      id: "DEF-001",
      severity: "critical",
      category: "fastening",
      location: "KM 125.4 + 200m",
      confidence: 96,
      recurrence: "new",
      action: "Immediate Repair",
      timestamp: "2 minutes ago",
      team: "Team A",
      thumbnail: "/railway-track-missing-rail-clip-defect.jpg",
    },
    {
      id: "DEF-002",
      severity: "major",
      category: "alignment",
      location: "KM 126.8 + 50m",
      confidence: 94,
      recurrence: "recurring",
      action: "Manual Inspection",
      timestamp: "8 minutes ago",
      team: "Team B",
      thumbnail: "/railway-track-misaligned-concrete-sleeper.jpg",
    },
    {
      id: "DEF-003",
      severity: "critical",
      category: "structural",
      location: "KM 127.2 + 300m",
      confidence: 89,
      recurrence: "persistent",
      action: "Emergency Repair",
      timestamp: "15 minutes ago",
      team: "Team A",
      thumbnail: "/cracked-concrete-railway-sleeper-with-visible-crac.jpg",
    },
    {
      id: "DEF-004",
      severity: "major",
      category: "joint",
      location: "KM 128.1 + 100m",
      confidence: 92,
      recurrence: "new",
      action: "Monitoring",
      timestamp: "22 minutes ago",
      team: "Team C",
      thumbnail: "/railway-rail-joint-with-excessive-gap-between-rail.jpg",
    },
    {
      id: "DEF-005",
      severity: "minor",
      category: "ballast",
      location: "KM 129.5 + 150m",
      confidence: 87,
      recurrence: "recurring",
      action: "Ballast Renewal",
      timestamp: "35 minutes ago",
      team: "Team B",
      thumbnail: "/railway-track-ballast-degradation-and-settlement.jpg",
    },
    {
      id: "DEF-006",
      severity: "critical",
      category: "wear",
      location: "KM 130.2 + 75m",
      confidence: 91,
      recurrence: "new",
      action: "Rail Grinding",
      timestamp: "45 minutes ago",
      team: "Team D",
      thumbnail: "/railway-rail-head-surface-wear-and-corrugation-def.jpg",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      case "major":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20"
      case "minor":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/20"
    }
  }

  const filteredDefects = selectedFilter === "all" ? defects : defects.filter((d) => d.severity === selectedFilter)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <WrenchIcon className="w-5 h-5 text-orange-400" />
            Defect Intelligence Table
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-1 rounded border border-border bg-background text-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="major">Major Only</option>
              <option value="minor">Minor Only</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3 pr-4">
            {filteredDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                {/* Header row with severity and ID */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getSeverityColor(defect.severity)}>
                      {defect.severity.toUpperCase()}
                    </Badge>
                    <span className="font-medium text-foreground">{defect.id}</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400">{defect.confidence}% Confidence</Badge>
                </div>

                {/* Content row with thumbnail, details, and actions */}
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded border border-border overflow-hidden flex-shrink-0 bg-gray-800">
                    <img
                      src={defect.thumbnail || "/placeholder.svg"}
                      alt={defect.id}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Defect details */}
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <p className="text-sm font-medium text-foreground capitalize">{defect.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {defect.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Recurrence</p>
                      <Badge className="text-xs bg-purple-500/20 text-purple-400">{defect.recurrence}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {defect.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Action panel */}
                  <div className="flex flex-col gap-2 min-w-48">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">{defect.action}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Assigned Team</p>
                      <p className="text-sm font-medium text-foreground">{defect.team}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
