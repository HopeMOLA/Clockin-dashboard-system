import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { EmployeeTable } from "@/components/employee-table"
import { AttendanceChart } from "@/components/attendance-chart"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EmployeeTable />
          </div>

          <div className="space-y-6">
            <AttendanceChart />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
