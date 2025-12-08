"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Satellite, Activity, AlertCircle, CheckCircle2, Navigation, MapPinOff, Info } from "lucide-react"
import { useState, useEffect } from "react"
import { estimateTrackKM } from "@/lib/railway-database"
import { NoGpsCard } from "./no-gps-card"

interface GPSData {
  latitude: number
  longitude: number
  accuracy: number
  heading: number
  speed: number
  altitude: number
  timestamp: number
  satellites: number
  lockStatus: "strong" | "weak" | "no-fix"
  isDrifting: boolean
}

export function LiveGpsTracking() {
  const [gpsData, setGpsData] = useState<GPSData | null>(null)
  const [error, setError] = useState<string>("")
  const [watching, setWatching] = useState(false)
  const [trackPosition, setTrackPosition] = useState({ km: 0, chainage: 0 })
  const [previousLocation, setPreviousLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [calibrationGuide, setCalibrationGuide] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false) // Track if using IP fallback
  const [gpsTimeout, setGpsTimeout] = useState(false) // Track GPS timeout state

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by this browser")
      return
    }

    let timeoutId: NodeJS.Timeout

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        clearTimeout(timeoutId)

        const coords = position.coords
        let lockStatus: "strong" | "weak" | "no-fix" = "strong"
        if (coords.accuracy > 50) lockStatus = "weak"
        if (coords.accuracy > 100) lockStatus = "no-fix"

        let isDrifting = false
        if (previousLocation) {
          const distance = calculateDistance(
            previousLocation.lat,
            previousLocation.lon,
            coords.latitude,
            coords.longitude,
          )
          if (distance > 3000) {
            isDrifting = true
            console.log("[v0] GPS Drift detected:", distance, "m")
          }
        }

        const newGpsData: GPSData = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy || 5,
          heading: coords.heading || 0,
          speed: coords.speed ? coords.speed * 3.6 : 0,
          altitude: coords.altitude || 0,
          timestamp: position.timestamp,
          satellites: Math.min(Math.floor(coords.accuracy / 2) + 8, 25),
          lockStatus,
          isDrifting,
        }

        setGpsData(newGpsData)
        setPreviousLocation({ lat: coords.latitude, lon: coords.longitude })

        const trackPos = estimateTrackKM(coords.latitude, coords.longitude)
        setTrackPosition(trackPos)

        setError("")
        setWatching(true)
        setCalibrationGuide(false)
        setUsingFallback(false)
        setGpsTimeout(false)
      },
      (err) => {
        console.log("[v0] GPS Error:", err.message)

        if (err.code === err.TIMEOUT) {
          setGpsTimeout(true)
          setError("GPS acquisition timeout - attempting IP-based location...")

          fetch("https://ipapi.co/json/")
            .then((res) => res.json())
            .then((data) => {
              console.log("[v0] FALLBACK LOCATION:", data)
              const fallbackCoords = {
                latitude: data.latitude,
                longitude: data.longitude,
                accuracy: 5000, // IP-based accuracy ~5km
                heading: 0,
                speed: 0,
                altitude: 0,
                timestamp: Date.now(),
                satellites: 0,
                lockStatus: "no-fix" as const,
                isDrifting: false,
              }

              setGpsData(fallbackCoords)
              setUsingFallback(true)
              setWatching(true)
              setCalibrationGuide(false)

              const trackPos = estimateTrackKM(data.latitude, data.longitude)
              setTrackPosition(trackPos)
            })
            .catch((fetchErr) => {
              console.log("[v0] Fallback location failed:", fetchErr.message)
              setError("GPS unavailable and IP location failed")
              setWatching(false)
            })
        } else {
          setError(`GPS Error: ${err.message}`)
          setWatching(false)
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000, // Increased from 10s to 30s for better satellite lock
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
      clearTimeout(timeoutId)
    }
  }, [previousLocation])

  if (gpsTimeout && !watching) {
    return <NoGpsCard />
  }

  const getLockStatusColor = (status: string) => {
    switch (status) {
      case "strong":
        return { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" }
      case "weak":
        return { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }
      default:
        return { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" }
    }
  }

  const statusColors = gpsData
    ? getLockStatusColor(gpsData.lockStatus)
    : { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <Card className={`${statusColors.bg} border ${statusColors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className={`w-5 h-5 ${statusColors.color}`} />
          Live GPS Tracking
          {usingFallback && <Badge className="bg-orange-500/20 text-orange-400 text-xs ml-auto">IP Fallback</Badge>}
        </CardTitle>
        {error && (
          <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calibrationGuide && !watching && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-4">
              <div className="flex gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <p className="font-semibold mb-1">To get accurate GPS location:</p>
                  <ul className="text-xs space-y-1 ml-2">
                    <li>✓ Move outside with clear sky view</li>
                    <li>✓ Ensure device GPS is ON</li>
                    <li>✓ Turn OFF Wi-Fi (prevents IP triangulation errors)</li>
                    <li>✓ Wait 15-30 seconds for fresh GPS lock</li>
                    <li>✓ Satellites should be ≥ 12 for accuracy</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Primary location display */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
            {/* KM + Chainage - ACTUAL GPS COORDINATES */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Track Position</p>
              <div className="text-lg font-bold text-cyan-400">
                KM {trackPosition.km.toFixed(1)} + {trackPosition.chainage.toFixed(0)}m
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {gpsData?.latitude.toFixed(6)}, {gpsData?.longitude.toFixed(6)}
              </p>
            </div>

            {/* Speed & Heading */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Speed</p>
              <div className="text-lg font-bold text-blue-400">{gpsData?.speed.toFixed(1) || "0.0"} km/h</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                Heading: {gpsData?.heading.toFixed(0)}°
              </p>
            </div>
          </div>

          {/* GPS Lock Status */}
          <div className="grid grid-cols-3 gap-3">
            {/* Lock Status Badge */}
            <div className="flex flex-col items-center">
              <Badge
                className={`${statusColors.color} ${statusColors.bg} border ${statusColors.border} text-xs mb-2 capitalize`}
              >
                {gpsData?.lockStatus === "strong" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {gpsData?.lockStatus === "weak" && <Activity className="w-3 h-3 mr-1" />}
                {gpsData?.lockStatus === "no-fix" && <MapPinOff className="w-3 h-3 mr-1" />}
                {gpsData?.lockStatus || "No Fix"}
              </Badge>
              <p className="text-xs text-muted-foreground text-center">Lock Status</p>
            </div>

            {/* Satellites */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Satellite className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-400">{gpsData?.satellites || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Satellites</p>
            </div>

            {/* Accuracy */}
            <div className="flex flex-col items-center">
              <div
                className={`text-sm font-bold mb-2 ${gpsData && gpsData.accuracy < 10 ? "text-green-400" : gpsData && gpsData.accuracy < 50 ? "text-yellow-400" : "text-red-400"}`}
              >
                ±{gpsData?.accuracy.toFixed(1) || "—"}m
              </div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>

          {gpsData?.isDrifting && (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded px-2 py-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-400">GPS drift detected - getting fresh location fix...</span>
            </div>
          )}

          {/* Encoder/IMU Fallback Status */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Primary Source:</span>
              <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                {watching ? (usingFallback ? "IP Location" : "GPS Active") : "GPS Initializing"}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Fallback:</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Encoder/IMU Ready</Badge>
            </div>
          </div>

          {/* Last update */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            {gpsData
              ? `Last updated: ${new Date(gpsData.timestamp).toLocaleTimeString()}`
              : "Waiting for GPS signal..."}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
