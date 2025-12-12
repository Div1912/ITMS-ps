import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Radio, Settings, Download } from "lucide-react"

export function FrequencyAnalysis() {
  const frequencyData = [
    { frequency: "0-5", amplitude: 2.1, category: "low" },
    { frequency: "5-10", amplitude: 3.8, category: "low" },
    { frequency: "10-15", amplitude: 5.2, category: "medium" },
    { frequency: "15-20", amplitude: 7.4, category: "medium" },
    { frequency: "20-25", amplitude: 9.1, category: "high" },
    { frequency: "25-30", amplitude: 6.8, category: "high" },
    { frequency: "30-35", amplitude: 4.3, category: "high" },
    { frequency: "35-40", amplitude: 2.9, category: "high" },
    { frequency: "40-45", amplitude: 1.8, category: "high" },
    { frequency: "45-50", amplitude: 1.2, category: "high" },
  ]

  const dominantFrequencies = [
    { range: "20-25 Hz", amplitude: "9.1 mm/s", source: "Wheel-Rail Interface" },
    { range: "15-20 Hz", amplitude: "7.4 mm/s", source: "Track Irregularities" },
    { range: "25-30 Hz", amplitude: "6.8 mm/s", source: "Bogie Dynamics" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Frequency Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              FFT Settings
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-48">
          <h4 className="text-sm font-medium text-foreground mb-3">Frequency Spectrum (Hz vs Amplitude)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="frequency" stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value} Hz`} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value} mm/s`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => `Frequency: ${value} Hz`}
                formatter={(value: any) => [`${value} mm/s`, "Amplitude"]}
              />
              <Bar dataKey="amplitude" fill="#06B6D4" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Dominant Frequencies</h4>
          {dominantFrequencies.map((freq, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/30"
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-cyan-400 bg-cyan-500/10 border-cyan-500/20">
                  {freq.range}
                </Badge>
                <span className="text-sm text-muted-foreground">{freq.source}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{freq.amplitude}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg border border-border bg-card/30">
            <div className="text-lg font-bold text-cyan-400">9.1</div>
            <div className="text-sm text-muted-foreground">Peak Amplitude</div>
            <div className="text-xs text-muted-foreground">mm/s</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-card/30">
            <div className="text-lg font-bold text-purple-400">22.5</div>
            <div className="text-sm text-muted-foreground">Dominant Freq</div>
            <div className="text-xs text-muted-foreground">Hz</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-card/30">
            <div className="text-lg font-bold text-orange-400">3.2</div>
            <div className="text-sm text-muted-foreground">RMS Level</div>
            <div className="text-xs text-muted-foreground">mm/s</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
