export function getLocationName(latitude: number, longitude: number): string {
  // Simple reverse geolocation approximation based on coordinates
  // In production, you'd use Google Maps API or similar for accurate names

  const lat = latitude
  const lon = longitude

  // Kerala boundaries approximation
  if (lat >= 8.3 && lat <= 12.5 && lon >= 74.8 && lon <= 77.5) {
    // More specific locations
    if (lat >= 9.9 && lat <= 10.2 && lon >= 76.2 && lon <= 76.4) {
      return "Ernakulam Junction Area, Kerala"
    }
    if (lat >= 10.7 && lat <= 10.9 && lon >= 76.6 && lon <= 76.8) {
      return "Palakkad Junction Area, Kerala"
    }
    if (lat >= 10.8 && lat <= 11.0 && lon >= 76.7 && lon <= 76.9) {
      return "Palakkad-Coimbatore Line, Kerala"
    }
    if (lat >= 11.1 && lat <= 11.3 && lon >= 75.3 && lon <= 75.6) {
      return "Kozhikode (Calicut) Area, Kerala"
    }
    if (lat >= 11.8 && lat <= 12.0 && lon >= 75.3 && lon <= 75.5) {
      return "Kannur Area, Kerala"
    }
    if (lat >= 12.4 && lat <= 12.6 && lon >= 74.9 && lon <= 75.1) {
      return "Kasaragod Area, Kerala"
    }
    if (lat >= 8.4 && lat <= 8.6 && lon >= 76.9 && lon <= 77.0) {
      return "Trivandrum Central Area, Kerala"
    }
    return "Central Kerala"
  }

  // Coimbatore region
  if (lat >= 10.9 && lat <= 11.1 && lon >= 76.9 && lon <= 77.0) {
    return "Coimbatore Junction Area, Tamil Nadu"
  }
  if (lat >= 10.6 && lat <= 11.1 && lon >= 76.5 && lon <= 77.5) {
    return "Coimbatore Region, Tamil Nadu"
  }

  // Generic fallback
  return `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`
}

// Calculate distance using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
