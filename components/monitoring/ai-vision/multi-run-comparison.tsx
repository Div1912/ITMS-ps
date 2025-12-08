"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp } from "lucide-react"

export function MultiRunComparison() {
  const defectTrendData = [
    { km: "125", run1: 2, run2: 3, run3: 4, run4: 3, run5: 5 },
    { km: "126", run1: 1, run2: 2, run3: 2, run4: 3, run5: 4 },
    { km: "127", run1: 3, run2: 4, run3: 5, run4: 6, run5: 7 },
    { km: "128", run1: 2, run2: 2, run3: 3, run4: 4, run5: 5 },
    { km: "129", run1: 1, run2: 2, run3: 2, run4: 3, run5: 4 },
    { km: "130", run1: 4, run2: 5, run3: 6, run4: 7, run5: 8 },
  ]

  const railWearData = [
    { section: "125-126", prev: 2.1, current: 2.4, trend: "increasing" },
    { section: "126-127", prev: 1.8, current: 1.9, trend: "stable" },
    { section: "127-128", prev: 3.2, current: 3.8, trend: "increasing" },
    { section: "128-129", prev: 1.5, current: 1.6, trend: "stable" },
    { section: "129-130", prev: 2.9, current: 3.5, trend: "increasing" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Defect Density per KM */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Defect Density Trends (5 Runs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defectTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="km" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
                <Legend />
                <Line type="monotone" dataKey="run1" stroke="#9CA3AF" name="Run 1" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="run2" stroke="#6B7280" name="Run 2" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="run3" stroke="#4B5563" name="Run 3" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="run4" stroke="#3B82F6" name="Run 4" />
                <Line type="monotone" dataKey="run5" stroke="#EF4444" strokeWidth={2} name="Run 5 (Current)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rail Wear Progression */}
      <Card>
        <CardHeader>
          <CardTitle>Rail Wear Growth Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={railWearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="section" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
                <Legend />
                <Bar dataKey="prev" fill="#6B7280" name="Previous Inspection" />
                <Bar dataKey="current" fill="#EF4444" name="Current Inspection" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
