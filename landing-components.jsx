// landing-components.jsx – Brivio Capital landing page sections
const { useState, useEffect, useRef } = React;

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useViewport() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return {
    width,
    isMobile: width < 720,
    isTablet: width >= 720 && width < 1024,
    isDesktop: width >= 1024
  };
}

// Section horizontal padding – tighter on mobile
function sectionPad(isMobile, isTablet) {
  if (isMobile) return '0 20px';
  if (isTablet) return '0 32px';
  return '0 56px';
}

const T = {
  navy: '#0D1B2A',
  graphite: '#2B2F33',
  brass: '#B99B5F',
  brassLight: '#D4BA85',
  brassDark: '#8C7547',
  steel: '#656B72', // UI only: borders, dividers, inactive states
  bodyText: '#A8ADB3', // secondary body copy – ~5.5:1 on navy, ~4.2:1 on graphite
  mutedText: '#7B8289', // tertiary metadata – intentionally subtle
  offwhite: '#F5F7F9',
  // ─ Light-section tokens (Option 2 alternating dark/light) ─
  bgLight: '#E8EBEF',        // softened off-white section background
  textOnLight: '#0D1B2A',    // navy headings on light
  bodyOnLight: '#51606E',    // body copy on light – ~7:1 contrast
  mutedOnLight: '#7A8694',   // tertiary metadata on light
  cardLight: '#FFFFFF',      // white card on light section
  cardBorderLight: '#DDE3E9',// hairline border on light cards
  border: 'rgba(245,247,249,0.08)',
  borderMed: 'rgba(245,247,249,0.14)',
  surfaceElev: '#3A4046'
};

const FONT_UI = "'InterVariable', 'Inter', 'Helvetica Neue', Arial, sans-serif";
const FONT_DISPLAY = "'InterDisplay', 'InterVariable', 'Inter', 'Helvetica Neue', Arial, sans-serif";

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  height: 48, padding: '0 28px',
  borderRadius: 2, fontSize: 12, fontWeight: 500,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  cursor: 'pointer', textDecoration: 'none', border: 'none',
  fontFamily: FONT_UI, transition: 'background 0.2s, color 0.2s'
};
const btnPrimary = { ...btnBase, background: T.brass, color: T.navy };
const btnSecondary = { ...btnBase, background: 'transparent', color: T.offwhite, border: `1px solid rgba(245,247,249,0.25)` };

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

function Eyebrow({ children, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, ...style }}>
      <div style={{ width: 24, height: 1, background: T.brass, flexShrink: 0 }} />
      <span style={{ color: T.brass, fontSize: 13, fontWeight: 500, letterSpacing: '0.16em' }}>{children}</span>
    </div>);

}

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {setVisible(true);obs.disconnect();}
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ onContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile, isTablet } = useViewport();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navItems = [
  { label: 'How it Works', id: 'how-it-works' },
  { label: 'Why Brivio', id: 'why' },
  { label: 'About Us', href: 'about.html' },
  { label: 'FAQs', href: 'faq.html' }];

  const linkSt = {
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    color: 'rgba(245,247,249,0.62)', fontSize: 16, fontWeight: 400, letterSpacing: '0.02em',
    fontFamily: 'inherit', transition: 'color 0.2s', whiteSpace: 'nowrap', textDecoration: 'none'
  };

  const handleNavClick = (id) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: isMobile ? 64 : 84, display: 'flex', alignItems: 'center',
      padding: isMobile ? '0 20px' : isTablet ? '0 32px' : '0 56px',
      background: scrolled || menuOpen ? 'rgba(13,27,42,0.94)' : 'transparent',
      backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
      transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s'
    }}>
      <a href="index.html" onClick={e => { 
        // If already on index.html, just scroll to top instead of navigating
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
          e.preventDefault(); 
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
      }} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={window.__resources.brivioLockup} alt="Brivio Capital" style={{ height: isMobile ? 44 : 64 }} />
      </a>
      <div style={{ flex: 1 }} />

      {isMobile ?
      <>
          <button
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            display: 'flex', flexDirection: 'column', gap: 5,
            width: 40, height: 40, alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{
            width: 22, height: 1.5, background: T.offwhite,
            transition: 'transform 0.25s, opacity 0.25s',
            transform: menuOpen ? 'rotate(45deg) translate(4px, 4.5px)' : 'none'
          }} />
            <span style={{
            width: 22, height: 1.5, background: T.offwhite,
            transition: 'opacity 0.25s',
            opacity: menuOpen ? 0 : 1
          }} />
            <span style={{
            width: 22, height: 1.5, background: T.offwhite,
            transition: 'transform 0.25s',
            transform: menuOpen ? 'rotate(-45deg) translate(4px, -4.5px)' : 'none'
          }} />
          </button>

          {menuOpen &&
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: 'rgba(13,27,42,0.98)', backdropFilter: 'blur(16px)',
          borderTop: `1px solid ${T.border}`,
          padding: '24px 20px 32px',
          display: 'flex', flexDirection: 'column', gap: 22
        }}>
              {navItems.map((item) =>
          item.href ?
          <a key={item.label} href={item.href} style={{
            ...linkSt, color: T.offwhite, fontSize: 16, textAlign: 'left',
            padding: '8px 0', borderBottom: `1px solid ${T.border}`
          }}>
                  {item.label}
                </a> :

          <button key={item.label} onClick={() => handleNavClick(item.id)} style={{
            ...linkSt, color: T.offwhite, fontSize: 16, textAlign: 'left',
            padding: '8px 0', borderBottom: `1px solid ${T.border}`
          }}>
                  {item.label}
                </button>
          )}
              <button onClick={() => {setMenuOpen(false);onContact();}} style={{
            ...btnPrimary, height: 48, justifyContent: 'center', marginTop: 8
          }}>
                Apply to Partner
              </button>
            </div>
        }
        </> :

      <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 20 : 32 }}>
          {navItems.map((item) =>
        item.href ?
        <a key={item.label} href={item.href} style={linkSt}
        onMouseEnter={(e) => e.currentTarget.style.color = T.offwhite}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,247,249,0.62)'}>
              {item.label}
            </a> :

        <button key={item.label} onClick={() => scrollToId(item.id)} style={linkSt}
        onMouseEnter={(e) => e.target.style.color = T.offwhite}
        onMouseLeave={(e) => e.target.style.color = 'rgba(245,247,249,0.62)'}>
              {item.label}
            </button>
        )}
          <button onClick={onContact} style={{ ...btnPrimary, height: 40, padding: '0 22px', fontSize: 11, whiteSpace: 'nowrap' }}
        onMouseEnter={(e) => e.currentTarget.style.background = T.brassLight}
        onMouseLeave={(e) => e.currentTarget.style.background = T.brass}>
            Apply to Partner
          </button>
        </div>
      }
    </nav>);

}

// ─── HERO ────────────────────────────────────────────────────────────────────
const HERO_VARIANTS = [
{
  lines: ['Your auto finance company', 'Our infrastructure'],
  accent: { line: 0, word: 'Your auto finance company' },
  sub: `All the economics. None of the build.`
},
{
  lines: ['Keep the finance income', 'you hand to banks'],
  accent: { line: 0, word: 'finance income' },
  sub: `Launch your own auto finance company – the spread, the data, the customer relationship – without the capital or the build.`
},
{
  lines: ['Your name on the loan.', "Not the bank's."],
  accent: { line: 0, word: 'Your name' },
  sub: `Every deal you finance builds your portfolio, your data, your economics – on a platform built and run by people who've operated auto lenders at scale.`
}];


function Hero({ variant, onContact }) {
  const v = HERO_VARIANTS[variant] || HERO_VARIANTS[0];
  const [mounted, setMounted] = useState(false);
  const { isMobile, isTablet } = useViewport();
  useEffect(() => {const t = setTimeout(() => setMounted(true), 60);return () => clearTimeout(t);}, [variant]);
  useEffect(() => {setMounted(false);}, [variant]);

  function renderLine(line, i) {
    const { line: aLine, word: aWord } = v.accent;
    if (i !== aLine) return <span key={i} style={{ display: 'block' }}>{line}</span>;
    const idx = line.indexOf(aWord);
    if (idx === -1) return <span key={i} style={{ display: 'block' }}>{line}</span>;
    const noPrefix = idx === 0;
    return (
      <span key={i} style={{ display: 'block', whiteSpace: noPrefix ? 'nowrap' : 'normal' }}>
        {line.slice(0, idx)}
        <span className="nb" style={{ color: T.brass }}>{aWord}</span>
        {line.slice(idx + aWord.length)}
      </span>);

  }

  return (
    <section style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2A3A 100%)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: isMobile ? '110px 20px 80px' : isTablet ? '130px 32px 90px' : '140px 56px 100px',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(245,247,249,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,249,0.022) 1px, transparent 1px)`,
        backgroundSize: isMobile ? '48px 48px' : '72px 72px'
      }} />
      {/* Brass ambient glow */}
      <div style={{
        position: 'absolute', bottom: -120, left: -60, width: 480, height: 480,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(185,155,95,0.07) 0%, transparent 65%)'
      }} />
      {/* Top-right accent line */}
      {!isMobile &&
      <div style={{
        position: 'absolute', top: 0, right: 240, width: 1, height: '40vh',
        background: `linear-gradient(${T.brass}, transparent)`, opacity: 0.3, pointerEvents: 'none'
      }} />
      }

      {/* Bridge image – right side */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '100%', pointerEvents: 'none', overflow: 'hidden'
      }}>
        <img src={window.__resources.bridgeImg} alt="" style={{
          width: isMobile ? '100%' : '52%', height: '100%', objectFit: 'cover',
          objectPosition: 'center right', position: 'absolute', top: 0, right: 0,
          opacity: isMobile ? 0.22 : 0.55,
          filter: 'grayscale(0.65) sepia(0.4) brightness(0.82) contrast(1.05)'
        }} />
        {/* Brass/navy duotone wash so the image reads in-palette */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: isMobile ? '100%' : '52%', pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(13,27,42,0.55) 0%, rgba(185,155,95,0.22) 100%)',
          mixBlendMode: 'color'
        }} />
        {/* Left-to-right fade so text remains legible */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isMobile ?
          `linear-gradient(180deg, ${T.navy} 0%, rgba(13,27,42,0.85) 40%, rgba(13,27,42,0.92) 100%)` :
          `linear-gradient(90deg, ${T.navy} 0%, ${T.navy} 42%, rgba(13,27,42,0.82) 60%, rgba(13,27,42,0.32) 82%, rgba(13,27,42,0.12) 100%)`
        }} />
        {/* Bottom fade into the section below */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 160,
          background: `linear-gradient(180deg, transparent 0%, ${T.navy} 100%)`
        }} />
      </div>

      <div style={{
        position: 'relative', maxWidth: 860,
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}>
        <h1 style={{
          fontSize: isMobile ? 'clamp(38px, 11vw, 52px)' : 'clamp(52px, 6.5vw, 84px)',
          fontWeight: 500,
          fontFamily: FONT_DISPLAY,
          letterSpacing: '-0.02em', lineHeight: 1.04,
          color: T.offwhite, margin: isMobile ? '0 0 24px' : '0 0 32px'
        }}>
          {v.lines.map(renderLine)}
        </h1>

        <p style={{
          fontSize: isMobile ? 16 : 18, fontWeight: 400, lineHeight: 1.65, color: T.bodyText,
          maxWidth: 680, margin: isMobile ? '0 0 36px' : '0 0 52px', whiteSpace: 'pre-line'
        }}>{v.sub}</p>

        <div style={{ display: 'flex', gap: isMobile ? 12 : 16, flexWrap: 'wrap' }}>
          <button onClick={onContact} style={{ ...btnPrimary, ...(isMobile ? { height: 48, padding: '0 24px' } : {}) }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.brassLight}
          onMouseLeave={(e) => e.currentTarget.style.background = T.brass}>
            Apply to Partner <Arrow />
          </button>
          <button onClick={() => scrollToId('how-it-works')} style={{ ...btnSecondary, ...(isMobile ? { height: 48, padding: '0 24px' } : {}) }}
          onMouseEnter={(e) => {e.currentTarget.style.background = T.offwhite;e.currentTarget.style.color = T.navy;}}
          onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.color = T.offwhite;}}>
            How it works
          </button>
        </div>
      </div>

      {!isMobile &&
      <div style={{
        position: 'absolute', bottom: 44, left: isTablet ? 32 : 56,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
      }}>
          <div style={{ width: 1, height: 36, background: `linear-gradient(${T.steel}, transparent)` }} />
          <span style={{ color: T.steel, fontSize: 10, letterSpacing: '0.18em', fontWeight: 300 }}>SCROLL</span>
        </div>
      }
    </section>);

}

// ─── THE REALITY ─────────────────────────────────────────────────────────────
const REALITY_CARDS = [
{ stat: '1 payment', sub: 'How often you get paid on the loan' },
{ stat: '3–5 years', sub: 'How long the lender collects on it' },
{ stat: '100%', sub: 'Ownership of customer data' }];


function TheReality() {
  const [ref, visible] = useReveal();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { isMobile, isTablet } = useViewport();
  return (
    <section style={{
      padding: isMobile ? '80px 20px' : isTablet ? '100px 32px' : '120px 56px',
      background: T.navy
    }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div style={{ marginBottom: isMobile ? 40 : 64 }}>
          <Eyebrow>THE REALITY</Eyebrow>
          <h2 style={{
            fontSize: isMobile ? 32 : 52, fontWeight: 500, fontFamily: FONT_DISPLAY,
            letterSpacing: '-0.01em', color: T.offwhite, margin: 0,
            lineHeight: 1.15, maxWidth: 900
          }}>
            <span style={{ display: 'block' }}>Lenders get paid for months, for years.</span>
            <span style={{ display: 'block', color: T.brass }}>You got paid once.</span>
          </h2>
        </div>

        {/* Three stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 1, background: T.border
        }}>
          {REALITY_CARDS.map((c, i) => {
            const isActive = hoveredCard !== null ? hoveredCard === i : i === 0;
            return (
          <div key={i} style={{
            background: hoveredCard === i ? 'rgba(185,155,95,0.2)' : 'rgba(185,155,95,0.12)',
            border: '1px solid rgba(185,155,95,0.25)',
            padding: isMobile ? '36px 28px' : '48px 40px',
            display: 'flex', flexDirection: 'column', gap: 14,
            borderTop: `2px solid ${isActive ? T.brass : 'rgba(185,155,95,0.25)'}`,
            transition: 'background 0.25s, border-color 0.2s', cursor: 'default'
          }}
          onMouseEnter={() => { if (!isMobile) setHoveredCard(i); }}
          onMouseLeave={() => { if (!isMobile) setHoveredCard(null); }}>
              <div style={{
              fontSize: isMobile ? 40 : 52, fontWeight: 500,
              fontFamily: FONT_DISPLAY, color: T.brass,
              letterSpacing: '-0.02em', lineHeight: 1
            }}>{c.stat}</div>
              <div style={{ fontSize: isMobile ? 14 : 15, color: T.bodyText, lineHeight: 1.65 }}>{c.sub}</div>
            </div>
            );
          })}
        </div>

        {/* Calculator CTA band */}
        <a href="calculator.html" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, marginTop: isMobile ? 44 : 56,
          padding: isMobile ? '28px 26px' : '32px 44px',
          background: 'rgba(185,155,95,0.07)',
          border: `1px solid ${T.brass}`, borderRadius: 4,
          textDecoration: 'none', flexWrap: 'wrap',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(185,155,95,0.14)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(185,155,95,0.07)'}>
          <span style={{ fontSize: isMobile ? 16 : 19, fontWeight: 500, color: T.offwhite, letterSpacing: '-0.005em', lineHeight: 1.35 }}>
            Curious what you're leaving on the table?
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: isMobile ? 13 : 14, fontWeight: 600, color: T.brass, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            Calculate it
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>

        {/* Apply to Partner */}
        <div style={{ marginTop: isMobile ? 32 : 44 }}>
          <a href="index.html#contact" style={{ ...btnPrimary, ...(isMobile ? { height: 48, padding: '0 24px' } : {}) }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.brassLight}
          onMouseLeave={(e) => e.currentTarget.style.background = T.brass}>
            Apply to Partner <Arrow />
          </a>
        </div>
      </div>
    </section>);

}

// ─── HOW IT WORKS ────────────────────────────────────────────────────────────
const STEPS = [
{ n: '01', title: 'We look under the hood', body: "Your loan volumes, credit mix, and what you're earning today from markups and flat fees. We build the picture, then show you exactly what you're leaving on the table." },
{ n: '02', title: 'You set the pricing', body: 'We walk through the economics together – baseline versus adding margin, and how each approach stacks up against the competition. We agree on a range that works for both sides. Then you decide where to land.' },
{ n: '03', title: 'Agree to terms', body: 'Sign our agreement. Then, do the one thing banks never let you do … put your name on the loan.' },
{ n: '04', title: 'We get to work', body: "Your branded portal gets built. Your program goes into the tech stack. We train your F&I team so day one feels like business as usual. You don't lift a finger." },
{ n: '05', title: "You're live", body: 'Your team routes deals to your new finance company. From this point, every funded deal builds your portfolio, your customer data, and your economics. The bank no longer gets that – you do.' }];


function HowItWorks() {
  const [ref, visible] = useReveal();
  const { isMobile, isTablet } = useViewport();
  return (
    <section id="how-it-works" style={{
      padding: isMobile ? '80px 20px' : isTablet ? '100px 32px' : '120px 56px',
      background: T.bgLight
    }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div style={{ marginBottom: isMobile ? 40 : 64 }}>
          <Eyebrow>HOW IT WORKS</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 500, fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em', color: T.textOnLight, margin: 0, lineHeight: 1.15 }}>
            Your brand on every loan – in under 90 days.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: isMobile ? '48px 1fr' : '48px 1fr',
                columnGap: isMobile ? 20 : 32, position: 'relative',
                paddingBottom: last ? 0 : isMobile ? 32 : 44
              }}>
                {/* Number badge + connecting vertical line */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 2,
                    border: `1px solid ${T.brass}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#FFFFFF', position: 'relative', zIndex: 1,
                    boxShadow: '0 2px 12px rgba(185,155,95,0.18)'
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: T.brassDark }}>{s.n}</span>
                  </div>
                  {!last &&
                  <div style={{
                    position: 'absolute', top: 48, bottom: 0, width: 1,
                    background: `linear-gradient(${T.brass}, rgba(185,155,95,0.15))`
                  }} />
                  }
                </div>
                <div style={{ paddingTop: 2 }}>
                  <h3 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 600, color: T.textOnLight, margin: '0 0 10px', lineHeight: 1.25, letterSpacing: '-0.005em' }}>{s.title}</h3>
                  <p style={{ fontSize: isMobile ? 14 : 15, color: T.bodyOnLight, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
                </div>
              </div>);

          })}
        </div>

        {/* Takeaway callout */}
        <div style={{
          marginTop: isMobile ? 44 : 64,
          background: 'rgba(185,155,95,0.1)', borderTop: `2px solid ${T.brass}`,
          padding: isMobile ? '24px' : '30px 36px'
        }}>
          <p style={{ fontSize: isMobile ? 15 : 17, color: T.textOnLight, lineHeight: 1.55, margin: 0, fontWeight: 500, letterSpacing: '-0.005em' }}>
            The average dealer location routes <span className="nb" style={{ color: T.brassDark, fontWeight: 600 }}>$26mm in loans annually</span> to banks and credit unions. Every one of those loans is margin and customer data you don't own. That changes on day one.
          </p>
        </div>
      </div>
    </section>);

}

// ─── WHY BRIVIO ──────────────────────────────────────────────────────────────
const WHY_CARDS = [
{
  title: 'You\u2019re not our experiment',
  body: 'Our founders have led auto lending businesses inside the largest US bank, captive lenders, and a leading consumer fintech, generating over $75 billion across three decades. We\u2019ve operated through credit cycles, capital markets dislocations, and regulatory change. We\u2019re doing it again, this time for you.',
  link: { label: 'Meet the founders', href: 'about.html' }
},
{
  title: 'This is the only thing we do',
  body: 'Auto-native from day one. Not a powersports pivot, not a consumer fintech adding cars, not a side project. Full-spectrum credit – new and used, prime through subprime – because that\u2019s how your dealership makes more.'
},
{
  title: 'One partner total accountability',
  body: 'Licensing, compliance, underwriting, servicing, capital markets. We coordinate the full stack, so you don\u2019t have to. When something needs attention, you call us. We handle it from there.'
}];

const WIN_POINTS = [
'No major capital commitment. Modest setup and subscription fees',
'You bring the loan rooftop. We bring the infrastructure',
'No long-term commitments. We earn your business every month',
'Our economics are tied to yours. We don\u2019t win unless you do'];


function WhyBrivio() {
  const [ref, visible] = useReveal();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { isMobile, isTablet } = useViewport();
  return (
    <section id="why" style={{ padding: isMobile ? '80px 20px' : isTablet ? '100px 32px' : '120px 56px', background: T.bgLight }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div style={{ marginBottom: isMobile ? 40 : 64 }}>
          <Eyebrow>WHY BRIVIO</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 500, fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em', color: T.textOnLight, margin: 0, lineHeight: 1.15, maxWidth: 760 }}>
            <span style={{ display: 'block' }}>Built for dealers</span>
            <span style={{ display: 'block', color: T.brassDark }}>By people who've run auto lenders</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: T.cardBorderLight }}>
          {WHY_CARDS.map((c, i) => {
            const isActive = hoveredCard !== null ? hoveredCard === i : i === 0;
            return (
            <div key={i} style={{
              background: hoveredCard === i ? '#FBFAF7' : T.cardLight,
              padding: isMobile ? '36px 28px' : '44px 36px',
              borderTop: `2px solid ${isActive ? T.brass : 'transparent'}`,
              boxShadow: hoveredCard === i ? '0 8px 28px rgba(13,27,42,0.1)' : 'none',
              display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.25s, border-color 0.2s'
            }}
            onMouseEnter={() => { if (!isMobile) setHoveredCard(i); }}
            onMouseLeave={() => { if (!isMobile) setHoveredCard(null); }}>
              <h3 style={{ fontSize: isMobile ? 22 : 24, fontWeight: 600, color: T.textOnLight, margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.005em', minHeight: isMobile ? 'auto' : '2.5em' }}>{c.title}</h3>
              <p style={{ fontSize: isMobile ? 14 : 14.5, color: T.bodyOnLight, lineHeight: 1.65, margin: 0 }}>{c.body}</p>
              {c.link &&
              <a href={c.link.href} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 'auto', paddingTop: 22,
                color: T.brassDark, fontSize: 13, fontWeight: 600, letterSpacing: '0.02em',
                textDecoration: 'none', alignSelf: 'flex-start', transition: 'gap 0.2s, color 0.2s'
              }}
              onMouseEnter={(e) => {e.currentTarget.style.color = T.brass;e.currentTarget.style.gap = '11px';}}
              onMouseLeave={(e) => {e.currentTarget.style.color = T.brassDark;e.currentTarget.style.gap = '7px';}}>
                  {c.link.label}
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              }
            </div>
            );
          })}
        </div>

        {!isMobile && <div style={{
          marginTop: isMobile ? 36 : 48,
          background: 'rgba(185,155,95,0.1)', borderTop: `2px solid ${T.brass}`,
          padding: isMobile ? '28px 24px' : '36px 40px'
        }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: isMobile ? 24 : 30, fontWeight: 500, color: T.textOnLight, letterSpacing: '-0.01em', marginBottom: isMobile ? 22 : 26 }}>
            We win when you win.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : '18px 32px' }}>
            {WIN_POINTS.map((pt, i) =>
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.brassDark, marginTop: 9, flexShrink: 0 }} />
                <span style={{ fontSize: isMobile ? 14 : 15, color: T.bodyOnLight, lineHeight: 1.6 }}>{pt}</span>
              </div>
            )}
          </div>
        </div>}
      </div>
    </section>);

}

// ─── WE WIN WHEN YOU WIN (mobile-only standalone section) ────────────────────
function WinWhenYouWinSection() {
  const { isMobile } = useViewport();
  if (!isMobile) return null;
  return (
    <section style={{ padding: '64px 20px', background: T.navy, borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 500, color: T.offwhite, letterSpacing: '-0.01em', marginBottom: 22 }}>
          We win when you win
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {WIN_POINTS.map((pt, i) =>
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.brass, marginTop: 9, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: T.bodyText, lineHeight: 1.6 }}>{pt}</span>
            </div>
          )}
        </div>
      </div>
    </section>);
}

// ─── WHO WE WORK WITH ────────────────────────────────────────────────────────
const ROOFTOPS = [
{
  label: 'KEEP THE ECONOMICS',
  title: 'Capture the spread you give away',
  body: 'Today you earn a one-time fee while outside lenders collect the financing margin for years. Run your own captive program with Brivio and keep the lending economics on every deal.',
  sub: 'New & used · Prime through subprime'
},
{
  label: 'OWN THE RELATIONSHIP',
  title: 'Keep your customer and your data',
  body: 'Lenders see payment behavior, credit trajectory, and trade-in timing on every customer. With a Brivio-powered captive, that data and the ongoing relationship stay with your group.',
  sub: '100% customer data ownership'
},
{
  label: 'LAUNCH FAST',
  title: 'A lender of your own, in months',
  body: 'No $25M+ build and no 12-month timeline. Brivio handles technology, compliance, capital, and servicing end to end, so your group can launch a branded finance program in under 120 days.',
  sub: '~$15K to start · Under 120 days'
}];


function RooftopsWeServe() {
  const [ref, visible] = useReveal();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { isMobile, isTablet } = useViewport();
  return (
    <section id="who" style={{ padding: isMobile ? '80px 20px' : isTablet ? '100px 32px' : '120px 56px', background: T.navy }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div style={{ marginBottom: isMobile ? 40 : 64 }}>
          <Eyebrow>WHO WE SERVE</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 500, fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em', color: T.offwhite, margin: 0, whiteSpace: isMobile ? 'normal' : 'nowrap', lineHeight: 1.15 }}>
            Built for multi-rooftop dealer groups
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: T.border }}>
          {ROOFTOPS.map((p, i) => {
            const isActive = hoveredCard !== null ? hoveredCard === i : i === 0;
            return (
          <div key={i} style={{
            background: hoveredCard === i ? 'rgba(185,155,95,0.2)' : 'rgba(185,155,95,0.12)',
            border: '1px solid rgba(185,155,95,0.25)',
            padding: isMobile ? '36px 28px' : '48px 40px',
            borderTop: `2px solid ${isActive ? T.brass : 'rgba(185,155,95,0.25)'}`,
            transition: 'background 0.25s, border-color 0.2s'
          }}
          onMouseEnter={() => { if (!isMobile) setHoveredCard(i); }}
          onMouseLeave={() => { if (!isMobile) setHoveredCard(null); }}>
              <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.14em', color: T.brass, textTransform: 'uppercase', marginBottom: 20 }}>{p.label}</div>
              <h3 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 500, color: T.offwhite, margin: '0 0 16px', lineHeight: 1.25 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: T.bodyText, lineHeight: 1.65, margin: '0 0 28px' }}>{p.body}</p>
              <div style={{ fontSize: 11, color: 'rgba(245,247,249,0.7)', letterSpacing: '0.06em', fontWeight: 300 }}>{p.sub}</div>
            </div>
            );
          })}
        </div>
      </div>
    </section>);

}

// ─── CALCULATOR TEASER ───────────────────────────────────────────────────────
function CalcTeaser() {
  const [ref, visible] = useReveal();
  const { isMobile, isTablet } = useViewport();
  return (
    <section style={{ padding: isMobile ? '80px 20px 80px' : isTablet ? '100px 32px 100px' : '120px 56px 120px', background: T.bgLight }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div style={{ marginBottom: isMobile ? 40 : 56 }}>
          <Eyebrow>BENEFIT CALCULATOR</Eyebrow>
          <h2 style={{
            fontFamily: "'InterDisplay','InterVariable','Inter','Helvetica Neue',Arial,sans-serif",
            fontSize: isMobile ? 30 : 46, fontWeight: 500, letterSpacing: '-0.01em',
            color: T.textOnLight, margin: '0 0 16px', lineHeight: 1.15,
            whiteSpace: isMobile ? 'normal' : 'nowrap'
          }}>
            See what you're leaving on the table
          </h2>
          <p style={{ fontSize: 15, color: T.bodyOnLight, lineHeight: 1.65, margin: '0 0 40px', maxWidth: 600 }}>Lenders can make over $1,000 per loan. Recapture those economics with Brivio Capital. Use our calculator to see your annual upside from a Brivio captive program.</p>
        </div>
        <div style={{
          background: '#FFFFFF', border: `1px solid ${T.cardBorderLight}`,
          borderRadius: 12, padding: isMobile ? '40px 28px' : '40px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24
        }}>
          <p style={{ fontSize: 15, color: T.bodyOnLight, lineHeight: 1.65, margin: 0, maxWidth: 540 }}>See your dealership's estimated annual upside in under 60 seconds.</p>
          <a href="calculator.html" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            height: 52, padding: '0 32px', flexShrink: 0,
            background: T.brass, color: T.navy,
            borderRadius: 2, fontSize: 12, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'background 0.2s',
            boxShadow: '0 0 32px rgba(185,155,95,0.2)',
            alignSelf: isMobile ? 'flex-start' : 'auto'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.brassLight}
          onMouseLeave={(e) => e.currentTarget.style.background = T.brass}>
            Run the numbers
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>);

}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, visible] = useReveal();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', role: '', message: '' });
  const { isMobile, isTablet } = useViewport();

  const inputSt = {
    width: '100%', height: 52, padding: '0 18px',
    background: 'rgba(245,247,249,0.04)',
    border: `1px solid rgba(245,247,249,0.12)`,
    borderRadius: 2, color: T.offwhite,
    fontSize: 16, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };
  const labelSt = {
    display: 'block', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em',
    color: T.steel, textTransform: 'uppercase', marginBottom: 10
  };
  const focus = (e) => e.target.style.borderColor = T.brass;
  const blur = (e) => e.target.style.borderColor = 'rgba(245,247,249,0.12)';

  return (
    <section id="contact" style={{ padding: isMobile ? '80px 20px' : isTablet ? '100px 32px' : '120px 56px', background: T.navy }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div style={{ marginBottom: isMobile ? 44 : 56 }}>
          <Eyebrow>GET IN TOUCH</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 36 : 52, fontWeight: 500, fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em', color: T.offwhite, margin: '0 0 16px', lineHeight: 1.15, whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
            Let's build something together
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 16, color: T.bodyText, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
            Tell us what you're building. We'll come prepared.
          </p>
        </div>

        <form action="https://formspree.io/f/xbdbozza" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelSt}>Name</label>
                <input name="name" style={inputSt} placeholder="Your name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelSt}>Email</label>
                <input name="email" type="email" style={inputSt} placeholder="your@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={focus} onBlur={blur} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelSt}>Phone</label>
                <input name="phone" type="tel" style={inputSt} placeholder="(555) 123-4567" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelSt}>Company</label>
                <input name="company" style={inputSt} placeholder="Organization" value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              onFocus={focus} onBlur={blur} />
              </div>
            </div>
            <div>
              <label style={labelSt}>Role</label>
              <input name="role" style={inputSt} placeholder="Your title" value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelSt}>What you're building</label>
              <textarea
              name="message"
              style={{ ...inputSt, height: 140, padding: '14px 18px', resize: 'none', lineHeight: 1.55 }}
              placeholder="Tell us about your program or initiative…"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              onFocus={focus} onBlur={blur} />
            
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, marginTop: 8 }}>
              <button type="submit" style={{ ...btnPrimary, alignSelf: 'flex-start' }}
            onMouseEnter={(e) => e.currentTarget.style.background = T.brassLight}
            onMouseLeave={(e) => e.currentTarget.style.background = T.brass}>
                Send message <Arrow />
              </button>
              <p style={{ fontSize: 13, color: T.steel, lineHeight: 1.55, margin: 0 }}>
                We'll reach out within two business days to walk through your numbers – no obligation.
              </p>
            </div>
          </form>
      </div>
    </section>);

}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const { isMobile, isTablet } = useViewport();
  return (
    <footer style={{ padding: isMobile ? '32px 20px' : isTablet ? '40px 32px' : '48px 56px', background: T.navy, borderTop: `1px solid ${T.border}` }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: isMobile ? 14 : 20,
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <img src={window.__resources.brivioLockup} alt="Brivio Capital" style={{ height: isMobile ? 40 : 52, opacity: 0.85 }} />
        <span style={{ color: T.steel, fontSize: isMobile ? 10 : 11, fontWeight: 300, letterSpacing: '0.18em' }}>
          CAPITAL.&nbsp;&nbsp;CONNECTION.&nbsp;&nbsp;MOMENTUM.
        </span>
        <span style={{ color: 'rgba(101,107,114,0.45)', fontSize: isMobile ? 11 : 12 }}>© 2026 Brivio Capital</span>
      </div>
    </footer>);

}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
const FOUNDERS = [
{
  initials: 'AM',
  photo: null,
  name: 'Alex Morgan',
  role: 'Founder & CEO',
  bio: "Alex has spent his career underwriting and scaling auto finance platforms – leading originations at a major OEM captive, a leading consumer fintech, and the auto and remarketing arm of a money-center bank. Across those seats he's been responsible for $25bn+ in originations and relationships with 850+ dealer rooftops, with operating experience through both the '08 cycle and COVID."
},
{
  initials: 'JR',
  photo: null,
  name: 'Jordan Reed',
  role: 'Co-Founder & COO',
  bio: "Jordan has built pricing, analytics, and operations functions for some of the largest auto lenders in the country – auto lending at a consumer fintech, pricing & analytics at a top-five bank, and auto pricing and direct auto operations at a money-center bank. Over 15+ years they've priced roughly $50bn in originations and built multiple lending products from 0 → 1."
}];


function About() {
  const [ref, visible] = useReveal();
  const { isMobile, isTablet } = useViewport();
  return (
    <section id="about" style={{ padding: isMobile ? '80px 20px' : isTablet ? '100px 32px' : '120px 56px', background: T.graphite, borderTop: `1px solid ${T.border}` }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <Eyebrow>ABOUT US</Eyebrow>
        <h2 style={{
          fontFamily: "'InterDisplay','InterVariable','Inter','Helvetica Neue',Arial,sans-serif",
          fontSize: isMobile ? 32 : 46, fontWeight: 500, letterSpacing: '-0.01em',
          color: T.offwhite, margin: '0 0 16px', lineHeight: 1.15,
          whiteSpace: isMobile ? 'normal' : 'nowrap'
        }}>
          Built by operators who have lived inside auto finance.
        </h2>
        <p style={{ fontSize: 15, color: T.bodyText, lineHeight: 1.65, margin: '0 0 64px' }}>
          Brivio Capital was founded by two operators who together have priced, originated, and scaled tens of billions of dollars in auto loans across the country's largest captive and consumer lenders.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 56 }}>
          {FOUNDERS.map((f, i) =>
          <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{
              width: 88, height: 88, flexShrink: 0,
              borderRadius: '50%', overflow: 'hidden',
              background: T.navy, border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {f.photo ?
              <img src={f.photo} alt={f.name} style={{
                width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%'
              }} /> :

              <div style={{
                fontFamily: "'InterDisplay','InterVariable','Inter','Helvetica Neue',Arial,sans-serif",
                fontSize: 28, fontWeight: 400, color: T.brass, letterSpacing: '-0.01em'
              }}>
                    {f.initials}
                  </div>
              }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                fontFamily: "'InterDisplay','InterVariable','Inter','Helvetica Neue',Arial,sans-serif",
                fontSize: 18, fontWeight: 500, color: T.offwhite, margin: '0 0 2px', letterSpacing: '-0.005em'
              }}>
                  {f.name}
                </h3>
                <div style={{
                fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', color: T.brass,
                textTransform: 'uppercase', marginBottom: 14
              }}>
                  {f.role}
                </div>
                <p style={{ fontSize: 13.5, color: T.bodyText, lineHeight: 1.7, margin: 0 }}>
                  {f.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ─── PROOF POINTS STRIP ─────────────────────────────────────────────────────
function ProofPoints() {
  const [ref, visible] = useReveal();
  const { isMobile, isTablet } = useViewport();

  const stats = [
  { num: '50%+', label: 'Finance Income\nPer Deal' },
  { num: '15%+', label: 'Repeat-Purchase\nLift' },
  { num: '100%', label: 'Customer Data\nOwnership' },
  { num: '<120', label: 'Days\nTo Launch' }];


  return (
    <section style={{ background: T.navy, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        padding: isMobile ? '0 20px' : isTablet ? '0 32px' : '0 56px',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
      }}>
        {stats.map((s, i) =>
        <div key={i} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center',
          padding: isMobile ? '36px 12px' : '44px 24px',
          borderLeft: !isMobile && i > 0 ? `1px solid ${T.border}` :
          isMobile && i % 2 === 1 ? `1px solid ${T.border}` : 'none',
          borderTop: isMobile && i >= 2 ? `1px solid ${T.border}` : 'none'
        }}>
            <div style={{
            fontSize: isMobile ? 34 : 44, fontWeight: 500,
            fontFamily: FONT_DISPLAY, color: T.brass,
            letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 10
          }}>{s.num}</div>
            <div style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.13em',
            color: T.steel, textTransform: 'uppercase', lineHeight: 1.65,
            whiteSpace: 'pre-line'
          }}>{s.label}</div>
          </div>
        )}
      </div>
    </section>);

}

Object.assign(window, { Nav, Hero, TheReality, HowItWorks, WhyBrivio, WinWhenYouWinSection, RooftopsWeServe, CalcTeaser, About, Contact, Footer });