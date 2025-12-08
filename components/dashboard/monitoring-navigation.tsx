"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Activity,
  Gauge,
  Zap,
  AlertTriangle,
  Camera,
  Video,
  BarChart3,
  TrendingUp,
  Download,
  Settings,
  RefreshCw,
} from "lucide-react"
import { useState , useEffect } from "react"

const monitoringSystems = [
  {
    id: "track-geometry",
    name: "Track Geometry",
    description: "Real-time track alignment monitoring",
    icon: Activity,
    status: "operational",
    path: "/monitoring/track-geometry",
    alerts: 3,
    lastUpdate: "2 min ago",
    dataPoints: "1,247",
  },
  {
    id: "rail-profile",
    name: "Rail Profile",
    description: "Rail wear and profile analysis",
    icon: Gauge,
    status: "operational",
    path: "/monitoring/rail-profile",
    alerts: 1,
    lastUpdate: "1 min ago",
    dataPoints: "892",
  },
  {
    id: "acceleration",
    name: "Acceleration",
    description: "Vibration and acceleration monitoring",
    icon: Zap,
    status: "operational",
    path: "/monitoring/acceleration",
    alerts: 0,
    lastUpdate: "30 sec ago",
    dataPoints: "2,156",
  },
  {
    id: "ai-vision",
    name: "Condition Monitoring",
    description: "Computer vision analysis",
    icon: Camera,
    status: "operational",
    path: "/monitoring/ai-vision",
    alerts: 2,
    lastUpdate: "15 sec ago",
    dataPoints: "847",
  },
  {
    id: "video-recording",
    name: "4K Recording",
    description: "High-definition video capture",
    icon: Video,
    status: "operational",
    path: "/monitoring/video-recording",
    alerts: 0,
    lastUpdate: "5 sec ago",
    dataPoints: "Active",
  },
  {
   id: "infigment detection",
    name: "Infrigment Detection",
    description: "High-definition video capture",
    icon: Video,
    status: "operational",
    path: "/monitoring/infringement",
    alerts: 0,
    lastUpdate: "5 sec ago",
    dataPoints: "Active",
  },
]

export function MonitoringNavigation() {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [uptime, setUptime] = useState("00:00:00")

 // startTime is the numeric timestamp (ms) when the system started
  const [startTime, setStartTime] = useState<number | null>(null)

  // initialize startTime from localStorage (or now if not present)
  useEffect(() => {
    const saved = localStorage.getItem("system-start-time")
    const initialTime = saved ? Number(saved) : Date.now()

    setStartTime(initialTime)
    localStorage.setItem("system-start-time", initialTime.toString())
  }, [])

  // interval that updates uptime every second — depends on startTime
  useEffect(() => {
    if (startTime === null) return

    const tick = () => {
      const now = Date.now()
      const diff = now - startTime

      const totalSeconds = Math.floor(diff / 1000)
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0")
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
      const seconds = String(totalSeconds % 60).padStart(2, "0")

      setUptime(`${hours}:${minutes}:${seconds}`)
    }

    // immediate tick so UI doesn't wait 1s on start
    tick()
    const timer = setInterval(tick, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  const handleRefresh = async () => {
    setRefreshing(true)

    // reset start time (both in localStorage and state) -> uptime resets immediately
    const newTime = Date.now()
    localStorage.setItem("system-start-time", newTime.toString())
    setStartTime(newTime)

    // simulate data refresh delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setRefreshing(false)
  }

  

  const exportSystemStatus = (format: string) => {
    const data = {
      timestamp: new Date().toISOString(),
      systemOverview: {
        totalSystems: monitoringSystems.length,
        operational: monitoringSystems.filter((s) => s.status === "operational").length,
        totalAlerts: monitoringSystems.reduce((sum, s) => sum + s.alerts, 0),
      },
      systems: monitoringSystems.map((system) => ({
        id: system.id,
        name: system.name,
        status: system.status,
        alerts: system.alerts,
        lastUpdate: system.lastUpdate,
        dataPoints: system.dataPoints,
      })),
    }

    if (format === "csv") {
      const csvContent = [
        "System ID,Name,Status,Alerts,Last Update,Data Points",
        ...monitoringSystems.map(
          (s) => `${s.id},"${s.name}",${s.status},${s.alerts},"${s.lastUpdate}",${s.dataPoints}`,
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `system-status-${Date.now()}.csv`
      a.click()
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `system-status-${Date.now()}.json`
      a.click()
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Professional Monitoring Systems</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time railway infrastructure monitoring and analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportSystemStatus("csv")}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/analytics")}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg border border-green-500/20 bg-green-500/10">
            <div className="text-xl font-bold text-green-400">
              {monitoringSystems.filter((s) => s.status === "operational").length}
            </div>
            <div className="text-sm text-muted-foreground">Systems Online</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-red-500/20 bg-red-500/10">
            <div className="text-xl font-bold text-red-400">
              {monitoringSystems.reduce((sum, s) => sum + s.alerts, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </div>
         
          <div className="text-center p-3 rounded-lg border border-purple-500/20 bg-purple-500/10">
            <div className="text-xl font-bold text-purple-400">{uptime}
</div>
            <div className="text-sm text-muted-foreground">System Uptime</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monitoringSystems.map((system) => {
            const Icon = system.icon
            return (
              <Button
                key={system.id}
                variant="outline"
                className="h-auto p-4 justify-start hover:bg-card/70 transition-all duration-200 bg-transparent hover:scale-[1.02] hover:shadow-lg"
                onClick={() => router.push(system.path)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Icon className="w-6 h-6 text-blue-400" />
                    {system.status === "operational" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{system.name}</h3>
                      <div className="flex items-center gap-2">
                        {system.alerts > 0 && (
                          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                            {system.alerts}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            system.status === "operational"
                              ? "bg-green-500/10 text-green-400 border-green-500/20 text-xs"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs"
                          }
                        >
                          {system.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{system.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Updated: {system.lastUpdate}</span>
                      <span className="text-blue-400 font-medium">{system.dataPoints} pts</span>
                    </div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/analytics")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportSystemStatus("json")}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              System Config
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alert Center
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
