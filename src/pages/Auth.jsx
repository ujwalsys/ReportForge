import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

// Simulates the Google OAuth popup UI flow
function GoogleOAuthPopup({ onClose, onSuccess }) {
  const [step, setStep] = useState('account') // account | password
  const [email, setEmail] = useState('')
  const accounts = [
    { name: 'Ujwal Singh', email: 'ujwal.21singh@gmail.com', avatar: 'US' },
    { name: 'Work Admin', email: 'admin@reportforge.com', avatar: 'WA' },
  ]

  return (
    <div className={styles.oauthOverlay} onClick={onClose}>
      <div className={styles.oauthPopup} onClick={e => e.stopPropagation()}>
        <div className={styles.oauthHeader}>
          <svg width="74" height="24" viewBox="0 0 74 24" fill="none">
            <text x="0" y="20" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#4285F4">G</text>
            <text x="16" y="20" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#EA4335">o</text>
            <text x="29" y="20" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#FBBC05">o</text>
            <text x="42" y="20" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#4285F4">g</text>
            <text x="54" y="20" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#34A853">l</text>
            <text x="62" y="20" fontFamily="Arial" fontWeight="700" fontSize="20" fill="#EA4335">e</text>
          </svg>
        </div>
        <div className={styles.oauthTitle}>Sign in</div>
        <div className={styles.oauthSub}>to continue to ReportForge</div>

        {step === 'account' && (
          <>
            <div className={styles.oauthAccounts}>
              {accounts.map(acc => (
                <div key={acc.email} className={styles.oauthAccount} onClick={() => { setEmail(acc.email); setStep('password') }}>
                  <div className={styles.oauthAvatar}>{acc.avatar}</div>
                  <div>
                    <div className={styles.oauthName}>{acc.name}</div>
                    <div className={styles.oauthEmail}>{acc.email}</div>
                  </div>
                  <svg style={{ marginLeft: 'auto' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </div>
              ))}
              <div className={styles.oauthAccount} onClick={() => setStep('email')}>
                <div className={styles.oauthAvatarAlt}>+</div>
                <div className={styles.oauthName}>Use another account</div>
              </div>
            </div>
            <div className={styles.oauthFooter}>
              <span>English (United States)</span>
              <div style={{ display: 'flex', gap: 16 }}>
                <span>Help</span><span>Privacy</span><span>Terms</span>
              </div>
            </div>
          </>
        )}

        {step === 'email' && (
          <div style={{ padding: '0 32px 24px' }}>
            <input
              className={styles.oauthInput} type="email" placeholder="Email or phone"
              value={email} onChange={e => setEmail(e.target.value)} autoFocus
            />
            <p style={{ fontSize: 12, color: '#5f6368', margin: '12px 0 24px', lineHeight: 1.5 }}>
              Not your computer? Use Guest mode to sign in privately.{' '}
              <span style={{ color: '#1a73e8', cursor: 'pointer' }}>Learn more</span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className={styles.oauthLink}>Forgot email?</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.oauthBtnSec} onClick={onClose}>Cancel</button>
                <button className={styles.oauthBtnPrim} onClick={() => email && setStep('password')}>Next</button>
              </div>
            </div>
          </div>
        )}

        {step === 'password' && (
          <div style={{ padding: '0 32px 24px' }}>
            <div className={styles.oauthEmailChip}>
              <div className={styles.oauthChipAvatar}>{email[0]?.toUpperCase()}</div>
              <span>{email}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setStep('account')}><polyline points="9 18 15 12 9 6" /></svg>
            </div>
            <p style={{ fontSize: 15, color: '#202124', marginBottom: 20 }}>Welcome</p>
            <input className={styles.oauthInput} type="password" placeholder="Enter your password" defaultValue="••••••••" autoFocus />
            <p style={{ fontSize: 12, color: '#5f6368', margin: '12px 0 24px', lineHeight: 1.5 }}>
              Before using this app, you can review ReportForge's{' '}
              <span style={{ color: '#1a73e8', cursor: 'pointer' }}>privacy policy</span> and{' '}
              <span style={{ color: '#1a73e8', cursor: 'pointer' }}>terms of service</span>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className={styles.oauthLink}>Forgot password?</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={styles.oauthBtnSec} onClick={onClose}>Cancel</button>
                <button className={styles.oauthBtnPrim} onClick={() => onSuccess(email)}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function GitHubOAuthPopup({ onClose, onSuccess }) {
  const [step, setStep] = useState('login')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  return (
    <div className={styles.oauthOverlay} onClick={onClose}>
      <div className={styles.githubPopup} onClick={e => e.stopPropagation()}>
        {step === 'login' && (
          <>
            <div className={styles.githubHeader}>
              <svg height="32" viewBox="0 0 16 16" fill="white" width="32">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <div className={styles.githubBody}>
              <h2 style={{ fontSize: 24, fontWeight: 300, marginBottom: 16, color: '#24292f', textAlign: 'center' }}>Sign in to GitHub</h2>
              <div className={styles.githubFg}>
                <label>Username or email address</label>
                <input className={styles.githubInput} value={user} onChange={e => setUser(e.target.value)} autoFocus />
              </div>
              <div className={styles.githubFg}>
                <label>Password <span style={{ float: 'right', color: '#0969da', cursor: 'pointer', fontSize: 12 }}>Forgot password?</span></label>
                <input className={styles.githubInput} type="password" value={pass} onChange={e => setPass(e.target.value)} />
              </div>
              <button className={styles.githubBtn} onClick={() => setStep('authorize')}>Sign in</button>
              <p style={{ fontSize: 12, color: '#57606a', textAlign: 'center', marginTop: 16 }}>
                New to GitHub? <span style={{ color: '#0969da', cursor: 'pointer' }}>Create an account</span>
              </p>
            </div>
          </>
        )}
        {step === 'authorize' && (
          <div className={styles.githubBody}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, background: '#24292f', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg height="24" viewBox="0 0 16 16" fill="white" width="24"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                </div>
                <div style={{ width: 30, height: 1, background: '#d0d7de' }} />
                <div style={{ width: 44, height: 44, background: 'var(--land-green)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>RF</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#24292f' }}>Authorize ReportForge</div>
              <div style={{ fontSize: 13, color: '#57606a', marginTop: 6 }}>ReportForge wants permission to access your account</div>
            </div>
            <div style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              {['Read your user profile', 'Access your email addresses'].map(p => (
                <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, fontSize: 13, color: '#24292f' }}>
                  <span style={{ color: '#2da44e', fontSize: 16 }}>✓</span>{p}
                </div>
              ))}
            </div>
            <button className={styles.githubBtn} style={{ background: '#2da44e' }} onClick={() => onSuccess(user || 'user@github.com')}>
              Authorize ReportForge
            </button>
            <button className={styles.githubBtnSec} onClick={onClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Auth() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [tab, setTab] = useState('signin')
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('admin@reportforge.com')
  const [password, setPassword] = useState('password123')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPass, setSignupPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthPopup, setOauthPopup] = useState(null) // 'google' | 'github'
  const [error, setError] = useState('')

  const doLogin = (r = role, name = null, emailVal = null) => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      const userData = login(r, name, emailVal)
      setLoading(false)
      navigate('/welcome')
    }, 800)
  }

  const handleEmailLogin = () => {
    if (!email) { setError('Please enter your email'); return }
    doLogin(role, null, email)
  }

  const handleSignup = () => {
    if (!firstName || !signupEmail) { setError('Please fill all required fields'); return }
    doLogin(role, `${firstName} ${lastName}`.trim(), signupEmail)
  }

  const handleOAuthSuccess = (provider, oauthEmail) => {
    setOauthPopup(null)
    doLogin(role, null, oauthEmail || `${provider}user@${provider}.com`)
  }

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftLogo} onClick={() => navigate('/')}>
          <div className={styles.leftLogoBadge}>📊</div>
          ReportForge
        </div>
        <div className={styles.leftContent}>
          <h2 className={styles.leftTitle}>
            The BI platform<br />your team <em>deserves.</em>
          </h2>
          <p className={styles.leftDesc}>
            Automate reporting, run cube analytics, schedule delivery, and monitor your pipeline — unified.
          </p>
          <div className={styles.leftSteps}>
            {[
              { n: 1, active: true, text: 'Sign in or create your account' },
              { n: 2, active: false, text: 'Set up your workspace & role' },
              { n: 3, active: false, text: 'Build and schedule your first report' },
            ].map(s => (
              <div key={s.n} className={styles.leftStep}>
                <div className={`${styles.stepCircle} ${s.active ? styles.stepActive : ''}`}>{s.n}</div>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.leftBackBtn} onClick={() => navigate('/')}>← Back to home</div>
      </div>

      {/* Right panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'signin' ? styles.tabOn : ''}`} onClick={() => { setTab('signin'); setError('') }}>Sign In</button>
            <button className={`${styles.tab} ${tab === 'signup' ? styles.tabOn : ''}`} onClick={() => { setTab('signup'); setError('') }}>Sign Up</button>
          </div>

          {/* Role Selector */}
          <div className={styles.roleRow}>
            <div className={`${styles.roleOpt} ${role === 'admin' ? styles.roleSelected : ''}`} onClick={() => setRole('admin')}>
              <div className={styles.roleIcon}>👑</div>
              <div className={styles.roleName}>Admin</div>
              <div className={styles.roleDesc}>Full access</div>
            </div>
            <div className={`${styles.roleOpt} ${role === 'user' ? styles.roleSelected : ''}`} onClick={() => setRole('user')}>
              <div className={styles.roleIcon}>👤</div>
              <div className={styles.roleName}>User</div>
              <div className={styles.roleDesc}>My reports</div>
            </div>
          </div>

          {/* Social */}
          <div className={styles.socialRow}>
            <button className={styles.socialBtn} onClick={() => setOauthPopup('google')}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
            <button className={styles.socialBtn} onClick={() => setOauthPopup('github')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className={styles.divider}><span>or continue with email</span></div>

          {tab === 'signin' && (
            <>
              <div className={styles.fg}>
                <label>Email Address</label>
                <input className={styles.inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@company.com" />
              </div>
              <div className={styles.fg}>
                <label>Password</label>
                <input className={styles.inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
              </div>
              <div className={styles.forgotRow}>
                <span className={styles.forgot}>Forgot password?</span>
              </div>
            </>
          )}

          {tab === 'signup' && (
            <>
              <div className={styles.frow}>
                <div className={styles.fg}><label>First Name *</label><input className={styles.inp} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" /></div>
                <div className={styles.fg}><label>Last Name</label><input className={styles.inp} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" /></div>
              </div>
              <div className={styles.fg}><label>Work Email *</label><input className={styles.inp} type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="you@company.com" /></div>
              <div className={styles.fg}><label>Password *</label><input className={styles.inp} type="password" value={signupPass} onChange={e => setSignupPass(e.target.value)} placeholder="Min. 8 characters" /></div>
            </>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submitBtn} onClick={tab === 'signin' ? handleEmailLogin : handleSignup} disabled={loading}>
            {loading ? <span className="spin">⚙️</span> : tab === 'signin' ? 'Sign In to ReportForge →' : 'Create Account →'}
          </button>

          <div className={styles.switchRow}>
            {tab === 'signin' ? (
              <>Don't have an account? <span onClick={() => setTab('signup')}>Sign up free</span></>
            ) : (
              <>Already have an account? <span onClick={() => setTab('signin')}>Sign in</span></>
            )}
          </div>
        </div>
      </div>

      {/* OAuth Popups */}
      {oauthPopup === 'google' && (
        <GoogleOAuthPopup onClose={() => setOauthPopup(null)} onSuccess={(em) => handleOAuthSuccess('google', em)} />
      )}
      {oauthPopup === 'github' && (
        <GitHubOAuthPopup onClose={() => setOauthPopup(null)} onSuccess={(em) => handleOAuthSuccess('github', em)} />
      )}
    </div>
  )
}
