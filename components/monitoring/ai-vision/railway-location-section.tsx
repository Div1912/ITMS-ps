"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, AlertTriangle, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { calculateDistance, type RailwayStation } from "@/lib/railway-database"
import { KERALA_STATIONS } from "@/lib/kerala-stations"
import { getLocationName } from "@/lib/geolocation-utils"

interface LocationData {
  nearestStation: RailwayStation | null
  distance: number
  nearbyStations: (RailwayStation & { distance: number })[]
  currentLatitude: number | null
  currentLongitude: number | null
  locationName: string
  currentSpeed: number
}

export function RailwayLocationSection() {
  const [locationData, setLocationData] = useState<LocationData>({
    nearestStation: null,
    distance: 0,
    nearbyStations: [],
    currentLatitude: null,
    currentLongitude: null,
    locationName: "Determining location...",
    currentSpeed: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords

        const locationName = getLocationName(latitude, longitude)

        const allStations = KERALA_STATIONS
        let nearest: (RailwayStation & { distance: number }) | null = null
        let minDistance = Number.POSITIVE_INFINITY

        const nearbyStations: (RailwayStation & { distance: number })[] = []

        allStations.forEach((station) => {
          const dist = calculateDistance(latitude, longitude, station.latitude, station.longitude)

          if (dist < minDistance) {
            minDistance = dist
            nearest = { ...station, distance: dist }
          }

          if (dist <= 10000) {
            nearbyStations.push({ ...station, distance: dist })
          }
        })

        nearbyStations.sort((a, b) => a.distance - b.distance)

        setLocationData({
          nearestStation: nearest,
          distance: minDistance,
          nearbyStations,
          currentLatitude: latitude,
          currentLongitude: longitude,
          locationName,
          currentSpeed: speed ? speed * 3.6 : 0, // Convert m/s to km/h
        })
        setLoading(false)
      },
      () => setLoading(false),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }, // Increased timeout to 30s
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Fetching location...</p>
        </CardContent>
      </Card>
    )
  }

  const station = locationData.nearestStation

  if (!station) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Unable to determine location</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-400" />📍 Location & Section Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Location Name and Speed */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Location</p>
                <h3 className="text-lg font-bold text-cyan-400">{locationData.locationName}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Current Speed</p>
                <p className="text-lg font-bold text-blue-400">{locationData.currentSpeed.toFixed(1)} km/h</p>
              </div>
            </div>
            <p className="text-xs text-cyan-300">
              {locationData.currentLatitude?.toFixed(6)}, {locationData.currentLongitude?.toFixed(6)}
            </p>
          </div>

          {/* Nearest Station Info */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nearest Railway Station</p>
                <h3 className="text-lg font-bold text-green-400">{station.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Distance</p>
                <p
                  className={`text-lg font-bold ${locationData.distance < 500 ? "text-orange-400" : "text-green-400"}`}
                >
                  {locationData.distance < 1000
                    ? `${locationData.distance.toFixed(0)}m`
                    : `${(locationData.distance / 1000).toFixed(2)} km`}
                </p>
              </div>
            </div>
            {locationData.distance < 500 && (
              <div className="flex items-center gap-2 text-xs bg-orange-500/20 border border-orange-500/30 rounded px-2 py-1 text-orange-400">
                <AlertTriangle className="w-3 h-3" />
                Approaching station - Reduce speed
              </div>
            )}
          </div>

          {/* Block Section Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase">Block Section</p>
              <p className="text-sm font-bold text-blue-400">
                {station.blockSectionStart} → {station.blockSectionEnd}
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase">Division</p>
              <p className="text-sm font-bold text-purple-400">{station.division}</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase">Route</p>
              <p className="text-sm font-bold text-cyan-400">{station.route}</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase">State</p>
              <p className="text-sm font-bold text-amber-400">{station.state}</p>
            </div>
          </div>

          {/* Nearby Stations List */}
          {locationData.nearbyStations.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Nearby Stations within 10 km
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {locationData.nearbyStations.map((stn) => (
                  <div key={stn.code} className="flex items-center justify-between text-xs p-2 bg-slate-500/10 rounded">
                    <div>
                      <p className="text-muted-foreground">{stn.name}</p>
                      <p className="text-xs text-slate-400">{stn.code}</p>
                    </div>
                    <Badge
                      className={`text-xs ${stn.distance < 1000 ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}`}
                    >
                      {stn.distance < 1000 ? `${stn.distance.toFixed(0)}m` : `${(stn.distance / 1000).toFixed(1)}km`}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section Summary */}
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Operating in: {station.blockSectionStart} → {station.blockSectionEnd} | {station.state}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              KM: {station.km} | Division: {station.division}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
