"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Settings } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function AccelerationHeader() {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleExport = async () => {
    setIsExporting(true)
    toast({ title: "Exporting Data", description: "Fetching acceleration data from database..." })

    try {
      const { data, error } = await supabase
        .from("acceleration_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000)

      if (error) throw error

      const csvContent = [
        "Timestamp,Vertical (m/s²),Lateral (m/s²),Longitudinal (m/s²),RMS Vibration (mm/s),Peak Vibration (mm/s),RQI",
        ...(data || []).map(
          (row) =>
            `${row.created_at},${row.vertical_accel},${row.lateral_accel},${row.longitudinal_accel},${row.rms_vibration || 0},${row.peak_vibration || 0},${row.ride_quality_index || 0}`,
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `acceleration-data-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({ title: "Export Complete", description: `Downloaded ${data?.length || 0} records` })
    } catch (err) {
      toast({ title: "Export Failed", description: String(err), variant: "destructive" })
    } finally {
      setIsExporting(false)
    }
  }

  const handleCalibrate = () => {
    toast({ title: "Sensor Calibration", description: "Starting IMU calibration process..." })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Acceleration & Vibration Monitoring</h1>
            <p className="text-muted-foreground mt-1">Real-time track dynamics and ride quality assessment</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Sensors Active
            </Badge>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCalibrate}>
                <Settings className="w-4 h-4 mr-2" />
                Calibrate
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span>Sampling Rate: 1000 Hz</span>
          <span>•</span>
          <span>Speed: 85 km/h</span>
          <span>•</span>
          <span>Temperature: 24°C</span>
          <span>•</span>
          <span>Last Calibration: 2 days ago</span>
        </div>
      </div>
    </div>
  )
}
