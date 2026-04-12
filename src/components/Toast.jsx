import { useState, useCallback, useEffect } from 'react'

let _addToast = null

export function useToast() {
  const toast = useCallback((type, title, msg) => {
    if (_addToast) _addToast({ type, title, msg, id: Date.now() })
  }, [])
  return toast
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = (t) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4500)
    }
    return () => { _addToast = null }
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(x => x.id !== id))

  const icons = { success: '✅', info: '📡', warning: '⚠️', error: '❌' }
  const colors = { success: '#1a7a4a', info: '#6366f1', warning: '#d97706', error: '#dc2626' }

  return (
    <div style={{
      position: 'fixed', bottom: 22, right: 22, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: '#fff', border: `1px solid #e0ded8`,
          borderLeft: `3px solid ${colors[t.type] || colors.info}`,
          borderRadius: 11, padding: '12px 16px', display: 'flex', alignItems: 'center',
          gap: 11, maxWidth: 320, boxShadow: '0 8px 30px rgba(0,0,0,.12)',
          animation: 'slideInRight 0.35s cubic-bezier(.34,1.56,.64,1)',
          fontFamily: 'var(--font-b)',
        }}>
          <span style={{ fontSize: 17 }}>{icons[t.type]}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{t.title}</div>
            <div style={{ color: '#6b6960', fontSize: 11, marginTop: 1 }}>{t.msg}</div>
          </div>
          <button onClick={() => remove(t.id)} style={{
            background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 14, padding: 2,
          }}>✕</button>
        </div>
      ))}
    </div>
  )
}
