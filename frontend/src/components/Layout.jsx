import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import AdminSidebar from './AdminSidebar'
import PillNav from './ui/PillNav'
import TokenCounter from './TokenCounter'
import { Globe, BookOpen, LayoutDashboard, Zap, User as UserIcon, ShieldCheck, Activity, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAdminRoute = location.pathname.startsWith('/dashboard/admin') && user?.role?.toLowerCase() === 'admin'
  const isUserDashboard = location.pathname.startsWith('/dashboard/user')
  const isDashboard = isAdminRoute || isUserDashboard
  const isLandingPage = location.pathname === '/'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Map our internal state to PillNav items
  const menuItems = isAuthenticated
    ? [
      { label: 'Portal', href: '/', icon: Globe },
      { label: 'Catalog', href: '/exams', icon: BookOpen },
      { label: user?.role === 'admin' ? 'Console' : 'Node', href: user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user', icon: LayoutDashboard },
      { label: 'Tokens', href: '/pricing', icon: Zap },
      { label: 'Profile', href: '/profile', icon: UserIcon },
      { label: 'Sign Out', href: '#logout', icon: Sparkles }
    ]
    : [
      { label: 'Catalog', href: '/exams', icon: BookOpen },
      { label: 'Pricing', href: '/pricing', icon: Zap },
      { label: 'Access', href: '/login', icon: UserIcon },
      { label: 'Join', href: '/register', icon: Sparkles }
    ]

  // Intercept the logout href
  const handlePillClick = (href) => {
    if (href === '#logout') {
      handleLogout()
    }
  }

  // Logo as a data URL for the PillNav
  const logoUrl = "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' rx='30' fill='%238B5CF6'/%3E%3Cpath d='M30 35C30 32.2386 32.2386 30 35 30H65C67.7614 30 70 32.2386 70 35V65C70 67.7614 67.7614 70 65 70H35C32.2386 70 30 67.7614 30 65V35Z' stroke='white' strokeWidth='6'/%3E%3Cpath d='M40 45H60' stroke='white' strokeWidth='6' strokeLinecap='round'/%3E%3Cpath d='M40 55H60' stroke='white' strokeWidth='6' strokeLinecap='round'/%3E%3C/svg%3E"

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-primary/10 selection:text-primary">
      {/* --- ELITE PILL NAV (Hidden on Dashboards) --- */}
      {!isDashboard && (
        <div className="fixed top-4 inset-x-0 z-50 flex items-center justify-center gap-3 px-4">
          <PillNav
            logo={logoUrl}
            logoAlt="ExamFlow Logo"
            items={menuItems}
            activeHref={location.pathname}
            onItemClick={handlePillClick}
            baseColor="#8B5CF6"
            dockColor="#ffffff"
            pillColor="#ffffff"
            pillTextColor="#8B5CF6"
            hoveredPillTextColor="#ffffff"
            className={scrolled ? 'scale-95 transition-all duration-700' : 'transition-all duration-700'}
          />
          {isAuthenticated && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <TokenCounter />
            </div>
          )}
        </div>
      )}

      <main className={`flex-1 flex flex-col ${isAdminRoute ? 'min-h-screen pt-0' : 'pt-32'}`}>
        {isAdminRoute ? (
          <div className="flex flex-1 bg-slate-50/30 items-start">
            <AdminSidebar />
            <div className="flex-1 scroll-smooth min-w-0">
              <Outlet />
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <Outlet />
          </div>
        )}
      </main>

      {!isAdminRoute && (
        <footer className="py-24 border-t border-slate-100 bg-white">
          <div className="container mx-auto px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">E</div>
                  <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">ExamFlow<span className="text-primary text-4xl">.</span></span>
                </div>
                <p className="text-sm font-medium text-slate-400 max-w-xs text-center md:text-left leading-relaxed">Engineering the world's most advanced digital examination protocols.</p>
              </div>
              <div className="flex flex-col items-center gap-8">
                <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <a href="#" className="hover:text-primary transition-colors">Infrastructure</a>
                  <a href="#" className="hover:text-primary transition-colors">Governance</a>
                  <a href="#" className="hover:text-primary transition-colors">Intelligence</a>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] text-center">
                  &copy; {new Date().getFullYear()} Elite Academic Foundation &bull; Global Operations Verified
                </p>
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all cursor-pointer"><ShieldCheck className="h-5 w-5" /></div>
                <div className="h-12 w-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all cursor-pointer"><Activity className="h-5 w-5" /></div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
