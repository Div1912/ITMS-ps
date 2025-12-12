"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cpu, Wifi, Battery, Thermometer } from "lucide-react"

const GEOMETRY_URL = "https://pendant-adjacent-factory-load.trycloudflare.com/geometry"

export function SensorStatus() {
  const [sensors, setSensors] = useState([
    {
      id: "mpu6050-1",
      name: "MPU6050",
      type: "IMU - Acceleration & Gyro",
      status: "online",
      health: 98,
      temperature: 42,
      battery: 87,
      signal: 95,
    },
    {
      id: "vl53ldk-1",
      name: "VL53L0X",
      type: "Laser Distance Sensor",
      status: "online",
      health: 96,
      temperature: 38,
      battery: 92,
      signal: 88,
    },
    {
      id: "vl53ldk-2",
      name: "VL53L0X",
      type: "Laser Distance Sensor",
      status: "online",
      health: 99,
      temperature: 35,
      battery: 78,
      signal: 92,
    },
    {
      id: "encoder-1",
      name: "Rotary Encoder",
      type: "Position Tracking",
      status: "online",
      health: 99,
      temperature: 32,
      battery: 95,
      signal: 98,
    },
  ])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(GEOMETRY_URL, { cache: "no-store" })
        if (res.ok) {
          setSensors((prev) =>
            prev.map((s) => ({
              ...s,
              status: "online",
              health: Math.min(100, Math.max(95, s.health + (Math.random() * 2 - 1))),
              temperature: Math.max(30, s.temperature + (Math.random() * 2 - 1)),
            })),
          )
        } else {
          throw new Error("Offline")
        }
      } catch {
        // Sensors offline
        setSensors((prev) =>
          prev.map((s) => ({
            ...s,
            status: "warning",
            health: Math.max(0, s.health - 5),
          })),
        )
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const onlineSensors = sensors.filter((s) => s.status === "online").length
  const averageHealth = Math.round(sensors.reduce((acc, s) => acc + s.health, 0) / sensors.length)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          <div>
            <CardTitle className="text-lg">Sensor Status</CardTitle>
            <CardDescription>Track geometry sensor health</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-lg font-bold text-green-400">
              {onlineSensors}/{sensors.length}
            </div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-lg font-bold text-blue-400">{averageHealth}%</div>
            <div className="text-xs text-muted-foreground">Health</div>
          </div>
        </div>

        <div className="space-y-3">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="p-3 rounded-lg border border-border/50 bg-background/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm text-foreground">{sensor.name}</h4>
                  <p className="text-xs text-muted-foreground">{sensor.type}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    sensor.status === "online"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  }
                >
                  {sensor.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Health</span>
                  <span className="font-medium">{sensor.health.toFixed(0)}%</span>
                </div>
                <Progress value={sensor.health} className="h-1" />

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-orange-400" />
                    <span>{sensor.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-green-400" />
                    <span>{sensor.battery}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-blue-400" />
                    <span>{sensor.signal}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
