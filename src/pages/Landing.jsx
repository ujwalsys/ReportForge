import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLANS } from '../data/mockData'
import styles from './Landing.module.css'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
    }}>{children}</div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')
  const featRef = useRef(null)
  const howRef = useRef(null)
  const pricRef = useRef(null)
  const tplRef = useRef(null)

  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className={styles.page}>
      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <span className={styles.logoDot} />
          ReportForge
        </div>
        <div className={styles.navLinks}>
          <button onClick={() => scrollTo(featRef)}>Features</button>
          <button onClick={() => scrollTo(tplRef)}>Templates</button>
          <button onClick={() => scrollTo(howRef)}>How It Works</button>
          <button onClick={() => scrollTo(pricRef)}>Pricing</button>
        </div>
        <button className={styles.navCta} onClick={() => navigate('/auth')}>
          Login / Sign Up
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            Enterprise BI Platform · v2.0
          </div>
          <h1 className={styles.heroTitle}>
            Build <em>smarter</em><br />reports, faster.
          </h1>
          <p className={styles.heroSub}>
            Automate report generation, run GROUP BY cube analytics, schedule delivery,
            and monitor your ActiveMQ pipeline — all from one unified platform.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnHeroPrim} onClick={() => navigate('/auth')}>
              Try ReportForge Free →
            </button>
            <button className={styles.btnHeroSec} onClick={() => scrollTo(howRef)}>
              How it works ↓
            </button>
          </div>

          {/* MOCKUP */}
          <div className={styles.mockupWrap}>
            <div className={styles.mockupBar}>
              <span className={styles.dot} style={{ background: '#ef4444' }} />
              <span className={styles.dot} style={{ background: '#f59e0b' }} />
              <span className={styles.dot} style={{ background: '#10b981' }} />
              <span style={{ fontSize: 11, color: '#4a4d6a', fontFamily: 'var(--font-m)', marginLeft: 10 }}>
                reportforge.app — Admin Dashboard
              </span>
            </div>
            <div className={styles.mockupScreen}>
              {[
                { label: 'Total Revenue', val: '₹2.94L', color: '#10b981', sub: 'SUM(grand_total)' },
                { label: 'Reports', val: '1,240', color: '#6366f1', sub: 'COUNT(*)' },
                { label: 'Scheduled', val: '12', color: '#ec4899', sub: 'Active jobs' },
              ].map(c => (
                <div key={c.label} className={styles.mockCard}>
                  <div style={{ fontSize: 9, color: '#4a4d6a', fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{c.label}</div>
                  <div style={{ fontFamily: 'var(--font-d)', fontSize: 26, fontWeight: 800, color: c.color }}>{c.val}</div>
                  <div style={{ fontSize: 10, color: '#4a4d6a', marginTop: 4 }}>{c.sub}</div>
                </div>
              ))}
              <div className={styles.mockTable}>
                {[
                  { name: 'Q4 Revenue Analysis', status: 'COMPLETED', color: '#10b981', bg: 'rgba(16,185,129,.1)' },
                  { name: 'User Churn Report', status: 'PROCESSING', color: '#38bdf8', bg: 'rgba(56,189,248,.1)' },
                  { name: 'Monthly KPI Export', status: 'PENDING', color: '#f59e0b', bg: 'rgba(245,158,11,.1)' },
                  { name: 'Regional Sales Cube', status: 'COMPLETED', color: '#10b981', bg: 'rgba(16,185,129,.1)' },
                ].map(r => (
                  <div key={r.name} className={styles.mockRow}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#8b8faf', flex: 1, fontFamily: 'var(--font-m)' }}>{r.name}</span>
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-m)', fontWeight: 600, background: r.bg, color: r.color }}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featRef} className={styles.features}>
        <div className={styles.container}>
          <Reveal><div className={styles.sectionLabel}>Core Capabilities</div></Reveal>
          <Reveal delay={0.05}>
            <h2 className={styles.sectionTitle}>Everything you need to<br /><em>dominate</em> your data.</h2>
          </Reveal>
          <div className={styles.featGrid}>
            {[
              { icon: '📊', title: 'Dynamic Report Builder', desc: 'Select columns, date filters, toggle Y/N data types, and queue jobs to ActiveMQ with one click.' },
              { icon: '🧊', title: 'Cube / Group By Engine', desc: 'Run SUM, COUNT, AVG, MAX, MIN aggregations with GROUP BY clauses and live SQL preview.' },
              { icon: '⚙️', title: 'ActiveMQ Job Queue', desc: 'Reports processed asynchronously via JMS. Monitor queue status, workers, and throughput live.' },
              { icon: '⏰', title: 'Automated Scheduling', desc: 'Schedule reports DAILY, WEEKLY, MONTHLY via Spring @Scheduled. Auto-email delivery.' },
              { icon: '📈', title: 'Analytics & Charts', desc: 'Bar, Line, Pie, Donut, Radar charts built from your data. Export as PDF instantly.' },
              { icon: '🔄', title: 'Smart Rerun', desc: 'Rerun any past report with fresh DB data. Compare old vs new row counts and download updated Excel.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className={styles.featCard}>
                  <div className={styles.featIcon}>{f.icon}</div>
                  <div className={styles.featTitle}>{f.title}</div>
                  <div className={styles.featDesc}>{f.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section ref={tplRef} className={styles.templates}>
        <div className={styles.container}>
          <Reveal><div className={styles.sectionLabel}>Ready-Made Templates</div></Reveal>
          <Reveal delay={0.05}>
            <h2 className={styles.sectionTitle}>Start with a <em>template,</em><br />customize everything.</h2>
          </Reveal>
          <div className={styles.tplGrid}>
            {[
              { icon: '💰', name: 'Revenue Analysis', desc: 'Grand Total, MRR, ARR by region', bg: 'linear-gradient(135deg,#0d2318,#1a4a30)' },
              { icon: '👥', name: 'User Churn Report', desc: 'Churn rate, last login, plan analysis', bg: 'linear-gradient(135deg,#1e1b4b,#312e81)' },
              { icon: '📦', name: 'Invoice Summary', desc: 'Paid/Unpaid status, invoice types cube', bg: 'linear-gradient(135deg,#431407,#7c2d12)' },
              { icon: '📈', name: 'KPI Dashboard', desc: 'Real-time aggregated business metrics', bg: 'linear-gradient(135deg,#064e3b,#065f46)' },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className={styles.tplCard} onClick={() => navigate('/auth')}>
                  <div className={styles.tplPreview} style={{ background: t.bg }}>
                    <span style={{ fontSize: 38 }}>{t.icon}</span>
                  </div>
                  <div className={styles.tplBody}>
                    <div className={styles.tplName}>{t.name}</div>
                    <div className={styles.tplDesc}>{t.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={howRef} className={styles.how}>
        <div className={styles.container}>
          <Reveal><div className={styles.sectionLabelLight}>Pipeline Architecture</div></Reveal>
          <Reveal delay={0.05}>
            <h2 className={styles.sectionTitleLight}>From request to <em style={{ color: '#818cf8' }}>Excel</em> in seconds.</h2>
          </Reveal>
          <div className={styles.steps}>
            {[
              { num: '01', icon: '🖥️', title: 'Configure Report', desc: 'Select columns, date range, grouping, and export format from the visual builder.' },
              { num: '02', icon: '📨', title: 'Queue via JMS', desc: 'Spring Boot creates a job in MySQL and sends it to ActiveMQ queue instantly.' },
              { num: '03', icon: '⚙️', title: 'Worker Processes', desc: '@JmsListener workers run GROUP BY cube engine, generate Excel via Apache POI.' },
              { num: '04', icon: '✅', title: 'Download Ready', desc: 'Report saved to storage, status updated to COMPLETED. Download Excel or PDF instantly.' },
            ].map((s, i) => (
              <Reveal key={s.num} delay={i * 0.1}>
                <div className={styles.step}>
                  <div className={styles.stepNum}>{s.num}</div>
                  <div className={styles.stepIcon}>{s.icon}</div>
                  <div className={styles.stepTitle}>{s.title}</div>
                  <div className={styles.stepDesc}>{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section ref={pricRef} className={styles.pricing}>
        <div className={styles.container}>
          <Reveal><div className={styles.sectionLabel}>Transparent Pricing</div></Reveal>
          <Reveal delay={0.05}>
            <h2 className={styles.sectionTitle}>Plans for every<br /><em>team size.</em></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={styles.billingToggle}>
              <button onClick={() => setBilling('monthly')} className={billing === 'monthly' ? styles.billingOn : styles.billingOff}>Monthly</button>
              <button onClick={() => setBilling('yearly')} className={billing === 'yearly' ? styles.billingOn : styles.billingOff}>
                Yearly <span className={styles.saveBadge}>Save 20%</span>
              </button>
            </div>
          </Reveal>
          <div className={styles.pricingGrid}>
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.08}>
                <div className={`${styles.planCard} ${plan.badge === 'Most Popular' ? styles.planFeatured : ''}`}>
                  {plan.badge && <div className={styles.planBadge} style={{ background: plan.color }}>{plan.badge}</div>}
                  <div className={styles.planName}>{plan.name}</div>
                  <div className={styles.planPrice}>
                    {plan.price.monthly === 0 ? (
                      <span className={styles.planAmt}>Free</span>
                    ) : (
                      <>
                        <span className={styles.planCurr}>$</span>
                        <span className={styles.planAmt}>{billing === 'monthly' ? plan.price.monthly : plan.price.yearly}</span>
                        <span className={styles.planPer}>/mo</span>
                      </>
                    )}
                  </div>
                  <p className={styles.planDesc}>{plan.desc}</p>
                  <div className={styles.planDivider} />
                  <ul className={styles.planFeatures}>
                    {plan.features.map(f => (
                      <li key={f}><span className={styles.featureCheck} style={{ color: plan.color }}>✓</span>{f}</li>
                    ))}
                    {plan.disabled.map(f => (
                      <li key={f} className={styles.featureDisabled}><span>✕</span>{f}</li>
                    ))}
                  </ul>
                  <button className={styles.planCta} style={{
                    background: plan.badge === 'Most Popular' ? plan.color : 'transparent',
                    color: plan.badge === 'Most Popular' ? '#fff' : plan.color,
                    border: `2px solid ${plan.color}`,
                  }} onClick={() => navigate('/auth')}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to transform<br />your reporting?</h2>
          <p className={styles.ctaSub}>Join hundreds of enterprises running automated BI pipelines with ReportForge.</p>
          <button className={styles.ctaBtn} onClick={() => navigate('/auth')}>Get Started Free →</button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>ReportForge</div>
        <div style={{ color: '#8b8faf', fontSize: 13 }}>© 2026 ReportForge · Spring Boot + ActiveMQ + Apache POI</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Docs', 'Contact'].map(l => (
            <span key={l} style={{ color: '#8b8faf', fontSize: 13, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
