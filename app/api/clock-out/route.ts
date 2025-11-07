import { NextResponse } from "next/server"
import employeesData from "@/data/employees.json"
import clockRecordsData from "@/data/clock-records.json"

export async function POST(request: Request) {
  try {
    const { employeeId, pin } = await request.json()

    // Validate employee
    const employee = employeesData.find((emp) => emp.id === employeeId && emp.pin === pin)

    if (!employee) {
      return NextResponse.json({ error: "Invalid employee ID or PIN" }, { status: 401 })
    }

    // Find active clock-in record
    const activeRecord = clockRecordsData.find((record: any) => record.employeeId === employeeId && !record.clockOut)

    if (!activeRecord) {
      return NextResponse.json({ error: "No active clock-in found. Please clock in first." }, { status: 400 })
    }

    // Calculate hours worked
    const clockOutTime = new Date()
    const clockInTime = new Date(activeRecord.clockIn)
    const hoursWorked = ((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)).toFixed(2)

    // Update record
    const updatedRecord = {
      ...activeRecord,
      clockOut: clockOutTime.toISOString(),
      hoursWorked: Number.parseFloat(hoursWorked),
    }

    // In a real app, this would update the database or file system
    console.log("[v0] Clock-out record updated:", updatedRecord)

    return NextResponse.json({
      success: true,
      employeeName: employee.name,
      clockOutTime: clockOutTime.toLocaleTimeString(),
      hoursWorked: `${hoursWorked} hours`,
    })
  } catch (error) {
    console.error("[v0] Clock-out error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
