import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react'
import { useEffect } from 'react'

export default function Toast({ message, type = 'info', isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <Bell className="h-5 w-5 text-yellow-500" />
  }

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md min-w-[300px] max-w-md ${bgColors[type]}`}
        >
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground leading-tight">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-foreground/10 rounded-lg transition-colors text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
