import { Suspense } from "react"
import { AIVisionHeader } from "@/components/monitoring/ai-vision/ai-vision-header"
import { ConditionMonitoringKpis } from "@/components/monitoring/ai-vision/condition-monitoring-kpis"
import { TrackStripView } from "@/components/monitoring/ai-vision/track-strip-view"
import { DefectIntelligencePanel } from "@/components/monitoring/ai-vision/defect-intelligence-panel"
import { MultiRunComparison } from "@/components/monitoring/ai-vision/multi-run-comparison"
import { SensorHealthDiagnostics } from "@/components/monitoring/ai-vision/sensor-health-diagnostics"
import { AIPerformanceAnalytics } from "@/components/monitoring/ai-vision/ai-performance-analytics"
import { MaintenancePlanning } from "@/components/monitoring/ai-vision/maintenance-planning"
import { LiveGpsTracking } from "@/components/monitoring/ai-vision/live-gps-tracking"
import { TrackProgressBar } from "@/components/monitoring/ai-vision/track-progress-bar"
import { GpsImuFusion } from "@/components/monitoring/ai-vision/gps-imu-fusion"
import { RailwayLocationSection } from "@/components/monitoring/ai-vision/railway-location-section"
import { LandmarkAwareness } from "@/components/monitoring/ai-vision/landmark-awareness"
import { SpeedRestrictionOverlay } from "@/components/monitoring/ai-vision/speed-restriction-overlay"
import { SectionProgressVisualization } from "@/components/monitoring/ai-vision/section-progress-visualization"

export default function AIVisionPage() {
  return (
    <div className="min-h-screen bg-background">
      <AIVisionHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Suspense fallback={<div>Loading KPIs...</div>}>
          <ConditionMonitoringKpis />
        </Suspense>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cyan-400 tracking-wide">📍 LIVE GPS & LOCATION MONITORING</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Suspense fallback={<div>Loading GPS...</div>}>
                <LiveGpsTracking />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<div>Loading location info...</div>}>
                <RailwayLocationSection />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-green-400 tracking-wide">🎯 NAVIGATION & AWARENESS</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Suspense fallback={<div>Loading fusion status...</div>}>
                <GpsImuFusion />
              </Suspense>
            </div>
            <div className="lg:col-span-1">
              <Suspense fallback={<div>Loading landmarks...</div>}>
                <LandmarkAwareness />
              </Suspense>
            </div>
            <div className="lg:col-span-1">
              <Suspense fallback={<div>Loading speed restrictions...</div>}>
                <SpeedRestrictionOverlay />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-indigo-400 tracking-wide">📊 SECTION PROGRESS & COVERAGE</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div>Loading progress...</div>}>
              <TrackProgressBar />
            </Suspense>
            <Suspense fallback={<div>Loading section progress...</div>}>
              <SectionProgressVisualization />
            </Suspense>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-orange-400 tracking-wide">🔍 DEFECT INTELLIGENCE & TRACK ANALYSIS</h2>
          <Suspense fallback={<div>Loading track view...</div>}>
            <TrackStripView />
          </Suspense>
          <Suspense fallback={<div>Loading defect intelligence...</div>}>
            <DefectIntelligencePanel />
          </Suspense>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-purple-400 tracking-wide">📈 AI ANALYTICS & PERFORMANCE</h2>
          <div className="grid grid-cols-1 gap-6">
            <Suspense fallback={<div>Loading comparison data...</div>}>
              <MultiRunComparison />
            </Suspense>
            <Suspense fallback={<div>Loading AI analytics...</div>}>
              <AIPerformanceAnalytics />
            </Suspense>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-blue-400 tracking-wide">🔧 SYSTEM HEALTH & MAINTENANCE</h2>
          <div className="grid grid-cols-1 gap-6">
            <Suspense fallback={<div>Loading sensor health...</div>}>
              <SensorHealthDiagnostics />
            </Suspense>
            <Suspense fallback={<div>Loading maintenance planning...</div>}>
              <MaintenancePlanning />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
