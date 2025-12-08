"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MaintenancePlanning() {
  const maintenancePlans = [
    {
      segment: "KM 125.4 - 125.6",
      priority: 95,
      urgency: "critical-24h",
      issues: ["Missing Rail Clip", "Joint Gap"],
      estimatedCost: "$8,500",
      teams: "Team A, Team B",
      workOrderStatus: "pending",
    },
    {
      segment: "KM 127.0 - 127.5",
      priority: 88,
      urgency: "high-48h",
      issues: ["Cracked Sleeper", "Alignment Issue"],
      estimatedCost: "$12,000",
      teams: "Team A, Team D",
      workOrderStatus: "pending",
    },
    {
      segment: "KM 129.2 - 129.8",
      priority: 76,
      urgency: "medium-1w",
      issues: ["Ballast Degradation", "Rail Wear"],
      estimatedCost: "$15,500",
      teams: "Team B, Team C",
      workOrderStatus: "scheduled",
    },
    {
      segment: "KM 130.0 - 130.5",
      priority: 92,
      urgency: "critical-24h",
      issues: ["Surface Defect", "Corrugation"],
      estimatedCost: "$6,800",
      teams: "Team C",
      workOrderStatus: "pending",
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    if (urgency.includes("critical")) return "text-red-400 bg-red-500/10 border-red-500/20"
    if (urgency.includes("high")) return "text-orange-400 bg-orange-500/10 border-orange-500/20"
    return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
  }

  const getWorkOrderColor = (status: string) => {
    return status === "pending"
      ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
      : "text-green-400 bg-green-500/10 border-green-500/20"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-400" />
            Maintenance Planning & Work Orders
          </CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenancePlans.map((plan, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border bg-card/30">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground text-sm">{plan.segment}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Priority Score: {plan.priority}/100</p>
                </div>
                <Badge variant="outline" className={getUrgencyColor(plan.urgency)}>
                  {plan.urgency.replace("-", " ").toUpperCase()}
                </Badge>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Issues</p>
                  <div className="space-y-1">
                    {plan.issues.map((issue, i) => (
                      <Badge key={i} className="text-xs bg-purple-500/20 text-purple-400">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Est. Cost</p>
                  <p className="text-sm font-medium text-foreground">{plan.estimatedCost}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Assigned Teams</p>
                  <p className="text-sm text-foreground">{plan.teams}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Work Order</p>
                  <Badge variant="outline" className={getWorkOrderColor(plan.workOrderStatus)}>
                    {plan.workOrderStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {/* Summary statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {maintenancePlans.filter((p) => p.urgency.includes("critical")).length}
              </p>
              <p className="text-xs text-muted-foreground">Critical (24h)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {maintenancePlans.filter((p) => p.urgency.includes("high")).length}
              </p>
              <p className="text-xs text-muted-foreground">High (48h)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                $
                {maintenancePlans.reduce((sum, p) => sum + Number.parseInt(p.estimatedCost.replace(/\D/g, "")), 0) /
                  1000}
                K
              </p>
              <p className="text-xs text-muted-foreground">Total Est. Cost</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{maintenancePlans.length}</p>
              <p className="text-xs text-muted-foreground">Total Work Orders</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
