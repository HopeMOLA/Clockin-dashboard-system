"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { getEmployees, getTodayRecords } from "@/lib/storage"

type EmployeeStatus = {
  id: string
  name: string
  role: string
  clockIn: string
  clockOut: string | null
  status: "active" | "clocked-out"
  hours: string
  avatar: string
}

export function EmployeeTable() {
  const [employees, setEmployees] = useState<EmployeeStatus[]>([])

  useEffect(() => {
    const employeesData = getEmployees()
    const todayRecords = getTodayRecords()

    const employeeStatuses: EmployeeStatus[] = employeesData.map((emp) => {
      const record = todayRecords.find((r) => r.employeeId === emp.id && !r.clockOut)
      const completedRecord = todayRecords.find((r) => r.employeeId === emp.id && r.clockOut)

      if (record) {
        const clockInTime = new Date(record.clockIn)
        const now = new Date()
        const hoursWorked = (now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)

        return {
          id: emp.id,
          name: emp.name,
          role: emp.position,
          clockIn: clockInTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          clockOut: null,
          status: "active" as const,
          hours: `${hoursWorked.toFixed(1)}h`,
          avatar: emp.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
        }
      } else if (completedRecord) {
        return {
          id: emp.id,
          name: emp.name,
          role: emp.position,
          clockIn: new Date(completedRecord.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          clockOut: new Date(completedRecord.clockOut!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "clocked-out" as const,
          hours: `${completedRecord.hours?.toFixed(1) || 0}h`,
          avatar: emp.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
        }
      } else {
        return {
          id: emp.id,
          name: emp.name,
          role: emp.position,
          clockIn: "—",
          clockOut: "—",
          status: "clocked-out" as const,
          hours: "0h",
          avatar: emp.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
        }
      }
    })

    setEmployees(employeeStatuses)
  }, [])

  const getStatusColor = (status: EmployeeStatus["status"]) => {
    switch (status) {
      case "active":
        return "bg-accent/20 text-accent-foreground border-accent/50"
      case "clocked-out":
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusLabel = (status: EmployeeStatus["status"]) => {
    switch (status) {
      case "active":
        return "Working"
      case "clocked-out":
        return "Off Duty"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left font-medium py-3 px-2">Employee</th>
                <th className="text-left font-medium py-3 px-2 hidden sm:table-cell">Clock In</th>
                <th className="text-left font-medium py-3 px-2 hidden md:table-cell">Clock Out</th>
                <th className="text-left font-medium py-3 px-2">Status</th>
                <th className="text-left font-medium py-3 px-2 hidden lg:table-cell">Hours</th>
                <th className="text-right font-medium py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/generic-placeholder-icon.png" />
                        <AvatarFallback className="text-xs">{employee.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{employee.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 hidden sm:table-cell">
                    <span className="text-sm font-mono">{employee.clockIn}</span>
                  </td>
                  <td className="py-4 px-2 hidden md:table-cell">
                    <span className="text-sm font-mono">{employee.clockOut || "—"}</span>
                  </td>
                  <td className="py-4 px-2">
                    <Badge variant="outline" className={getStatusColor(employee.status)}>
                      {getStatusLabel(employee.status)}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 hidden lg:table-cell">
                    <span className="text-sm font-mono">{employee.hours}</span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
