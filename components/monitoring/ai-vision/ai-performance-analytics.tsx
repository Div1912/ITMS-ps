"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Brain, TrendingUp } from "lucide-react"

export function AIPerformanceAnalytics() {
  const accuracyTrend = [
    { period: "Mon", accuracy: 94.2, confidence: 92, falsePosRate: 2.1 },
    { period: "Tue", accuracy: 95.1, confidence: 93.5, falsePosRate: 1.8 },
    { period: "Wed", accuracy: 94.8, confidence: 92.8, falsePosRate: 2.2 },
    { period: "Thu", accuracy: 96.3, confidence: 94.2, falsePosRate: 1.5 },
    { period: "Fri", accuracy: 96.8, confidence: 95.1, falsePosRate: 1.2 },
    { period: "Sat", accuracy: 95.4, confidence: 93.9, falsePosRate: 1.8 },
  ]

  const confidenceMap = [
    { segment: "125-126", confidence: 94, coverage: "Full" },
    { segment: "126-127", confidence: 89, coverage: "Full" },
    { segment: "127-128", confidence: 97, coverage: "Full" },
    { segment: "128-129", confidence: 91, coverage: "Full" },
    { segment: "129-130", confidence: 95, coverage: "Full" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Accuracy Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            AI Accuracy Trend (Weekly)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="period" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[80, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6", r: 4 }}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Map by Segment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Confidence Map by Track Segment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {confidenceMap.map((segment, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{segment.segment}</span>
                  <span className="font-medium text-foreground">{segment.confidence}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                    style={{ width: `${segment.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* False Positive vs Negative */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Detection Reliability Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="period" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
                <Bar dataKey="confidence" fill="#10B981" name="Confidence Level %" />
                <Bar dataKey="falsePosRate" fill="#EF4444" name="False Positive Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
