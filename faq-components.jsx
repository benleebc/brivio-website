// faq-components.jsx – Brivio Capital "FAQ" page.
// Relies on globals from landing-components.jsx (loaded first):
//   T, FONT_UI, FONT_DISPLAY, btnPrimary, Arrow, Eyebrow, useReveal, useViewport, Footer
// Do NOT redeclare those names here (shared Babel global scope).

// ─── FAQ NAV ─────────────────────────────────────────────────────────────────
function FAQNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile, isTablet } = useViewport();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navItems = [
  { label: 'How it Works', href: 'index.html#how-it-works' },
  { label: 'Why Brivio', href: 'index.html#why' },
  { label: 'About Us', href: 'about.html' },
  { label: 'FAQs', href: 'faq.html', active: true }];

  const linkSt = {
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    color: 'rgba(245,247,249,0.62)', fontSize: 13, fontWeight: 400, letterSpacing: '0.03em',
    fontFamily: 'inherit', transition: 'color 0.2s', whiteSpace: 'nowrap', textDecoration: 'none'
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: isMobile ? 64 : 84, display: 'flex', alignItems: 'center',
      padding: isMobile ? '0 20px' : isTablet ? '0 32px' : '0 56px',
      background: scrolled || menuOpen ? 'rgba(13,27,42,0.94)' : 'rgba(13,27,42,0.6)',
      backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'blur(6px)',
      borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
      transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s'
    }}>
      <a href="index.html" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={window.__resources.brivioLockup} alt="Brivio Capital" style={{ height: isMobile ? 36 : 48 }} />
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
            <span style={{ width: 22, height: 1.5, background: T.offwhite, transition: 'transform 0.25s, opacity 0.25s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4.5px)' : 'none' }} />
            <span style={{ width: 22, height: 1.5, background: T.offwhite, transition: 'opacity 0.25s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 1.5, background: T.offwhite, transition: 'transform 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4.5px)' : 'none' }} />
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
          <a key={item.label} href={item.href} style={{
            ...linkSt, color: item.active ? T.brass : T.offwhite, fontSize: 16, textAlign: 'left',
            padding: '8px 0', borderBottom: `1px solid ${T.border}`
          }}>
                  {item.label}
                </a>
          )}
              <a href="index.html#contact" style={{ ...btnPrimary, height: 48, justifyContent: 'center', marginTop: 8 }}>
                Apply to Partner
              </a>
            </div>
        }
        </> :

      <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 20 : 32 }}>
          {navItems.map((item) =>
        <a key={item.label} href={item.href} style={{ ...linkSt, color: item.active ? T.brass : 'rgba(245,247,249,0.62)' }}
        onMouseEnter={(e) => e.currentTarget.style.color = T.offwhite}
        onMouseLeave={(e) => e.currentTarget.style.color = item.active ? T.brass : 'rgba(245,247,249,0.62)'}>
              {item.label}
            </a>
        )}
          <a href="index.html#contact" style={{ ...btnPrimary, height: 40, padding: '0 22px', fontSize: 11, whiteSpace: 'nowrap' }}
        onMouseEnter={(e) => e.currentTarget.style.background = T.brassLight}
        onMouseLeave={(e) => e.currentTarget.style.background = T.brass}>
            Apply to Partner
          </a>
        </div>
      }
    </nav>);

}

// ─── FAQ DATA ────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
{
  num: '01',
  label: 'About the Program',
  items: [
  'What exactly is Brivio\u2019s relationship to my dealership – vendor, partner, or lender?',
  'Who actually owns the loans that get originated?',
  'Does my dealership become a licensed lender, or does Brivio handle the licensing?',
  'What states can we operate in, and how long does multi-state licensing take?',
  'Can I keep working with my existing bank lenders alongside the Brivio program?',
  'What does Brivio actually do that my dealership doesn\u2019t already do today?',
  'Is there a minimum dealership size or loan volume to participate?']

},
{
  num: '02',
  label: 'About the Economics',
  items: [
  'How do I actually make money on this – what changes about my per-deal economics?',
  'Is my finance reserve affected with this program?',
  'What are the upfront costs, and what\u2019s the ongoing fee structure?',
  'When do I start earning, and how is that revenue recognized on my books?',
  'How does Brivio make money? What\u2019s the alignment between our interests?',
  'What happens if my loan volumes are lower than projected – am I locked into fees?',
  'Are there long-term commitments or contract minimums?',
  'What\u2019s the payback period on the setup costs?',
  'How do gain-on-sale economics work, and when do those payments flow?']

},
{
  num: '03',
  label: 'About the Operations',
  items: [
  'Does my F&I team have to learn new systems or change how they handle deals?',
  'How does this integrate with my existing DealerTrack or RouteOne workflow?',
  'What does the actual customer experience look like – what do my buyers see?',
  'Who handles underwriting decisions, and how fast are they?',
  'Who handles collections if a loan goes delinquent?',
  'What happens if a customer disputes a charge or files a complaint?',
  'Does my dealership take on credit risk, or does Brivio?',
  'Will my floor managers and sales staff need training?',
  'Can I see and report on my portfolio\u2019s performance in real time?']

},
{
  num: '04',
  label: 'About the Risk',
  items: [
  'What happens to my program if Brivio goes out of business?',
  'Who would service my existing loans if Brivio shut down or got acquired?',
  'Can my customer data be transferred to another platform if I want to exit?',
  'What\u2019s the exit process if I decide the program isn\u2019t working?',
  'Do I have any personal liability as a dealer principal?',
  'What regulatory exposure does my dealership take on?',
  'How is Brivio funded, and what\u2019s the company\u2019s financial runway?',
  'Who are Brivio\u2019s capital partners, and how stable is the funding model?']

},
{
  num: '05',
  label: 'About Brivio',
  items: [
  'Why aren\u2019t there customer testimonials on the site?',
  'How many dealer groups are currently using Brivio?',
  'When did Brivio actually launch?',
  'Has the model been proven elsewhere in the auto industry?',
  'Who\u2019s on the team beyond the founders?',
  'What\u2019s Brivio\u2019s funding stage?',
  'Who are the investors and capital partners?',
  'What\u2019s Brivio\u2019s plan if you don\u2019t reach scale quickly?']

},
{
  num: '06',
  label: 'About the Competitive Landscape',
  items: [
  'How is Brivio different from Octane?',
  'Why wouldn\u2019t I just build my own captive lender, like AutoNation did?',
  'How does this compare to working with a fintech lender like Upgrade or Upstart?',
  'Why is this different from working with a bank\u2019s white-label program?',
  'What stops a bank from offering the same model?',
  'If this is so valuable, why hasn\u2019t anyone done it yet?']

}];


// ─── FAQ ITEM (accordion row) ────────────────────────────────────────────────
function FAQItem({ q }) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useViewport();
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20,
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        padding: isMobile ? '20px 0' : '24px 0', fontFamily: 'inherit'
      }}>
        <span style={{
          fontSize: isMobile ? 15.5 : 17, fontWeight: 500,
          color: open ? T.offwhite : 'rgba(245,247,249,0.84)', lineHeight: 1.45,
          letterSpacing: '-0.005em', transition: 'color 0.2s'
        }}>{q}</span>
        {/* Plus / minus toggle */}
        <span style={{ flexShrink: 0, width: 24, height: 24, marginTop: 1, position: 'relative', color: T.brass }}>
          <span style={{ position: 'absolute', top: '50%', left: '50%', width: 14, height: 1.5, background: 'currentColor', transform: 'translate(-50%,-50%)' }} />
          <span style={{ position: 'absolute', top: '50%', left: '50%', width: 1.5, height: 14, background: 'currentColor', transform: `translate(-50%,-50%) scaleY(${open ? 0 : 1})`, transition: 'transform 0.25s ease' }} />
        </span>
      </button>
      <div style={{
        overflow: 'hidden', maxHeight: open ? 220 : 0, opacity: open ? 1 : 0,
        transition: 'max-height 0.32s ease, opacity 0.32s ease'
      }}>
        <div style={{ padding: isMobile ? '2px 0 22px' : '2px 0 26px', maxWidth: 680 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.brass, textTransform: 'uppercase', marginBottom: 10 }}>Answer</div>
          <p style={{ fontSize: isMobile ? 14.5 : 15.5, color: T.mutedText, fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>[Answer to be added]</p>
        </div>
      </div>
    </div>);

}

// ─── FAQ CATEGORY (two-column section) ───────────────────────────────────────
function FAQCategory({ cat, background }) {
  const [ref, visible] = useReveal();
  const { isMobile, isTablet } = useViewport();
  return (
    <section style={{
      background, borderTop: `1px solid ${T.border}`,
      padding: isMobile ? '56px 20px' : isTablet ? '72px 32px' : '88px 56px'
    }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '4fr 8fr',
        gap: isMobile ? 24 : 80, alignItems: 'start',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div style={{ position: isMobile ? 'static' : 'sticky', top: 116 }}>
          <Eyebrow>{cat.num}</Eyebrow>
          <h2 style={{
            fontSize: isMobile ? 24 : 30, fontWeight: 500, fontFamily: FONT_DISPLAY,
            letterSpacing: '-0.01em', color: T.offwhite, margin: '0 0 12px', lineHeight: 1.2,
            maxWidth: 300
          }}>
            {cat.label}
          </h2>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', color: T.steel }}>
            {cat.items.length} questions
          </div>
        </div>
        <div>
          {cat.items.map((q, i) => <FAQItem key={i} q={q} />)}
        </div>
      </div>
    </section>);

}

// ─── FAQ HEADER ──────────────────────────────────────────────────────────────
function FAQHeader() {
  const [mounted, setMounted] = useState(false);
  const { isMobile, isTablet } = useViewport();
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  return (
    <section style={{
      background: T.navy, position: 'relative', overflow: 'hidden',
      padding: isMobile ? '132px 20px 64px' : isTablet ? '160px 32px 80px' : '188px 56px 100px'
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(245,247,249,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,249,0.022) 1px, transparent 1px)`,
        backgroundSize: isMobile ? '48px 48px' : '72px 72px'
      }} />
      <div style={{
        position: 'absolute', top: -120, right: -80, width: 460, height: 460,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(185,155,95,0.08) 0%, transparent 65%)'
      }} />
      <div style={{
        position: 'relative', maxWidth: 1100, margin: '0 auto',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}>
        <Eyebrow>FAQ</Eyebrow>
        <h1 style={{
          fontSize: isMobile ? 'clamp(34px, 9vw, 46px)' : 'clamp(48px, 5.6vw, 76px)',
          fontWeight: 500, fontFamily: FONT_DISPLAY,
          letterSpacing: '-0.02em', lineHeight: 1.06,
          color: T.offwhite, margin: '0 0 20px', maxWidth: 900
        }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: isMobile ? 16 : 18, color: T.bodyText, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
          The questions dealer principals actually ask – answered straight.
        </p>
      </div>
    </section>);

}

// ─── FAQ CONTACT BAND ────────────────────────────────────────────────────────
function FAQContact() {
  const [ref, visible] = useReveal();
  const { isMobile, isTablet } = useViewport();
  return (
    <section style={{
      background: T.graphite, borderTop: `1px solid ${T.border}`,
      padding: isMobile ? '64px 20px' : isTablet ? '84px 32px' : '104px 56px'
    }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <Eyebrow>STILL HAVE QUESTIONS</Eyebrow>
        <h2 style={{
          fontSize: isMobile ? 26 : 34, fontWeight: 500, fontFamily: FONT_DISPLAY,
          letterSpacing: '-0.01em', color: T.offwhite, margin: '0 0 28px', lineHeight: 1.2,
          maxWidth: 620
        }}>
          Talk to the people who built it.
        </h2>
        <a href="index.html#contact" style={{ ...btnPrimary, ...(isMobile ? { height: 48, padding: '0 24px' } : {}) }}
        onMouseEnter={(e) => e.currentTarget.style.background = T.brassLight}
        onMouseLeave={(e) => e.currentTarget.style.background = T.brass}>
          Apply to Partner <Arrow />
        </a>
      </div>
    </section>);

}

// ─── FAQ PAGE ────────────────────────────────────────────────────────────────
function FAQPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <FAQNav />
      <FAQHeader />
      {FAQ_CATEGORIES.map((cat, i) =>
      <FAQCategory key={cat.num} cat={cat} background={i % 2 === 0 ? T.graphite : T.navy} />
      )}
      <FAQContact />
      <Footer />
    </>);

}

Object.assign(window, { FAQPage });
