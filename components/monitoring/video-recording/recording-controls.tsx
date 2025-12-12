"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Square, Camera, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"

export function RecordingControls() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          facingMode: "environment", // Use back camera on mobile
        },
        audio: true,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      })

      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        setVideoBlob(blob)

        const timestamp = new Date().toISOString()
        console.log("[v0] Recording stopped, uploading to Vercel Blob...")

        try {
          const formData = new FormData()
          formData.append("video", blob, `railway-inspection-${timestamp}.webm`)

          const uploadResponse = await fetch("/api/video-upload", {
            method: "POST",
            body: formData,
          })

          if (!uploadResponse.ok) {
            throw new Error("Upload failed")
          }

          const uploadData = await uploadResponse.json()
          console.log("[v0] Video uploaded to Blob:", uploadData.url)

          const { data, error } = await supabase
            .from("video_recordings")
            .insert({
              timestamp,
              duration: recordingDuration,
              file_size: blob.size,
              resolution: "3840x2160",
              format: "webm",
              video_url: uploadData.url,
            })
            .select()

          if (error) {
            console.error("[v0] Failed to save recording metadata:", error)
            toast({
              title: "Save Failed",
              description: "Could not save recording metadata to database",
              variant: "destructive",
            })
          } else {
            console.log("[v0] Video recording saved successfully with URL:", data)
            toast({
              title: "Recording Saved",
              description: `Video uploaded and saved successfully`,
            })

            // Trigger refresh of saved recordings viewer
            window.dispatchEvent(new CustomEvent("recording-saved"))
          }
        } catch (err) {
          console.error("[v0] Error uploading/saving recording:", err)
          toast({
            title: "Upload Failed",
            description: "Could not upload video to cloud storage",
            variant: "destructive",
          })
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)

      // Track duration
      const startTime = Date.now()
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

      console.log("[v0] Recording started with 4K resolution")
      toast({
        title: "Recording Started",
        description: "4K video recording from phone camera",
      })
    } catch (err) {
      console.error("[v0] Camera access error:", err)
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to record",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
    }

    setIsRecording(false)

    console.log("[v0] Recording stopped, duration:", recordingDuration, "seconds")
    toast({
      title: "Recording Stopped",
      description: `Duration: ${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, "0")}`,
    })
  }

  const downloadRecording = () => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `railway-inspection-${new Date().toISOString()}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log("[v0] Recording downloaded")
      toast({
        title: "Downloaded",
        description: "Video saved to your device",
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-red-400" />
            Phone Camera Recording
          </CardTitle>
          {isRecording && (
            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 animate-pulse">
              REC {formatDuration(recordingDuration)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!isRecording && !videoBlob && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <Camera className="w-16 h-16" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button onClick={startRecording} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Start 4K Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}

          {videoBlob && (
            <Button onClick={downloadRecording} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-sm font-bold text-blue-400">3840x2160</div>
            <div className="text-xs text-muted-foreground">Resolution</div>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-sm font-bold text-green-400">{formatDuration(recordingDuration)}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="text-sm font-bold text-purple-400">
              {videoBlob ? (videoBlob.size / 1024 / 1024).toFixed(1) : "0"} MB
            </div>
            <div className="text-xs text-muted-foreground">Size</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
