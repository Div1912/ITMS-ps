"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Maximize2, RotateCcw, Layers, Download, Upload, FileText } from "lucide-react"
import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

export function ProfileVisualization() {

   const CustomLegend = () => {
  return (
    <div className="flex items-center justify-center gap-6 py-2 text-xs text-gray-300">
      <div className="flex items-center gap-2">
        <div className="w-3 h-1 bg-cyan-400 rounded"></div>
        Ideal Rail Profile
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-1 bg-purple-400 rounded"></div>
        Rail Profile Captured by Outside Laser
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-1 bg-gray-400 rounded"></div>
        Rail Profile Captured by Inside Laser
      </div>
    </div>
  );
};

  const [selectedProfile, setSelectedProfile] = useState("current")
  const [showGrid, setShowGrid] = useState(true)
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)

  const railProfileData = [
    // Left rail base
    { x: -70, ideal: -150, worn: -152, laser: -151, section: "base" },
    { x: -60, ideal: -148, worn: -150, laser: -149, section: "base" },
    { x: -50, ideal: -145, worn: -147, laser: -146, section: "base" },
    { x: -40, ideal: -142, worn: -144, laser: -143, section: "base" },
    { x: -35, ideal: -140, worn: -142, laser: -141, section: "base" },

    // Left web (vertical part)
    { x: -35, ideal: -140, worn: -142, laser: -141, section: "web" },
    { x: -15, ideal: -120, worn: -122, laser: -121, section: "web" },
    { x: -15, ideal: -20, worn: -23, laser: -22, section: "web" },
    { x: -35, ideal: 0, worn: -3, laser: -2, section: "web" },

    // Rail head (top curved part) - left side
    { x: -35, ideal: 0, worn: -3, laser: -2, section: "head" },
    { x: -30, ideal: -2, worn: -5, laser: -4, section: "head" },
    { x: -25, ideal: -5, worn: -8, laser: -7, section: "head" },
    { x: -20, ideal: -8, worn: -12, laser: -11, section: "head" },
    { x: -15, ideal: -12, worn: -16, laser: -15, section: "head" },
    { x: -10, ideal: -15, worn: -19, laser: -18, section: "head" },
    { x: -5, ideal: -18, worn: -22, laser: -21, section: "head" },
    { x: 0, ideal: -20, worn: -25, laser: -24, section: "head" },

    // Rail head - right side
    { x: 5, ideal: -18, worn: -22, laser: -21, section: "head" },
    { x: 10, ideal: -15, worn: -19, laser: -18, section: "head" },
    { x: 15, ideal: -12, worn: -16, laser: -15, section: "head" },
    { x: 20, ideal: -8, worn: -12, laser: -11, section: "head" },
    { x: 25, ideal: -5, worn: -8, laser: -7, section: "head" },
    { x: 30, ideal: -2, worn: -5, laser: -4, section: "head" },
    { x: 35, ideal: 0, worn: -3, laser: -2, section: "head" },

    // Right web
    { x: 35, ideal: 0, worn: -3, laser: -2, section: "web" },
    { x: 15, ideal: -20, worn: -23, laser: -22, section: "web" },
    { x: 15, ideal: -120, worn: -122, laser: -121, section: "web" },
    { x: 35, ideal: -140, worn: -142, laser: -141, section: "web" },

    // Right rail base
    { x: 35, ideal: -140, worn: -142, laser: -141, section: "base" },
    { x: 40, ideal: -142, worn: -144, laser: -143, section: "base" },
    { x: 50, ideal: -145, worn: -147, laser: -146, section: "base" },
    { x: 60, ideal: -148, worn: -150, laser: -149, section: "base" },
    { x: 70, ideal: -150, worn: -152, laser: -151, section: "base" },
  ]

  const wearData = {
    leftVWear: 3.7,
    leftLWear: 0.74,
    leftHWear: 2.38,
    leftAWear: 4.57,
    railInc: 3.97,
  }

  const exportData = (format: string) => {
    const data = {
      timestamp: new Date().toISOString(),
      location: "KM 125.4",
      rail: "Left",
      wearData,
      profileData: railProfileData,
    }

    if (format === "csv") {
      const csvContent = [
        "Parameter,Value,Unit",
        `V-WEAR,${wearData.leftVWear},mm`,
        `L-WEAR,${wearData.leftLWear},mm`,
        `H-WEAR,${wearData.leftHWear},mm`,
        `A-WEAR,${wearData.leftAWear},mm`,
        `RAIL-INC,${wearData.railInc},degrees`,
        "",
        "X_Position,Ideal_Height,Worn_Height,Laser_Height,Section",
        ...railProfileData.map((point) => `${point.x},${point.ideal},${point.worn},${point.laser},${point.section}`),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rail-profile-${Date.now()}.csv`
      a.click()
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rail-profile-${Date.now()}.json`
      a.click()
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">Position: {label}mm</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-cyan-400"></div>
              <span className="text-cyan-400">Ideal: {data.ideal}mm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-purple-400"></div>
              <span className="text-purple-400">Outside Laser: {data.worn}mm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-gray-400"></div>
              <span className="text-gray-400">Inside Laser: {data.laser}mm</span>
            </div>
            <div className="text-yellow-400 mt-2">Section: {data.section}</div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Rail Profile Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedProfile} onValueChange={setSelectedProfile}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="baseline">Baseline</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => exportData("csv")}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportData("json")}>
              <FileText className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-blue-400 bg-blue-500/10 border-blue-500/20">
              Section: KM 125.4
            </Badge>
            <Badge variant="outline" className="text-green-400 bg-green-500/10 border-green-500/20">
              Rail: Left
            </Badge>
            <Badge variant="outline" className="text-purple-400 bg-purple-500/10 border-purple-500/20">
              Speed: 60 km/h
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
              <Layers className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-border p-4">
        <CustomLegend />
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={railProfileData} margin={{ top: 30, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={showGrid ? 0.3 : 0} />
              <XAxis
                dataKey="x"
                stroke="#9CA3AF"
                label={{
                  value: "Position (mm)",
                  position: "insideBottom",
                  offset: -10,
                  style: { textAnchor: "middle", fill: "#9CA3AF" },
                }}
              />
              <YAxis
                stroke="#9CA3AF"
                label={{
                  value: "Height (mm)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#9CA3AF" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
            



              {/* Reference lines for rail sections */}
              <ReferenceLine y={-20} stroke="#4B5563" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={-140} stroke="#4B5563" strokeDasharray="2 2" opacity={0.5} />

              <Line
                type="monotone"
                dataKey="ideal"
                stroke="#06B6D4"
                strokeWidth={2}
                strokeDasharray="5,5"
                name="Ideal Rail Profile"
                dot={false}
                activeDot={{ r: 4, fill: "#06B6D4" }}
              />
              <Line
                type="monotone"
                dataKey="worn"
                stroke="#8B5CF6"
                strokeWidth={3}
                name="Rail Profile Captured by Outside Laser"
                dot={false}
                activeDot={{ r: 4, fill: "#8B5CF6" }}
              />
              <Line
                type="monotone"
                dataKey="laser"
                stroke="#6B7280"
                strokeWidth={2}
                name="Rail Profile Captured by Inside Laser"
                dot={false}
                activeDot={{ r: 4, fill: "#6B7280" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium text-white mb-2">Rail Measurements</div>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">V-WEAR:</span>
                <span className="text-red-400 font-mono">{wearData.leftVWear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">L-WEAR:</span>
                <span className="text-yellow-400 font-mono">{wearData.leftLWear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">H-WEAR:</span>
                <span className="text-orange-400 font-mono">{wearData.leftHWear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">A-WEAR:</span>
                <span className="text-red-400 font-mono">{wearData.leftAWear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">RAIL-INC:</span>
                <span className="text-blue-400 font-mono">{wearData.railInc}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-4">
          <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/10 text-center">
            <div className="text-xl font-bold text-red-400">{wearData.leftVWear}</div>
            <div className="text-sm text-muted-foreground">V-WEAR (mm)</div>
            <div className="text-xs text-red-300 mt-1">Critical</div>
          </div>
          <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-center">
            <div className="text-xl font-bold text-yellow-400">{wearData.leftLWear}</div>
            <div className="text-sm text-muted-foreground">L-WEAR (mm)</div>
            <div className="text-xs text-yellow-300 mt-1">Good</div>
          </div>
          <div className="p-4 rounded-lg border border-orange-500/20 bg-orange-500/10 text-center">
            <div className="text-xl font-bold text-orange-400">{wearData.leftHWear}</div>
            <div className="text-sm text-muted-foreground">H-WEAR (mm)</div>
            <div className="text-xs text-orange-300 mt-1">Moderate</div>
          </div>
          <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/10 text-center">
            <div className="text-xl font-bold text-red-400">{wearData.leftAWear}</div>
            <div className="text-sm text-muted-foreground">A-WEAR (mm)</div>
            <div className="text-xs text-red-300 mt-1">Critical</div>
          </div>
          <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/10 text-center">
            <div className="text-xl font-bold text-blue-400">{wearData.railInc}</div>
            <div className="text-sm text-muted-foreground">RAIL-INC (°)</div>
            <div className="text-xs text-blue-300 mt-1">Normal</div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-orange-500/20 bg-orange-500/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-400">Rail Condition Assessment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on current wear measurements, this rail section shows significant vertical and angular wear.
                Maintenance recommended within 30 days.
              </p>
            </div>
            <Badge variant="outline" className="text-orange-400 bg-orange-500/10 border-orange-500/20">
              Moderate Risk
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
