"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Info, CheckCircle, Clock, X, Bell, BellOff, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  timestamp: Date
  location: string
  acknowledged: boolean
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Track Geometry Deviation",
    description: "Lateral deviation exceeds 5mm threshold at KM 245.8",
    timestamp: new Date(Date.now() - 3000),
    location: "Section A-B, KM 245.8",
    acknowledged: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Rail Profile Wear",
    description: "Increased wear detected on right rail",
    timestamp: new Date(Date.now() - 6000),
    location: "Section B-C, KM 267.2",
    acknowledged: false,
  },
  {
    id: "3",
    type: "info",
    title: "Maintenance Window",
    description: "Scheduled maintenance in 2 hours",
    timestamp: new Date(Date.now() - 9000),
    location: "Section C-D, KM 289.5",
    acknowledged: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Acceleration Spike",
    description: "Unusual vibration pattern detected",
    timestamp: new Date(Date.now() - 12000),
    location: "Section A-B, KM 234.1",
    acknowledged: false,
  },
]

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { toast } = useToast()

const AlertMessage = (type: "critical" | "warning" | "info") => {
    if (type === "critical") {
      return {
        title: "Track Geometry Deviation",
        description: "Lateral deviation exceeded threshold limit",
      }
    }
    if (type === "warning") {
      return {
        title: "Vibration Spike",
        description: "Unusual vibration pattern detected",
      }
    }
    return {
      title: "System Notification",
      description: "Routine system monitoring update",
    }
  }

  useEffect(() => {
  const interval = setInterval(() => {
    if (Math.random() < 0.8) {
      // Determine alert type
      const r = Math.random()
const alertType: Alert["type"] =
  r < 0.33 ? "critical" : r < 0.66 ? "warning" : "info"

const msg = AlertMessage(alertType)

const newAlert: Alert = {
  id: Date.now().toString(),
  type: alertType,
  title: msg.title,
  description: msg.description,
  timestamp: new Date(),
  location: `KM ${(Math.random() * 300 + 200).toFixed(1)}`,
  acknowledged: false,
}


      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)])

      if (soundEnabled) {
        toast({
          title: "New Alert",
          description: newAlert.title,
          variant: newAlert.type === "critical" ? "destructive" : "default",
        })
      }
    }
  }, 5000)

  return () => clearInterval(interval)
}, [soundEnabled, toast])


  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been marked as acknowledged",
    })
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    toast({
      title: "Alert Dismissed",
      description: "Alert has been removed from the panel",
    })
  }

  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, acknowledged: true })))
    toast({
      title: "All Alerts Acknowledged",
      description: "All alerts have been marked as acknowledged",
    })
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "info":
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const getAlertBadge = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 animate-pulse">
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

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((alert) => alert.type === filter)
  const unacknowledgedCount = alerts.filter((alert) => !alert.acknowledged).length

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-white">System Alerts</CardTitle>
            <CardDescription className="text-gray-300">Recent notifications and warnings</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`${soundEnabled ? "bg-green-600/20 border-green-500/30 text-green-400" : "bg-gray-600/20 border-gray-500/30 text-gray-400"}`}
            >
              {soundEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
            </Button>
            {unacknowledgedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={acknowledgeAll}
                className="bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/30"
              >
                Ack All
              </Button>
            )}
            {unacknowledgedCount > 0 && (
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 animate-pulse">
                {unacknowledgedCount} New
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          {(["all", "critical", "warning", "info"] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className={`text-xs ${
                filter === filterType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600/20 border-gray-500/30 text-gray-400 hover:bg-gray-600/30"
              }`}
            >
              <Filter className="w-3 h-3 mr-1" />
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    alert.acknowledged
                      ? "bg-slate-700/30 border-gray-600/30"
                      : "bg-slate-700/50 border-gray-600/50 hover:bg-slate-700/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <motion.div
                        animate={alert.type === "critical" && !alert.acknowledged ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {getAlertIcon(alert.type)}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-white truncate">{alert.title}</h4>
                          {getAlertBadge(alert.type)}
                        </div>
                        <p className="text-xs text-gray-300 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
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
                          className="h-6 px-2 text-xs text-green-400 hover:bg-green-600/20"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-6 px-2 text-xs text-red-400 hover:bg-red-600/20"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
