import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Home,
  Database,
  Activity
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export default function AdminSidebar() {
  const location = useLocation()
  const { logout, user } = useAuthStore()

  const menuItems = [
    { name: 'Intelligence', icon: Activity, path: '/dashboard/admin' },
    { name: 'Exam Inventory', icon: Database, path: '/dashboard/admin/exams' },
    { name: 'User Manifest', icon: Users, path: '/dashboard/admin/users' },
    { name: 'Payments Ledger', icon: Settings, path: '/dashboard/admin/payments' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-80 flex-shrink-0 bg-slate-900 h-screen sticky top-0 hidden md:flex flex-col p-8 z-30 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-slate-600 transition-all">
      <div className="flex-1 flex flex-col space-y-10 mb-8">
        <div className="flex items-center gap-4 px-2">
          <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-white font-black text-xl tracking-tighter">Console</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-0.5">Admin Privileges</p>
          </div>
        </div>

        <nav className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 ml-4 mb-6">Core Protocols</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block"
            >
              <div
                className={`flex items-center justify-between px-6 py-5 rounded-[1.5rem] transition-all duration-500 group ${isActive(item.path)
                  ? 'bg-primary text-white shadow-2xl shadow-primary/40'
                  : 'text-slate-500 hover:bg-slate-800 hover:text-slate-100'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
                  <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
                </div>
                {isActive(item.path) && <ChevronRight className="h-4 w-4" />}
              </div>
            </Link>
          ))}
        </nav>

        <div className="pt-10 space-y-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 ml-4">Terminal Links</p>
          <div className="space-y-2">
            <Link to="/" className="flex items-center gap-4 px-6 py-4 text-xs font-black text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all uppercase tracking-widest">
              <Home className="h-4 w-4" />
              Public Portal
            </Link>
            <Link to="/exams" className="flex items-center gap-4 px-6 py-4 text-xs font-black text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all uppercase tracking-widest">
              <BookOpen className="h-4 w-4" />
              Academic View
            </Link>
            <Link to="/profile" className="flex items-center gap-4 px-6 py-4 text-xs font-black text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all uppercase tracking-widest">
              <Users className="h-4 w-4" />
              My Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-800/50 rounded-[2.5rem] mt-auto border border-slate-800 shadow-inner">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-white truncate">{user?.name}</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">Root Access</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-slate-900 border border-slate-700 hover:bg-rose-900/20 hover:text-rose-500 hover:border-rose-900/30 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          Terminate
        </button>
      </div>
    </aside>
  )
}
