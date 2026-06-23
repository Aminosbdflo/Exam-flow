import { useAuthStore } from '../store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { User as UserIcon, Mail, ShieldCheck, Award, Target, BookOpen, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl animate-in fade-in duration-700">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          User Identity
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
          System Profile
        </h1>
        <p className="text-slate-500 text-lg font-medium">Manage your personal credentials and identity parameters.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden relative text-center">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5"></div>
            <CardContent className="pt-16 pb-8 px-8 relative z-10 flex flex-col items-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-3xl object-cover mb-6 border-4 border-white shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black mb-6 border-4 border-white shadow-lg">
                  {user.name?.charAt(0)}
                </div>
              )}
              <h2 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h2>
              <p className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2 justify-center">
                <ShieldCheck className="h-4 w-4" />
                {user.role === 'admin' ? 'Administrator' : 'Standard User'}
              </p>
              
              <div className="w-full bg-slate-50 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>Level</span>
                  <span className="text-primary">{user.level || 'Beginner'}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>Joined</span>
                  <span className="text-slate-900">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button onClick={() => navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user')} className="w-full h-14 rounded-2xl font-black bg-slate-900 hover:bg-slate-800 transition-all">
            Return to Dashboard
          </Button>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                <UserIcon className="h-6 w-6 text-primary" />
                Identity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <span className="font-bold text-slate-900">{user.email}</span>
                </div>
              </div>

              {user.googleId && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Connected via Google Workspace
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" />
                Academic Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Graduation Progress</p>
                <h3 className="text-3xl font-black text-slate-900">{user.graduationProgress || 0}%</h3>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                <BookOpen className="h-8 w-8 text-emerald-500 mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Assessments Taken</p>
                <h3 className="text-3xl font-black text-slate-900">{user.examHistory?.length || 0}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
