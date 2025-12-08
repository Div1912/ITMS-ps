"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { BarChart3, Pause, RotateCcw } from "lucide-react"

export function AccelerationCharts() {
  const accelerationData = [
    { time: "00:00", vertical: 0.2, lateral: 0.1, longitudinal: 0.05 },
    { time: "00:05", vertical: 0.4, lateral: 0.15, longitudinal: 0.08 },
    { time: "00:10", vertical: 0.6, lateral: 0.25, longitudinal: 0.12 },
    { time: "00:15", vertical: 0.85, lateral: 0.42, longitudinal: 0.28 },
    { time: "00:20", vertical: 0.92, lateral: 0.38, longitudinal: 0.22 },
    { time: "00:25", vertical: 0.78, lateral: 0.35, longitudinal: 0.18 },
    { time: "00:30", vertical: 0.65, lateral: 0.28, longitudinal: 0.15 },
    { time: "00:35", vertical: 0.88, lateral: 0.45, longitudinal: 0.32 },
    { time: "00:40", vertical: 0.95, lateral: 0.48, longitudinal: 0.35 },
    { time: "00:45", vertical: 0.82, lateral: 0.41, longitudinal: 0.29 },
    { time: "00:50", vertical: 0.76, lateral: 0.36, longitudinal: 0.24 },
    { time: "00:55", vertical: 0.69, lateral: 0.32, longitudinal: 0.19 },
    { time: "01:00", vertical: 0.73, lateral: 0.34, longitudinal: 0.21 },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Real-time Acceleration
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select defaultValue="1min">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30s">30s</SelectItem>
                <SelectItem value="1min">1min</SelectItem>
                <SelectItem value="5min">5min</SelectItem>
                <SelectItem value="15min">15min</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Pause className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accelerationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value} m/s²`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: any, name: string) => [
                  `${value} m/s²`,
                  name === "vertical" ? "Vertical" : name === "lateral" ? "Lateral" : "Longitudinal",
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
            <div className="text-lg font-bold text-red-400">0.85 m/s²</div>
            <div className="text-sm text-muted-foreground">Current Vertical</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-blue-500/20 bg-blue-500/10">
            <div className="text-lg font-bold text-blue-400">0.42 m/s²</div>
            <div className="text-sm text-muted-foreground">Current Lateral</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-green-500/20 bg-green-500/10">
            <div className="text-lg font-bold text-green-400">0.28 m/s²</div>
            <div className="text-sm text-muted-foreground">Current Longitudinal</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
