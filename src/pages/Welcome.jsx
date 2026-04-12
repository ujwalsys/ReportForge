import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CookieBanner from '../components/CookieBanner'
import styles from './Welcome.module.css'

const ADMIN_ACCESS = [
  { icon: '📊', name: 'Full Dashboard', tag: 'All analytics', ok: true },
  { icon: '🔨', name: 'Report Builder', tag: 'Create & edit', ok: true },
  { icon: '📈', name: 'Analytics', tag: 'Global charts', ok: true },
  { icon: '🧊', name: 'Cube Engine', tag: 'Group By', ok: true },
  { icon: '⏰', name: 'Scheduler', tag: 'All users', ok: true },
  { icon: '🖥️', name: 'MQ Monitor', tag: 'ActiveMQ live', ok: true },
  { icon: '📋', name: 'All Reports', tag: 'Everyone', ok: true },
  { icon: '⚙️', name: 'Settings', tag: 'System config', ok: true },
]

const USER_ACCESS = [
  { icon: '📊', name: 'Dashboard', tag: 'Your reports', ok: true },
  { icon: '🔨', name: 'Report Builder', tag: 'Create', ok: true },
  { icon: '📈', name: 'Analytics', tag: 'Basic charts', ok: true },
  { icon: '🧊', name: 'Cube Engine', tag: 'Admin only', ok: false },
  { icon: '⏰', name: 'Scheduler', tag: 'Own jobs', ok: true },
  { icon: '🖥️', name: 'MQ Monitor', tag: 'Admin only', ok: false },
  { icon: '📋', name: 'Report History', tag: 'Your data', ok: true },
  { icon: '📥', name: 'Downloads', tag: 'Own files', ok: true },
]

export default function Welcome() {
  const { user, cookieAccepted } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/auth')
  }, [user, navigate])

  if (!user) return null

  const isAdmin = user.role === 'admin'
  const accessList = isAdmin ? ADMIN_ACCESS : USER_ACCESS

  return (
    <div className={`${styles.page} ${isAdmin ? styles.adminPage : styles.userPage}`}>
      <div className={styles.bg} />

      <div className={styles.inner}>
        {/* Badge */}
        <div className={`${styles.badge} ${isAdmin ? styles.adminBadge : styles.userBadge}`} style={{ animationDelay: '0s' }}>
          {isAdmin ? '👑 ADMIN · FULL ACCESS GRANTED' : '👤 USER · PERSONAL WORKSPACE'}
        </div>

        {/* Title */}
        <h1 className={`${styles.title} ${isAdmin ? styles.adminTitle : styles.userTitle}`}>
          Welcome back,<br />
          <span className={`${isAdmin ? styles.adminSpan : styles.userSpan}`}>
            {user.name}.
          </span>
        </h1>

        {/* Sub */}
        <p className={`${styles.sub} ${isAdmin ? styles.adminSub : styles.userSub}`}>
          {isAdmin
            ? 'You have complete access to all reporting tools, analytics engine, ActiveMQ monitor, cube engine, and system administration.'
            : 'Access your personal reports, schedule deliveries, download your data — all in your clean, dedicated workspace.'}
        </p>

        {/* Access Cards */}
        <div className={styles.grid}>
          {accessList.map((item, i) => (
            <div
              key={item.name}
              className={`${styles.card} ${isAdmin ? styles.adminCard : styles.userCard} ${!item.ok ? styles.cardLocked : ''}`}
              style={{ animationDelay: `${0.3 + i * 0.05}s`, animation: 'fadeUp 0.5s ease both' }}
            >
              <div className={styles.cardIcon}>{item.icon}</div>
              <div className={styles.cardName}>{item.name}</div>
              <div className={`${styles.cardTag} ${item.ok ? (isAdmin ? styles.tagOk : styles.tagOkUser) : styles.tagLocked}`}>
                {item.ok ? '✅' : '🔒'} {item.tag}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className={`${styles.exploreBtn} ${isAdmin ? styles.adminBtn : styles.userBtn}`}
          style={{ animation: 'fadeUp 0.5s 0.7s ease both' }}
          onClick={() => navigate('/dashboard')}
        >
          {isAdmin ? 'Explore Admin Dashboard →' : 'Go to My Dashboard →'}
        </button>
      </div>

      {/* Cookie Banner bottom-left */}
      {!cookieAccepted && <CookieBanner />}
    </div>
  )
}
