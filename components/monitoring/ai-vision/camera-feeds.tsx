"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Maximize2, Play, Pause, RotateCcw, Settings, Download, Zap, AlertTriangle } from "lucide-react"
import { useState } from "react"

export function CameraFeeds() {
  const [selectedLayout, setSelectedLayout] = useState("grid")
  const [recordingAll, setRecordingAll] = useState(true)

  const cameras = [
    {
      id: "CAM-001",
      name: "Front View",
      status: "active",
      location: "KM 125.0",
      resolution: "4K",
      fps: 60,
      aiDetections: 3,
      lastAlert: "2 min ago",
      temperature: "42°C",
      signalStrength: 95,
    },
    {
      id: "CAM-002",
      name: "Left Rail",
      status: "active",
      location: "KM 125.0",
      resolution: "4K",
      fps: 60,
      aiDetections: 1,
      lastAlert: "5 min ago",
      temperature: "38°C",
      signalStrength: 92,
    },
    {
      id: "CAM-003",
      name: "Right Rail",
      status: "active",
      location: "KM 125.0",
      resolution: "4K",
      fps: 60,
      aiDetections: 0,
      lastAlert: "15 min ago",
      temperature: "41°C",
      signalStrength: 88,
    },
    {
      id: "CAM-004",
      name: "Rear View",
      status: "active",
      location: "KM 125.0",
      resolution: "4K",
      fps: 60,
      aiDetections: 2,
      lastAlert: "1 min ago",
      temperature: "39°C",
      signalStrength: 94,
    },
    {
      id: "CAM-005",
      name: "Track Overview",
      status: "active",
      location: "KM 125.0",
      resolution: "4K",
      fps: 60,
      aiDetections: 4,
      lastAlert: "30 sec ago",
      temperature: "43°C",
      signalStrength: 97,
    },
    {
      id: "CAM-006",
      name: "Infrastructure",
      status: "active",
      location: "KM 125.0",
      resolution: "4K",
      fps: 60,
      aiDetections: 1,
      lastAlert: "8 min ago",
      temperature: "40°C",
      signalStrength: 90,
    },
    {
      id: "CAM-007",
      name: "Signal View",
      status: "maintenance",
      location: "KM 125.0",
      resolution: "4K",
      fps: 0,
      aiDetections: 0,
      lastAlert: "N/A",
      temperature: "N/A",
      signalStrength: 0,
    },
    {
      id: "CAM-008",
      name: "Platform View",
      status: "active",
      location: "KM 125.0",
      resolution: "4K",
      fps: 60,
      aiDetections: 2,
      lastAlert: "3 min ago",
      temperature: "37°C",
      signalStrength: 93,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "maintenance":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "offline":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-muted-foreground bg-muted/10 border-border"
    }
  }

  const exportCameraData = (format: string) => {
    const data = {
      timestamp: new Date().toISOString(),
      totalCameras: cameras.length,
      activeCameras: cameras.filter((c) => c.status === "active").length,
      totalDetections: cameras.reduce((sum, cam) => sum + cam.aiDetections, 0),
      cameraDetails: cameras.map((cam) => ({
        id: cam.id,
        name: cam.name,
        status: cam.status,
        location: cam.location,
        resolution: cam.resolution,
        fps: cam.fps,
        aiDetections: cam.aiDetections,
        lastAlert: cam.lastAlert,
        temperature: cam.temperature,
        signalStrength: cam.signalStrength,
      })),
    }

    if (format === "csv") {
      const csvContent = [
        "Camera ID,Name,Status,Location,Resolution,FPS,AI Detections,Last Alert,Temperature,Signal Strength",
        ...cameras.map(
          (cam) =>
            `${cam.id},"${cam.name}",${cam.status},"${cam.location}",${cam.resolution},${cam.fps},${cam.aiDetections},"${cam.lastAlert}",${cam.temperature},${cam.signalStrength}%`,
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `camera-feeds-${Date.now()}.csv`
      a.click()
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `camera-feeds-${Date.now()}.json`
      a.click()
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            Professional AI Vision System
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedLayout} onValueChange={setSelectedLayout}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="focus">Focus View</SelectItem>
                <SelectItem value="split">Split View</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => exportCameraData("csv")}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCameraData("json")}>
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRecordingAll(!recordingAll)}
              className={recordingAll ? "bg-red-500/10 border-red-500/20" : ""}
            >
              {recordingAll ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {recordingAll ? "Stop All" : "Record All"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg border border-green-500/20 bg-green-500/10">
            <div className="text-xl font-bold text-green-400">
              {cameras.filter((c) => c.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Cameras</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-blue-500/20 bg-blue-500/10">
            <div className="text-xl font-bold text-blue-400">
              {cameras.reduce((sum, cam) => sum + cam.aiDetections, 0)}
            </div>
            <div className="text-sm text-muted-foreground">AI Detections</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-purple-500/20 bg-purple-500/10">
            <div className="text-xl font-bold text-purple-400">98.2%</div>
            <div className="text-sm text-muted-foreground">System Accuracy</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10">
            <div className="text-xl font-bold text-yellow-400">
              {cameras.filter((c) => c.status === "maintenance").length}
            </div>
            <div className="text-sm text-muted-foreground">Maintenance</div>
          </div>
        </div>

        <div
          className={`grid gap-4 ${
            selectedLayout === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : selectedLayout === "focus"
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 lg:grid-cols-3"
          }`}
        >
          {cameras.map((camera) => (
            <div key={camera.id} className="relative group">
              <div className="aspect-video bg-gray-900 rounded-lg border border-border overflow-hidden">
                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                  {camera.status === "active" ? (
                    <>
                      {/* Professional railway track simulation */}
                      <div className="absolute inset-0">
                        <img
                          src="/images/design-mode/WhatsApp%20Image%202025-09-24%20at%2008.26.58_d618a445.jpg.jpeg"
                          alt="Railway track view"
                          className="w-full h-full object-cover opacity-70"
                        />

                        {/* AI Detection overlays */}
                        {camera.aiDetections > 0 && (
                          <div className="absolute inset-0">
                            {Array.from({ length: camera.aiDetections }).map((_, i) => (
                              <div
                                key={i}
                                className="absolute border-2 border-yellow-400 bg-yellow-400/20 rounded"
                                style={{
                                  left: `${20 + i * 25}%`,
                                  top: `${30 + i * 15}%`,
                                  width: "15%",
                                  height: "20%",
                                }}
                              >
                                <div className="absolute -top-6 left-0 bg-yellow-400 text-black text-xs px-1 rounded">
                                  Detection {i + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Professional HUD overlay */}
                      <div className="absolute top-2 left-2 space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1 bg-black/70 rounded text-xs">
                          <Zap className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400">AI: ON</span>
                        </div>
                        {camera.aiDetections > 0 && (
                          <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded text-xs">
                            <AlertTriangle className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400">{camera.aiDetections} Objects</span>
                          </div>
                        )}
                        <div className="px-2 py-1 bg-black/70 rounded text-xs text-green-400">
                          Signal: {camera.signalStrength}%
                        </div>
                      </div>

                      {/* Recording and status indicators */}
                      <div className="absolute top-2 right-2 space-y-1">
                        {recordingAll && (
                          <div className="flex items-center gap-2 px-2 py-1 bg-red-500/20 border border-red-500/40 rounded">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-red-400">REC</span>
                          </div>
                        )}
                        <div className="px-2 py-1 bg-black/70 rounded text-xs text-white">
                          {camera.resolution} @ {camera.fps}fps
                        </div>
                      </div>

                      {/* Temperature and system info */}
                      <div className="absolute bottom-2 left-2 space-y-1">
                        <div className="px-2 py-1 bg-black/70 rounded text-xs text-cyan-400">
                          Temp: {camera.temperature}
                        </div>
                        <div className="px-2 py-1 bg-black/70 rounded text-xs text-gray-300">
                          Last Alert: {camera.lastAlert}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Camera Offline</p>
                        <p className="text-xs text-gray-600">Maintenance Mode</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced camera controls overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    {camera.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Enhanced camera info panel */}
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">{camera.name}</h4>
                  <Badge variant="outline" className={getStatusColor(camera.status)}>
                    {camera.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>{camera.id}</span>
                  <span className="text-right">{camera.location}</span>
                  <span>Detections: {camera.aiDetections}</span>
                  <span className="text-right">Signal: {camera.signalStrength}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
