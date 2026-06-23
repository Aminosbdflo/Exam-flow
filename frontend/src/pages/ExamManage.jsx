import { useState, useEffect } from 'react'
import api from '../store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import ExamFormModal from '../components/ExamFormModal'
import { 
  Plus, 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  ArrowUpRight,
  Loader2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react'
import Toast from '../components/ui/Toast'

export default function ExamManage() {
  const [exams, setExams] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    examsTaken: 124, // Mock for now
    avgScore: 82 // Mock for now
  })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  useEffect(() => {
    fetchExams()
    fetchStats()
  }, [])

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams')
      setExams(res.data)
    } catch (error) {
      setToast({ show: true, message: 'Failed to fetch exams', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await api.get('/users/stats')
      setStats(prev => ({ ...prev, totalUsers: res.data.totalUsers }))
    } catch (error) {
      console.error('Failed to fetch stats')
    }
  }

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await api.put(`/exams/${id}`, { isPublished: !currentStatus })
      setToast({ show: true, message: `Exam ${!currentStatus ? 'published' : 'moved to drafts'}`, type: 'success' })
      fetchExams()
    } catch (error) {
      setToast({ show: true, message: 'Failed to update exam status', type: 'error' })
    }
  }

  const handleDeleteExam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam? All associated results will be lost.')) return
    try {
      await api.delete(`/exams/${id}`)
      setToast({ show: true, message: 'Exam deleted successfully', type: 'success' })
      fetchExams()
    } catch (error) {
      setToast({ show: true, message: 'Failed to delete exam', type: 'error' })
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-muted-foreground font-bold animate-pulse">Synchronizing platform data...</p>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Exam Inventory</h1>
          <p className="text-muted-foreground">Monitor platform-wide assessment status and performance.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-xl font-bold px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      <ExamFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchExams}
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4 mb-10">
        {[
          { label: 'Total Exams', value: exams.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-500/10' },
          { label: 'Exams Taken', value: stats.examsTaken, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-500/10' },
          { label: 'Avg Score', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-primary/5 shadow-sm overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg inline-block mb-4`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table */}
      <Card className="border-primary/5 shadow-sm overflow-hidden rounded-3xl mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-primary/5">
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Exam Name</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Questions</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {exams.map((exam) => (
                <tr key={exam._id} className="hover:bg-muted/20 transition-colors group">
                  <td className="p-5">
                    <p className="font-bold text-sm">{exam.title}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{exam.difficulty}</p>
                  </td>
                  <td className="p-5">
                    <button 
                      onClick={() => handleTogglePublish(exam._id, exam.isPublished)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${exam.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                    >
                      {exam.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-5 text-xs font-bold text-muted-foreground">{exam.category || 'General'}</td>
                  <td className="p-5 text-xs font-black">{exam.questions?.length || 0}</td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl hover:text-primary hover:bg-primary/5"
                        onClick={() => setToast({ show: true, message: 'Edit feature coming soon!', type: 'info' })}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteExam(exam._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Toast 
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  )
}
