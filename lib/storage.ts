export interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  pin: string
  avatar: string
}

export interface ClockRecord {
  id: string
  employeeId: string
  employeeName: string
  clockIn: string
  clockOut: string | null
  date: string
  hours: number | null
}

const EMPLOYEES_KEY = "employees_data"
const CLOCK_RECORDS_KEY = "clock_records_data"

// Initialize default data
const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    position: "Senior Developer",
    pin: "1234",
    avatar: "/generic-placeholder-icon.png",
  },
  {
    id: "EMP002",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    pin: "2345",
    avatar: "/generic-placeholder-icon.png",
  },
  {
    id: "EMP003",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    department: "Sales",
    position: "Sales Representative",
    pin: "3456",
    avatar: "/generic-placeholder-icon.png",
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "HR",
    position: "HR Specialist",
    pin: "4567",
    avatar: "/generic-placeholder-icon.png",
  },
  {
    id: "EMP005",
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Engineering",
    position: "DevOps Engineer",
    pin: "5678",
    avatar: "/generic-placeholder-icon.png",
  },
]

const DEFAULT_CLOCK_RECORDS: ClockRecord[] = [
  {
    id: "REC001",
    employeeId: "EMP001",
    employeeName: "John Smith",
    clockIn: "2024-01-15T08:30:00",
    clockOut: "2024-01-15T17:00:00",
    date: "2024-01-15",
    hours: 8.5,
  },
  {
    id: "REC002",
    employeeId: "EMP002",
    employeeName: "Sarah Johnson",
    clockIn: "2024-01-15T09:00:00",
    clockOut: null,
    date: "2024-01-15",
    hours: null,
  },
]

// Employee operations
export function getEmployees(): Employee[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(EMPLOYEES_KEY)
  if (!data) {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(DEFAULT_EMPLOYEES))
    return DEFAULT_EMPLOYEES
  }
  return JSON.parse(data)
}

export function addEmployee(employee: Omit<Employee, "id" | "avatar">): Employee {
  const employees = getEmployees()

  // Check if email exists
  const emailExists = employees.some((emp) => emp.email === employee.email)
  if (emailExists) {
    throw new Error("Email already registered")
  }

  // Generate new ID
  const lastId = employees.length > 0 ? employees[employees.length - 1].id : "EMP000"
  const idNumber = Number.parseInt(lastId.replace("EMP", "")) + 1
  const newId = `EMP${idNumber.toString().padStart(3, "0")}`

  const newEmployee: Employee = {
    ...employee,
    id: newId,
    avatar: "/generic-placeholder-icon.png",
  }

  employees.push(newEmployee)
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
  return newEmployee
}

export function findEmployeeByEmailAndPin(email: string, pin: string): Employee | null {
  const employees = getEmployees()
  return employees.find((emp) => emp.email === email && emp.pin === pin) || null
}

// Clock records operations
export function getClockRecords(): ClockRecord[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(CLOCK_RECORDS_KEY)
  if (!data) {
    localStorage.setItem(CLOCK_RECORDS_KEY, JSON.stringify(DEFAULT_CLOCK_RECORDS))
    return DEFAULT_CLOCK_RECORDS
  }
  return JSON.parse(data)
}

export function addClockIn(employeeId: string, employeeName: string): ClockRecord {
  const records = getClockRecords()
  const today = new Date().toISOString().split("T")[0]

  // Check if already clocked in today
  const existingRecord = records.find(
    (record) => record.employeeId === employeeId && record.date === today && !record.clockOut,
  )

  if (existingRecord) {
    throw new Error("Already clocked in")
  }

  const newRecord: ClockRecord = {
    id: `REC${(records.length + 1).toString().padStart(3, "0")}`,
    employeeId,
    employeeName,
    clockIn: new Date().toISOString(),
    clockOut: null,
    date: today,
    hours: null,
  }

  records.push(newRecord)
  localStorage.setItem(CLOCK_RECORDS_KEY, JSON.stringify(records))
  return newRecord
}

export function addClockOut(employeeId: string): ClockRecord {
  const records = getClockRecords()
  const today = new Date().toISOString().split("T")[0]

  const record = records.find((r) => r.employeeId === employeeId && r.date === today && !r.clockOut)

  if (!record) {
    throw new Error("No active clock-in found")
  }

  const clockOutTime = new Date()
  const clockInTime = new Date(record.clockIn)
  const hours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)

  record.clockOut = clockOutTime.toISOString()
  record.hours = Math.round(hours * 100) / 100

  localStorage.setItem(CLOCK_RECORDS_KEY, JSON.stringify(records))
  return record
}

export function getTodayRecords(): ClockRecord[] {
  const records = getClockRecords()
  const today = new Date().toISOString().split("T")[0]
  return records.filter((record) => record.date === today)
}
