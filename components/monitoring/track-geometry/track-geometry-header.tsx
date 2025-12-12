"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Play, Pause, Download, Settings, MapPin, FileJson, FileSpreadsheet } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TrackGeometryHeader() {
  const [isRecording, setIsRecording] = useState(true)
  const [selectedSection, setSelectedSection] = useState("section-a")
  const [isExporting, setIsExporting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const exportToCSV = async () => {
    try {
      setIsExporting(true)
      const { data, error } = await supabase
        .from("geometry_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000)

      if (error) throw error

      if (!data || data.length === 0) {
        alert("No data available to export")
        return
      }

      // Create CSV content
      const headers = [
        "Timestamp",
        "Lateral Deviation (mm)",
        "Vertical Deviation (mm)",
        "Gauge (mm)",
        "Twist (mm/m)",
        "Curvature (°)",
        "Cant (mm)",
      ]
      const csvRows = [headers.join(",")]

      data.forEach((row) => {
        const values = [
          new Date(row.created_at).toISOString(),
          row.lateral_deviation,
          row.vertical_deviation,
          row.gauge,
          row.twist,
          row.curvature,
          row.cant,
        ]
        csvRows.push(values.join(","))
      })

      const csvContent = csvRows.join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `track_geometry_${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("[v0] Export failed:", err)
      alert("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = async () => {
    try {
      setIsExporting(true)
      const { data, error } = await supabase
        .from("geometry_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000)

      if (error) throw error

      if (!data || data.length === 0) {
        alert("No data available to export")
        return
      }

      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `track_geometry_${new Date().toISOString().slice(0, 10)}.json`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("[v0] Export failed:", err)
      alert("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Track Geometry Monitoring</h1>
              <p className="text-sm text-muted-foreground">Real-time track alignment and geometry analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-40">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="section-a">Section A-B</SelectItem>
                <SelectItem value="section-b">Section B-C</SelectItem>
                <SelectItem value="section-c">Section C-D</SelectItem>
                <SelectItem value="section-d">Section D-E</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={isRecording ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export Data"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON}>
                  <FileJson className="w-4 h-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Settings panel coming soon - configure thresholds and alerts here")}
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Badge
              variant="outline"
              className={
                isRecording
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-gray-500/10 text-gray-400 border-gray-500/20"
              }
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${isRecording ? "bg-green-400 pulse-data" : "bg-gray-400"}`}
              ></div>
              {isRecording ? "RECORDING" : "STOPPED"}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
