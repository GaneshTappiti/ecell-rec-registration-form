"use client"

import * as React from "react"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  content: string
  className?: string
  iconClassName?: string
}

export function InfoTooltip({ content, className, iconClassName }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex">
            <Info
              className={cn("w-3 h-3 text-muted-foreground hover:text-foreground cursor-help transition-colors", iconClassName)}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent className={cn("max-w-xs", className)}>
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
