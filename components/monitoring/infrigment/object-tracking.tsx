import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Navigation, Clock, Activity } from "lucide-react"

export function ObjectTracking() {
  const trackedObjects = [
    {
      id: "TRK-001",
      type: "Maintenance Vehicle",
      status: "tracking",
      location: "KM 125.8",
      speed: "15 km/h",
      direction: "North",
      confidence: 98,
      duration: "5 minutes",
      camera: "CAM-003",
    },
    {
      id: "TRK-002",
      type: "Railway Worker",
      status: "tracking",
      location: "KM 126.2",
      speed: "3 km/h",
      direction: "South",
      confidence: 94,
      duration: "12 minutes",
      camera: "CAM-002",
    },
    {
      id: "TRK-003",
      type: "Inspection Drone",
      status: "tracking",
      location: "KM 127.5",
      speed: "25 km/h",
      direction: "East",
      confidence: 96,
      duration: "3 minutes",
      camera: "CAM-005",
    },
    {
      id: "TRK-004",
      type: "Wildlife (Deer)",
      status: "lost",
      location: "KM 128.1",
      speed: "0 km/h",
      direction: "Unknown",
      confidence: 0,
      duration: "2 minutes ago",
      camera: "CAM-006",
    },
  ]

  const trackingStats = [
    { label: "Active Tracks", value: "3", color: "text-green-400" },
    { label: "Lost Tracks", value: "1", color: "text-red-400" },
    { label: "Avg Confidence", value: "96%", color: "text-blue-400" },
    { label: "Track Duration", value: "6.7min", color: "text-purple-400" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "tracking":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "lost":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      case "new":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20"
      default:
        return "text-muted-foreground bg-muted/10 border-border"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Object Tracking
          </CardTitle>
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Track History
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trackingStats.map((stat, index) => (
            <div key={index} className="text-center p-3 rounded-lg border border-border bg-card/30">
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Active Tracking Objects</h4>
          {trackedObjects.map((obj) => (
            <div key={obj.id} className="p-4 rounded-lg border border-border bg-card/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getStatusColor(obj.status)}>
                    {obj.status.toUpperCase()}
                  </Badge>
                  <span className="font-medium text-foreground">{obj.type}</span>
                </div>
                <span className="text-sm text-muted-foreground">{obj.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-foreground">{obj.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-muted-foreground">Speed:</span>
                  <span className="text-foreground">{obj.speed}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-foreground">{obj.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Direction: <span className="text-foreground">{obj.direction}</span>
                  </span>
                  <span>
                    Camera: <span className="text-foreground">{obj.camera}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Confidence:</span>
                  <div className="w-16">
                    <Progress value={obj.confidence} className="h-2" />
                  </div>
                  <span className="text-sm text-foreground">{obj.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
