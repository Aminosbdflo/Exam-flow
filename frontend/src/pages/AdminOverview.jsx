import { useState, useEffect } from 'react'
import api from '../store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Activity,
  Zap,
  ShieldAlert,
  Server,
  ChevronRight,
  Database,
  Search
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Toast from '../components/ui/Toast'

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/payments/admin/stats')
      setStats(res.data)
    } catch (error) {
      setToast({ show: true, message: 'Failed to load system stats', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']

  if (loading || !stats) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50/50">
      <div className="h-20 w-20 border-8 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
      <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Synchronizing Global Intelligence</p>
    </div>
  )

  return (
    <div className="container mx-auto px-8 py-12 max-w-7xl animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <Server className="h-3 w-3" />
            System Console v2.4.0
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">Admin <br className="hidden md:block" /> Dashboard</h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl italic leading-relaxed">Monitoring payments and overall platform statistics.</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <Link to="/" className="flex-1 md:flex-none">
            <Button variant="outline" className="h-14 md:h-16 w-full px-8 rounded-2xl font-black text-base md:text-lg border-2 hover:bg-slate-50">Public View</Button>
          </Link>
          <Link to="/dashboard/admin/exams" className="flex-1 md:flex-none">
            <Button className="h-14 md:h-16 w-full px-8 rounded-2xl font-black text-base md:text-lg bg-slate-900 hover:bg-primary transition-all shadow-2xl shadow-slate-200 group">
              Inventory
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* High-Impact Metric Cards */}
      <div className="grid gap-8 md:grid-cols-4 mb-16">
        {[
          { label: 'Utilisateurs', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Inscrits' },
          { label: 'Exams Passés', value: stats?.totalExamsPassed || 0, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Gloabaux' },
          { label: 'Revenu Total', value: `€${stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Ventes' },
          { label: 'Revenu Mensuel', value: `€${stats?.monthlyRevenue || 0}`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Ce mois-ci' },
          { label: 'Paiements', value: stats?.totalPayments || 0, icon: Server, color: 'text-slate-600', bg: 'bg-slate-50', sub: 'Total effectués' },
          { label: 'Tokens Vendus', value: stats?.tokensSold || 0, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Total' },
          { label: 'Utilisateurs Premium', value: stats?.premiumUsers || 0, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50', sub: '>20 tokens' },
          { label: 'Revenu Hebdo', value: `€${stats?.weeklyRevenue || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Cette semaine' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Analytics Chart */}
      <div className="grid gap-8 mb-16">
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="p-10 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              Revenus par Mois
            </CardTitle>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Évolution mensuelle des revenus Stripe</p>
          </CardHeader>
          <CardContent className="p-10">
            {stats?.chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stats.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
                  <Tooltip formatter={(value) => [`€${value}`, 'Revenu']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 700 }} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex flex-col items-center justify-center text-slate-300">
                <TrendingUp className="w-16 h-16 mb-4" />
                <p className="font-bold text-slate-400">Aucun paiement enregistré pour le moment</p>
                <p className="text-sm text-slate-300 mt-1">Les données apparaîtront après le premier achat</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* High-Density Data Tables */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* User Intel */}
        <Card className="border-none shadow-2xl shadow-slate-100 rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              User Manifest
            </CardTitle>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Node Joins</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {(stats?.recentUsers || []).map((u, i) => (
                <div key={i} className="flex items-center justify-between p-8 hover:bg-slate-50 transition-all duration-300 group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-lg group-hover:bg-primary transition-colors">
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 leading-none mb-1">{u.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Registered</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Result Intel */}
        <Card className="border-none shadow-2xl shadow-slate-100 rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              Submission Log
            </CardTitle>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Live Feed</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {(stats?.recentResults || []).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-8 hover:bg-slate-50 transition-all duration-300 group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Award className="h-7 w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-black text-slate-900 leading-none mb-1 truncate max-w-[200px]">{r.exam?.title || 'Unknown Exam'}</p>
                      <p className="text-xs text-slate-400 font-medium truncate max-w-[180px]">by {r.user?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-2xl font-black text-primary">{Math.round((r.score / r.totalQuestions) * 100)}%</span>
                      <ChevronRight className="h-4 w-4 text-slate-200" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vector Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-24 text-center py-10">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-200">ExamFlow Intelligence &bull; Secured System Access</p>
      </div>

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  )
}
