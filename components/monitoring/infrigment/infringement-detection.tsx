"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, MapPin, Clock, Eye, Download, Camera, Shield, User, Car, Zap } from "lucide-react"
import { useState } from "react"

export function InfringementDetection() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const infringements = [
    {
      id: "INF-001",
      type: "Unauthorized Person on Track",
      severity: "critical",
      location: "KM 125.4 + 200m",
      camera: "CAM-002",
      confidence: 98,
      timestamp: "2 minutes ago",
      description: "Person detected within track clearance zone",
      action: "Emergency stop activated, security dispatched",
      imageUrl: "/railway-track-with-person-walking.jpg",
      detectionBox: { x: 45, y: 35, width: 15, height: 25 },
      objectType: "person",
    },
    {
      id: "INF-002",
      type: "Vehicle Clearance Violation",
      severity: "critical",
      location: "KM 126.8 + 50m",
      camera: "CAM-005",
      confidence: 96,
      timestamp: "5 minutes ago",
      description: "Vehicle detected too close to track boundary",
      action: "Warning signals activated",
      imageUrl: "/railway-track-with-car-near-tracks.jpg",
      detectionBox: { x: 20, y: 40, width: 30, height: 20 },
      objectType: "vehicle",
    },
    {
      id: "INF-003",
      type: "Track Obstruction",
      severity: "critical",
      location: "KM 127.2 + 300m",
      camera: "CAM-001",
      confidence: 94,
      timestamp: "8 minutes ago",
      description: "Large object blocking track clearance",
      action: "Track inspection team dispatched",
      imageUrl: "/railway-track-with-fallen-tree-obstruction.jpg",
      detectionBox: { x: 40, y: 45, width: 25, height: 15 },
      objectType: "object",
    },
    {
      id: "INF-004",
      type: "Maintenance Worker Alert",
      severity: "warning",
      location: "KM 128.1 + 100m",
      camera: "CAM-007",
      confidence: 92,
      timestamp: "12 minutes ago",
      description: "Authorized maintenance personnel near track",
      action: "Speed restriction in effect",
      imageUrl: "/railway-maintenance-worker-on-tracks-with-safety-v.jpg",
      detectionBox: { x: 35, y: 30, width: 12, height: 20 },
      objectType: "worker",
    },
    {
      id: "INF-005",
      type: "Animal Intrusion",
      severity: "warning",
      location: "KM 129.5 + 150m",
      camera: "CAM-006",
      confidence: 89,
      timestamp: "18 minutes ago",
      description: "Large animal detected near track",
      action: "Monitoring continued, horn activated",
      imageUrl: "/railway-track-with-deer-crossing.jpg",
      detectionBox: { x: 50, y: 50, width: 18, height: 12 },
      objectType: "animal",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "info":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20"
      default:
        return "text-muted-foreground bg-muted/10 border-border"
    }
  }

  const getObjectIcon = (objectType: string) => {
    switch (objectType) {
      case "person":
        return <User className="w-3 h-3" />
      case "vehicle":
        return <Car className="w-3 h-3" />
      case "worker":
        return <Shield className="w-3 h-3" />
      case "animal":
        return <Zap className="w-3 h-3" />
      default:
        return <AlertTriangle className="w-3 h-3" />
    }
  }

  const filteredInfringements =
    selectedFilter === "all" ? infringements : infringements.filter((i) => i.severity === selectedFilter)

  const infringementCounts = {
    critical: infringements.filter((i) => i.severity === "critical").length,
    warning: infringements.filter((i) => i.severity === "warning").length,
    info: infringements.filter((i) => i.severity === "info").length,
  }

  const exportInfringementData = (format: string) => {
    const data = {
      timestamp: new Date().toISOString(),
      totalInfringements: infringements.length,
      summary: infringementCounts,
      detailedReport: infringements.map((inf) => ({
        id: inf.id,
        type: inf.type,
        severity: inf.severity,
        location: inf.location,
        confidence: inf.confidence,
        timestamp: inf.timestamp,
        description: inf.description,
        action: inf.action,
        objectType: inf.objectType,
      })),
    }

    if (format === "csv") {
      const csvContent = [
        "ID,Type,Severity,Location,Confidence,Timestamp,Description,Action,Object_Type",
        ...infringements.map(
          (inf) =>
            `${inf.id},"${inf.type}",${inf.severity},"${inf.location}",${inf.confidence}%,"${inf.timestamp}","${inf.description}","${inf.action}",${inf.objectType}`,
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `track-infringement-report-${Date.now()}.csv`
      a.click()
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `track-infringement-report-${Date.now()}.json`
      a.click()
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Track Clearance & Infringement Detection
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-1 rounded border border-border bg-background text-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            <Button variant="outline" size="sm" onClick={() => exportInfringementData("csv")}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportInfringementData("json")}>
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Live View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg border border-red-500/20 bg-red-500/10 relative">
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-red-400">{infringementCounts.critical}</div>
            <div className="text-sm text-muted-foreground">Critical Violations</div>
          </div>
          <div className="text-center p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 relative">
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{infringementCounts.warning}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
          <div className="text-center p-4 rounded-lg border border-blue-500/20 bg-blue-500/10">
            <div className="text-2xl font-bold text-blue-400">{infringementCounts.info}</div>
            <div className="text-sm text-muted-foreground">Info</div>
          </div>
          <div className="text-center p-4 rounded-lg border border-green-500/20 bg-green-500/10">
            <div className="text-2xl font-bold text-green-400">96.8%</div>
            <div className="text-sm text-muted-foreground">Detection Accuracy</div>
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="space-y-4">
            {filteredInfringements.map((infringement) => (
              <div
                key={infringement.id}
                className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getSeverityColor(infringement.severity)}>
                      {infringement.severity.toUpperCase()}
                    </Badge>
                    <span className="font-medium text-foreground">{infringement.type}</span>
                    <Badge variant="outline" className="text-purple-400 bg-purple-500/10 border-purple-500/20">
                      {getObjectIcon(infringement.objectType)}
                      <span className="ml-1">{infringement.objectType}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-400 bg-green-500/10 border-green-500/20">
                      {infringement.confidence}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">{infringement.id}</span>
                  </div>
                </div>

                <div className="flex gap-4 mb-3">
                  <div className="relative w-32 h-24 rounded border border-border overflow-hidden bg-slate-800">
                    <img
                      src={infringement.imageUrl || "/placeholder.svg"}
                      alt={infringement.type}
                      className="w-full h-full object-cover"
                    />
                    {/* AI Detection Box Overlay */}
                    <div
                      className="absolute border-2 border-red-400 bg-red-400/20"
                      style={{
                        left: `${infringement.detectionBox.x}%`,
                        top: `${infringement.detectionBox.y}%`,
                        width: `${infringement.detectionBox.width}%`,
                        height: `${infringement.detectionBox.height}%`,
                      }}
                    />
                    {/* AI Confidence Label */}
                    <div className="absolute top-1 left-1 bg-black/70 text-red-400 text-xs px-1 rounded flex items-center gap-1">
                      {getObjectIcon(infringement.objectType)}
                      {infringement.confidence}%
                    </div>
                    {/* AI Detection Status */}
                    <div className="absolute bottom-1 right-1 bg-green-500/80 text-white text-xs px-1 rounded">
                      AI DETECTED
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">{infringement.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{infringement.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{infringement.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-blue-400" />
                        <span>{infringement.camera}</span>
                      </div>
                      <div className="text-green-400">{infringement.action}</div>
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
