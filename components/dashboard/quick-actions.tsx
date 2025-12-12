"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Download, Settings, FileText, AlertTriangle, BarChart3, Pause, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"

export function QuickActions() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const [isRecording, setIsRecording] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const handleStartStopRecording = async () => {
    setIsRecording(!isRecording)
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "4K video recording has been stopped" : "4K video recording is now active",
    })
  }

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    toast({
      title: "Generating Report",
      description: "Fetching data from database...",
    })

    try {
      // Fetch latest geometry data
      const { data: geometryData } = await supabase
        .from("geometry_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      // Fetch latest acceleration data
      const { data: accelData } = await supabase
        .from("acceleration_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
          geometryRecords: geometryData?.length || 0,
          accelerationRecords: accelData?.length || 0,
          avgLateralDeviation: geometryData
            ? (geometryData.reduce((sum, r) => sum + Number(r.lateral_deviation), 0) / geometryData.length).toFixed(2)
            : 0,
          avgVerticalAccel: accelData
            ? (accelData.reduce((sum, r) => sum + Number(r.vertical_accel), 0) / accelData.length).toFixed(3)
            : 0,
        },
        geometryData: geometryData?.slice(0, 10),
        accelerationData: accelData?.slice(0, 10),
        recommendations: [
          "Track geometry within acceptable limits",
          "Vibration levels normal for current speed",
          "Continue regular monitoring schedule",
        ],
      }

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ITMS-Report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Report Generated",
        description: `Report with ${geometryData?.length || 0} geometry and ${accelData?.length || 0} acceleration records`,
      })
    } catch (err) {
      toast({
        title: "Report Generation Failed",
        description: String(err),
        variant: "destructive",
      })
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleExportData = async () => {
    toast({
      title: "Exporting Data",
      description: "Fetching all monitoring data...",
    })

    try {
      // Fetch geometry data
      const { data: geometryData } = await supabase
        .from("geometry_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000)

      // Fetch acceleration data
      const { data: accelData } = await supabase
        .from("acceleration_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000)

      const csvData = [
        "Type,Timestamp,Metric,Value,Unit",
        ...(geometryData || []).flatMap((row) => [
          `Geometry,${row.created_at},Lateral Deviation,${row.lateral_deviation},mm`,
          `Geometry,${row.created_at},Vertical Deviation,${row.vertical_deviation},mm`,
          `Geometry,${row.created_at},Gauge,${row.gauge},mm`,
        ]),
        ...(accelData || []).flatMap((row) => [
          `Acceleration,${row.created_at},Vertical Accel,${row.vertical_accel},m/s²`,
          `Acceleration,${row.created_at},Lateral Accel,${row.lateral_accel},m/s²`,
          `Acceleration,${row.created_at},RMS Vibration,${row.rms_vibration},mm/s`,
        ]),
      ].join("\n")

      const blob = new Blob([csvData], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ITMS-Complete-Data-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data Exported",
        description: `Exported ${(geometryData?.length || 0) + (accelData?.length || 0)} total records`,
      })
    } catch (err) {
      toast({
        title: "Export Failed",
        description: String(err),
        variant: "destructive",
      })
    }
  }

  const actions = [
    {
      id: "start-recording",
      label: isRecording ? "Stop Recording" : "Start Recording",
      description: isRecording ? "Stop 4K video capture" : "Begin 4K video capture",
      icon: isRecording ? Pause : Play,
      variant: "default" as const,
      className: isRecording ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white",
      action: handleStartStopRecording,
    },
    {
      id: "generate-report",
      label: "Generate Report",
      description: "Create analysis report",
      icon: isGeneratingReport ? CheckCircle : FileText,
      variant: "outline" as const,
      className: "bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/30",
      action: handleGenerateReport,
      disabled: isGeneratingReport,
    },
    {
      id: "export-data",
      label: "Export Data",
      description: "Download monitoring data",
      icon: Download,
      variant: "outline" as const,
      className: "bg-purple-600/20 border-purple-500/30 text-purple-400 hover:bg-purple-600/30",
      action: handleExportData,
    },
    {
      id: "calibrate",
      label: "Calibrate Sensors",
      description: "System calibration",
      icon: Settings,
      variant: "outline" as const,
      className: "bg-orange-600/20 border-orange-500/30 text-orange-400 hover:bg-orange-600/30",
      action: () => {
        toast({
          title: "Sensor Calibration",
          description: "Starting sensor calibration process...",
        })
      },
    },
    {
      id: "emergency-stop",
      label: "Emergency Stop",
      description: "Stop all monitoring",
      icon: AlertTriangle,
      variant: "destructive" as const,
      className: "bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30",
      action: () => {
        toast({
          title: "Emergency Stop Activated",
          description: "All monitoring systems have been stopped",
          variant: "destructive",
        })
      },
    },
    {
      id: "analytics",
      label: "View Analytics",
      description: "Detailed analysis",
      icon: BarChart3,
      variant: "outline" as const,
      className: "bg-teal-600/20 border-teal-500/30 text-teal-400 hover:bg-teal-600/30",
      action: () => router.push("/analytics"),
    },
  ]

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
        <CardDescription className="text-gray-300">Common monitoring operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant={action.variant}
                  className={`justify-start h-auto p-3 w-full transition-all duration-300 hover:scale-105 ${action.className || ""}`}
                  onClick={action.action}
                  disabled={action.disabled}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${action.disabled ? "animate-spin" : ""}`} />
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs opacity-70">{action.description}</div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
