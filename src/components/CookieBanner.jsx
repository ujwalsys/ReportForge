import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function CookieBanner() {
  const { saveCookiePrefs } = useAuth()
  const [prefs, setPrefs] = useState({ essential: true, analytics: true, marketing: false })
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)

  if (!visible) return null

  const accept = (mode) => {
    const saved = mode === 'all'
      ? { essential: true, analytics: true, marketing: true }
      : mode === 'reject'
      ? { essential: true, analytics: false, marketing: false }
      : prefs
    saveCookiePrefs(saved)
    setVisible(false)
  }

  const toggle = (key) => {
    if (key === 'essential') return
    setPrefs(p => ({ ...p, [key]: !p[key] }))
  }

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 20, zIndex: 8888,
      width: 360, background: '#fff', border: '1px solid #e0ded8',
      borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,.15)',
      animation: 'slideUp 0.4s cubic-bezier(.34,1.56,.64,1)',
      fontFamily: 'var(--font-b)', overflow: 'hidden',
    }}>
      <div style={{ padding: '18px 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🍪</span>
          <div style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: 16 }}>Cookie Preferences</div>
        </div>
        <p style={{ fontSize: 12.5, color: '#6b6960', lineHeight: 1.65, marginBottom: 14 }}>
          We use cookies to deliver and improve our services, analyze usage, and personalize your experience on ReportForge.
        </p>

        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {[
              { key: 'essential', label: 'Essential', desc: 'Required for the platform to function.', fixed: true },
              { key: 'analytics', label: 'Analytics', desc: 'Help us understand usage patterns.' },
              { key: 'marketing', label: 'Marketing', desc: 'Personalize content and offers.' },
            ].map(opt => (
              <div key={opt.key} onClick={() => toggle(opt.key)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 9, border: `1.5px solid ${prefs[opt.key] ? 'var(--land-green)' : '#e0ded8'}`,
                background: prefs[opt.key] ? 'rgba(26,122,74,0.05)' : 'var(--land-bg)',
                cursor: opt.fixed ? 'default' : 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  background: prefs[opt.key] ? 'var(--land-green)' : '#e0ded8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#fff', transition: 'all 0.2s',
                }}>{prefs[opt.key] ? '✓' : ''}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--land-ink)' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: '#6b6960' }}>{opt.desc}</div>
                </div>
                {opt.fixed && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--land-green)', fontFamily: 'var(--font-m)' }}>Always on</span>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => accept('all')} style={{
            flex: 1, padding: '10px 0', borderRadius: 9, fontSize: 13, fontWeight: 700,
            background: 'var(--land-green)', color: '#fff',
          }}>Accept All</button>
          <button onClick={() => setExpanded(!expanded)} style={{
            flex: 1, padding: '10px 0', borderRadius: 9, fontSize: 13, fontWeight: 600,
            background: 'var(--land-bg)', color: 'var(--land-ink)',
            border: '1.5px solid #e0ded8',
          }}>{expanded ? 'Save Choices' : 'Customize'}</button>
          <button onClick={() => accept('reject')} style={{
            padding: '10px 14px', borderRadius: 9, fontSize: 13, fontWeight: 500,
            background: 'transparent', color: '#6b6960',
            border: '1.5px solid #e0ded8',
          }}>Reject</button>
        </div>
      </div>
    </div>
  )
}
