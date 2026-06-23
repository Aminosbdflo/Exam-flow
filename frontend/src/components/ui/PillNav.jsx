import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power4.out',
  baseColor = '#8B5CF6',
  dockColor = '#ffffff',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#ffffff',
  pillTextColor = '#8B5CF6',
  onItemClick,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.6, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 12), duration: 0.6, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 20), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 0.6, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { display: 'none', opacity: 0 });
    }

    if (initialLoadAnimation) {
      const logoEl = logoRef.current;
      const navItems = navItemsRef.current;

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, { scale: 1, duration: 0.8, ease });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, opacity: 0 });
        gsap.to(navItems, { width: 'auto', opacity: 1, duration: 0.8, ease });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    logoTweenRef.current = gsap.to(img, {
      scale: 1.1,
      duration: 0.4,
      ease: "back.out(2)",
      overwrite: 'auto',
      onComplete: () => gsap.to(img, { scale: 1, duration: 0.3, ease: "power2.out" })
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.4, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.4, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.4, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.4, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { display: 'flex' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power4.out" }
        );
        gsap.fromTo(
          menu.querySelectorAll('.mobile-link'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power4.out", delay: 0.1 }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power4.in",
          onComplete: () => gsap.set(menu, { display: 'none' })
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isRouterLink = href => href && !href.startsWith('http') && !href.startsWith('#');

  const cssVars = {
    ['--accent']: baseColor,
    ['--dock-bg']: dockColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: pillTextColor,
    ['--nav-h']: '56px',
    ['--pill-pad-x']: '28px',
    ['--pill-gap']: '8px'
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-6">
      <nav
        className={`w-auto flex items-center justify-center gap-3 pointer-events-auto bg-transparent ${className}`}
        style={cssVars}
      >
        <div 
          className="flex items-center gap-2 p-1.5 rounded-full shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-slate-100"
          style={{ background: 'var(--dock-bg, #fff)' }}
        >
          <Link
            to="/"
            onMouseEnter={handleLogoEnter}
            ref={logoRef}
            className="rounded-[1.2rem] px-5 inline-flex items-center justify-center overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ height: 'var(--nav-h)', background: 'var(--dock-bg, #fff)' }}
          >
            <div ref={logoImgRef} className="flex items-center gap-2">
              <div className="h-8 w-8 bg-slate-900 rounded-[0.8rem] flex items-center justify-center text-white font-black text-sm">E</div>
              <span className="font-black text-lg tracking-tighter text-slate-900 uppercase">ExamFlow<span className="text-primary">.</span></span>
            </div>
          </Link>

          <div
            ref={navItemsRef}
            className="relative items-center rounded-full hidden md:flex"
            style={{ height: 'var(--nav-h)' }}
          >
            <ul className="list-none flex items-stretch m-0 p-0 h-full" style={{ gap: 'var(--pill-gap)' }}>
              {items.map((item, i) => (
                <li key={item.href} className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      to={item.href}
                      className="relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-black text-[11px] leading-[0] uppercase tracking-[0.2em] px-[var(--pill-pad-x)] transition-all"
                      style={{ background: 'var(--pill-bg, #fff)', color: 'var(--pill-text, #8B5CF6)' }}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      onClick={() => onItemClick?.(item.href)}
                    >
                      <span className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none" style={{ background: 'var(--accent, #8B5CF6)', willChange: 'transform' }} ref={el => circleRefs.current[i] = el} />
                      <span className="label-stack relative inline-flex items-center gap-2 leading-[1] z-[2]">
                        <span className="pill-label relative z-[2] inline-flex items-center gap-2 leading-[1]" style={{ willChange: 'transform' }}>
                          {item.icon && <item.icon className="h-3.5 w-3.5" />}
                          {item.label}
                        </span>
                        <span className="pill-label-hover absolute left-0 top-0 z-[3] inline-flex items-center gap-2" style={{ color: 'var(--hover-text, #fff)', willChange: 'transform, opacity' }}>
                          {item.icon && <item.icon className="h-3.5 w-3.5" />}
                          {item.label}
                        </span>
                      </span>
                      {activeHref === item.href && <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-1.5 h-1.5 rounded-full z-[4]" style={{ background: 'var(--accent, #8B5CF6)' }} />}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-black text-[11px] leading-[0] uppercase tracking-[0.2em] px-[var(--pill-pad-x)] transition-all"
                      style={{ background: 'var(--pill-bg, #fff)', color: 'var(--pill-text, #8B5CF6)' }}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      onClick={(e) => {
                        if (item.href.startsWith('#')) e.preventDefault();
                        onItemClick?.(item.href);
                      }}
                    >
                      <span className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none" style={{ background: 'var(--accent, #8B5CF6)', willChange: 'transform' }} ref={el => circleRefs.current[i] = el} />
                      <span className="label-stack relative inline-flex items-center gap-2 leading-[1] z-[2]">
                        <span className="pill-label relative z-[2] inline-flex items-center gap-2 leading-[1]" style={{ willChange: 'transform' }}>
                          {item.icon && <item.icon className="h-3.5 w-3.5" />}
                          {item.label}
                        </span>
                        <span className="pill-label-hover absolute left-0 top-0 z-[3] inline-flex items-center gap-2" style={{ color: 'var(--hover-text, #fff)', willChange: 'transform, opacity' }}>
                          {item.icon && <item.icon className="h-3.5 w-3.5" />}
                          {item.label}
                        </span>
                      </span>
                      {activeHref === item.href && <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-1.5 h-1.5 rounded-full z-[4]" style={{ background: 'var(--accent, #8B5CF6)' }} />}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <button
            ref={hamburgerRef}
            onClick={toggleMobileMenu}
            className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1.5 cursor-pointer p-0 relative transition-all active:scale-90"
            style={{ width: 'var(--nav-h)', height: 'var(--nav-h)', background: 'var(--accent, #8B5CF6)' }}
          >
            <span className="hamburger-line w-5 h-0.5 rounded origin-center bg-white" />
            <span className="hamburger-line w-5 h-0.5 rounded origin-center bg-white" />
          </button>
        </div>
      </nav>

      {/* --- FULL SCREEN MOBILE OVERLAY --- */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[998] flex-col items-center justify-center p-12 hidden"
      >
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-8">System Protocol Navigation</p>
          {items.map(item => {
            const isRouter = isRouterLink(item.href);
            const content = (
              <span className={`mobile-link w-full py-6 px-10 flex items-center justify-center gap-4 text-center text-3xl font-black uppercase tracking-tighter rounded-3xl transition-all ${activeHref === item.href ? 'bg-accent text-white shadow-2xl shadow-accent/20' : 'text-slate-900 hover:bg-slate-50'}`} style={{ '--accent': baseColor }}>
                {item.icon && <item.icon className="h-7 w-7" />}
                {item.label}
              </span>
            );

            return isRouter ? (
              <Link
                key={item.href}
                to={item.href}
                className="w-full flex"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onItemClick?.(item.href);
                }}
              >
                {content}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="w-full flex"
                onClick={(e) => {
                  if (item.href.startsWith('#')) e.preventDefault();
                  setIsMobileMenuOpen(false);
                  onItemClick?.(item.href);
                }}
              >
                {content}
              </a>
            )
          })}
          <div className="mt-12 pt-12 border-t border-slate-100 w-full text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">ExamFlow Institutional Grid &bull; v2.4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PillNav;
