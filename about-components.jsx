// about-components.jsx – Brivio Capital "About Us" page.
// Relies on globals declared in landing-components.jsx (loaded first):
//   T, FONT_UI, FONT_DISPLAY, btnPrimary, Arrow, Eyebrow, useReveal, useViewport, Footer
// Do NOT redeclare those names here (shared Babel global scope).

// ─── ABOUT NAV ───────────────────────────────────────────────────────────────
// Visually identical to the homepage Nav, but every item is a real link so it
// works as a standalone page. "How it Works" / "Why Brivio" jump to the homepage
// sections; "About Us" is the current page; "Apply to Partner" → contact.
function AboutNav() {
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
  { label: 'About Us', href: 'about.html', active: true },
  { label: 'FAQs', href: 'faq.html' }];

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
      <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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

// ─── LINKEDIN ICON ───────────────────────────────────────────────────────────
function LinkedInLink({ href, name }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn`}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 30, height: 30, borderRadius: 4, flexShrink: 0,
      border: `1px solid ${T.border}`, color: T.brass,
      textDecoration: 'none', transition: 'background 0.2s, border-color 0.2s, color 0.2s'
    }}
    onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(185,155,95,0.12)';e.currentTarget.style.borderColor = T.brass;}}
    onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.borderColor = T.border;}}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    </a>);

}

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
const ABOUT_FOUNDERS = [
{
  photoKey: 'charlesHeadshot',
  name: 'Charles Do',
  role: 'Founder & CEO',
  linkedin: 'https://www.linkedin.com/in/charles-do/',
  tagline: 'Bank. Captive. Fintech. One of the few auto finance executives to have led businesses inside all three',
  bio: 'Charles began at GMAC and lived through the 2008 financial crisis as it became Ally Financial. At JPMorgan Chase, he led three auto finance businesses, including the bank\u2019s white-label captive program for Jaguar Land Rover. He later launched Best Egg\u2019s auto lending business as Head of Auto. Most recently led Harley-Davidson Financial Services through a landmark forward flow transaction with KKR and PIMCO, including a 9.8% equity sale of the business.'
},
{
  photoKey: 'benHeadshot',
  name: 'Ben Lee',
  role: 'Co-Founder & COO',
  linkedin: 'https://www.linkedin.com/in/benjamin-lee-81b7878/',
  tagline: 'Priced and scaled auto lending businesses across the largest institutions in auto finance',
  bio: 'Ben began his career in GE Capital\u2019s Financial Management Program before joining Ally Financial in 2010, where he ran stress testing as the bank rebuilt under post-crisis regulatory scrutiny. At JPMorgan Chase, he led pricing across the bank\u2019s auto originations portfolio, including the white-label captive programs for Mazda, Subaru, and Jaguar Land Rover, before continuing that work at Santander. He later joined Best Egg to help build and ultimately led the auto lending business.'
}];

function AboutHeader() {
  const [mounted, setMounted] = useState(false);
  const { isMobile, isTablet } = useViewport();
  useEffect(() => {const t = setTimeout(() => setMounted(true), 60);return () => clearTimeout(t);}, []);
  return (
    <section style={{
      background: T.navy, position: 'relative', overflow: 'hidden',
      padding: isMobile ? '140px 20px 72px' : isTablet ? '170px 32px 96px' : '200px 56px 120px'
    }}>
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(245,247,249,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,249,0.022) 1px, transparent 1px)`,
        backgroundSize: isMobile ? '48px 48px' : '72px 72px'
      }} />
      {/* Brass ambient glow */}
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
        <Eyebrow>ABOUT US</Eyebrow>
        <h1 style={{
          fontSize: isMobile ? 'clamp(32px, 8.5vw, 44px)' : 'clamp(46px, 5.4vw, 72px)',
          fontWeight: 500, fontFamily: FONT_DISPLAY,
          letterSpacing: '-0.02em', lineHeight: 1.08,
          color: T.offwhite, margin: 0, maxWidth: 980
        }}>
          30 years inside auto lenders{' '}
          <span style={{ color: T.brass }}>Now building the alternative</span>
        </h1>
      </div>
    </section>);

}

function AboutProse({ eyebrow, title, paras, background, emphasizeShort }) {
  const [ref, visible] = useReveal();
  const { isMobile, isTablet } = useViewport();
  const isLight = background === T.bgLight;
  return (
    <section style={{
      background, borderTop: `1px solid ${isLight ? T.cardBorderLight : T.border}`,
      padding: isMobile ? '72px 20px' : isTablet ? '92px 32px' : '110px 56px'
    }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '4fr 8fr',
        gap: isMobile ? 28 : 80, alignItems: 'start',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 style={{
            fontSize: isMobile ? 32 : 46, fontWeight: 500, fontFamily: FONT_DISPLAY,
            letterSpacing: '-0.01em', color: isLight ? T.textOnLight : T.offwhite, margin: 0, lineHeight: 1.18,
            maxWidth: 360
          }}>
            {title}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 18 : 22, maxWidth: 680 }}>
          {paras.map((p, i) => {
            const isShort = emphasizeShort && p.trim().split(' ').length <= 3;
            return (
              <p key={i} style={{
                fontSize: isShort ? isMobile ? 18 : 20 : isMobile ? 15.5 : 17,
                color: isShort ? (isLight ? T.brassDark : T.brass) : (isLight ? T.bodyOnLight : T.bodyText),
                fontWeight: isShort ? 500 : 400,
                lineHeight: 1.7, margin: 0,
                fontFamily: isShort ? FONT_DISPLAY : FONT_UI,
                letterSpacing: isShort ? '-0.005em' : 'normal'
              }}>{p}</p>);

          })}
        </div>
      </div>
    </section>);

}

function FounderCard({ f }) {
  const { isMobile } = useViewport();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: isMobile ? 18 : 22, alignItems: 'center', marginBottom: 22 }}>
        <div style={{
          width: isMobile ? 84 : 104, height: isMobile ? 84 : 104, flexShrink: 0,
          borderRadius: '50%', overflow: 'hidden',
          background: T.navy, border: `1px solid ${T.cardBorderLight}`
        }}>
          {/* Headshot – swap the file at assets/<name>_headshot.png to replace */}
          <img src={window.__resources[f.photoKey]} alt={f.name} style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top'
          }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: FONT_DISPLAY, fontSize: isMobile ? 24 : 28, fontWeight: 500,
              color: T.textOnLight, margin: 0, letterSpacing: '-0.01em'
            }}>{f.name}</h3>
            <LinkedInLink href={f.linkedin} name={f.name} />
          </div>
          <div style={{
            fontSize: 13, fontWeight: 500, letterSpacing: '0.13em', color: T.brassDark,
            textTransform: 'uppercase'
          }}>{f.role}</div>
        </div>
      </div>

      <p style={{
        fontStyle: 'italic', fontSize: isMobile ? 17 : 20, lineHeight: 1.6,
        color: T.textOnLight, margin: '0 0 18px', fontWeight: 400, letterSpacing: '-0.005em'
      }}>{f.tagline}</p>

      <p style={{ fontSize: isMobile ? 14 : 15, color: T.bodyOnLight, lineHeight: 1.75, margin: 0 }}>{f.bio}</p>
    </div>);

}

function AboutFounders() {
  const [ref, visible] = useReveal();
  const { isMobile, isTablet } = useViewport();
  return (
    <section style={{
      background: T.bgLight, borderTop: `1px solid ${T.cardBorderLight}`,
      padding: isMobile ? '72px 20px' : isTablet ? '92px 32px' : '110px 56px'
    }}>
      <div ref={ref} style={{
        maxWidth: 1100, margin: '0 auto',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease'
      }}>
        <div style={{ marginBottom: isMobile ? 44 : 64 }}>
          <Eyebrow>THE FOUNDERS</Eyebrow>
          <h2 style={{
            fontSize: isMobile ? 32 : 46, fontWeight: 500, fontFamily: FONT_DISPLAY,
            letterSpacing: '-0.01em', color: T.textOnLight, margin: 0, lineHeight: 1.18
          }}>
            The operators behind Brivio
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 48 : 72
        }}>
          {ABOUT_FOUNDERS.map((f, i) => <FounderCard key={i} f={f} />)}
        </div>

        {/* Closing line */}
        <div style={{
          marginTop: isMobile ? 48 : 72, paddingTop: isMobile ? 40 : 56,
          borderTop: `1px solid ${T.cardBorderLight}`
        }}>
          <p style={{
            fontStyle: 'italic', fontFamily: FONT_DISPLAY,
            fontSize: isMobile ? 22 : 30, lineHeight: 1.65, letterSpacing: '-0.01em',
            textAlign: isMobile ? 'left' : 'justify', wordSpacing: '0.18em',
            color: T.textOnLight, margin: '0 0 32px', fontWeight: 400
          }}>
            Together, we've spent three decades inside auto finance … running captives, leading pricing, and operating through every condition the market throws at lenders. If you're a dealer group ready to own your lending economics, let's talk.
          </p>
          <a href="index.html#contact" style={{ ...btnPrimary, ...(isMobile ? { height: 48, padding: '0 24px' } : {}) }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.brassLight}
          onMouseLeave={(e) => e.currentTarget.style.background = T.brass}>
            Apply to Partner <Arrow />
          </a>
        </div>
      </div>
    </section>);

}

function AboutPage() {
  useEffect(() => {
    // Honor a #hash on load (e.g. arriving mid-page); otherwise top.
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <AboutNav />
      <AboutHeader />
      <AboutProse
        eyebrow="WHAT WE SAW"
        title="What we saw from the inside"
        background={T.bgLight}
        paras={[
        'The auto finance system has a quiet imbalance. A dealership sells the car, builds the customer relationship, and arranges the loan … handing the keys to a lender that takes most of the economics. The lender also gets the customer, the data, and the payment history. The dealership did the heavy lifting of marketing and bringing in the customer. The value happens elsewhere.',
        'A handful of the largest dealer groups figured out how to fix this: they built their own captive lenders. Until now, that path required tens of millions in capital and over a year to build. Nearly every other dealer group stayed on the sidelines.']} />

      <AboutProse
        eyebrow="WHAT WE'RE DOING"
        title="What we're doing about it"
        background={T.navy}
        emphasizeShort
        paras={[
        'We spent three decades inside auto lenders, leading businesses that generated over $75 billion across the largest U.S. bank, OEM captives, and a leading consumer fintech. We know how this business actually works because we\u2019ve operated at scale.',
        'We\u2019re building Brivio because launching a captive lender shouldn\u2019t be reserved for the few dealer groups with the capital to build one from scratch.',
        'The infrastructure exists to make this accessible. The capital markets are open to dealer-originated paper. The technology can be assembled rather than built from scratch. The only thing missing was a team that understood every layer of the stack well enough to bring it together.',
        'That\u2019s us.',
        'We\u2019re doing this now because the moment is right and the gap is real – and because dealers have been doing the work without keeping the economics for long enough.']} />

      <AboutFounders />
      <Footer />
    </>);

}

Object.assign(window, { AboutPage });