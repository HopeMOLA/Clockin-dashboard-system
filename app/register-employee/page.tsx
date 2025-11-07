"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BurgerMenu } from "@/components/burger-menu"
import { UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addEmployee } from "@/lib/storage"

export default function RegisterEmployeePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    pin: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Validate PIN format
      if (!/^\d{4}$/.test(formData.pin)) {
        setMessage({ type: "error", text: "PIN must be exactly 4 digits" })
        setLoading(false)
        return
      }

      // Add employee to localStorage
      const newEmployee = addEmployee(formData)

      setMessage({
        type: "success",
        text: `Employee registered successfully! Employee ID: ${newEmployee.id}`,
      })
      setFormData({ name: "", email: "", department: "", position: "", pin: "" })

      setTimeout(() => router.push("/"), 2000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to register employee"
      setMessage({ type: "error", text: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <BurgerMenu />
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Register Employee</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-2xl mx-auto p-4 md:p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">New Employee Registration</h2>
            <p className="text-muted-foreground">Fill in the details to register a new employee in the system.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.smith@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                name="department"
                type="text"
                placeholder="Engineering"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                name="position"
                type="text"
                placeholder="Senior Developer"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin">4-Digit PIN *</Label>
              <Input
                id="pin"
                name="pin"
                type="password"
                placeholder="Enter 4-digit PIN"
                value={formData.pin}
                onChange={handleChange}
                pattern="[0-9]{4}"
                maxLength={4}
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                This PIN will be used for clock-in and clock-out authentication
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Employee
                </>
              )}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  )
}
