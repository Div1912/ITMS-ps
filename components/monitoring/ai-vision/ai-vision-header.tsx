import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Settings, Activity } from "lucide-react"

export function AIVisionHeader() {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              Condition Monitoring Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Railway infrastructure analytics and defect intelligence for critical maintenance operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              System Active
            </Badge>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span>Route: Main Line Section A</span>
          <span>•</span>
          <span>Detection Accuracy: 96.8%</span>
          <span>•</span>
          <span>Last Sync: 2 min ago</span>
          <span>•</span>
          <span>Track Health: 87%</span>
        </div>
      </div>
    </div>
  )
}
