"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { BarChart3, Pause, RotateCcw } from "lucide-react"

const generateSimulatedData = () => ({
  vertical: (Math.random() - 0.5) * 0.02,
  lateral: (Math.random() - 0.5) * 0.015,
  longitudinal: (Math.random() - 0.5) * 0.01,
})

export function AccelerationCharts() {
  const [data, setData] = useState<any[]>([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      const dataPoint = generateSimulatedData()

      const time = new Date().toLocaleTimeString("en-IN", {
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
      })

      const newPoint = { time, ...dataPoint }
      setData((prev) => [...prev.slice(-59), newPoint])
    }, 1000)

    return () => clearInterval(interval)
  }, [paused])

  const latest = data.length > 0 ? data[data.length - 1] : { vertical: 0, lateral: 0, longitudinal: 0 }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Real-time Acceleration
            <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Simulated</span>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Select defaultValue="1min">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1min">1min</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => setPaused(!paused)}>
              <Pause className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={() => setData([])}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `${v.toFixed(2)} m/s²`} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                formatter={(value: any, name: string) => [
                  `${value.toFixed(3)} m/s²`,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />

              <Legend />

              <Line type="monotone" dataKey="vertical" stroke="#EF4444" strokeWidth={2} dot={false} name="Vertical" />
              <Line type="monotone" dataKey="lateral" stroke="#3B82F6" strokeWidth={2} dot={false} name="Lateral" />
              <Line
                type="monotone"
                dataKey="longitudinal"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Longitudinal"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg border border-red-500/20 bg-red-500/10">
            <div className="text-lg font-bold text-red-400">{latest.vertical.toFixed(3)} m/s²</div>
            <div className="text-sm text-muted-foreground">Current Vertical</div>
          </div>

          <div className="text-center p-3 rounded-lg border border-blue-500/20 bg-blue-500/10">
            <div className="text-lg font-bold text-blue-400">{latest.lateral.toFixed(3)} m/s²</div>
            <div className="text-sm text-muted-foreground">Current Lateral</div>
          </div>

          <div className="text-center p-3 rounded-lg border border-green-500/20 bg-green-500/10">
            <div className="text-lg font-bold text-green-400">{latest.longitudinal.toFixed(3)} m/s²</div>
            <div className="text-sm text-muted-foreground">Current Longitudinal</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
