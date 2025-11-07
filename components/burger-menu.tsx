"use client"

import { useState } from "react"
import { Menu, X, Home, Clock, LogOut, BarChart3, UserPlus, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/clock-in", label: "Clock In", icon: Clock },
    { href: "/clock-out", label: "Clock Out", icon: LogOut },
    { href: "/register-employee", label: "Register Employee", icon: UserPlus },
    { href: "/employees", label: "All Employees", icon: Users },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Burger button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar menu */}
      <nav
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r z-40 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              TC
            </div>
            <div>
              <h2 className="font-semibold text-lg">TimeClockPro</h2>
              <p className="text-xs text-muted-foreground">Employee Portal</p>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex-1 py-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary border-r-2 border-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-6 border-t">
            <p className="text-xs text-muted-foreground text-center">v1.0.0 - Employee Clock System</p>
          </div>
        </div>
      </nav>
    </>
  )
}
