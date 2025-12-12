import { Suspense } from "react"
import { RailProfileHeader } from "@/components/monitoring/rail-profile/rail-profile-header"
import { ProfileMetrics } from "@/components/monitoring/rail-profile/profile-metrics"
import { WearAnalysis } from "@/components/monitoring/rail-profile/wear-analysis"
import { ProfileVisualization } from "@/components/monitoring/rail-profile/profile-visualization"
import { DefectDetection } from "@/components/monitoring/rail-profile/defect-detection"
import { MaintenanceRecommendations } from "@/components/monitoring/rail-profile/maintenance-recommendations"

export default function RailProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <RailProfileHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Suspense fallback={<div>Loading metrics...</div>}>
          <ProfileMetrics />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<div>Loading wear analysis...</div>}>
            <WearAnalysis />
          </Suspense>

          <Suspense fallback={<div>Loading profile visualization...</div>}>
            <ProfileVisualization />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Suspense fallback={<div>Loading defect detection...</div>}>
            <DefectDetection />
          </Suspense>

          <Suspense fallback={<div>Loading maintenance recommendations...</div>}>
            <MaintenanceRecommendations />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
