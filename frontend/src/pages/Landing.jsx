import { useAuthStore } from '../store/useAuthStore'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, Zap, Shield, BarChart3, GraduationCap, ArrowRight, MousePointer2, Sparkles, FileCheck, Users2, LayoutDashboard } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import examSheetImage from '../assets/nguyen-dang-hoang-nhu-qDgTQOYk6B8-unsplash.jpg'
import studyDeskImage from '../assets/nick-morrison-FHnnjk1Yj7Y-unsplash.jpg'
import onlineStudyImage from '../assets/wes-hicks-4-EeTnaC1S4-unsplash.jpg'

gsap.registerPlugin(ScrollTrigger)

// Custom SplitText effect for titles
const splitText = (text) => {
  return text.split('').map((char, i) => (
    <span key={i} className="char inline-block whitespace-pre">
      {char}
    </span>
  ))
}

export default function Landing() {
  const { isAuthenticated } = useAuthStore()
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const whyRef = useRef(null)
  const illustrationsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animations
      const tl = gsap.timeline()
      
      tl.from(".hero-badge", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out"
      })
      .from(".char", {
        y: 100,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.5")
      .from(".hero-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3")
      .from(".hero-btns", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
      .from(".spline-container", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=1")

      // Parallax for Spline HUDs
      gsap.to(".hud-1", {
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        }
      })
      gsap.to(".hud-2", {
        y: -150,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2
        }
      })

      // Features Reveal
      gsap.utils.toArray(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true
          }
        })
      })

      // Stats Stagger
      gsap.from(".stat-item", {
        scale: 0.5,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
          once: true
        }
      })

      // Illustration sections reveal
      gsap.utils.toArray(".illustration-section").forEach((section, i) => {
        gsap.from(section, {
          x: i % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true
          }
        })
      })

      // Why ExamFlow Section Reveal
      gsap.from(".why-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: whyRef.current,
          start: "top 75%",
          once: true
        }
      })
      gsap.utils.toArray(".why-card").forEach((card, i) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true
          }
        })
      })

    })

    return () => ctx.revert() // Cleanup GSAP on unmount
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section ref={heroRef} className="relative px-4 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center text-center overflow-hidden bg-slate-50/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-gradient-to-b from-primary/10 via-violet-500/5 to-transparent rounded-full blur-[140px] -z-10" />
        
        <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-10 shadow-[0_10px_30px_-5px_rgba(139,92,246,0.15)]">
          <Sparkles className="h-4 w-4 fill-current animate-pulse" />
          The New Standard in Academic Intelligence
        </div>

        <h1 ref={titleRef} className="text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter w-full max-w-7xl mb-8 md:mb-12 leading-[1.1] text-slate-900 overflow-visible py-4 flex flex-col items-center">
          <div className="block mb-2 md:mb-4 text-center">{splitText("Unleash Your")}</div>
          <span className="relative inline-block text-violet-600 bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 pb-4 overflow-visible text-center">
            {splitText("True Potential")}
          </span>
        </h1>

        <p className="hero-text text-lg sm:text-xl md:text-3xl text-slate-500 max-w-4xl mb-12 md:mb-16 leading-relaxed font-medium px-4">
          A high-performance, 3D-accelerated examination platform <br className="hidden md:block" /> engineered for the next generation of academic leaders.
        </p>

        <div className="hero-btns flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center mb-24 relative z-20 w-full px-6">
          <Link to={isAuthenticated ? "/dashboard/user" : "/register"} className="w-full sm:w-auto flex justify-center">
            <Button size="lg" className="h-20 w-full sm:w-auto px-16 rounded-[2rem] text-xl font-black shadow-[0_20px_50px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_25px_60px_-10px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95 transition-all bg-gradient-to-r from-primary to-violet-600 border-none text-white">
              {isAuthenticated ? "Enter Dashboard" : "Launch Platform"}
              {isAuthenticated ? <LayoutDashboard className="h-6 w-6 ml-3" /> : <ArrowRight className="h-6 w-6 ml-3 stroke-[3px]" />}
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto flex justify-center">
            <Button size="lg" variant="ghost" className="h-20 w-full sm:w-auto px-16 rounded-[2rem] text-xl font-bold text-slate-600 hover:text-primary hover:bg-white transition-all border border-slate-200 bg-white/50 backdrop-blur-md shadow-sm">
              Explore Specs
              <MousePointer2 className="h-5 w-5 ml-3" />
            </Button>
          </a>
        </div>

        {/* --- SPLINE 3D SCENE --- */}
        <div className="spline-container relative w-full max-w-7xl mx-auto h-[400px] md:h-[800px] z-10">
          <div className="w-full h-full relative rounded-[4rem] overflow-hidden">
            <spline-viewer
              url="https://prod.spline.design/u22lFSFej3-0N1me/scene.splinecode"
              loading-anim-type="none"
              style={{ width: '100%', height: '100%', display: 'block', backgroundColor: 'transparent' }}
              className="scale-100 md:scale-125"
            />
          </div>

          {/* Floating GlassHUD Elements */}
          <div className="hud-1 absolute top-[10%] left-[2%] md:left-[5%] p-8 bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-white/40 z-20 flex items-center gap-6 hidden md:flex hover:scale-105 transition-transform cursor-default group">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <FileCheck className="h-8 w-8 stroke-[2.5px]" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Algorithmic</div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">Auto-Grading</div>
            </div>
          </div>

          <div className="hud-2 absolute bottom-[20%] right-[2%] md:right-[5%] p-8 bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-white/40 z-20 flex items-center gap-6 hidden md:flex hover:scale-105 transition-transform cursor-default group">
            <div className="h-16 w-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 shadow-inner border border-violet-500/5 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
              <Users2 className="h-8 w-8 stroke-[2.5px]" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600/60 mb-1">Encrypted</div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">Smart Proctoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Institutions", val: "200+" },
              { label: "Exams Taken", val: "1.5M+" },
              { label: "Global Rating", val: "4.9/5" },
              { label: "Network Uptime", val: "99.9%" }
            ].map((s, i) => (
              <div key={i} className="stat-item text-center group">
                <div className="text-6xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors duration-500 tracking-tighter">{s.val}</div>
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-slate-600 transition-colors">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Illustration & Features Sections */}
      <section ref={illustrationsRef} className="bg-white">
        {/* Section 1: Illustration Right */}
        <div className="illustration-section py-48 border-b border-slate-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center gap-12 md:gap-24 text-center md:text-left">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em]">
                Academic Excellence
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Precision <br className="hidden md:block" /> Assessments
              </h2>
              <p className="text-slate-500 text-2xl font-medium leading-relaxed max-w-xl">
                Our proprietary auto-grading engine delivers instant, granular feedback on student performance with 100% accuracy protocols.
              </p>
              <div className="pt-8">
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 font-black">Discover the Logic</Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full -z-10" />
              <img src={examSheetImage} alt="Student filling in an exam answer sheet" className="w-full rounded-[4rem] shadow-2xl shadow-slate-200/50 hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Section 2: Illustration Left */}
        <div className="illustration-section py-48 border-b border-slate-50 bg-slate-50/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24 text-center md:text-right">
            <div className="flex-1 space-y-8 flex flex-col items-center md:items-end">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-[10px] font-black uppercase tracking-[0.3em]">
                Advanced Analytics
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Cognitive <br className="hidden md:block" /> Intelligence
              </h2>
              <p className="text-slate-500 text-2xl font-medium leading-relaxed max-w-xl">
                Gain deep insights into cognitive gaps with high-density performance maps and automated skill tiering architectures.
              </p>
              <div className="pt-8 text-right">
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 font-black">View Analytics Demo</Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-violet-500/10 blur-[100px] rounded-full -z-10" />
              <img src={studyDeskImage} alt="Study desk with laptop and notebook" className="w-full rounded-[4rem] shadow-2xl shadow-slate-200/50 hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Section 3: Illustration Right */}
        <div className="illustration-section py-48">
          <div className="container mx-auto max-w-7xl px-8 flex flex-col md:flex-row items-center gap-24">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">
                Digital Transformation
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Future-Proof <br className="hidden md:block" /> Classrooms
              </h2>
              <p className="text-slate-500 text-2xl font-medium leading-relaxed max-w-xl">
                Empower your institution with a high-performance infrastructure designed to scale with the next generation of academic leaders.
              </p>
              <div className="pt-8">
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 font-black">Join the Network</Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full -z-10" />
              <img src={onlineStudyImage} alt="Student studying online with a laptop" className="w-full rounded-[4rem] shadow-2xl shadow-slate-200/50 hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section ref={featuresRef} id="features" className="py-48 px-4 relative bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-36">
            <h2 className="text-7xl font-black tracking-tight mb-8 text-slate-900">Next-Gen Protocols</h2>
            <p className="text-slate-500 text-2xl max-w-3xl mx-auto font-medium leading-relaxed">Engineered for the absolute highest standards of academic integrity and performance.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Zap, title: "Auto-grading", desc: "Proprietary evaluation models delivering perfect accuracy and instant feedback." },
              { icon: Shield, title: "Vault Security", desc: "Military-grade encryption securing all assessment session metadata and results." },
              { icon: BarChart3, title: "Visual Logic", desc: "High-density performance maps to identify and bridge cognitive gaps." },
              { icon: GraduationCap, title: "Skill Tiers", desc: "Level up from Foundation to Mastery through proven, data-driven milestones." }
            ].map((f, i) => (
              <div
                key={i}
                className="feature-card flex flex-col items-center text-center space-y-8 group p-12 rounded-[3.5rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-700"
              >
                <div className="h-24 w-24 rounded-3xl bg-slate-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-700 shadow-sm">
                  <f.icon className="h-12 w-12 stroke-[2px]" />
                </div>
                <h3 className="font-black text-3xl tracking-tight text-slate-800">{f.title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ExamFlow Section */}
      <section ref={whyRef} id="about" className="py-56 px-4 bg-white text-slate-900 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-gradient-to-br from-primary/5 via-violet-500/5 to-transparent rounded-full blur-[140px] animate-pulse" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-40">
            <div className="inline-block px-5 py-2 mb-8 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.5em]">
              100% Academic Freedom
            </div>
            <h2 className="why-title text-6xl md:text-9xl font-black tracking-tighter mb-8 md:mb-10 text-slate-900 leading-[0.8]">
              Why <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600 pb-4">ExamFlow</span>
            </h2>
            <p className="text-slate-500 text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
              All assessments are completely free. No limitations. <br className="hidden md:block" /> Just pure academic growth at your own pace.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 items-stretch">
            {[
              { title: "Unlimited Access", desc: "Take as many exams as you want, whenever you're ready. No hidden fees, ever.", icon: Zap },
              { title: "Instant Intel", desc: "Receive your results immediately with a granular breakdown of your performance.", icon: CheckCircle2 },
              { title: "Smart Progress", desc: "Monitor your evolution with beautiful analytics and automated skill tiering.", icon: BarChart3 }
            ].map((item, i) => (
              <div
                key={i}
                className="why-card group flex flex-col items-center text-center rounded-[4rem] overflow-hidden transition-all duration-700 bg-white border border-slate-100 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.08)] hover:shadow-[0_60px_120px_-30px_rgba(139,92,246,0.15)] hover:border-primary/20 p-16"
              >
                <div className="h-24 w-24 rounded-[2rem] bg-primary/5 flex items-center justify-center text-primary mb-12 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-700">
                  <item.icon className="h-12 w-12 stroke-[2px]" />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-slate-800 mb-6">{item.title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/30">E</div>
            <span className="text-4xl font-black tracking-tighter uppercase text-slate-900">ExamFlow<span className="text-primary text-6xl">.</span></span>
          </div>
          <p className="text-xl text-slate-400 max-w-md mx-auto leading-relaxed font-semibold mb-16 italic">
            Engineering the benchmark for high-performance global assessment protocols.
          </p>
          <div className="flex justify-center gap-16 text-sm font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Legal Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Direct Support</a>
          </div>
          <div className="mt-20 text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
            &copy; {new Date().getFullYear()} Elite Academic Foundation
          </div>
        </div>
      </footer>
    </div>
  )
}
