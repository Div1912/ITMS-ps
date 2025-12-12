import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Clock, MapPin, Activity, Filter } from "lucide-react"

export function VibrationAlerts() {
  const alerts = [
    {
      id: "VIB-001",
      type: "High Vertical Acceleration",
      severity: "warning",
      location: "KM 125.8 + 150m",
      value: "0.95 m/s²",
      threshold: "0.9 m/s²",
      timestamp: "2 minutes ago",
      duration: "15 seconds",
    },
    {
      id: "VIB-002",
      type: "Excessive Lateral Vibration",
      severity: "critical",
      location: "KM 127.2 + 300m",
      value: "0.85 m/s²",
      threshold: "0.8 m/s²",
      timestamp: "8 minutes ago",
      duration: "45 seconds",
    },
    {
      id: "VIB-003",
      type: "RQI Threshold Exceeded",
      severity: "warning",
      location: "KM 128.5 + 50m",
      value: "3.8 RQI",
      threshold: "3.5 RQI",
      timestamp: "15 minutes ago",
      duration: "30 seconds",
    },
    {
      id: "VIB-004",
      type: "Frequency Anomaly",
      severity: "info",
      location: "KM 129.1 + 200m",
      value: "25.5 Hz",
      threshold: "20-25 Hz",
      timestamp: "22 minutes ago",
      duration: "10 seconds",
    },
    {
      id: "VIB-005",
      type: "Sensor Calibration Alert",
      severity: "warning",
      location: "Accelerometer #3",
      value: "Drift detected",
      threshold: "±2% accuracy",
      timestamp: "1 hour ago",
      duration: "Ongoing",
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

  const alertCounts = {
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Vibration Alerts
          </CardTitle>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg border border-red-500/20 bg-red-500/10">
            <div className="text-xl font-bold text-red-400">{alertCounts.critical}</div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10">
            <div className="text-xl font-bold text-yellow-400">{alertCounts.warning}</div>
            <div className="text-sm text-muted-foreground">Warning</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-blue-500/20 bg-blue-500/10">
            <div className="text-xl font-bold text-blue-400">{alertCounts.info}</div>
            <div className="text-sm text-muted-foreground">Info</div>
          </div>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="font-medium text-foreground">{alert.type}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{alert.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{alert.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Value: <span className="text-foreground font-medium">{alert.value}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Threshold: <span className="text-foreground">{alert.threshold}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    <span>{alert.duration}</span>
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
