import { TrackGeometryHeader } from "@/components/monitoring/track-geometry/track-geometry-header"
import { GeometryMetrics } from "@/components/monitoring/track-geometry/geometry-metrics"
import { DeviationCharts } from "@/components/monitoring/track-geometry/deviation-charts"
import { SensorStatus } from "@/components/monitoring/track-geometry/sensor-status"

export default function TrackGeometryPage() {
  return (
    <div className="min-h-screen bg-background">
      <TrackGeometryHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GeometryMetrics />
            <DeviationCharts />
          </div>
          <div className="space-y-6">
            <SensorStatus />
          </div>
        </div>
      </main>
    </div>
  )
}
