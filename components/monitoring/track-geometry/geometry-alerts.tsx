"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Info, CheckCircle, Clock, X } from "lucide-react"

interface GeometryAlert {
  id: string
  type: "critical" | "warning" | "info"
  parameter: string
  value: number
  limit: number
  unit: string
  location: string
  timestamp: Date
  acknowledged: boolean
}

const initialAlerts: GeometryAlert[] = [
  {
    id: "1",
    type: "critical",
    parameter: "Lateral Deviation",
    value: 5.2,
    limit: 5.0,
    unit: "mm",
    location: "KM 245.8",
    timestamp: new Date(Date.now() - 120000),
    acknowledged: false,
  },
  {
    id: "2",
    type: "warning",
    parameter: "Track Gauge",
    value: 1438.5,
    limit: 1438.0,
    unit: "mm",
    location: "KM 246.2",
    timestamp: new Date(Date.now() - 300000),
    acknowledged: false,
  },
  {
    id: "3",
    type: "warning",
    parameter: "Vertical Deviation",
    value: 3.8,
    limit: 4.0,
    unit: "mm",
    location: "KM 247.1",
    timestamp: new Date(Date.now() - 450000),
    acknowledged: true,
  },
  {
    id: "4",
    type: "info",
    parameter: "Cross Level",
    value: 2.1,
    limit: 3.0,
    unit: "mm",
    location: "KM 248.5",
    timestamp: new Date(Date.now() - 600000),
    acknowledged: false,
  },
]

export function GeometryAlerts() {
  const [alerts, setAlerts] = useState<GeometryAlert[]>(initialAlerts)

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const getAlertIcon = (type: GeometryAlert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "info":
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const getAlertBadge = (type: GeometryAlert["type"]) => {
    switch (type) {
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
            Critical
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Info
          </Badge>
        )
    }
  }

  const unacknowledgedCount = alerts.filter((alert) => !alert.acknowledged).length

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Geometry Alerts</CardTitle>
            <CardDescription>Track geometry violations and warnings</CardDescription>
          </div>
          {unacknowledgedCount > 0 && (
            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
              {unacknowledgedCount} New
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-colors ${
                  alert.acknowledged ? "bg-muted/20 border-border/30" : "bg-card border-border/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-foreground">{alert.parameter}</h4>
                        {getAlertBadge(alert.type)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {alert.value.toFixed(1)}
                        {alert.unit} exceeds limit of {alert.limit.toFixed(1)}
                        {alert.unit}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp.toLocaleTimeString("en-IN", { hour12: true })}
                        </div>
                        <span>{alert.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="h-6 px-2 text-xs"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
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
