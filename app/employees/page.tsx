"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, Briefcase, Hash } from "lucide-react"
import { getEmployees, type Employee } from "@/lib/storage"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])

  useEffect(() => {
    const loadEmployees = () => {
      const data = getEmployees()
      setEmployees(data)
      setFilteredEmployees(data)
    }
    loadEmployees()
  }, [])

  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEmployees(filtered)
  }, [searchTerm, employees])

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Engineering: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Marketing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Sales: "bg-green-500/10 text-green-500 border-green-500/20",
      HR: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      Finance: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      Operations: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    }
    return colors[department] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      {/* Main content */}
      <main className="container px-4 py-6 md:py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-3xl font-bold mt-2">{employees.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Departments</p>
                  <p className="text-3xl font-bold mt-2">{new Set(employees.map((e) => e.department)).size}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-3xl font-bold mt-2">{employees.filter((e) => e.status === "active").length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee List */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>View and search all registered employees</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, department, or position..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No employees found matching your search" : "No employees registered yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.employeeId}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-primary">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-base">{employee.name}</h3>
                          <Badge
                            variant="outline"
                            className={employee.status === "active" ? "bg-green-500/10 text-green-500" : ""}
                          >
                            {employee.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          <span>ID: {employee.employeeId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2 md:ml-auto">
                      <Badge variant="outline" className={getDepartmentColor(employee.department)}>
                        {employee.department}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      {employee.registeredAt && (
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(employee.registeredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
