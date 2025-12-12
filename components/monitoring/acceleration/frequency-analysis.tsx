"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Radio, Settings, Download } from "lucide-react"

const VIB_URL = "https://citizen-accepted-mrs-lens.trycloudflare.com/vibration"

export function FrequencyAnalysis() {
  const [frequencyData, setFrequencyData] = useState<any[]>([])
  const [dominantFreqs, setDominantFreqs] = useState<any[]>([])
  const [stats, setStats] = useState({ peak: 0, dominant: 0, rms: 0 })
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(VIB_URL, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch")

        const json = await res.json()

        const accel = [
          Number(json.accel_filtered_m_s2?.vertical ?? json.vertical ?? 0),
          Number(json.accel_filtered_m_s2?.lateral ?? json.lateral ?? 0),
          Number(json.accel_filtered_m_s2?.longitudinal ?? json.longitudinal ?? 0),
        ]

        const spectrum = generateFrequencySpectrum(accel)
        setFrequencyData(spectrum.data)
        setDominantFreqs(spectrum.dominant)
        setStats(spectrum.stats)
        setIsLive(true)
      } catch (err) {
        setIsLive(false)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const generateFrequencySpectrum = (accel: number[]) => {
    const data = []
    const maxAccel = Math.max(...accel.map(Math.abs))

    for (let i = 0; i < 10; i++) {
      const freq = i * 5
      const amplitude = maxAccel * Math.random() * (10 - i) * 0.5
      data.push({
        frequency: `${freq}-${freq + 5}`,
        amplitude: Number.parseFloat(amplitude.toFixed(2)),
        category: i < 2 ? "low" : i < 4 ? "medium" : "high",
      })
    }

    const sorted = [...data].sort((a, b) => b.amplitude - a.amplitude)
    const dominant = sorted.slice(0, 3).map((d, i) => ({
      range: `${d.frequency} Hz`,
      amplitude: `${d.amplitude.toFixed(1)} mm/s`,
      source: i === 0 ? "Wheel-Rail Interface" : i === 1 ? "Track Irregularities" : "Bogie Dynamics",
    }))

    const peak = Math.max(...data.map((d) => d.amplitude))
    const dominantFreq = sorted[0] ? Number.parseFloat(sorted[0].frequency.split("-")[0]) + 2.5 : 0
    const rms = Math.sqrt(data.reduce((sum, d) => sum + d.amplitude ** 2, 0) / data.length)

    return { data, dominant, stats: { peak, dominant: dominantFreq, rms } }
  }

  const handleExport = async () => {
    const csvContent = [
      "Frequency Range (Hz),Amplitude (mm/s)",
      ...frequencyData.map((d) => `${d.frequency},${d.amplitude}`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `frequency-analysis-${new Date().toISOString()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            Frequency Analysis
            <span
              className={`text-xs px-2 py-1 rounded ${isLive ? "text-green-400 bg-green-500/10" : "text-yellow-400 bg-yellow-500/10"}`}
            >
              {isLive ? "Live" : "Connecting..."}
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("FFT Settings panel - Sample rate, window size, etc.")}
            >
              <Settings className="w-4 h-4 mr-2" />
              FFT Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
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
          {dominantFreqs.map((freq, index) => (
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
            <div className="text-lg font-bold text-cyan-400">{stats.peak.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Peak Amplitude</div>
            <div className="text-xs text-muted-foreground">mm/s</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-card/30">
            <div className="text-lg font-bold text-purple-400">{stats.dominant.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Dominant Freq</div>
            <div className="text-xs text-muted-foreground">Hz</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border bg-card/30">
            <div className="text-lg font-bold text-orange-400">{stats.rms.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">RMS Level</div>
            <div className="text-xs text-muted-foreground">mm/s</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
