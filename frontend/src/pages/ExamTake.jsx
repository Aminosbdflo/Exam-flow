import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { useAuthStore } from '../store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Timer, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Send } from 'lucide-react'
import Toast from '../components/ui/Toast'
import gsap from 'gsap'

export default function ExamTake() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshTokens } = useAuthStore()

  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  const questionRef = useRef(null)

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [exam.questions[currentQuestion]._id]: val })
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const formattedAnswers = exam.questions.map(q => ({
        questionId: q._id,
        providedAnswer: answers[q._id] || ""
      }))

      const res = await api.post(`/exams/${id}/submit`, { answers: formattedAnswers })
      setResult(res.data.result)
      if (res.data.user) {
        useAuthStore.getState().updateUser(res.data.user)
      }
      // Refresh token count in navbar (1 token was deducted on exam start)
      await refreshTokens()
      setToast({ show: true, message: 'Exam submitted successfully!', type: 'success' })
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to submit exam.',
        type: 'error'
      })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const startExam = async () => {
      try {
        const res = await api.post(`/exams/${id}/start`)
        if (res.data) {
          setExam(res.data)
          setTimeLeft(res.data.duration * 60)

          // Initial entrance animation
          gsap.from(".exam-header", { y: -50, opacity: 0, duration: 1, ease: "power3.out" })
          gsap.from(".question-card", { scale: 0.95, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" })
        } else {
          throw new Error('Exam data not found')
        }
      } catch (err) {
        const errData = err.response?.data
        if (errData?.action === 'REDIRECT_PRICING') {
          navigate('/pricing')
          return
        }
        setError(err.response?.data?.message || err.message || 'Failed to start exam')
      } finally {
        setLoading(false)
      }
    }
    startExam()
  }, [id])

  useEffect(() => {
    if (timeLeft > 0 && !result && exam) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timerId)
    } else if (timeLeft === 0 && exam && !result && !submitting) {
      handleSubmit()
    }
  }, [timeLeft, exam, result, submitting])

  // Question Transition Animation
  useEffect(() => {
    if (questionRef.current && !loading && !result) {
      gsap.fromTo(questionRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [currentQuestion, loading, result])

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Assessment Protocols</p>
    </div>
  )

  if (error) return (
    <div className="flex-1 flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-md w-full rounded-[2.5rem] shadow-2xl border-none p-10">
        <CardContent className="p-0 flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-8">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-900">Accès Refusé</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">{error}</p>
          <Button onClick={() => navigate('/pricing')} className="w-full h-16 rounded-2xl font-black text-lg bg-violet-600 hover:bg-violet-700 shadow-xl shadow-violet-200 transition-all mb-3">Acheter des Tokens</Button>
          <Button variant="ghost" onClick={() => navigate('/exams')} className="w-full h-12 rounded-2xl font-bold text-slate-500">Retour aux examens</Button>
        </CardContent>
      </Card>
    </div>
  )

  if (result) return (
    <div className="flex-1 flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-2xl w-full rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white">
        <div className="h-32 bg-primary/5 flex items-center justify-center">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <CardContent className="p-12 flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-full bg-slate-50 flex flex-col items-center justify-center mb-8 border-8 border-primary/5">
            <span className="text-5xl font-black text-slate-900">{Math.round((result.score / result.totalQuestions) * 100)}%</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Accuracy</span>
          </div>
          <h2 className="text-4xl font-black mb-4 text-slate-900">Assessment Concluded</h2>
          <p className="text-slate-500 font-medium mb-12 text-lg">
            Final score verified: <span className="text-slate-900 font-black">{result.score}</span> / <span className="text-slate-900 font-black">{result.totalQuestions}</span> correct protocols.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" onClick={() => navigate('/exams')} className="h-16 rounded-2xl font-black text-lg border-2 hover:bg-slate-50">Try Another</Button>
            <Button onClick={() => navigate('/dashboard')} className="h-16 rounded-2xl font-black text-lg bg-slate-900 hover:bg-primary shadow-xl shadow-slate-200 transition-all">Go to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (!exam) return null

  const q = exam.questions[currentQuestion]
  const isLastQuestion = currentQuestion === exam.questions.length - 1

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* Top Bar */}
      <header className="exam-header bg-white border-b border-slate-100 sticky top-0 z-20 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">
              {exam.title.charAt(0)}
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-900">{exam.title}</h1>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Question {currentQuestion + 1} of {exam.questions.length}
                </span>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-mono text-xl font-black shadow-sm ${timeLeft < 60 ? 'bg-rose-50 text-rose-500 border border-rose-100 animate-pulse' : 'bg-slate-50 text-slate-900 border border-slate-200'}`}>
            <Timer className={`w-6 h-6 ${timeLeft < 60 ? 'text-rose-500' : 'text-primary'}`} />
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl flex flex-col items-center">
        {exam.questions.length === 0 ? (
          <div className="text-center p-20 bg-white rounded-[3rem] shadow-xl border border-slate-100">
            <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <p className="text-slate-500 font-bold italic text-lg">System Error: No protocols found in this assessment.</p>
          </div>
        ) : (
          <div className="question-card w-full space-y-8">
            <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white min-h-[500px] flex flex-col">
              <div className="p-12 md:p-16 flex-1 flex flex-col" ref={questionRef}>
                <div className="flex items-center gap-4 mb-10">
                  <span className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black text-xs border border-primary/10">
                    {currentQuestion + 1}
                  </span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-12">
                  {q.text}
                </h2>

                <div className="flex-1 space-y-4">
                  {q.type === 'mcq' && (
                    <div className="grid gap-4">
                      {q.options.map((opt, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center p-6 border-2 rounded-[2rem] cursor-pointer transition-all duration-300 group ${answers[q._id] === opt ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                        >
                          <input
                            type="radio"
                            name={q._id}
                            value={opt}
                            checked={answers[q._id] === opt}
                            onChange={() => handleAnswer(opt)}
                            className="hidden"
                          />
                          <div className={`h-8 w-8 rounded-full border-2 mr-6 flex items-center justify-center transition-all ${answers[q._id] === opt ? 'border-primary bg-primary' : 'border-slate-200 group-hover:border-primary'}`}>
                            {answers[q._id] === opt && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                          </div>
                          <span className={`text-xl font-bold transition-colors ${answers[q._id] === opt ? 'text-slate-900' : 'text-slate-600'}`}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-6 mt-8">
                      {['True', 'False'].map(opt => (
                        <label
                          key={opt}
                          className={`flex flex-col items-center justify-center p-12 border-2 rounded-[3rem] cursor-pointer transition-all duration-500 group ${answers[q._id] === opt ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                          <input
                            type="radio"
                            name={q._id}
                            value={opt}
                            checked={answers[q._id] === opt}
                            onChange={() => handleAnswer(opt)}
                            className="hidden"
                          />
                          <div className={`h-12 w-12 rounded-full border-4 mb-4 flex items-center justify-center transition-all ${answers[q._id] === opt ? 'border-primary bg-primary scale-110' : 'border-slate-100'}`}>
                            {answers[q._id] === opt && <CheckCircle2 className="h-6 w-6 text-white" />}
                          </div>
                          <span className={`text-2xl font-black ${answers[q._id] === opt ? 'text-primary' : 'text-slate-300 group-hover:text-slate-500'}`}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="mt-8">
                      <textarea
                        rows={4}
                        placeholder="Type your cryptographic response here..."
                        className="w-full border-2 border-slate-100 rounded-[2.5rem] p-10 text-2xl font-bold focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 bg-slate-50/50 transition-all"
                        value={answers[q._id] || ''}
                        onChange={(e) => handleAnswer(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-10 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
                <Button
                  variant="ghost"
                  className="h-16 px-10 rounded-2xl font-black text-lg text-slate-400 hover:text-slate-900"
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-6 w-6 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-4">
                  {!isLastQuestion ? (
                    <Button
                      onClick={() => setCurrentQuestion(prev => prev + 1)}
                      className="h-16 px-12 rounded-2xl font-black text-lg bg-slate-900 hover:bg-primary shadow-xl shadow-slate-200 transition-all"
                    >
                      Next Intelligence
                      <ChevronRight className="h-6 w-6 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="h-16 px-12 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-100 transition-all flex items-center gap-3"
                    >
                      {submitting ? 'Encrypting...' : 'Final Submission'}
                      {!submitting && <Send className="h-6 w-6" />}
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Secure Environment Enabled &bull; AES-256 Encryption Active</p>
            </div>
          </div>
        )}
      </main>

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  )
}
