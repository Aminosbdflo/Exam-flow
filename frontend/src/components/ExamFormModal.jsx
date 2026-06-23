import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Save, HelpCircle, List, Type, CheckCircle2, AlertCircle, Upload, FileJson, Info } from 'lucide-react'
import Toast from './ui/Toast'
import { Button } from './ui/button'
import api from '../store/useAuthStore'

export default function ExamFormModal({ isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    difficulty: 'Medium',
    category: 'General',
    isPublished: false,
    questions: [
      { type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: '' }
    ]
  })

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: '' }]
    })
  }

  const handleRemoveQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index)
    setFormData({ ...formData, questions: newQuestions })
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions]
    newQuestions[index][field] = value
    
    // Reset options/correctAnswer if type changes
    if (field === 'type') {
      if (value === 'tf') {
        newQuestions[index].options = ['True', 'False']
        newQuestions[index].correctAnswer = 'True'
      } else if (value === 'input') {
        newQuestions[index].options = []
        newQuestions[index].correctAnswer = ''
      } else {
        newQuestions[index].options = ['', '', '', '']
        newQuestions[index].correctAnswer = ''
      }
    }
    
    setFormData({ ...formData, questions: newQuestions })
  }

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].options[oIndex] = value
    setFormData({ ...formData, questions: newQuestions })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        
        // Basic validation of uploaded JSON
        if (!json.title || !Array.isArray(json.questions)) {
          throw new Error("Invalid JSON structure. Needs 'title' and 'questions' array.")
        }

        setFormData({
          ...formData,
          ...json,
          questions: json.questions.map(q => ({
            type: q.type || 'mcq',
            text: q.text || '',
            options: q.options || (q.type === 'tf' ? ['True', 'False'] : ['', '', '', '']),
            correctAnswer: q.correctAnswer || ''
          }))
        })
        
        setToast({ show: true, message: 'JSON data imported successfully!', type: 'success' })
      } catch (err) {
        setError("Failed to parse JSON: " + err.message)
        setToast({ show: true, message: 'Import failed: ' + err.message, type: 'error' })
      }
    }
    reader.readAsText(file)
    // Reset input
    e.target.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Basic Validation
    if (!formData.title.trim()) return setError('Exam title is required')
    
    const invalidQuestion = formData.questions.find((q, i) => !q.text.trim() || !q.correctAnswer.trim())
    if (invalidQuestion) {
      const index = formData.questions.indexOf(invalidQuestion)
      return setError(`Question ${index + 1} is incomplete or has no correct answer selected`)
    }

    setLoading(true)
    try {
      await api.post('/exams', formData)
      setToast({ show: true, message: 'Exam created successfully!', type: 'success' })
      setTimeout(() => {
        onRefresh()
        onClose()
      }, 1500)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        duration: 30,
        difficulty: 'Medium',
        category: 'General',
        isPublished: false,
        questions: [{ type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: '' }]
      })
    } catch (error) {
      console.error('Failed to create exam:', error)
      setError(error.response?.data?.message || 'Failed to create exam. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-white border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] rounded-[3rem] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FileJson className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none mb-2">Create Professional Assessment</h2>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Protocol Configuration Terminal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept=".json" 
                onChange={handleFileUpload} 
                ref={fileInputRef} 
                className="hidden" 
              />
              <Button 
                type="button" 
                variant="outline" 
                className="h-12 rounded-xl border-dashed border-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all font-black"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl h-12 w-12 hover:bg-rose-50 hover:text-rose-500">
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12">
            {/* General Settings */}
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Exam Nomenclature</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., QUANTUM_ALGORITHMS_v1"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-lg text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Assessment Objectives</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Define the primary learning outcomes and scope..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium min-h-[120px] text-slate-600 leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Temporal Limit (Min)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Complexity Tier</label>
                    <select 
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-black text-slate-900 appearance-none cursor-pointer"
                    >
                      <option value="Easy">Foundation (Easy)</option>
                      <option value="Medium">Standard (Medium)</option>
                      <option value="Hard">Advanced (Hard)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Taxonomy Category</label>
                  <input 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Cryptography, Neural Networks"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-900"
                  />
                </div>
                <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10 group cursor-pointer">
                  <input 
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                    className="w-6 h-6 rounded-lg text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <label htmlFor="isPublished" className="text-sm font-black text-primary uppercase tracking-widest cursor-pointer">Immediate Network Deployment</label>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-50" />

            {/* Questions Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Question Infrastructure</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Protocols: <span className="text-primary">{formData.questions.length}</span></p>
                </div>
                <Button type="button" onClick={handleAddQuestion} variant="outline" className="h-14 rounded-2xl font-black border-2 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                  <Plus className="h-5 w-5 mr-2" />
                  Append New Question
                </Button>
              </div>

              <div className="space-y-10">
                {formData.questions.map((q, qIndex) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={qIndex}
                    className="p-10 rounded-[3rem] bg-white border border-slate-100 relative group hover:border-primary/20 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                  >
                    <button 
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="absolute top-8 right-8 p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col lg:flex-row gap-10">
                      <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center font-black text-2xl text-white shadow-xl group-hover:bg-primary transition-colors">
                        {qIndex + 1}
                      </div>
                      
                      <div className="flex-1 space-y-8">
                        <div className="flex flex-col xl:flex-row gap-8">
                          <div className="flex-1 space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protocol Content</label>
                            <input 
                              required
                              value={q.text}
                              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                              placeholder="Describe the challenge vector..."
                              className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-100 focus:border-primary outline-none transition-all font-black text-2xl text-slate-900 placeholder:text-slate-200"
                            />
                          </div>
                          <div className="w-full xl:w-64 space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interaction Logic</label>
                            <div className="flex bg-slate-50 p-2 rounded-2xl gap-2 border border-slate-100 shadow-inner">
                              {[
                                { id: 'mcq', icon: List, label: 'MCQ' },
                                { id: 'tf', icon: CheckCircle2, label: 'T/F' },
                                { id: 'input', icon: Type, label: 'STR' }
                              ].map((type) => (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => handleQuestionChange(qIndex, 'type', type.id)}
                                  className={`flex-1 p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${q.type === type.id ? 'bg-white shadow-lg text-primary scale-105' : 'text-slate-300 hover:text-slate-600'}`}
                                >
                                  <type.icon className="h-4 w-4" />
                                  <span className="text-[8px] font-black">{type.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Question Options/Answers */}
                        <div className="space-y-6">
                          {q.type === 'mcq' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all border-2 ${q.correctAnswer === opt && opt !== '' ? 'bg-emerald-50 border-emerald-500/20' : 'bg-slate-50/50 border-transparent hover:bg-slate-50'}`}>
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${q.correctAnswer === opt && opt !== '' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                    {String.fromCharCode(65 + oIndex)}
                                  </div>
                                  <input 
                                    required
                                    value={opt}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    placeholder={`Option ${oIndex + 1}`}
                                    className="flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none"
                                  />
                                  <input 
                                    type="radio"
                                    required
                                    name={`correct-${qIndex}`}
                                    checked={q.correctAnswer === opt && opt !== ''}
                                    onChange={() => handleQuestionChange(qIndex, 'correctAnswer', opt)}
                                    className="w-6 h-6 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {q.type === 'tf' && (
                            <div className="flex gap-6">
                              {['True', 'False'].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleQuestionChange(qIndex, 'correctAnswer', val)}
                                  className={`flex-1 py-5 rounded-[2rem] font-black border-2 transition-all text-lg ${q.correctAnswer === val ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/5' : 'bg-slate-50/50 border-slate-100 text-slate-300 hover:border-slate-300 hover:text-slate-500'}`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          )}

                          {q.type === 'input' && (
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deterministic String Match</label>
                              <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group-focus-within:border-primary transition-all">
                                <Info className="h-6 w-6 text-slate-300" />
                                <input 
                                  required
                                  value={q.correctAnswer}
                                  onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                                  placeholder="Input the exact case-insensitive expected string..."
                                  className="flex-1 bg-transparent border-none focus:ring-0 outline-none transition-all font-black text-slate-900"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>}
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verification: All nodes must be validated before deployment.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onClose} className="h-16 px-10 rounded-2xl font-black text-slate-400 hover:text-slate-900">Abort</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="h-16 px-12 rounded-2xl font-black text-lg bg-slate-900 hover:bg-primary text-white shadow-2xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-3"
              >
                {loading ? 'Transmitting...' : <><Save className="h-6 w-6" /> Deploy Protocol</>}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      <Toast 
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </AnimatePresence>
  )
}
