import { Link } from 'react-router-dom'
import { Zap, Plus } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TokenCounter() {
    const { user, isAuthenticated, refreshTokens } = useAuthStore()
    const tokens = user?.tokens ?? null
    const prevTokens = useRef(tokens)
    const isLow = tokens !== null && tokens <= 5
    const increased = prevTokens.current !== null && tokens !== null && tokens > prevTokens.current

    // Refresh live count on mount and after auth changes
    useEffect(() => {
        if (!isAuthenticated) return
        refreshTokens()
    }, [isAuthenticated])

    // Keep track of previous for animation
    useEffect(() => {
        prevTokens.current = tokens
    }, [tokens])

    if (!isAuthenticated || tokens === null) return null

    return (
        <Link
            to="/pricing"
            title="Acheter plus de tokens"
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all border select-none ${isLow
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 animate-pulse shadow-sm shadow-red-100'
                    : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 shadow-sm shadow-violet-100'
                }`}
        >
            <Zap className={`w-4 h-4 flex-shrink-0 ${isLow ? 'text-red-500' : 'text-violet-500'}`} fill="currentColor" />

            <AnimatePresence mode="wait">
                <motion.span
                    key={tokens}
                    initial={{ opacity: 0, y: increased ? -8 : 8, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: increased ? 8 : -8, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="tabular-nums font-black text-base"
                >
                    {tokens}
                </motion.span>
            </AnimatePresence>

            <Plus className="w-3 h-3 opacity-50 flex-shrink-0" />
        </Link>
    )
}
