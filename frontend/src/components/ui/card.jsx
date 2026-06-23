import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.memo(React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-[2rem] border border-slate-100 bg-white text-card-foreground shadow-sm transition-all duration-300", 
      className
    )} 
    {...props} 
  />
)))
Card.displayName = "Card"

const CardHeader = React.memo(React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-8", className)} {...props} />
)))
CardHeader.displayName = "CardHeader"

const CardTitle = React.memo(React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-black leading-none tracking-tight text-slate-900", className)} {...props} />
)))
CardTitle.displayName = "CardTitle"

const CardContent = React.memo(React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
)))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
