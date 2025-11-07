import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, department, position, pin } = body

    // Validate required fields
    if (!name || !email || !department || !position || !pin) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate PIN format
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be exactly 4 digits" }, { status: 400 })
    }

    // Read existing employees
    const filePath = path.join(process.cwd(), "data", "employees.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    const employees = JSON.parse(fileData)

    // Check if email already exists
    const emailExists = employees.some((emp: any) => emp.email === email)
    if (emailExists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Generate new employee ID
    const lastId = employees.length > 0 ? employees[employees.length - 1].id : "EMP000"
    const idNumber = Number.parseInt(lastId.replace("EMP", "")) + 1
    const newEmployeeId = `EMP${idNumber.toString().padStart(3, "0")}`

    // Create new employee object
    const newEmployee = {
      id: newEmployeeId,
      name,
      email,
      department,
      position,
      pin,
      avatar: "/placeholder.svg?height=40&width=40",
    }

    // Add new employee
    employees.push(newEmployee)

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(employees, null, 2))

    return NextResponse.json({
      success: true,
      employeeId: newEmployeeId,
      message: "Employee registered successfully",
    })
  } catch (error) {
    console.error("[v0] Error registering employee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
