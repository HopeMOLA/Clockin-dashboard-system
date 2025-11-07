"use client"

import type React from "react"
import { useState } from "react"
import { BurgerMenu } from "@/components/burger-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { findEmployeeByEmailAndPin, addClockIn } from "@/lib/storage"

export default function ClockInPage() {
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleClockIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const employee = findEmployeeByEmailAndPin(email, pin)

      if (!employee) {
        setMessage({ type: "error", text: "Invalid email or PIN" })
        setLoading(false)
        return
      }

      try {
        const record = addClockIn(employee.id, employee.name)
        const clockInTime = new Date(record.clockIn).toLocaleTimeString()

        setMessage({
          type: "success",
          text: `Welcome ${employee.name}! Clocked in at ${clockInTime}`,
        })
        setEmail("")
        setPin("")

        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Clock-in failed"
        setMessage({ type: "error", text: errorMessage })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
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
            <Clock className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Clock In</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-md mx-auto mt-8 md:mt-12">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Clock In</CardTitle>
              <CardDescription>Enter your email and PIN to clock in</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClockIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin">PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter your 4-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>

                {message && (
                  <div
                    className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                      message.type === "success"
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span>{message.text}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Processing..." : "Clock In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Current Time: {new Date().toLocaleTimeString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
