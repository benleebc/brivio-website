// calc-component.jsx – Brivio Capital "What you're giving up today" calculator.
// Reframed from a Brivio-earnings projection to the dealer's OPPORTUNITY COST:
// the finance income currently flowing to outside lenders. All figures are built
// on transparent, industry-level loan economics – not Brivio-specific performance.
// Exposed as window.CalculatorPage.
const { useState: cUseState, useEffect: cUseEffect, useRef: cUseRef } = React;

const cT = {
  navy:       '#0D1B2A',
  graphite:   '#2B2F33',
  brass:      '#B99B5F',
  brassLight: '#D4BA85',
  brassDark:  '#8C7547',
  steel:      '#656B72',
  bodyText:   '#A8ADB3',
  mutedText:  '#7B8289',
  offwhite:   '#F5F7F9',
  border:     'rgba(245,247,249,0.08)',
  borderMed:  'rgba(245,247,249,0.14)',
  surfaceElev:'#3A4046',
};

const C_FONT_UI      = "'InterVariable','Inter','Helvetica Neue',Arial,sans-serif";
const C_FONT_DISPLAY = "'InterDisplay','InterVariable','Inter','Helvetica Neue',Arial,sans-serif";

// ── Industry assumption ──────────────────────────────────────────────────
// Estimated lender finance income retained over the life of a typical auto loan,
// expressed as a share of originated principal. Industry-level, deliberately
// conservative, and shown to the user so the figure is verifiable.
const LENDER_LIFETIME_MARGIN = 0.04; // 4% of originated principal over the 3–5yr life

// ── Responsive hook ─────────────────────────────────────────────────────
function cUseViewport() {
  const [width, setWidth] = cUseState(window.innerWidth);
  cUseEffect(() => {
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

function cFmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

// ── Animated number ─────────────────────────────────────────────────────
function CAnimatedNumber({ value, prefix = '$', duration = 600 }) {
  const [display, setDisplay] = cUseState(value);
  const frameRef = cUseRef(null);
  const startRef = cUseRef(null);
  const fromRef  = cUseRef(value);

  cUseEffect(() => {
    const from = fromRef.current;
    const to   = value;
    if (from === to) return;
    startRef.current = null;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    function step(ts) {
      if (!startRef.current) startRef.current = ts;
      const prog = Math.min((ts - startRef.current) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setDisplay(Math.round(from + (to - from) * ease));
      if (prog < 1) frameRef.current = requestAnimationFrame(step);
      else fromRef.current = to;
    }
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <span>{prefix}{display.toLocaleString('en-US')}</span>;
}

// ── Slider ──────────────────────────────────────────────────────────────
function CSlider({ label, value, min, max, step = 1, onChange, money, hint }) {
  const THUMB = 18;
  const pct = ((value - min) / (max - min)) * 100;
  const fillWidth = `calc(${pct}% * (1 - ${THUMB}px / 100%) + ${THUMB / 2}px)`;
  const [inputValue, setInputValue] = cUseState(String(value));

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputValue(text);
    const num = parseInt(text.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= min && num <= max) onChange(num);
  };
  const handleInputBlur = () => setInputValue(String(value));
  cUseEffect(() => { setInputValue(String(value)); }, [value]);

  const getFormattedDisplay = (val) => money ? '$' + val.toLocaleString() : val.toLocaleString();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '0.12em', color: cT.steel, textTransform: 'uppercase' }}>{label}</span>
        <input
          type="text"
          value={money ? getFormattedDisplay(value) : value.toLocaleString()}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          style={{
            fontSize: 22, fontWeight: 500, color: cT.offwhite, fontFamily: C_FONT_DISPLAY, letterSpacing: '-0.01em',
            background: 'transparent', border: 'none', outline: 'none', textAlign: 'right',
            width: '150px', padding: 0, cursor: 'text'
          }}
        />
      </div>
      <div style={{ position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%',
          transform: 'translateY(-50%)', height: 2,
          background: 'rgba(245,247,249,0.1)', borderRadius: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: 0, top: '50%',
          transform: 'translateY(-50%)',
          width: fillWidth, height: 2,
          background: cT.brass, borderRadius: 2,
          pointerEvents: 'none', transition: 'width 0.04s linear',
        }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'relative', zIndex: 1, margin: 0 }} />
      </div>
      {hint && <div style={{ fontSize: 12, color: cT.mutedText, fontStyle: 'italic', marginTop: -2 }}>{hint}</div>}
    </div>
  );
}

// ── Opportunity-cost comparison card ─────────────────────────────────────
function COppCard({ label, value, sub, animKey, accent }) {
  const { isMobile } = cUseViewport();
  return (
    <div style={{
      background: accent ? 'rgba(185,155,95,0.07)' : cT.navy,
      border: `1px solid ${accent ? cT.brass : cT.border}`,
      borderRadius: 12, padding: isMobile ? '24px 22px' : '30px 28px',
      display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden',
    }}>
      {accent && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cT.brass}, ${cT.brassLight})` }} />
      )}
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', color: accent ? cT.brass : cT.mutedText, textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontSize: isMobile ? 30 : 40, fontWeight: 500, fontFamily: C_FONT_DISPLAY,
        color: accent ? cT.brass : cT.offwhite, letterSpacing: '-0.02em', lineHeight: 1,
      }}>
        <CAnimatedNumber key={`${label}-${animKey}`} value={value} />
      </div>
      <div style={{ fontSize: 14, color: cT.bodyText, lineHeight: 1.55 }}>{sub}</div>
    </div>
  );
}

// ── Calculator nav ──────────────────────────────────────────────────────
// Full top banner, matching the homepage / About / FAQ nav exactly:
// How it Works | Why Brivio | About Us | FAQs  +  Apply to Partner.
function CalcNav({ onGoHome, onContact }) {
  const [scrolled, setScrolled] = cUseState(false);
  const [menuOpen, setMenuOpen] = cUseState(false);
  const { isMobile, isTablet } = cUseViewport();
  cUseEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navItems = [
    { label: 'How it Works', href: 'index.html#how-it-works' },
    { label: 'Why Brivio',   href: 'index.html#why' },
    { label: 'About Us',     href: 'about.html' },
    { label: 'FAQs',         href: 'faq.html' },
  ];

  const linkSt = {
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    color: 'rgba(245,247,249,0.62)', fontSize: 13, fontWeight: 400, letterSpacing: '0.03em',
    fontFamily: 'inherit', transition: 'color 0.2s', whiteSpace: 'nowrap', textDecoration: 'none',
  };

  const ctaPrimary = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: cT.brass, color: cT.navy, borderRadius: 2,
    fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase',
    textDecoration: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
    transition: 'background 0.2s',
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: isMobile ? 64 : 84, display: 'flex', alignItems: 'center',
      padding: isMobile ? '0 20px' : isTablet ? '0 32px' : '0 56px',
      background: scrolled || menuOpen ? 'rgba(13,27,42,0.94)' : 'rgba(13,27,42,0.6)',
      backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'blur(6px)',
      borderBottom: scrolled ? `1px solid ${cT.border}` : '1px solid transparent',
      transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
    }}>
      <a href="/" onClick={(e) => { e.preventDefault(); onGoHome(); }} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer' }}>
        <img src={window.__resources.brivioLockup} alt="Brivio Capital" style={{ height: isMobile ? 36 : 48 }} />
      </a>
      <div style={{ flex: 1 }} />

      {isMobile ? (
        <>
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 8,
              display: 'flex', flexDirection: 'column', gap: 5,
              width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
            }}>
            <span style={{ width: 22, height: 1.5, background: cT.offwhite, transition: 'transform 0.25s, opacity 0.25s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4.5px)' : 'none' }} />
            <span style={{ width: 22, height: 1.5, background: cT.offwhite, transition: 'opacity 0.25s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 1.5, background: cT.offwhite, transition: 'transform 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4.5px)' : 'none' }} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 64, left: 0, right: 0,
              background: 'rgba(13,27,42,0.98)', backdropFilter: 'blur(16px)',
              borderTop: `1px solid ${cT.border}`,
              padding: '24px 20px 32px',
              display: 'flex', flexDirection: 'column', gap: 22,
            }}>
              {navItems.map((item) => (
                <a key={item.label} href={item.href} style={{
                  ...linkSt, color: cT.offwhite, fontSize: 16, textAlign: 'left',
                  padding: '8px 0', borderBottom: `1px solid ${cT.border}`,
                }}>
                  {item.label}
                </a>
              ))}
              <a href="index.html#contact" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onContact(); }} style={{ ...ctaPrimary, height: 48, marginTop: 8 }}>
                Apply to Partner
              </a>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 20 : 32 }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} style={linkSt}
              onMouseEnter={(e) => e.currentTarget.style.color = cT.offwhite}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,247,249,0.62)'}>
              {item.label}
            </a>
          ))}
          <a href="index.html#contact" onClick={(e) => { e.preventDefault(); onContact(); }} style={{ ...ctaPrimary, height: 40, padding: '0 22px', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background = cT.brassLight}
            onMouseLeave={e => e.currentTarget.style.background = cT.brass}>
            Apply to Partner
          </a>
        </div>
      )}
    </nav>
  );
}

// ── Main calculator page ────────────────────────────────────────────────
function CalculatorPage({ onGoHome, onContact }) {
  const [locations,  setLocations]  = cUseState(10);
  const [monthly,    setMonthly]    = cUseState(18);
  const [avgLoan,    setAvgLoan]    = cUseState(37100);
  const [fee,        setFee]        = cUseState(850);
  const [animKey,    setAnimKey]    = cUseState(0);
  const { isMobile, isTablet } = cUseViewport();

  const timerRef = cUseRef(null);
  function handleChange(setter, val) {
    setter(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAnimKey(k => k + 1), 120);
  }

  // ── Opportunity-cost math (industry-level, not Brivio-specific) ──
  const annualLoans   = locations * monthly * 12;          // funded loans / year
  const annualVolume  = annualLoans * avgLoan;             // X – routed to lenders
  const lenderEarnings = annualVolume * LENDER_LIFETIME_MARGIN; // Y – lender keeps, over life
  const dealerOnce    = annualLoans * fee;                 // Z – what you're paid, once
  const multiple      = dealerOnce > 0 ? lenderEarnings / dealerOnce : 0;

  return (
    <div style={{ minHeight: '100vh', background: cT.navy }}>
      <CalcNav onGoHome={onGoHome} onContact={onContact} />

      {/* HERO */}
      <div className="calc-hero" style={{
        padding: isMobile ? '110px 20px 56px' : isTablet ? '130px 32px 64px' : '140px 56px 72px',
        maxWidth: 1100, margin: '0 auto', textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 24, height: 1, background: cT.brass, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.16em', color: cT.brass, textTransform: 'uppercase' }}>The opportunity cost</span>
        </div>
        <h1 style={{
          fontFamily: C_FONT_DISPLAY,
          fontSize: isMobile ? 'clamp(34px, 9vw, 48px)' : 'clamp(42px, 5vw, 66px)',
          fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.06,
          color: cT.offwhite, margin: '0 0 24px',
        }}>
          What you're <span style={{ color: cT.brass }}>giving up today</span>
        </h1>
        <p style={{ fontSize: isMobile ? 16 : 18, color: cT.bodyText, lineHeight: 1.65, maxWidth: 680, margin: 0 }}>
          Every loan your dealerships route to an outside lender hands away years of finance income. This calculator shows what that costs you – built on industry-level loan economics, not Brivio projections, so the numbers are yours to verify.
        </p>
      </div>

      <div className="calc-body" style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px 80px' : isTablet ? '0 32px 100px' : '0 56px 120px' }}>

        {/* INPUTS */}
        <div className="calc-inputs" style={{
          background: cT.graphite, border: `1px solid ${cT.border}`,
          borderRadius: 12, padding: isMobile ? '28px 24px' : '40px 48px', marginBottom: isMobile ? 28 : 40,
        }}>
          <div style={{ marginBottom: isMobile ? 28 : 36 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', color: cT.brass, textTransform: 'uppercase', marginBottom: 8 }}>Your dealer group</div>
            <p style={{ fontSize: 15, color: cT.bodyText }}>Adjust the inputs to match your operation. Defaults reflect a typical multi-rooftop group.</p>
          </div>
          <div className="calc-sliders" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 28 : '32px 56px' }}>
            <CSlider label="Number of locations" value={locations} min={1} max={100} step={1} onChange={v => handleChange(setLocations, v)} />
            <CSlider label="Monthly funded loans / location" value={monthly} min={1} max={150} step={1} onChange={v => handleChange(setMonthly, v)} />
            <CSlider label="Average loan size" value={avgLoan} money min={10000} max={100000} step={500} onChange={v => handleChange(setAvgLoan, v)} />
            <CSlider label="Reserve / flat fee per deal (today)" value={fee} money min={0} max={2000} step={25} onChange={v => handleChange(setFee, v)} hint="Optional – industry default shown. Set to your number." />
          </div>

          <div className="calc-summary" style={{
            marginTop: isMobile ? 32 : 40, paddingTop: isMobile ? 24 : 32, borderTop: `1px solid ${cT.border}`,
            display: 'flex', gap: isMobile ? 24 : 48, flexWrap: 'wrap',
          }}>
            {[
              { label: 'Annual funded loans', sublabel: '(locations × monthly × 12)', value: annualLoans.toLocaleString() },
              { label: 'Annual loan volume given away', sublabel: '(funded loans × avg loan size)', value: cFmt(annualVolume) },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', color: cT.mutedText, textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: cT.mutedText, fontStyle: 'italic', marginBottom: 8 }}>{s.sublabel}</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 500, fontFamily: C_FONT_DISPLAY, color: cT.offwhite }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RESULT – the opportunity cost */}
        <div style={{
          background: cT.graphite, border: `1px solid ${cT.brass}`,
          borderRadius: 12, padding: isMobile ? '32px 24px' : '48px 56px',
          position: 'relative', overflow: 'hidden', marginBottom: isMobile ? 20 : 24,
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cT.brass}, ${cT.brassLight})` }} />
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', color: cT.brass, textTransform: 'uppercase', marginBottom: isMobile ? 20 : 24 }}>The reality for your group</div>

          <p style={{
            fontFamily: C_FONT_DISPLAY, fontWeight: 500, letterSpacing: '-0.01em',
            fontSize: isMobile ? 19 : 26, lineHeight: 1.45, color: cT.offwhite,
            margin: 0,
          }}>
            Based on your volume, your dealerships are giving away{' '}
            <span style={{ color: cT.brass }}><CAnimatedNumber key={`x-${animKey}`} value={annualVolume} /></span>{' '}
            in annual loan volume to banks. They will earn an estimated{' '}
            <span style={{ color: cT.brass }}><CAnimatedNumber key={`y-${animKey}`} value={lenderEarnings} /></span>{' '}
            from your customers over the next 3 to 5 years.{' '}
            <span style={{ color: cT.brassLight }}>You'll be paid once.</span>
          </p>

          {/* Once vs years contrast */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 14 : 20, marginTop: isMobile ? 28 : 36,
          }}>
            <COppCard
              label="You – paid once"
              value={dealerOnce}
              sub="One-time reserve / flat fee on this year's loans. Then it's gone."
              animKey={animKey}
            />
            <COppCard
              label="The lender – paid for years"
              value={lenderEarnings}
              sub="Estimated finance income collected every month over the loans' 3–5 year life."
              animKey={animKey}
              accent
            />
          </div>

          {dealerOnce > 0 && multiple >= 1.05 && (
            <div style={{ marginTop: isMobile ? 22 : 28, paddingTop: isMobile ? 20 : 24, borderTop: `1px solid ${cT.border}` }}>
              <p style={{ fontSize: isMobile ? 15 : 17, color: cT.bodyText, lineHeight: 1.6, margin: 0 }}>
                That's roughly{' '}
                <span style={{ color: cT.brass, fontWeight: 600, fontFamily: C_FONT_DISPLAY }}>{multiple.toFixed(1)}×</span>{' '}
                more to the lender than your stores keep – and they keep collecting long after your single payment clears.
              </p>
            </div>
          )}
        </div>

        {/* Assumption + disclaimer */}
        <div style={{
          background: 'rgba(245,247,249,0.03)', border: `1px solid ${cT.border}`,
          borderRadius: 8, padding: isMobile ? '18px 20px' : '20px 24px', marginBottom: isMobile ? 40 : 56,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: cT.brass, textTransform: 'uppercase', marginBottom: 8 }}>Assumption used</div>
          <p style={{ fontSize: isMobile ? 14 : 15, color: cT.bodyText, lineHeight: 1.65, margin: 0 }}>
            Estimated lender earnings assume <strong style={{ color: cT.offwhite, fontWeight: 600 }}>4% of originated loan principal</strong> retained as net finance income over a typical 3–5 year loan life. This is an industry-level estimate applied to your inputs – not a Brivio performance figure. Net finance income for consumer auto lenders (gross interest less cost of funds, credit losses, and servicing) is broadly estimated at 3–6% of originated principal depending on credit tier and lender type; we use 4% as a conservative mid-range figure, consistent with publicly available auto lender net interest margin data reported in CFPB auto loan market reports and Federal Reserve consumer credit statistics (G.19).
          </p>
        </div>

        <p style={{ fontSize: 12.5, color: cT.mutedText, lineHeight: 1.65, marginBottom: isMobile ? 48 : 64 }}>
          These figures are illustrative estimates of opportunity cost based on the inputs above and industry-level loan economics. They reflect income that outside lenders are positioned to earn on dealer-originated loans, not a guarantee of Brivio results. Actual lender earnings and dealer economics vary with credit mix, term, rate, prepayment, losses, and program structure. Brivio does not guarantee specific returns.
        </p>

        {/* CTA */}
        <div className="calc-cta" style={{
          background: cT.graphite, border: `1px solid ${cT.border}`,
          borderRadius: 12, padding: isMobile ? '32px 24px' : '48px 56px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexWrap: 'wrap', gap: isMobile ? 24 : 32,
          flexDirection: isMobile ? 'column' : 'row',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', color: cT.brass, textTransform: 'uppercase', marginBottom: 12 }}>Stop giving it away</div>
            <h2 style={{ fontFamily: C_FONT_DISPLAY, fontSize: isMobile ? 22 : 28, fontWeight: 500, color: cT.offwhite, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              Keep the economics you hand to banks
            </h2>
            <p style={{ fontSize: 14, color: cT.bodyText, marginTop: 10, maxWidth: 440, lineHeight: 1.6 }}>
              Tell us your numbers and we'll show you how a Brivio-powered program lets your group own the loan, the data, and the customer.
            </p>
          </div>
          <a href="index.html#contact" onClick={(e) => { e.preventDefault(); onContact(); }} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            height: 52, padding: '0 32px',
            background: cT.brass, color: cT.navy,
            borderRadius: 2, fontSize: 12, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            textDecoration: 'none', flexShrink: 0, transition: 'background 0.2s', cursor: 'pointer',
            boxShadow: '0 0 32px rgba(185,155,95,0.25)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = cT.brassLight}
          onMouseLeave={e => e.currentTarget.style.background = cT.brass}>
            Apply to Partner
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      <footer style={{ padding: isMobile ? '28px 20px' : isTablet ? '32px 32px' : '40px 56px', borderTop: `1px solid ${cT.border}` }}>
        <div className="calc-footer" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: isMobile ? 12 : 16,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <img src={window.__resources.brivioLockup} alt="Brivio Capital" style={{ height: isMobile ? 24 : 28, opacity: 0.75 }} />
          <span style={{ color: cT.steel, fontSize: isMobile ? 10 : 11, fontWeight: 300, letterSpacing: '0.18em' }}>CAPITAL.&nbsp;&nbsp;CONNECTION.&nbsp;&nbsp;MOMENTUM.</span>
          <span style={{ color: 'rgba(101,107,114,0.4)', fontSize: isMobile ? 10 : 11 }}>© 2026 Brivio Capital</span>
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { CalculatorPage });
