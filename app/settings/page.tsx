"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings, User, Bell, Shield, Clock, Save } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    companyName: "TimeClockPro",
    adminEmail: "admin@timeclockpro.com",
    timezone: "America/New_York",
    workHoursStart: "09:00",
    workHoursEnd: "17:00",
    emailNotifications: true,
    lateAlerts: true,
    autoClockOut: false,
    requirePinAuth: true,
  })

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("app_settings", JSON.stringify(settings))
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container px-4 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings and preferences</p>
          </div>
        </div>

        <div className="grid gap-6 md:gap-8 max-w-4xl">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>General Settings</CardTitle>
              </div>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Work Hours */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Work Hours</CardTitle>
              </div>
              <CardDescription>Set default work hours for attendance tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workHoursStart">Start Time</Label>
                  <Input
                    id="workHoursStart"
                    type="time"
                    value={settings.workHoursStart}
                    onChange={(e) => setSettings({ ...settings, workHoursStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workHoursEnd">End Time</Label>
                  <Input
                    id="workHoursEnd"
                    type="time"
                    value={settings.workHoursEnd}
                    onChange={(e) => setSettings({ ...settings, workHoursEnd: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates for important events</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lateAlerts">Late Clock-In Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when employees clock in late</p>
                </div>
                <Switch
                  id="lateAlerts"
                  checked={settings.lateAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, lateAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requirePinAuth">Require PIN Authentication</Label>
                  <p className="text-sm text-muted-foreground">Employees must enter PIN to clock in/out</p>
                </div>
                <Switch
                  id="requirePinAuth"
                  checked={settings.requirePinAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, requirePinAuth: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoClockOut">Auto Clock-Out</Label>
                  <p className="text-sm text-muted-foreground">Automatically clock out employees at end of day</p>
                </div>
                <Switch
                  id="autoClockOut"
                  checked={settings.autoClockOut}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoClockOut: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" className="gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
