"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "" }
    
    let score = 0
    
    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" }
    if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" }
    return { score, label: "Strong", color: "bg-green-500" }
  }

  const strength = getPasswordStrength(password)
  
  if (!password) return null

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Password strength:</span>
        <span className={cn("text-xs font-medium", {
          "text-red-500": strength.label === "Weak",
          "text-yellow-500": strength.label === "Medium", 
          "text-green-500": strength.label === "Strong"
        })}>
          {strength.label}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              level <= strength.score ? strength.color : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}
