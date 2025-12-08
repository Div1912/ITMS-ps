"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RailwayLogo } from "@/components/ui/railway-logo"
import { Bell, Settings, LogOut, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const [user, setUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("itms-user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("system-start-time")
    localStorage.removeItem("itms-user")
        router.push("/")
  }

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <RailwayLogo />
            <div>
              <h1 className="text-2xl font-bold text-foreground">ITMS Dashboard</h1>
              <p className="text-sm text-muted-foreground">Indigenous Track Monitoring System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {currentTime.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour12: true,
              })}
            </div>

            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 pulse-data"></div>
              System Online
            </Badge>

            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            {user && (
              <div className="flex items-center gap-2">
                <div className="text-right text-sm">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-muted-foreground">{user.role}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
