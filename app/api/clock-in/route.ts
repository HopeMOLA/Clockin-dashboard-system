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

    // Check if already clocked in
    const existingRecord = clockRecordsData.find((record: any) => record.employeeId === employeeId && !record.clockOut)

    if (existingRecord) {
      return NextResponse.json({ error: "You are already clocked in" }, { status: 400 })
    }

    // Create clock-in record
    const clockInTime = new Date().toISOString()
    const newRecord = {
      id: `REC${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      clockIn: clockInTime,
      clockOut: null,
      date: new Date().toISOString().split("T")[0],
    }

    // In a real app, this would write to a database or file system
    // For demo purposes, we'll just return success
    console.log("[v0] New clock-in record:", newRecord)

    return NextResponse.json({
      success: true,
      employeeName: employee.name,
      clockInTime: new Date(clockInTime).toLocaleTimeString(),
    })
  } catch (error) {
    console.error("[v0] Clock-in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
