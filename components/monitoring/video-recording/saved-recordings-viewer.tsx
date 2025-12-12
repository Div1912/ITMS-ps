"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Download, Trash2, Clock, HardDrive, RefreshCw, AlertCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Recording {
  id: string
  timestamp: string
  duration: number
  file_size: number
  resolution: string
  format: string
  video_url?: string
  created_at: string
}

export function SavedRecordingsViewer() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [needsMigration, setNeedsMigration] = useState(false)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchRecordings()

    const handleRecordingSaved = () => {
      console.log("[v0] New recording detected, refreshing list")
      fetchRecordings()
    }

    window.addEventListener("recording-saved", handleRecordingSaved)

    return () => {
      window.removeEventListener("recording-saved", handleRecordingSaved)
    }
  }, [])

  const fetchRecordings = async () => {
    setLoading(true)
    try {
      console.log("[v0] Fetching video recordings from database")
      const { data, error } = await supabase
        .from("video_recordings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        console.error("[v0] Error fetching recordings:", error)
        throw error
      }

      console.log("[v0] Found", data?.length || 0, "recordings")
      setRecordings(data || [])

      if (data && data.length > 0) {
        const hasRecordingsWithoutUrl = data.some((r) => !r.video_url)
        setNeedsMigration(hasRecordingsWithoutUrl)
      }
    } catch (err) {
      console.error("[v0] Failed to fetch recordings:", err)
      toast({
        title: "Error",
        description: "Failed to load recordings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteRecording = async (id: string) => {
    try {
      console.log("[v0] Deleting recording:", id)
      const { error } = await supabase.from("video_recordings").delete().eq("id", id)

      if (error) throw error

      setRecordings((prev) => prev.filter((r) => r.id !== id))
      console.log("[v0] Recording deleted successfully")
      toast({
        title: "Deleted",
        description: "Recording removed from archive",
      })
    } catch (err) {
      console.error("[v0] Delete failed:", err)
      toast({
        title: "Error",
        description: "Failed to delete recording",
        variant: "destructive",
      })
    }
  }

  const playVideo = (url: string) => {
    if (!url) {
      toast({
        title: "Error",
        description: "Video URL not available",
        variant: "destructive",
      })
      return
    }
    window.open(url, "_blank")
  }

  const downloadVideo = async (recording: Recording) => {
    if (!recording.video_url) {
      toast({
        title: "Error",
        description: "Video URL not available",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(recording.video_url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `railway-inspection-${recording.timestamp}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded",
        description: "Video saved to your device",
      })
    } catch (err) {
      console.error("[v0] Download failed:", err)
      toast({
        title: "Error",
        description: "Failed to download video",
        variant: "destructive",
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + " MB"
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">Loading recordings...</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-400" />
            Saved Recordings ({recordings.length})
          </CardTitle>
          <Button size="sm" variant="outline" onClick={fetchRecordings}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {needsMigration && (
          <div className="mb-4 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-400 mb-1">Database Migration Required</p>
                <p className="text-yellow-400/80 text-xs">
                  Run the SQL script{" "}
                  <code className="px-1 py-0.5 rounded bg-yellow-500/20">scripts/004_add_video_url_column.sql</code>{" "}
                  from the Scripts folder to enable video playback.
                </p>
              </div>
            </div>
          </div>
        )}

        {recordings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recordings saved yet</p>
            <p className="text-sm">Start recording to capture railway inspection footage</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recordings.map((recording) => (
              <div key={recording.id} className="p-4 rounded-lg border border-border/50 bg-background/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{formatTimestamp(recording.timestamp)}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Saved {new Date(recording.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {recording.resolution}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-green-400" />
                    <span>{formatDuration(recording.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-purple-400" />
                    <span>{formatFileSize(recording.file_size)}</span>
                  </div>
                  <div className="text-muted-foreground">{recording.format.toUpperCase()}</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                    onClick={() => recording.video_url && playVideo(recording.video_url)}
                    disabled={!recording.video_url}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    {recording.video_url ? "Play" : "No Video"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                    onClick={() => downloadVideo(recording)}
                    disabled={!recording.video_url}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    onClick={() => deleteRecording(recording.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
