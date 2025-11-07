"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { getEmployees, getTodayRecords } from "@/lib/storage"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    clockedIn: 0,
    avgHours: "0.0h",
    lateCheckIns: 0,
  })

  useEffect(() => {
    const employees = getEmployees()
    const todayRecords = getTodayRecords()

    const totalEmployees = employees.length
    const clockedIn = todayRecords.filter((r) => !r.clockOut).length

    // Calculate average hours for completed records
    const completedRecords = todayRecords.filter((r) => r.hours !== null)
    const avgHours =
      completedRecords.length > 0
        ? (completedRecords.reduce((sum, r) => sum + (r.hours || 0), 0) / completedRecords.length).toFixed(1)
        : "0.0"

    // Count late check-ins (after 9:00 AM)
    const lateCheckIns = todayRecords.filter((r) => {
      const clockInTime = new Date(r.clockIn)
      const hours = clockInTime.getHours()
      const minutes = clockInTime.getMinutes()
      return hours > 9 || (hours === 9 && minutes > 0)
    }).length

    setStats({
      totalEmployees,
      clockedIn,
      avgHours: `${avgHours}h`,
      lateCheckIns,
    })
  }, [])

  const statsConfig = [
    {
      title: "Total Employees",
      value: stats.totalEmployees.toString(),
      change: "Registered",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Clocked In",
      value: stats.clockedIn.toString(),
      change: `${stats.totalEmployees > 0 ? Math.round((stats.clockedIn / stats.totalEmployees) * 100) : 0}% attendance`,
      icon: CheckCircle2,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Avg Hours Today",
      value: stats.avgHours,
      change: "Completed shifts",
      icon: Clock,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Late Check-ins",
      value: stats.lateCheckIns.toString(),
      change: "After 9:00 AM",
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
