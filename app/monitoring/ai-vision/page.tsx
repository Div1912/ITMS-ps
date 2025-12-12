import { Suspense } from "react"
import { AIVisionHeader } from "@/components/monitoring/ai-vision/ai-vision-header"
import { ConditionMonitoringKpis } from "@/components/monitoring/ai-vision/condition-monitoring-kpis"
import { TrackStripView } from "@/components/monitoring/ai-vision/track-strip-view"
import { DefectIntelligencePanel } from "@/components/monitoring/ai-vision/defect-intelligence-panel"
import { MultiRunComparison } from "@/components/monitoring/ai-vision/multi-run-comparison"
import { SensorHealthDiagnostics } from "@/components/monitoring/ai-vision/sensor-health-diagnostics"
import { AIPerformanceAnalytics } from "@/components/monitoring/ai-vision/ai-performance-analytics"
import { MaintenancePlanning } from "@/components/monitoring/ai-vision/maintenance-planning"

export default function AIVisionPage() {
  return (
    <div className="min-h-screen bg-background">
      <AIVisionHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Suspense fallback={<div>Loading KPIs...</div>}>
          <ConditionMonitoringKpis />
        </Suspense>

        <Suspense fallback={<div>Loading track view...</div>}>
          <TrackStripView />
        </Suspense>

        <Suspense fallback={<div>Loading defect intelligence...</div>}>
          <DefectIntelligencePanel />
        </Suspense>

        <Suspense fallback={<div>Loading comparison data...</div>}>
          <MultiRunComparison />
        </Suspense>

        <Suspense fallback={<div>Loading sensor health...</div>}>
          <SensorHealthDiagnostics />
        </Suspense>

        <Suspense fallback={<div>Loading AI analytics...</div>}>
          <AIPerformanceAnalytics />
        </Suspense>

        <Suspense fallback={<div>Loading maintenance planning...</div>}>
          <MaintenancePlanning />
        </Suspense>
      </main>
    </div>
  )
}
