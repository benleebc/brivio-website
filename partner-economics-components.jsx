// partner-economics-components.jsx – Brivio Capital private partner economics model.
// DATA MODEL + FORMULAS preserved exactly from the original handoff spec (see
// the comment block in partner-economics.html). Design matches the main site.
// Exposed as window.PartnerEconomicsPage.
const { useState: pUseState, useEffect: pUseEffect, useRef: pUseRef, useMemo: pUseMemo } = React;

const pT = {
  navy:       '#0D1B2A',
  graphite:   '#2B2F33',
  brass:      '#B99B5F',
  brassLight: '#D4BA85',
  brassDark:  '#8C7547',
  coral:      '#F2675A',
  good:       '#7FB77E',
  steel:      '#656B72',
  bodyText:   '#A8ADB3',
  mutedText:  '#7B8289',
  offwhite:   '#F5F7F9',
  border:     'rgba(245,247,249,0.08)',
  borderMed:  'rgba(245,247,249,0.14)',
};

const P_FONT_UI      = "'InterVariable','Inter','Helvetica Neue',Arial,sans-serif";
const P_FONT_DISPLAY = "'InterDisplay','InterVariable','Inter','Helvetica Neue',Arial,sans-serif";

/* ══════════════════════════════════════════════════════════════════
   DATA MODEL — preserved exactly from handoff spec
   ══════════════════════════════════════════════════════════════════ */
const P_BRANDS = {
  "Porsche":                              { loan: 78000, mix:[0.82,0.15,0.03] },
  "Land Rover / Jaguar":                  { loan: 64000, mix:[0.76,0.19,0.05] },
  "BMW / Mercedes-Benz / Audi":           { loan: 58000, mix:[0.76,0.19,0.05] },
  "Lexus":                                { loan: 52000, mix:[0.78,0.18,0.04] },
  "Acura / Infiniti / Volvo / Genesis":   { loan: 46000, mix:[0.70,0.25,0.05] },
  "Ram / Jeep / Dodge / Chrysler":        { loan: 47000, mix:[0.50,0.33,0.17] },
  "Ford / Chevrolet / GMC / Buick":       { loan: 46000, mix:[0.54,0.32,0.14] },
  "Toyota / Honda":                       { loan: 38000, mix:[0.64,0.28,0.08] },
  "Subaru / Mazda / Volkswagen":          { loan: 36000, mix:[0.62,0.29,0.09] },
  "Hyundai / Kia":                        { loan: 33000, mix:[0.50,0.34,0.16] },
  "Nissan / Mitsubishi":                  { loan: 31000, mix:[0.44,0.37,0.19] },
  "Used / Independent":                   { loan: 28000, mix:[0.34,0.40,0.26] }
};

/* Band economics — sourced from Brivio segment model */
const P_BANDS_DEFAULT = [
  { key:"P",  name:"Prime 740+",          part:2.00, u:6.84,  adv:85, cof:6.5, ay:1.93, stress:50  },
  { key:"NP", name:"Near-prime 640–739",  part:2.80, u:8.94,  adv:80, cof:7.0, ay:2.08, stress:100 },
  { key:"SP", name:"Subprime <640",       part:2.80, u:12.25, adv:65, cof:8.0, ay:2.10, stress:250 }
];
const P_T3 = { adv:80, cof:6.5 };
const P_HURDLE_DEFAULT = 6.0;

/* ══════════════════════════════════════════════════════════════════
   CALC — formulas preserved exactly from handoff spec
   ══════════════════════════════════════════════════════════════════ */
function pCompute(roofs, bands, stressed, hurdlePct) {
  const hurdle = (hurdlePct || 6) / 100;

  // originations by band
  const orig = { P: 0, NP: 0, SP: 0 };
  let totalLoans = 0;
  roofs.forEach(r => {
    const brand = P_BRANDS[r.brand];
    const loans = parseFloat(r.loans) || 0;
    const annual = loans * 12 * brand.loan;
    totalLoans += loans * 12;
    orig.P  += annual * brand.mix[0];
    orig.NP += annual * brand.mix[1];
    orig.SP += annual * brand.mix[2];
  });
  const totalOrig = orig.P + orig.NP + orig.SP;

  // effective unlevered return per band (stress-adjusted), decimals
  const U = {}, PART = {};
  bands.forEach(b => {
    U[b.key] = (b.u - (stressed ? b.stress / 100 : 0)) / 100;
    PART[b.key] = b.part / 100;
  });

  /* Tier 1 — no capital, upfront participation on everything */
  const t1Income = orig.P * PART.P + orig.NP * PART.NP + orig.SP * PART.SP;

  /* Tier 2 — prime sold whole (participation kept); NP/SP junior retained */
  const t2 = { primePart: orig.P * PART.P, cap: 0, capIncome: 0 };
  ["NP", "SP"].forEach(k => {
    const b = bands.find(x => x.key === k);
    const book = orig[k] * b.ay;
    const cap  = book * (1 - b.adv / 100);
    const L    = (b.adv / 100) / (1 - b.adv / 100);
    const roe  = U[k] + L * (U[k] - b.cof / 100);
    t2.cap += cap; t2.capIncome += cap * roe;
  });
  const t2Income = t2.primePart + t2.capIncome;
  const t2ROE = t2.cap > 0 ? t2.capIncome / t2.cap : 0;
  const t2Incr = t2.capIncome - t2.cap * hurdle;

  /* Tier 3 — full captive, all bands held, own warehouse */
  const t3 = { cap: 0, income: 0 };
  bands.forEach(b => {
    const book = orig[b.key] * b.ay;
    const eq   = book * (1 - P_T3.adv / 100);
    const L    = (P_T3.adv / 100) / (1 - P_T3.adv / 100);
    const roe  = U[b.key] + L * (U[b.key] - P_T3.cof / 100);
    t3.cap += eq; t3.income += eq * roe;
  });
  const t3ROE = t3.cap > 0 ? t3.income / t3.cap : 0;
  const t3Incr = t3.income - t3.cap * hurdle;

  return { orig, totalOrig, totalLoans, t1Income, t2, t2Income, t2ROE, t2Incr, t3, t3ROE, t3Incr };
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function pMoney(x) {
  const neg = x < 0; x = Math.abs(x);
  let s;
  if (x >= 1e6) s = '$' + (x / 1e6).toFixed(x >= 10e6 ? 1 : 2) + 'M';
  else if (x >= 1e3) s = '$' + Math.round(x / 1e3) + 'K';
  else s = '$' + Math.round(x);
  return (neg ? '−' : '') + s;
}
function pPct(x) { return x.toFixed(1) + '%'; }

function pUseViewport() {
  const [width, setWidth] = pUseState(window.innerWidth);
  pUseEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { width, isMobile: width < 720, isTablet: width >= 720 && width < 1024 };
}

// ── Animated money value ────────────────────────────────────────────
function PAnimatedMoney({ value, duration = 500 }) {
  const [display, setDisplay] = pUseState(value);
  const frameRef = pUseRef(null);
  const fromRef  = pUseRef(value);
  pUseEffect(() => {
    const from = fromRef.current, to = value;
    if (from === to) return;
    let start = null;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    function step(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setDisplay(from + (to - from) * ease);
      if (prog < 1) frameRef.current = requestAnimationFrame(step);
      else fromRef.current = to;
    }
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);
  return <span>{pMoney(display)}</span>;
}

// ── Nav (matches site nav, plus Confidential badge) ────────────────
function PENav() {
  const [scrolled, setScrolled] = pUseState(false);
  const { isMobile, isTablet } = pUseViewport();
  pUseEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: isMobile ? 64 : 84, display: 'flex', alignItems: 'center',
      padding: isMobile ? '0 20px' : isTablet ? '0 32px' : '0 56px',
      background: scrolled ? 'rgba(13,27,42,0.94)' : 'rgba(13,27,42,0.6)',
      backdropFilter: scrolled ? 'blur(16px)' : 'blur(6px)',
      borderBottom: scrolled ? `1px solid ${pT.border}` : '1px solid transparent',
      transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
    }}>
      <a href="index.html" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={window.__resources.brivioLockup} alt="Brivio Capital" style={{ height: isMobile ? 36 : 48 }} />
      </a>
      <div style={{ flex: 1 }} />
      <span id="confBadge" style={{
        fontSize: isMobile ? 10 : 11, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: pT.mutedText, border: `1px solid ${pT.borderMed}`, borderRadius: 2,
        padding: isMobile ? '6px 10px' : '8px 14px', whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? 210 : 'none',
      }}>Confidential</span>
    </nav>
  );
}

// ── Rooftop row ─────────────────────────────────────────────────────
const pFieldSt = {
  background: 'rgba(13,27,42,0.6)', border: `1px solid ${pT.borderMed}`, borderRadius: 4,
  color: pT.offwhite, fontFamily: P_FONT_UI, fontSize: 14, padding: '10px 12px', width: '100%',
  outline: 'none',
};

function PRooftopRow({ roof, onChange, onRemove, canRemove, isMobile }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1.5fr 0.8fr 40px',
      gap: isMobile ? 10 : 12, alignItems: 'center',
      padding: isMobile ? '16px 0' : '10px 0',
      borderBottom: `1px solid ${pT.border}`,
    }}>
      <input type="text" value={roof.name} aria-label="Rooftop name" className="pe-field"
        onChange={e => onChange({ ...roof, name: e.target.value })} style={pFieldSt} />
      <select value={roof.brand} aria-label="Brand" className="pe-field pe-select"
        onChange={e => onChange({ ...roof, brand: e.target.value })}
        style={{ ...pFieldSt, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
        {Object.keys(P_BRANDS).map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="number" value={roof.loans} min="0" step="5" aria-label="Funded loans per month" className="pe-field"
          onChange={e => onChange({ ...roof, loans: e.target.value })} style={{ ...pFieldSt, textAlign: 'right' }} />
        {isMobile && <span style={{ fontSize: 11, color: pT.mutedText, whiteSpace: 'nowrap' }}>Brivio loans / mo</span>}
      </div>
      <button type="button" title="Remove rooftop" aria-label="Remove rooftop"
        onClick={onRemove} disabled={!canRemove}
        style={{
          background: 'none', border: `1px solid ${pT.border}`, borderRadius: 4,
          color: canRemove ? pT.mutedText : 'rgba(123,130,137,0.3)', height: 40, width: isMobile ? '100%' : 40,
          cursor: canRemove ? 'pointer' : 'default', fontSize: 16, fontFamily: P_FONT_UI,
          transition: 'color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => { if (canRemove) { e.currentTarget.style.color = pT.coral; e.currentTarget.style.borderColor = pT.coral; } }}
        onMouseLeave={e => { e.currentTarget.style.color = canRemove ? pT.mutedText : 'rgba(123,130,137,0.3)'; e.currentTarget.style.borderColor = 'rgba(245,247,249,0.08)'; }}>
        ×
      </button>
    </div>
  );
}

// ── Tier card ───────────────────────────────────────────────────────
// Desktop cards use CSS subgrid (grid-row: span 7) so eyebrows, titles,
// descriptions, income figures, tables, notes and learn-more sections all
// sit on shared rows across the three cards.
function PTierCard({ tag, title, sub, income, incomeLabel, rows, note, learnMore, learnOpen, onToggleLearn, isMobile, isTablet }) {
  const stacked = isMobile || isTablet;
  const cardSt = stacked
    ? { display: 'flex', flexDirection: 'column' }
    : { display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 7' };
  return (
    <div style={{
      background: pT.graphite, border: `1px solid ${pT.border}`,
      borderRadius: 12, padding: isMobile ? '28px 24px' : '32px 28px',
      position: 'relative', overflow: 'hidden', ...cardSt,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${pT.brass}, ${pT.brassLight})` }} />
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: pT.brass, textTransform: 'uppercase', marginBottom: 10 }}>{tag}</div>
      <h3 style={{ fontFamily: P_FONT_DISPLAY, fontSize: 21, fontWeight: 500, color: pT.offwhite, margin: '0 0 8px', letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontSize: 13.5, color: pT.bodyText, lineHeight: 1.6, margin: '0 0 24px' }}>{sub}</p>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: P_FONT_DISPLAY, fontSize: isMobile ? 32 : 36, fontWeight: 500, color: pT.brass, letterSpacing: '-0.02em', lineHeight: 1 }}>
          <PAnimatedMoney value={income} />
        </div>
        <div style={{ fontSize: 12, color: pT.mutedText, marginTop: 8, letterSpacing: '0.04em' }}>{incomeLabel}</div>
      </div>
      <div style={{ alignSelf: 'stretch', marginBottom: 16 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13.5,
            padding: '9px 0', borderTop: `1px solid ${pT.border}`,
          }}>
            <span style={{ color: pT.bodyText }}>{r[0]}</span>
            <span style={{
              fontWeight: 500, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
              color: r[2] === 'good' ? pT.good : r[2] === 'brass' ? pT.brassLight : pT.offwhite,
            }}>{r[1]}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: pT.mutedText, lineHeight: 1.6, margin: '0 0 18px' }}>{note}</p>
      <div style={{ borderTop: `1px solid ${pT.border}`, paddingTop: 14, alignSelf: 'stretch' }}>
        <button type="button" onClick={onToggleLearn} aria-expanded={learnOpen} style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          fontFamily: P_FONT_UI, fontSize: 12, fontWeight: 500, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: pT.brass, display: 'inline-flex', alignItems: 'center', gap: 8,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = pT.brassLight}
        onMouseLeave={e => e.currentTarget.style.color = pT.brass}>
          Learn more
          <span style={{ fontSize: 14, lineHeight: 1, transform: learnOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
        </button>
        {learnOpen && (
          <div style={{ marginTop: 16 }}>
            {learnMore.map((block, i) => (
              <div key={i} style={{ marginBottom: i === learnMore.length - 1 ? 0 : 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: pT.mutedText, marginBottom: 6 }}>{block.h}</div>
                <p style={{ fontSize: 13.5, color: pT.bodyText, lineHeight: 1.65, margin: 0 }}>{block.p}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Learn-more copy per tier ────────────────────────────────────────
const P_LEARN = {
  t1: [
    { h: 'What it asks of you', p: 'Nothing changes on your showroom floor. Your F&I team keeps writing deals the way it does today — Brivio funds the loan, sells it day one, and cuts you a check for your share of the gain at sale. No capital, no committee, no new headcount.' },
    { h: 'What you get', p: 'A second check on every funded deal, stacked on top of your existing finance reserve. It shows up when the loan sells, so there is no waiting on a portfolio to season.' },
    { h: 'The trade-off', p: 'It is the smallest number of the three, and the loan, the data, and the customer relationship still leave the building. Think of it as getting paid fairly for volume you are already producing — a starting point, not a destination.' },
  ],
  t2: [
    { h: 'What it asks of you', p: 'You put real capital to work — the junior slice on your near-prime and subprime paper. That capital is committed for the life of the loan pool and takes the first loss if credits go bad. Prime keeps selling day one, exactly like Tier 1.' },
    { h: 'What you get', p: 'The levered spread on your own customers\u2019 loans, month after month, for the life of the book — plus the upfront prime participation. Brivio carries the operational load: underwriting, servicing, collections, compliance, and reporting. You review a statement, not a loan file.' },
    { h: 'The trade-off', p: 'Income builds as the book builds — plan on 30 to 36 months to steady state, with year one meaningfully lighter. You are earning lender returns because you are taking lender risk on the slice you retain. Most groups start here or graduate here quickly.' },
  ],
  t3: [
    { h: 'What it asks of you', p: 'This is a real finance company with your name on it. Your captive funds every loan across all credit bands on its own warehouse facility, and your balance sheet carries the full portfolio risk. It is the most capital and the most commitment of the three.' },
    { h: 'What you get', p: 'Everything. Every dollar of finance income your customers generate stays in your group — no participation splits, no one else\u2019s margin. You own the loan, the data, and the customer for the next vehicle, the service visit, and the trade-in. Brivio runs the platform underneath so you are not building a servicing operation from scratch.' },
    { h: 'The trade-off', p: 'Full credit exposure and a dedicated warehouse facility to stand up and maintain. This is rarely the first step — the typical path is 12 to 24 months in Tier 2, proving out performance on your own paper, then converting.' },
  ],
};

// ── Under-the-hood assumptions (collapsed, editable) ────────────────
const pTdSt = { padding: '9px 10px', borderBottom: `1px solid ${pT.border}`, color: pT.bodyText, fontVariantNumeric: 'tabular-nums', fontSize: 13 };
const pThSt = { fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: pT.mutedText, textAlign: 'left', padding: '8px 10px', borderBottom: `1px solid ${pT.borderMed}`, fontWeight: 500 };
const pNumInputSt = { ...pFieldSt, width: 76, padding: '5px 8px', fontSize: 13, textAlign: 'right' };

function PAssumptions({ bands, onBandChange, hurdle, onHurdleChange, isMobile }) {
  const detailsSt = {
    border: `1px solid ${pT.border}`, borderRadius: 10,
    background: 'rgba(245,247,249,0.02)',
  };
  const summarySt = {
    cursor: 'pointer', padding: '16px 20px', fontSize: 13, letterSpacing: '0.04em',
    color: pT.mutedText, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  };
  return (
    <div>
      <details style={detailsSt}>
        <summary className="pe-summary" style={summarySt}>
          <span>Credit &amp; economics assumptions by band (editable)</span>
        </summary>
        <div style={{ padding: '6px 20px 24px', borderTop: `1px solid ${pT.border}`, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14, minWidth: 560 }}>
            <thead><tr>
              <th style={pThSt}>Credit band</th>
              <th style={{ ...pThSt, textAlign: 'right' }}>Upfront participation %</th>
              <th style={{ ...pThSt, textAlign: 'right' }}>Net unlevered return %</th>
              <th style={{ ...pThSt, textAlign: 'right' }}>Senior advance %</th>
              <th style={{ ...pThSt, textAlign: 'right' }}>Senior cost %</th>
            </tr></thead>
            <tbody>
              {bands.map((b, i) => (
                <tr key={b.key}>
                  <td style={{ ...pTdSt, color: pT.offwhite }}>{b.name}</td>
                  {[['part', 0.05], ['u', 0.05], ['adv', 1], ['cof', 0.1]].map(([f, step]) => (
                    <td key={f} style={{ ...pTdSt, textAlign: 'right' }}>
                      <input type="number" step={step} value={b[f]} className="pe-field"
                        onChange={e => onBandChange(i, f, parseFloat(e.target.value) || 0)}
                        style={pNumInputSt} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: pT.mutedText, lineHeight: 1.6, marginTop: 14 }}>
            Unlevered return = gross yield less net credit losses and servicing, annualized on average assets.
            Tier 3 assumes an 80% warehouse advance at 6.5% across all bands. Capital baseline (your alternative return) is{' '}
            <input type="number" step="0.1" value={hurdle} className="pe-field"
              onChange={e => onHurdleChange(parseFloat(e.target.value) || 0)}
              style={{ ...pNumInputSt, width: 64, display: 'inline-block' }} /> %.
          </p>
        </div>
      </details>
      <div style={{ height: 14 }} />
      <details style={detailsSt}>
        <summary className="pe-summary" style={summarySt}>
          <span>Brand assumptions: average amount financed &amp; credit mix</span>
        </summary>
        <div style={{ padding: '6px 20px 24px', borderTop: `1px solid ${pT.border}`, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14, minWidth: 560 }}>
            <thead><tr>
              <th style={pThSt}>Brand group</th>
              <th style={{ ...pThSt, textAlign: 'right' }}>Avg financed</th>
              <th style={{ ...pThSt, textAlign: 'right' }}>Prime 740+</th>
              <th style={{ ...pThSt, textAlign: 'right' }}>Near-prime 640–739</th>
              <th style={{ ...pThSt, textAlign: 'right' }}>Subprime &lt;640</th>
            </tr></thead>
            <tbody>
              {Object.entries(P_BRANDS).map(([k, v]) => (
                <tr key={k}>
                  <td style={{ ...pTdSt, color: pT.offwhite }}>{k}</td>
                  <td style={{ ...pTdSt, textAlign: 'right' }}>{pMoney(v.loan)}</td>
                  <td style={{ ...pTdSt, textAlign: 'right' }}>{Math.round(v.mix[0] * 100)}%</td>
                  <td style={{ ...pTdSt, textAlign: 'right' }}>{Math.round(v.mix[1] * 100)}%</td>
                  <td style={{ ...pTdSt, textAlign: 'right' }}>{Math.round(v.mix[2] * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: pT.mutedText, lineHeight: 1.6, marginTop: 14 }}>
            Directional estimates informed by industry origination data (luxury franchises skew prime; value and used operations skew near-prime/subprime).
            Calibrated per dealer group before final proposal. Lease-heavy luxury franchises fund fewer retail loans per rooftop — reflect that in the funded-loans input, not the mix.
          </p>
        </div>
      </details>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────
const P_DEFAULT_ROOFS = [
  { name: "Rooftop 1", brand: "Land Rover / Jaguar", loans: 45 },
  { name: "Rooftop 2", brand: "Land Rover / Jaguar", loans: 45 },
  { name: "Rooftop 3", brand: "Ford / Chevrolet / GMC / Buick", loans: 70 },
  { name: "Rooftop 4", brand: "Subaru / Mazda / Volkswagen", loans: 60 },
  { name: "Rooftop 5", brand: "Toyota / Honda", loans: 75 },
  { name: "Rooftop 6", brand: "Used / Independent", loans: 50 }
];

function PartnerEconomicsPage() {
  const [dealerName, setDealerName] = pUseState('');
  const [roofs, setRoofs] = pUseState(P_DEFAULT_ROOFS);
  const [roofsOpen, setRoofsOpen] = pUseState(false);
  const [learnOpen, setLearnOpen] = pUseState({ t1: false, t2: false, t3: false });
  const [bands, setBands] = pUseState(P_BANDS_DEFAULT.map(b => ({ ...b })));
  const [stressed, setStressed] = pUseState(false);
  const [hurdle, setHurdle] = pUseState(P_HURDLE_DEFAULT);
  const { isMobile, isTablet } = pUseViewport();

  const r = pUseMemo(() => pCompute(roofs, bands, stressed, hurdle), [roofs, bands, stressed, hurdle]);

  pUseEffect(() => {
    const el = document.getElementById('confBadge');
    if (el) el.textContent = 'Confidential · Prepared for ' + (dealerName.trim() || 'our partner');
  }, [dealerName]);

  const pad = isMobile ? '0 20px' : isTablet ? '0 32px' : '0 56px';
  const nameOrGroup = dealerName.trim() || 'your group';

  const strip = [
    { v: pMoney(r.totalOrig), k: 'Annual originations via Brivio' },
    { v: r.totalLoans.toLocaleString(), k: 'Brivio-funded loans / yr' },
    { v: r.totalOrig ? `${Math.round(r.orig.P / r.totalOrig * 100)} / ${Math.round(r.orig.NP / r.totalOrig * 100)} / ${Math.round(r.orig.SP / r.totalOrig * 100)}` : '0 / 0 / 0', k: 'Prime / near / sub %' },
    { v: pMoney(r.totalOrig ? r.totalOrig / r.totalLoans : 0), k: 'Avg amount financed' },
  ];

  const sectionLabel = (txt) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ width: 24, height: 1, background: pT.brass, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.16em', color: pT.brass, textTransform: 'uppercase' }}>{txt}</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: pT.navy }}>
      <PENav />

      {/* HERO */}
      <div style={{ padding: isMobile ? '110px 20px 48px' : isTablet ? '130px 32px 56px' : '150px 56px 64px', maxWidth: 1100, margin: '0 auto' }}>
        {sectionLabel('Partner economics · Private review')}
        <h1 style={{
          fontFamily: P_FONT_DISPLAY,
          fontSize: isMobile ? 'clamp(32px, 8.5vw, 44px)' : 'clamp(40px, 4.8vw, 60px)',
          fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.08,
          color: pT.offwhite, margin: '0 0 22px', maxWidth: 820,
        }}>
          Three ways to own your lending economics, <span style={{ color: pT.brass }}>{nameOrGroup}</span>
        </h1>
        <p style={{ fontSize: isMobile ? 16 : 18, color: pT.bodyText, lineHeight: 1.65, maxWidth: 660, margin: 0 }}>
          One platform, three levels of participation — from zero capital committed to running a full captive on your balance sheet. We've modeled your group below; adjust anything to match your operation.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 20px 80px' : isTablet ? '0 32px 100px' : '0 56px 110px' }}>

        {/* YOUR GROUP */}
        <div style={{
          background: pT.graphite, border: `1px solid ${pT.border}`, borderRadius: 12,
          padding: isMobile ? '28px 24px' : '40px 48px', marginBottom: isMobile ? 28 : 40,
        }}>
          <div style={{ marginBottom: isMobile ? 24 : 30 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', color: pT.brass, textTransform: 'uppercase', marginBottom: 8 }}>Your group</div>
            <p style={{ fontSize: 15, color: pT.bodyText, margin: 0 }}>Your rooftops and the monthly volume you'd fund <strong style={{ color: pT.offwhite, fontWeight: 500 }}>through Brivio</strong> — not your total store volume. Everything downstream updates as you edit.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 20 : 24, marginBottom: isMobile ? 24 : 30 }}>
            <div>
              <label htmlFor="pe-dealer-name" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.09em', color: pT.steel, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Dealer group name</label>
              <input id="pe-dealer-name" type="text" value={dealerName} placeholder="e.g., Snell Motor Companies" className="pe-field"
                onChange={e => setDealerName(e.target.value)} style={pFieldSt} />
            </div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.09em', color: pT.steel, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Loss scenario</span>
              <div role="group" aria-label="Loss scenario" style={{ display: 'inline-flex', border: `1px solid ${pT.borderMed}`, borderRadius: 4, overflow: 'hidden' }}>
                {[['Base case', false], ['Stressed losses', true]].map(([label, val]) => (
                  <button key={label} type="button" onClick={() => setStressed(val)} style={{
                    background: stressed === val ? (val ? pT.coral : pT.brass) : 'none',
                    border: 'none', color: stressed === val ? pT.navy : pT.bodyText,
                    fontFamily: P_FONT_UI, fontSize: 13, fontWeight: stressed === val ? 600 : 400,
                    padding: '10px 20px', cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
                  }}>{label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible rooftop roster */}
          <div style={{ border: `1px solid ${pT.border}`, borderRadius: 8, background: 'rgba(13,27,42,0.4)' }}>
            <button type="button" onClick={() => setRoofsOpen(o => !o)} aria-expanded={roofsOpen} style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              fontFamily: P_FONT_UI, fontSize: 13, letterSpacing: '0.04em', color: pT.bodyText, textAlign: 'left',
            }}>
              <span>Rooftops — {roofs.length} location{roofs.length === 1 ? '' : 's'} <span style={{ color: pT.mutedText }}>· view &amp; edit</span></span>
              <span style={{ color: pT.brass, fontSize: 16, lineHeight: 1 }}>{roofsOpen ? '–' : '+'}</span>
            </button>
            {roofsOpen && (
              <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${pT.border}` }}>
                {!isMobile && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1.1fr 1.5fr 0.8fr 40px', gap: 12,
                    fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: pT.mutedText,
                    padding: '16px 0 8px',
                  }}>
                    <div>Rooftop</div><div>Brand</div><div style={{ textAlign: 'right' }}>Brivio loans / mo</div><div></div>
                  </div>
                )}
                <div style={{ borderTop: `1px solid ${pT.border}` }}>
                  {roofs.map((roof, i) => (
                    <PRooftopRow key={i} roof={roof} isMobile={isMobile}
                      canRemove={roofs.length > 1}
                      onChange={next => setRoofs(rs => rs.map((x, j) => j === i ? next : x))}
                      onRemove={() => setRoofs(rs => rs.filter((_, j) => j !== i))} />
                  ))}
                </div>
                <button type="button"
                  onClick={() => setRoofs(rs => [...rs, { name: 'Rooftop ' + (rs.length + 1), brand: 'Toyota / Honda', loans: 60 }])}
                  style={{
                    marginTop: 16, background: 'none', border: `1px solid ${pT.borderMed}`, borderRadius: 4,
                    color: pT.bodyText, fontFamily: P_FONT_UI, fontSize: 13, letterSpacing: '0.04em',
                    padding: '10px 18px', cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = pT.brass; e.currentTarget.style.borderColor = pT.brass; }}
                  onMouseLeave={e => { e.currentTarget.style.color = pT.bodyText; e.currentTarget.style.borderColor = 'rgba(245,247,249,0.14)'; }}>
                  + Add rooftop
                </button>
              </div>
            )}
          </div>

          {/* volume strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? 20 : 40, marginTop: isMobile ? 28 : 36, paddingTop: isMobile ? 24 : 30,
            borderTop: `1px solid ${pT.border}`,
          }}>
            {strip.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: P_FONT_DISPLAY, fontSize: isMobile ? 20 : 24, fontWeight: 500, color: pT.offwhite, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: pT.mutedText, marginTop: 6 }}>{s.k}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: pT.mutedText, lineHeight: 1.6, margin: '20px 0 0' }}>
            Figures reflect only the volume routed through the Brivio program above — not your group's total sales or F&amp;I volume.
          </p>
        </div>

        {/* TIERS */}
        <div style={{ marginBottom: isMobile ? 12 : 16 }}>
          {sectionLabel('What each path earns you annually')}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: (isMobile || isTablet) ? '1fr' : 'repeat(3, 1fr)',
          gridTemplateRows: (isMobile || isTablet) ? undefined : 'repeat(7, auto)',
          gap: (isMobile || isTablet) ? 16 : '0 20px', marginBottom: 18,
        }}>
          <PTierCard isMobile={isMobile} isTablet={isTablet}
            learnMore={P_LEARN.t1} learnOpen={learnOpen.t1} onToggleLearn={() => setLearnOpen(o => ({ ...o, t1: !o.t1 }))}
            tag="Tier 1 · Zero capital" title="Participation"
            sub="Loans sold day one. You collect a share of the gain on every funded deal. No capital, no credit risk."
            income={r.t1Income} incomeLabel="per year, upfront income"
            rows={[
              ['Capital committed', '$0', ''],
              ['Credit risk to you', 'None', ''],
              ['Income timing', 'Paid at loan sale', ''],
            ]}
            note="On top of your existing finance reserve." />
          <PTierCard isMobile={isMobile} isTablet={isTablet}
            learnMore={P_LEARN.t2} learnOpen={learnOpen.t2} onToggleLearn={() => setLearnOpen(o => ({ ...o, t2: !o.t2 }))}
            tag="Tier 2 · Partial capital" title="Capital Partner"
            sub="Prime sold as in Tier 1. You fund the junior slice of near-prime & subprime and keep the levered spread."
            income={r.t2Income} incomeLabel="per year at steady state"
            rows={[
              ['Capital committed', pMoney(r.t2.cap), ''],
              ['Return on that capital', pPct(r.t2ROE * 100), r.t2ROE * 100 >= 12 ? 'good' : ''],
              ['vs. ' + pPct(hurdle) + ' alternative', (r.t2Incr >= 0 ? '+' : '') + pMoney(r.t2Incr) + ' / yr', r.t2Incr >= 0 ? 'brass' : ''],
              ['Upfront prime income', pMoney(r.t2.primePart), ''],
            ]}
            note="You take first-loss credit risk on retained capital. Brivio underwrites, services, and reports." />
          <PTierCard isMobile={isMobile} isTablet={isTablet}
            learnMore={P_LEARN.t3} learnOpen={learnOpen.t3} onToggleLearn={() => setLearnOpen(o => ({ ...o, t3: !o.t3 }))}
            tag="Tier 3 · Full captive" title="Your Own Book"
            sub="Your captive funds every loan across all credit bands on its own warehouse facility. All economics are yours."
            income={r.t3.income} incomeLabel="per year at steady state"
            rows={[
              ['Capital committed', pMoney(r.t3.cap), ''],
              ['Return on that capital', pPct(r.t3ROE * 100), r.t3ROE * 100 >= 12 ? 'good' : ''],
              ['vs. ' + pPct(hurdle) + ' alternative', (r.t3Incr >= 0 ? '+' : '') + pMoney(r.t3Incr) + ' / yr', r.t3Incr >= 0 ? 'brass' : ''],
            ]}
            note="Full portfolio credit risk. Requires a dedicated warehouse facility; typical path after 12–24 months in Tier 2." />
        </div>
        <p style={{ fontSize: 12.5, color: pT.mutedText, lineHeight: 1.65, marginBottom: isMobile ? 44 : 64 }}>
          Tier 2 and Tier 3 income shown at steady state, reached roughly 30–36 months after launch as the retained book builds. Year-one income during ramp is lower. Stressed case adds +50 / +100 / +250 bps of net loss to prime / near-prime / subprime.
        </p>

        {/* UNDER THE HOOD */}
        <div style={{ marginBottom: 18 }}>
          {sectionLabel('Under the hood')}
        </div>
        <PAssumptions bands={bands} isMobile={isMobile}
          onBandChange={(i, f, v) => setBands(bs => bs.map((b, j) => j === i ? { ...b, [f]: v } : b))}
          hurdle={hurdle} onHurdleChange={setHurdle} />

        {/* DISCLAIMER */}
        <p style={{ fontSize: 12, color: pT.mutedText, lineHeight: 1.65, margin: isMobile ? '40px 0 0' : '56px 0 0' }}>
          Illustrative economics for discussion purposes only. Not an offer, commitment, or guarantee of returns. Tier 2 and Tier 3 structures involve credit risk to retained capital, are subject to structuring, capital-partner terms, and legal documentation, and retained capital is committed for the life of the loan pool. Figures assume steady-state portfolio composition and are before dealer-level taxes. Brivio Capital, Inc.
        </p>
      </div>

      <footer style={{ padding: isMobile ? '28px 20px' : isTablet ? '32px 32px' : '40px 56px', borderTop: `1px solid ${pT.border}` }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: isMobile ? 12 : 16,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <a href="index.html" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img src={window.__resources.brivioLockup} alt="Brivio Capital" style={{ height: isMobile ? 24 : 28, opacity: 0.75 }} />
          </a>
          <span style={{ color: pT.steel, fontSize: isMobile ? 10 : 11, fontWeight: 300, letterSpacing: '0.18em' }}>CAPITAL.&nbsp;&nbsp;CONNECTION.&nbsp;&nbsp;MOMENTUM.</span>
          <span style={{ color: 'rgba(101,107,114,0.4)', fontSize: isMobile ? 10 : 11 }}>© 2026 Brivio Capital</span>
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { PartnerEconomicsPage });
