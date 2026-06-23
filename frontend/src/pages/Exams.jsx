import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import api from '../store/useAuthStore'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { BookOpen, Clock, ChevronRight, Search, ShieldCheck } from 'lucide-react'
import gsap from 'gsap'

export default function Exams() {
  const { user } = useAuthStore()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const navigate = useNavigate()
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams')
        setExams(res.data)
      } catch (error) {
        console.error('Failed to fetch exams', error)
      } finally {
        setLoading(false)
      }
    }
    fetchExams()
  }, [])

  useEffect(() => {
    if (!loading && exams.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".exam-card", {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".grid",
            start: "top 85%",
            once: true
          }
        })
        
        gsap.from(".page-header", {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          once: true
        })
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, exams])

  const categories = ['All', ...new Set(exams.map(e => e.category || 'General'))]

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDifficulty = selectedDifficulty === 'All' || (exam.difficulty || 'Medium') === selectedDifficulty
    const matchesCategory = selectedCategory === 'All' || (exam.category || 'General') === selectedCategory
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  if (loading) return (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
      <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Assembling Assessments</p>
    </div>
  )

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-16 max-w-7xl min-h-screen">
      <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            Academic Catalog
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">Expert <br className="hidden md:block" /> Assessments</h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl italic leading-relaxed">Precision-engineered examinations designed to validate expertise across high-demand technical domains.</p>
        </div>
        
        <div className="w-full md:w-96 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intelligence Database..." 
            className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all text-sm font-bold shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-8">
          <Card className="rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-xl overflow-hidden sticky top-32">
            <CardContent className="p-8 space-y-10">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                  Difficulty Level
                </h3>
                <div className="flex flex-col gap-2">
                  {['All', 'Easy', 'Medium', 'Hard'].map(level => {
                    const dotColors = {
                      'All': 'bg-slate-300',
                      'Easy': 'bg-emerald-400',
                      'Medium': 'bg-amber-400',
                      'Hard': 'bg-rose-400'
                    }
                    const isSelected = selectedDifficulty === level
                    return (
                      <button 
                        key={level} 
                        onClick={() => setSelectedDifficulty(level)}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                          isSelected 
                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]' 
                            : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : dotColors[level]}`} />
                        {level}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full" />
              
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                  Category
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => {
                    const isSelected = selectedCategory === cat
                    return (
                      <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                          isSelected 
                            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                            : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1">
          {filteredExams.length === 0 ? (
            <Card className="border-dashed border-2 bg-slate-50/50 py-32 text-center rounded-[3rem]">
              <CardContent>
                <div className="h-20 w-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No matching assessments</h3>
                <p className="text-slate-500 font-medium">Refine your filters and search the terminal again.</p>
                <Button 
                  onClick={() => { setSearchTerm(''); setSelectedDifficulty('All'); setSelectedCategory('All'); }} 
                  className="mt-6 rounded-xl font-bold bg-slate-900 hover:bg-slate-800"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredExams.map(exam => (
                <Card key={exam._id} className="exam-card group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 border-slate-100 hover:border-primary/30 overflow-hidden flex flex-col rounded-[3rem] bg-white">
                  <div className="h-48 bg-slate-50 p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
                    <BookOpen className="absolute -right-8 -bottom-8 h-40 w-40 text-slate-100 group-hover:text-primary/10 transition-all group-hover:scale-110 group-hover:-rotate-12 duration-700" />
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          exam.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                          exam.difficulty === 'Hard' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {exam.difficulty || 'Medium'}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                          {exam.category || 'General'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black leading-tight text-slate-900 group-hover:text-primary transition-colors pr-6 line-clamp-2">{exam.title}</h3>
                    </div>
                  </div>
                  
                  <CardContent className="p-10 flex-1 flex flex-col">
                    <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1 font-medium italic line-clamp-3">
                      {exam.description || "Comprehensive assessment covering core concepts and advanced practical applications."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex flex-col gap-1 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100/50">
                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">Duration</span>
                        <div className="flex items-center text-base font-black text-slate-900">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          {exam.duration}m
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100/50">
                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">Questions</span>
                        <div className="flex items-center text-base font-black text-slate-900">
                          <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                          {exam.questions?.length || 0}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full h-14 rounded-2xl font-black text-base group-hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.5)] shadow-none transition-all flex items-center justify-center gap-2 bg-slate-900 hover:bg-primary text-white border-none"
                      onClick={() => navigate(user ? `/exam/${exam._id}` : '/login')}
                    >
                      {!user ? "Login to Start" : "Begin Assessment"}
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-500" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
