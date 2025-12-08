import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Wifi, MapPin, Eye } from "lucide-react"

export function NoGpsCard() {
  return (
    <Card className="bg-red-500/10 border border-red-500/30">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-400 mb-2">GPS Not Available</h3>
              <p className="text-sm text-red-300 mb-4">
                The device could not acquire GPS signal. Using IP-based location fallback.
              </p>
            </div>
          </div>

          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-red-400 uppercase">To get accurate GPS:</p>
            <ul className="text-xs text-red-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                Move outside with clear sky view
              </li>
              <li className="flex items-center gap-2">
                <Eye className="w-3 h-3 flex-shrink-0" />
                Ensure no tall buildings nearby
              </li>
              <li className="flex items-center gap-2">
                <Wifi className="w-3 h-3 flex-shrink-0" />
                Turn OFF Wi-Fi (prevents IP triangulation errors)
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                Wait 15-30 seconds for fresh satellite lock
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-red-500/20">
            <p className="text-xs text-red-300">
              <strong>Current mode:</strong> IP-based location (accuracy ~5km). Satellite lock will improve accuracy to
              ±5-15m.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
