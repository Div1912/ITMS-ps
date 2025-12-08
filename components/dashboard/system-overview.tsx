"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Activity, Zap, Camera, Gauge, AlertTriangle, CheckCircle, Settings, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const systemModules = [
  {
    id: "track-geometry",
    name: "Track Geometry",
    status: "operational",
    health: 98,
    icon: Activity,
    description: "Real-time track alignment monitoring",
    route: "/monitoring/track-geometry",
  },
  {
    id: "rail-profile",
    name: "Rail Profile Analysis",
    status: "operational",
    health: 95,
    icon: Gauge,
    description: "Rail wear and profile assessment",
    route: "/monitoring/rail-profile",
  },
  {
    id: "acceleration",
    name: "Acceleration Monitoring",
    status: "operational",
    health: 97,
    icon: Zap,
    description: "Vibration and acceleration analysis",
    route: "/monitoring/acceleration",
  },
  {
    id: "infringement",
    name: "Infringement Detection",
    status: "warning",
    health: 87,
    icon: AlertTriangle,
    description: "Track clearance monitoring",
    route: "/monitoring/ai-vision",
  },
  {
    id: "ai-vision",
    name: "Condition Monitoring",
    status: "operational",
    health: 94,
    icon: Camera,
    description: "Computer vision analysis",
    route: "/monitoring/ai-vision",
  },
  {
    id: "video-recording",
    name: "4K Video Recording",
    status: "operational",
    health: 99,
    icon: CheckCircle,
    description: "High-definition track recording",
    route: "/monitoring/video-recording",
  },
]

export function SystemOverview() {
  const router = useRouter()
  const { toast } = useToast()
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)

  const operationalCount = systemModules.filter((m) => m.status === "operational").length
  const warningCount = systemModules.filter((m) => m.status === "warning").length
  const averageHealth = Math.round(systemModules.reduce((acc, m) => acc + m.health, 0) / systemModules.length)

  const handleModuleClick = (module: (typeof systemModules)[0]) => {
    router.push(module.route)
    toast({
      title: "Navigating to Module",
      description: `Opening ${module.name} monitoring interface`,
    })
  }

  const handleConfigureModule = (moduleId: string, moduleName: string) => {
    toast({
      title: "Configuration",
      description: `Opening configuration for ${moduleName}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h2
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          System Overview
        </motion.h2>
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 animate-pulse">
            {operationalCount} Operational
          </Badge>
          {warningCount > 0 && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse">
              {warningCount} Warning
            </Badge>
          )}
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            {averageHealth}% Health
          </Badge>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemModules.map((module, index) => {
          const Icon = module.icon
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredModule(module.id)}
              onHoverEnd={() => setHoveredModule(null)}
            >
              <Card
                className={`border-gray-200 dark:border-gray-800 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 cursor-pointer ${
                  hoveredModule === module.id ? "scale-105 shadow-lg shadow-blue-500/20" : ""
                }`}
                onClick={() => handleModuleClick(module)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-5 h-5 transition-colors duration-300 ${
                          module.status === "operational" ? "text-green-400" : "text-yellow-400"
                        }`}
                      />
                      <CardTitle className="text-lg text-white">{module.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          module.status === "operational"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }
                      >
                        {module.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">System Health</span>
                      <span className="font-medium text-white">{module.health}%</span>
                    </div>
                    <Progress value={module.health} className="h-2" />
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/30"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleModuleClick(module)
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Monitor
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-600/20 border-gray-500/30 text-gray-400 hover:bg-gray-600/30"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConfigureModule(module.id, module.name)
                        }}
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
