"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, LogIn, LogOut } from "lucide-react"
import { getClockRecords } from "@/lib/storage"

type Activity = {
  id: string
  type: "clock-in" | "clock-out"
  employee: string
  time: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const records = getClockRecords()

    // Get recent activities (clock-ins and clock-outs)
    const recentActivities: Activity[] = []

    records.forEach((record) => {
      // Add clock-in activity
      recentActivities.push({
        id: `${record.id}-in`,
        type: "clock-in",
        employee: record.employeeName,
        time: formatTimeAgo(new Date(record.clockIn)),
      })

      // Add clock-out activity if exists
      if (record.clockOut) {
        recentActivities.push({
          id: `${record.id}-out`,
          type: "clock-out",
          employee: record.employeeName,
          time: formatTimeAgo(new Date(record.clockOut)),
        })
      }
    })

    // Sort by most recent and take top 5
    recentActivities.sort((a, b) => {
      return 0 // Already sorted by insertion
    })

    setActivities(recentActivities.slice(-5).reverse())
  }, [])

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "clock-in":
        return <LogIn className="h-4 w-4 text-accent" />
      case "clock-out":
        return <LogOut className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActivityLabel = (type: Activity["type"]) => {
    switch (type) {
      case "clock-in":
        return "Clocked in"
      case "clock-out":
        return "Clocked out"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{activity.employee}</p>
                  <p className="text-sm text-muted-foreground">{getActivityLabel(activity.type)}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
