"use client"

import { Suspense } from "react"
import { AccelerationHeader } from "@/components/monitoring/acceleration/acceleration-header"
import { VibrationMetrics } from "@/components/monitoring/acceleration/vibration-metrics"
import { AccelerationCharts } from "@/components/monitoring/acceleration/acceleration-charts"
import { FrequencyAnalysis } from "@/components/monitoring/acceleration/frequency-analysis"
import { RideQualityIndex } from "@/components/monitoring/acceleration/ride-quality-index"
import { VibrationAlerts } from "@/components/monitoring/acceleration/vibration-alerts"

export default function AccelerationPage() {
  return (
    <div className="min-h-screen bg-background">
      <AccelerationHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Suspense fallback={<div>Loading metrics...</div>}>
          <VibrationMetrics />
        </Suspense>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Suspense fallback={<div>Loading acceleration charts...</div>}>
            <AccelerationCharts />
          </Suspense>

          <Suspense fallback={<div>Loading frequency analysis...</div>}>
            <FrequencyAnalysis />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<div>Loading ride quality...</div>}>
            <RideQualityIndex />
          </Suspense>

          <Suspense fallback={<div>Loading vibration alerts...</div>}>
            <VibrationAlerts />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
