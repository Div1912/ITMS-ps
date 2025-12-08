export interface RailwayStation {
  id: string
  name: string
  latitude: number
  longitude: number
  km: number
  blockSectionStart: string
  blockSectionEnd: string
  division: string
  route: string
  state: string
  platformCount: number
}

export interface RailwayLandmark {
  id: string
  type: "LC_GATE" | "CURVE" | "BRIDGE" | "TUNNEL" | "LEVEL_CROSSING" | "GRADIENT" | "STATION"
  name: string
  latitude: number
  longitude: number
  km: number
  speedRestriction?: number
  radius?: number
  gradient?: number
}

// Indian Railway Stations Database - Coimbatore Region (South Western Railway / Southern Railway)
export const RAILWAY_STATIONS: RailwayStation[] = [
  {
    id: "CBE",
    name: "Coimbatore Junction",
    latitude: 11.0007,
    longitude: 76.9634,
    km: 0.0,
    blockSectionStart: "Coimbatore",
    blockSectionEnd: "Mettupalayam",
    division: "Salem Division",
    route: "Southern Railway",
    state: "Tamil Nadu",
    platformCount: 8,
  },
  {
    id: "MTP",
    name: "Mettupalayam",
    latitude: 11.3088,
    longitude: 76.5631,
    km: 46.2,
    blockSectionStart: "Mettupalayam",
    blockSectionEnd: "Coimbatore",
    division: "Salem Division",
    route: "Southern Railway",
    state: "Tamil Nadu",
    platformCount: 3,
  },
  {
    id: "UDM",
    name: "Udumalpet",
    latitude: 10.9453,
    longitude: 77.0453,
    km: 32.5,
    blockSectionStart: "Coimbatore",
    blockSectionEnd: "Udumalpet",
    division: "Salem Division",
    route: "Southern Railway",
    state: "Tamil Nadu",
    platformCount: 2,
  },
  {
    id: "POL",
    name: "Pollachi",
    latitude: 10.6564,
    longitude: 77.1428,
    km: 68.8,
    blockSectionStart: "Pollachi",
    blockSectionEnd: "Coimbatore",
    division: "Salem Division",
    route: "Southern Railway",
    state: "Tamil Nadu",
    platformCount: 3,
  },
  {
    id: "KNR",
    name: "Kannur",
    latitude: 11.5572,
    longitude: 76.3713,
    km: 55.0,
    blockSectionStart: "Kannur",
    blockSectionEnd: "Mettupalayam",
    division: "Salem Division",
    route: "Southern Railway",
    state: "Tamil Nadu",
    platformCount: 2,
  },
  {
    id: "SAL",
    name: "Salem Junction",
    latitude: 11.4631,
    longitude: 78.1451,
    km: 120.5,
    blockSectionStart: "Salem",
    blockSectionEnd: "Coimbatore",
    division: "Salem Division",
    route: "Southern Railway",
    state: "Tamil Nadu",
    platformCount: 6,
  },
]

export const RAILWAY_LANDMARKS: RailwayLandmark[] = [
  {
    id: "LC101",
    type: "LC_GATE",
    name: "LC Gate No. 101",
    latitude: 11.008,
    longitude: 76.965,
    km: 1.2,
    speedRestriction: 15,
  },
  {
    id: "CURVE_CBE",
    type: "CURVE",
    name: "Coimbatore Curve Section",
    latitude: 11.015,
    longitude: 76.955,
    km: 2.5,
    radius: 600,
    speedRestriction: 40,
  },
  {
    id: "BR201",
    type: "BRIDGE",
    name: "Noyyal River Bridge",
    latitude: 11.025,
    longitude: 76.945,
    km: 3.8,
    speedRestriction: 50,
  },
  {
    id: "TUN_CBE",
    type: "TUNNEL",
    name: "Coimbatore Tunnel Section 1",
    latitude: 11.08,
    longitude: 76.85,
    km: 12.5,
  },
  {
    id: "LC102",
    type: "LC_GATE",
    name: "LC Gate No. 102",
    latitude: 11.15,
    longitude: 76.78,
    km: 25.3,
    speedRestriction: 10,
  },
  {
    id: "BR202",
    type: "BRIDGE",
    name: "Mountain Bridge",
    latitude: 11.22,
    longitude: 76.72,
    km: 33.5,
    speedRestriction: 35,
  },
]

// Haversine formula to calculate distance between two GPS coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Find nearest railway station to current GPS coordinates
export function findNearestStation(
  latitude: number,
  longitude: number,
): { station: RailwayStation; distance: number } | null {
  if (RAILWAY_STATIONS.length === 0) return null

  let nearest = RAILWAY_STATIONS[0]
  let minDistance = calculateDistance(latitude, longitude, nearest.latitude, nearest.longitude)

  for (let i = 1; i < RAILWAY_STATIONS.length; i++) {
    const station = RAILWAY_STATIONS[i]
    const distance = calculateDistance(latitude, longitude, station.latitude, station.longitude)
    if (distance < minDistance) {
      minDistance = distance
      nearest = station
    }
  }

  return { station: nearest, distance: minDistance }
}

// Find upcoming landmarks within specified distance
export function findUpcomingLandmarks(latitude: number, longitude: number, maxDistance = 5000): RailwayLandmark[] {
  return RAILWAY_LANDMARKS.filter((landmark) => {
    const distance = calculateDistance(latitude, longitude, landmark.latitude, landmark.longitude)
    return distance <= maxDistance
  }).sort((a, b) => {
    const distA = calculateDistance(latitude, longitude, a.latitude, a.longitude)
    const distB = calculateDistance(latitude, longitude, b.latitude, b.longitude)
    return distA - distB
  })
}

// Estimate track KM from GPS coordinates (simplified)
export function estimateTrackKM(latitude: number, longitude: number): { km: number; chainage: number } {
  const nearestResult = findNearestStation(latitude, longitude)
  if (!nearestResult) {
    return { km: 0, chainage: 0 }
  }

  const station = nearestResult.station
  const distance = nearestResult.distance

  // Estimate direction (north/south primarily affects KM)
  const latDiff = latitude - station.latitude
  const kmOffset = latDiff * 111.0 // Rough conversion: 1 degree ~ 111 km

  return {
    km: station.km + kmOffset,
    chainage: distance,
  }
}
