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
// items: { q: string, a: string } — sourced from green-highlighted content in FAQs.docx
const FAQ_CATEGORIES = [
{
  num: '01',
  label: 'How It Works',
  items: [
  { q: 'Does my dealership need any additional licensing, or does Brivio handle it?', a: 'No. Brivio handles all licensing and compliance. Your dealership operates under our regulatory framework, under your own brand. No additional burden on your end.' },
  { q: 'What states can we operate in, and how long does multi-state licensing take?', a: 'We\u2019re expanding state by state and moving quickly. If we\u2019re not yet licensed in your state, it typically takes 30 to 90 days to get there. Contact us to find out your timeline.' },
  { q: 'Can I keep working with my existing bank lenders alongside the Brivio program?', a: 'Yes. You keep all of your existing lender relationships. The difference is that loans routed through Brivio will earn you more income than you receive from other partners.' },
  { q: 'How do you differ from the current lenders I use today?', a: 'Today, your lender earns the income and owns the customer relationship after the sale. With Brivio, you do. Loans originate under your brand. You earn additional income and retain access to your customers\u2019 portfolio data \u2026 giving you a significant advantage when they\u2019re ready to buy again.' },
  { q: 'Why wouldn\u2019t I just build my own captive lender, like AutoNation did?', a: 'You could \u2026 and some of the largest dealer groups have. But AutoNation paid $85 million to acquire an existing lender before originating a single loan. Brivio gives you the same strategic advantages for a fraction of that cost, without the capital commitment, licensing burden, or operational complexity of building it yourself.' }]
},
{
  num: '02',
  label: 'The Economics',
  items: [
  { q: 'How do I actually make money on this \u2014 what changes about my per-deal economics?', a: 'Loans originated under your brand will earn additional income when sold to an investor. That\u2019s on top of your standard dealer reserve. We\u2019ll walk you through exactly what that means for your volume.' },
  { q: 'Is my finance reserve affected with this program?', a: 'No. The income you earn under your brand is on top of your standard dealer reserve.' },
  { q: 'What are the upfront costs, and what\u2019s the ongoing fee structure?', a: 'There\u2019s a modest one-time setup fee and an ongoing fee structure that scales with your program. We\u2019ll walk you through the full detail on our first call.' },
  { q: 'How does Brivio make money? What\u2019s the alignment between our interests?', a: 'Brivio earns modest fees for running the platform. Primarily, we earn a share of the income your program generates \u2014 so we only do well when your program does. There\u2019s no incentive for us to push volume that doesn\u2019t work for your business.' },
  { q: 'Are there long-term commitments or contract minimums?', a: 'No. If we\u2019re not the right partner for you, you\u2019re free to walk away. We\u2019d rather earn your business every day than lock you into a contract.' }]
},
{
  num: '03',
  label: 'Operations',
  items: [
  { q: 'Does my F&I team have to learn new systems or change how they handle deals?', a: 'No. Your F&I processes stay exactly the same. Nothing changes, except you now have the opportunity to earn more by sending the loan to a lender under your own brand.' }]
},
{
  num: '04',
  label: 'Other Questions',
  items: [
  { q: 'Does my dealership take on credit risk, or does Brivio?', a: 'Your obligations as a dealer stay exactly the same \u2014 you\u2019re responsible for verifying customer information and representations, as you always have been. Beyond that, credit risk transfers to the investor when the loan is sold. You are not on the hook for borrower defaults.' },
  { q: 'What regulatory exposure does my dealership take on?', a: 'Nothing beyond what you do today. Brivio manages all regulatory and compliance requirements on your behalf.' },
  { q: 'Is customer data secure?', a: 'Yes. Brivio maintains strict data security and privacy standards, and your customer data is never shared or sold to unauthorized third parties.' },
  { q: 'What happens if regulations change?', a: 'Brivio stays current on regulatory requirements and works with legal and compliance partners to meet the latest standards.' }]
}];


// ─── FAQ ITEM (accordion row) ────────────────────────────────────────────────
function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useViewport();
  const hasAnswer = Boolean(item.a);
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
        }}>{item.q}</span>
        {/* Plus / minus toggle */}
        <span style={{ flexShrink: 0, width: 24, height: 24, marginTop: 1, position: 'relative', color: T.brass }}>
          <span style={{ position: 'absolute', top: '50%', left: '50%', width: 14, height: 1.5, background: 'currentColor', transform: 'translate(-50%,-50%)' }} />
          <span style={{ position: 'absolute', top: '50%', left: '50%', width: 1.5, height: 14, background: 'currentColor', transform: `translate(-50%,-50%) scaleY(${open ? 0 : 1})`, transition: 'transform 0.25s ease' }} />
        </span>
      </button>
      <div style={{
        overflow: 'hidden', maxHeight: open ? 400 : 0, opacity: open ? 1 : 0,
        transition: 'max-height 0.35s ease, opacity 0.32s ease'
      }}>
        <div style={{ padding: isMobile ? '2px 0 22px' : '2px 0 26px', maxWidth: 680 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.brass, textTransform: 'uppercase', marginBottom: 10 }}>Answer</div>
          <p style={{ fontSize: isMobile ? 14.5 : 15.5, color: hasAnswer ? T.bodyText : T.mutedText, fontStyle: hasAnswer ? 'normal' : 'italic', lineHeight: 1.65, margin: 0 }}>{hasAnswer ? item.a : '[Answer to be added]'}</p>
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
          {cat.items.map((item, i) => <FAQItem key={i} item={item} />)}
        </div>
      </div>
    </section>);

}

// ─── FAQ HEADER ──────────────────────────────────────────────────────────────
function FAQHeader() {
  const [mounted, setMounted] = useState(false);
  const { isMobile, isTablet } = useViewport();
  useEffect(() => {const t = setTimeout(() => setMounted(true), 60);return () => clearTimeout(t);}, []);
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
        <p style={{ fontSize: isMobile ? 16 : 18, color: T.bodyText, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>The questions dealer principals actually ask – answered straight

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
        }}>Talk to the people who built it

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
  useEffect(() => {window.scrollTo(0, 0);}, []);
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