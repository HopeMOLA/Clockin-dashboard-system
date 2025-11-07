import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Since we're in a browser-based environment, we'll return an empty array
    // The actual data will be fetched client-side from localStorage
    return NextResponse.json({ employees: [] })
  } catch (error) {
    console.error("[v0] Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}
