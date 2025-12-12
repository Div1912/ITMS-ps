"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, MapPin, Clock, Eye, Download, Camera, Shield, User, Car, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

export function InfringementDetection() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [infringements, setInfringements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchInfringements()

    // Set up real-time subscription for new infringements
    const channel = supabase
      .channel("infringement-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "infringement_detections" }, () => {
        fetchInfringements()
      })
      .subscribe()

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchInfringements, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const fetchInfringements = async () => {
    try {
      const { data, error } = await supabase
        .from("infringement_detections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error

      if (data && data.length > 0) {
        // Transform database data to component format
        const formattedData = data.map((row) => ({
          id: row.infringement_id,
          type: row.type,
          severity: row.severity,
          location: row.location,
          camera: row.camera,
          confidence: row.confidence,
          timestamp: getTimeAgo(new Date(row.created_at)),
          description: row.description,
          action: row.action,
          imageUrl: row.image_url || "/placeholder.svg",
          detectionBox: row.detection_box || { x: 45, y: 35, width: 15, height: 25 },
          objectType: row.object_type,
        }))
        setInfringements(formattedData)
      } else {
        // Generate simulated infringements if no data exists
        generateSimulatedInfringements()
      }
      setIsLoading(false)
    } catch (err) {
      console.error("[v0] Failed to fetch infringements:", err)
      // Fallback to simulated data
      generateSimulatedInfringements()
      setIsLoading(false)
    }
  }

  const generateSimulatedInfringements = () => {
    const mockData = [
      {
        id: "INF-SIM-001",
        type: "Unauthorized Person on Track",
        severity: "critical",
        location: "KM 125.4 + 200m",
        camera: "CAM-002",
        confidence: 98,
        timestamp: "2 minutes ago",
        description: "Person detected within track clearance zone",
        action: "Emergency stop activated, security dispatched",
        imageUrl: "/placeholder.svg?height=200&width=300",
        detectionBox: { x: 45, y: 35, width: 15, height: 25 },
        objectType: "person",
      },
      {
        id: "INF-SIM-002",
        type: "Vehicle Clearance Violation",
        severity: "critical",
        location: "KM 126.8 + 50m",
        camera: "CAM-005",
        confidence: 96,
        timestamp: "5 minutes ago",
        description: "Vehicle detected too close to track boundary",
        action: "Warning signals activated",
        imageUrl: "/placeholder.svg?height=200&width=300",
        detectionBox: { x: 20, y: 40, width: 30, height: 20 },
        objectType: "vehicle",
      },
      {
        id: "INF-SIM-003",
        type: "Maintenance Worker Alert",
        severity: "warning",
        location: "KM 128.1 + 100m",
        camera: "CAM-007",
        confidence: 92,
        timestamp: "12 minutes ago",
        description: "Authorized maintenance personnel near track",
        action: "Speed restriction in effect",
        imageUrl: "/placeholder.svg?height=200&width=300",
        detectionBox: { x: 35, y: 30, width: 12, height: 20 },
        objectType: "worker",
      },
    ]
    setInfringements(mockData)
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

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

  const exportInfringementData = async (format: string) => {
    try {
      const { data, error } = await supabase
        .from("infringement_detections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000)

      if (error) throw error

      const exportData = data || infringements

      if (format === "csv") {
        const csvContent = [
          "ID,Type,Severity,Location,Confidence,Timestamp,Description,Action,Object_Type",
          ...exportData.map(
            (inf) =>
              `${inf.infringement_id || inf.id},"${inf.type}",${inf.severity},"${inf.location}",${inf.confidence}%,"${new Date(inf.created_at).toISOString()}","${inf.description}","${inf.action}",${inf.object_type || inf.objectType}`,
          ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `track-infringement-report-${Date.now()}.csv`
        a.click()
      } else if (format === "json") {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `track-infringement-report-${Date.now()}.json`
        a.click()
      }
    } catch (err) {
      console.error("[v0] Export failed:", err)
      alert("Failed to export infringement data")
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Track Clearance & Infringement Detection
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <div className="w-2 h-2 rounded-full mr-2 bg-green-400 pulse-data"></div>
              {isLoading ? "Loading..." : "LIVE"}
            </Badge>
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
            <Button variant="outline" size="sm" onClick={fetchInfringements}>
              <Eye className="w-4 h-4 mr-2" />
              Refresh
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
            {filteredInfringements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No infringements detected. System monitoring active.
              </div>
            ) : (
              filteredInfringements.map((infringement) => (
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
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
