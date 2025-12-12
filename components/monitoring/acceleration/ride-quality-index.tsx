import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Gauge } from "lucide-react"

export function RideQualityIndex() {
  const rqiData = [
    { time: "00:00", rqi: 2.1, comfort: "excellent" },
    { time: "00:10", rqi: 2.3, comfort: "excellent" },
    { time: "00:20", rqi: 2.8, comfort: "good" },
    { time: "00:30", rqi: 3.2, comfort: "good" },
    { time: "00:40", rqi: 3.8, comfort: "acceptable" },
    { time: "00:50", rqi: 3.5, comfort: "good" },
    { time: "01:00", rqi: 2.9, comfort: "good" },
  ]

  const comfortLevels = [
    { level: "Excellent", range: "< 2.5", color: "text-green-400 bg-green-500/10 border-green-500/20", percentage: 25 },
    { level: "Good", range: "2.5 - 3.5", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", percentage: 45 },
    {
      level: "Acceptable",
      range: "3.5 - 4.0",
      color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      percentage: 20,
    },
    { level: "Poor", range: "> 4.0", color: "text-red-400 bg-red-500/10 border-red-500/20", percentage: 10 },
  ]

  const currentRQI = 2.8
  const getRQIStatus = (rqi: number) => {
    if (rqi < 2.5) return { status: "Excellent", color: "text-green-400" }
    if (rqi < 3.5) return { status: "Good", color: "text-blue-400" }
    if (rqi < 4.0) return { status: "Acceptable", color: "text-yellow-400" }
    return { status: "Poor", color: "text-red-400" }
  }

  const currentStatus = getRQIStatus(currentRQI)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-indigo-400" />
          Ride Quality Index
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-foreground">{currentRQI}</div>
          <Badge variant="outline" className={`${currentStatus.color} bg-opacity-10`}>
            {currentStatus.status}
          </Badge>
          <p className="text-sm text-muted-foreground">Current Ride Quality Index</p>
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rqiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: any) => [`${value}`, "RQI"]}
              />
              <Line
                type="monotone"
                dataKey="rqi"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Comfort Level Distribution</h4>
          {comfortLevels.map((level, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={level.color}>
                    {level.level}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{level.range}</span>
                </div>
                <span className="text-sm text-foreground">{level.percentage}%</span>
              </div>
              <Progress value={level.percentage} className="h-2" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg border border-border bg-card/30">
            <div className="text-lg font-bold text-green-400">2.1</div>
            <div className="text-sm text-muted-foreground">Best RQI</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-card/30">
            <div className="text-lg font-bold text-blue-400">3.0</div>
            <div className="text-sm text-muted-foreground">Average RQI</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-card/30">
            <div className="text-lg font-bold text-yellow-400">3.8</div>
            <div className="text-sm text-muted-foreground">Peak RQI</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
