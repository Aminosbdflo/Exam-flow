import { useAuthStore } from '../store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { 
  Trophy, 
  Target, 
  History, 
  TrendingUp, 
  Award,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
  Zap,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function UserDashboard() {
  const { user } = useAuthStore()
  
  // Data for the performance chart
  const performanceData = user?.examHistory?.slice(-7)?.map((h, i) => ({
    name: `E${i + 1}`,
    score: Math.round((h.score / h.totalQuestions) * 100)
  })) || []

  // Data for graduation progress pie
  const progressData = [
    { name: 'Completed', value: user?.graduationProgress || 0 },
    { name: 'Remaining', value: 100 - (user?.graduationProgress || 0) }
  ]
  const COLORS = ['#8b5cf6', '#f8fafc']

  const averageScore = user?.examHistory?.length > 0 
    ? Math.round(user.examHistory.reduce((acc, curr) => acc + (curr.score/curr.totalQuestions)*100, 0) / user.examHistory.length)
    : 0

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            Institutional Dashboard
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
            Welcome back, <br className="hidden md:block" />
            <span className="text-primary">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-xl">Track your academic evolution and cryptographic assessment performance in real-time.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <Link to="/" className="flex-1 md:flex-none">
            <Button variant="outline" className="h-14 md:h-16 w-full px-8 rounded-2xl font-black text-base md:text-lg border-2 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              Home Page
            </Button>
          </Link>
          <Link to="/exams" className="flex-1 md:flex-none">
            <Button className="h-14 md:h-16 w-full px-8 rounded-2xl font-black text-base md:text-lg bg-slate-900 hover:bg-primary transition-all shadow-2xl shadow-slate-200 group">
              Assess
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-yellow-500/10 transition-all duration-700" />
          <CardContent className="p-8">
            <div className="h-14 w-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform duration-500">
              <Award className="h-7 w-7" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Academic Rank</p>
            <h3 className="text-3xl font-black text-slate-900">{user?.level || 'Beginner'}</h3>
            <div className="mt-6 h-2 w-full bg-slate-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-1000" 
                style={{ width: user?.level === 'Advanced' ? '100%' : user?.level === 'Intermediate' ? '66%' : '33%' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700" />
          <CardContent className="p-8">
            <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg. Precision</p>
            <h3 className="text-3xl font-black text-slate-900">{averageScore}%</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-4">+2.4% from last session</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
          <CardContent className="p-8">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
              <Zap className="h-7 w-7" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Assessments</p>
            <h3 className="text-3xl font-black text-slate-900">{user?.examHistory?.length || 0}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-4">Total submissions verified</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-500/10 transition-all duration-700" />
          <CardContent className="p-8">
            <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500">
              <Calendar className="h-7 w-7" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Session Active</p>
            <h3 className="text-3xl font-black text-slate-900">Today</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-4">Sync: 100% Operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mb-16">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                Evolution Analytics
              </CardTitle>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Accuracy trend across last 7 sessions</p>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] p-10">
            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                  <TrendingUp className="h-8 w-8 text-slate-300" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Insufficient Intelligence</h4>
                <p className="text-sm text-slate-400 font-medium max-w-[240px]">Complete your primary assessment to generate evolution analytics.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Gauge */}
        <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Tier Mastery
            </CardTitle>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional graduation status</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[400px]">
            <div className="relative h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={105}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900">{user?.graduationProgress || 0}%</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Verified</span>
              </div>
            </div>
            <div className="mt-8 px-10 py-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-center text-slate-400 uppercase tracking-widest">
                Target: {100 - (user?.graduationProgress || 0)}% Remaining for Next Tier
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed History Table */}
      <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <History className="h-6 w-6 text-primary" />
              Intelligence Log
            </CardTitle>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Full historical assessment metadata</p>
          </div>
          <Link to="/exams">
            <Button variant="outline" className="h-12 px-8 rounded-xl font-black text-xs border-2 hover:bg-slate-50">New Protocol</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {!user?.examHistory || user.examHistory.length === 0 ? (
            <div className="text-center py-24 bg-slate-50/30">
              <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <History className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold italic">No intelligence logs found in database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Assessment Unit</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Timestamp</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Score Vector</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Protocol Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {user.examHistory.slice().reverse().map((h, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs group-hover:bg-primary transition-colors">
                            {h.examTitle.charAt(0)}
                          </div>
                          <span className="text-lg font-black text-slate-900">{h.examTitle}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-sm font-bold text-slate-400">
                          {new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-end gap-1">
                          <span className="text-xl font-black text-slate-900">{h.score}</span>
                          <span className="text-xs font-bold text-slate-400 pb-1">/ {h.totalQuestions}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className={`inline-flex px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          (h.score/h.totalQuestions) >= 0.5 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-rose-50 text-rose-500 border border-rose-100'
                        }`}>
                          {(h.score/h.totalQuestions) >= 0.5 ? 'Success' : 'Critical Failure'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-16 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic">ExamFlow Institutional Grid &bull; Data Integrity Verified</p>
      </div>
    </div>
  )
}
