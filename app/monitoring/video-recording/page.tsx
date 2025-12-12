import { Suspense } from "react"
import { VideoRecordingHeader } from "@/components/monitoring/video-recording/video-recording-header"
import { RecordingControls } from "@/components/monitoring/video-recording/recording-controls"
import { StorageManagement } from "@/components/monitoring/video-recording/storage-management"
import { RecordingScheduler } from "@/components/monitoring/video-recording/recording-scheduler"
import { VideoArchive } from "@/components/monitoring/video-recording/video-archive"
import { QualitySettings } from "@/components/monitoring/video-recording/quality-settings"

export default function VideoRecordingPage() {
  return (
    <div className="min-h-screen bg-background">
      <VideoRecordingHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Suspense fallback={<div>Loading recording controls...</div>}>
          <RecordingControls />
        </Suspense>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Suspense fallback={<div>Loading storage management...</div>}>
            <StorageManagement />
          </Suspense>

          <Suspense fallback={<div>Loading quality settings...</div>}>
            <QualitySettings />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<div>Loading recording scheduler...</div>}>
            <RecordingScheduler />
          </Suspense>

          <Suspense fallback={<div>Loading video archive...</div>}>
            <VideoArchive />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
