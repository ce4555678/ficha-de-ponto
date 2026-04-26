"use client"

import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

interface DialogElementProps {
  children: ReactNode
  className?: string
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-popover shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className }: DialogElementProps) {
  return (
    <div className={cn("border-b border-border px-6 py-4", className)}>
      {children}
    </div>
  )
}

export function DialogContent({ children, className }: DialogElementProps) {
  return <div className={cn("space-y-4 px-6 py-6", className)}>{children}</div>
}

export function DialogFooter({ children, className }: DialogElementProps) {
  return (
    <div className={cn("flex flex-col gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end", className)}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className }: DialogElementProps) {
  return <h2 className={cn("text-xl font-semibold leading-7", className)}>{children}</h2>
}

export function DialogDescription({ children, className }: DialogElementProps) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}
