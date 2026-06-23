import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.memo(React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-12 px-6 py-2 rounded-xl",
    sm: "h-9 rounded-lg px-3 text-xs",
    lg: "h-14 rounded-2xl px-10 text-lg",
    icon: "h-12 w-12 rounded-xl",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-black tracking-tight ring-offset-background transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
}))
Button.displayName = "Button"

export { Button }
