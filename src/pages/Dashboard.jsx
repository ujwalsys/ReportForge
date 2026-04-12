import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { DB_DATA, DEMO_JOBS } from '../data/mockData'
import { useToast } from '../components/Toast'
import styles from './Dashboard.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const SIDEBAR_ITEMS_ADMIN = [
  { section: 'Workspace' },
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'builder', icon: '🔨', label: 'Report Builder' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'cube', icon: '🧊', label: 'Cube Engine' },
  { section: 'Reports' },
  { id: 'history', icon: '📋', label: 'All Reports', badge: 'jobs' },
  { id: 'schedule', icon: '⏰', label: 'Scheduler', badge: 'schedules' },
  { section: 'System' },
  { id: 'mqmonitor', icon: '🖥️', label: 'MQ Monitor' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

const SIDEBAR_ITEMS_USER = [
  { section: 'My Workspace' },
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'builder', icon: '🔨', label: 'Report Builder' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'cube', icon: '🧊', label: 'Cube Engine', locked: true },
  { section: 'My Reports' },
  { id: 'history', icon: '📋', label: 'My Reports', badge: 'jobs' },
  { id: 'schedule', icon: '⏰', label: 'My Schedules', badge: 'schedules' },
  { section: 'System' },
  { id: 'mqmonitor', icon: '🖥️', label: 'MQ Monitor', locked: true },
]

let jobIdCounter = 1005

export default function Dashboard() {
  const { user, logout: authLogout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [active, setActive] = useState('dashboard')
  const [jobs, setJobs] = useState(() =>
    DEMO_JOBS.map(d => ({ ...d, createdAt: new Date(Date.now() - d.hoursAgo * 3600000) }))
  )
  const [builderOpen, setBuilderOpen] = useState(false)
  const [mqOpen, setMqOpen] = useState(false)
  const [lockedModal, setLockedModal] = useState(false)

  useEffect(() => { if (!user) navigate('/auth') }, [user, navigate])
  if (!user) return null

  const isAdmin = user.role === 'admin'
  const sideItems = isAdmin ? SIDEBAR_ITEMS_ADMIN : SIDEBAR_ITEMS_USER

  const handleNav = (id, locked) => {
    if (locked) { setLockedModal(true); return }
    setActive(id)
    if (id === 'builder') setBuilderOpen(true)
    if (id === 'mqmonitor') setMqOpen(true)
  }

  const doLogout = () => { authLogout(); navigate('/') }

  const pageTitles = { dashboard: isAdmin ? 'Admin Dashboard' : 'My Dashboard', builder: 'Report Builder', analytics: 'Analytics & Charts', cube: 'Cube Engine', history: isAdmin ? 'All Reports' : 'My Reports', schedule: 'Scheduler', mqmonitor: 'ActiveMQ Monitor', settings: 'Settings' }

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === 'COMPLETED').length,
    inQueue: jobs.filter(j => ['PENDING','PROCESSING'].includes(j.status)).length,
    failed: jobs.filter(j => j.status === 'FAILED').length,
  }

  return (
    <div className={`${styles.layout} ${isAdmin ? styles.adminLayout : styles.userLayout}`}>
      {/* ── SIDEBAR ── */}
      <aside className={`${styles.sidebar} ${isAdmin ? styles.adminSidebar : styles.userSidebar}`}>
        <div className={`${styles.sbLogo} ${isAdmin ? styles.adminSbLogo : styles.userSbLogo}`}>
          <div style={{ fontFamily: 'var(--font-d)', fontSize: 19, fontWeight: 800 }}>ReportForge</div>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 2, opacity: 0.5 }}>
            {isAdmin ? 'Enterprise · Admin' : 'User Workspace'}
          </div>
        </div>

        <nav className={styles.sbNav}>
          {sideItems.map((item, i) => {
            if (item.section) return (
              <div key={i} className={`${styles.navSec} ${isAdmin ? styles.adminNavSec : styles.userNavSec}`}>{item.section}</div>
            )
            const isActive = active === item.id && !item.locked
            return (
              <div key={item.id}
                className={`${styles.navItem} ${isAdmin ? styles.adminNavItem : styles.userNavItem} ${isActive ? (isAdmin ? styles.adminNavOn : styles.userNavOn) : ''} ${item.locked ? styles.navLocked : ''}`}
                onClick={() => handleNav(item.id, item.locked)}
                title={item.locked ? 'Admin access only' : ''}
              >
                <span className={styles.navIco}>{item.icon}</span>
                <span>{item.label}</span>
                {item.locked && <span className={styles.lockIcon}>🔒</span>}
                {item.badge === 'jobs' && !item.locked && (
                  <span className={`${styles.badge} ${isAdmin ? styles.adminBadge : styles.userBadge}`}>{jobs.length}</span>
                )}
              </div>
            )
          })}
          <div className={`${styles.navItem} ${isAdmin ? styles.adminNavItem : styles.userNavItem}`} onClick={doLogout}>
            <span className={styles.navIco}>🚪</span><span>Logout</span>
          </div>
        </nav>

        <div className={`${styles.sbFoot} ${isAdmin ? styles.adminSbFoot : styles.userSbFoot}`}>
          <div className={styles.userRow}>
            <div className={`${styles.ava} ${isAdmin ? styles.adminAva : styles.userAva}`}>{user.initials}</div>
            <div>
              <div className={`${styles.uName} ${isAdmin ? styles.adminUName : styles.userUName}`}>{user.name}</div>
              <div className={`${styles.uRole} ${isAdmin ? styles.adminURole : styles.userURole}`}>{isAdmin ? '👑 Super Admin' : '👤 Standard User'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className={styles.main}>
        {/* TOPBAR */}
        <div className={`${styles.topbar} ${isAdmin ? styles.adminTopbar : styles.userTopbar}`}>
          <div className={`${styles.topTitle} ${isAdmin ? styles.adminTopTitle : styles.userTopTitle}`}>{pageTitles[active]}</div>
          {isAdmin && (
            <div className={styles.mqChip}>
              <span className={styles.mqDot} />ActiveMQ Live
            </div>
          )}
          <button className={`${styles.btnSmGhost} ${isAdmin ? styles.adminBtnGhost : styles.userBtnGhost}`} onClick={() => setBuilderOpen(true)}>➕ New Report</button>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {active === 'dashboard' && <DashSection isAdmin={isAdmin} jobs={jobs} setJobs={setJobs} stats={stats} toast={toast} onNew={() => setBuilderOpen(true)} />}
          {active === 'analytics' && <AnalyticsSection isAdmin={isAdmin} toast={toast} />}
          {active === 'cube' && isAdmin && <CubeSection toast={toast} />}
          {active === 'history' && <HistorySection isAdmin={isAdmin} jobs={jobs} setJobs={setJobs} toast={toast} />}
          {active === 'schedule' && <ScheduleSection isAdmin={isAdmin} toast={toast} />}
          {active === 'settings' && isAdmin && <SettingsSection />}
          {active === 'builder' && <BuilderPlaceholder onOpen={() => setBuilderOpen(true)} isAdmin={isAdmin} />}
        </div>
      </div>

      {/* MODALS */}
      {builderOpen && <BuilderModal isAdmin={isAdmin} onClose={() => setBuilderOpen(false)} onGenerate={(job) => { setJobs(prev => [job, ...prev]); setBuilderOpen(false); setActive('dashboard'); toast('info', 'Job Queued', `${job.id} sent to queue`); simulateJob(job, setJobs, toast) }} />}
      {mqOpen && <MQModal jobs={jobs} onClose={() => setMqOpen(false)} />}
      {lockedModal && <LockedModal onClose={() => setLockedModal(false)} />}
    </div>
  )
}

function simulateJob(job, setJobs, toast) {
  setTimeout(() => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'PROCESSING' } : j))
    let p = 0
    const t = setInterval(() => {
      p += 10
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, progress: Math.min(p, 98) } : j))
      if (p >= 100) {
        clearInterval(t)
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'COMPLETED', progress: 100 } : j))
        toast('success', '✅ Report Ready', `"${job.name}" is ready to download!`)
      }
    }, 700)
  }, 1200)
}

/* ── DASHBOARD SECTION ── */
function DashSection({ isAdmin, jobs, setJobs, stats, toast, onNew }) {
  const grouped = {}
  DB_DATA.forEach(r => { grouped[r.region] = (grouped[r.region] || 0) + r.grand_total })
  const statusCounts = { COMPLETED: jobs.filter(j=>j.status==='COMPLETED').length, PENDING: jobs.filter(j=>j.status==='PENDING').length, FAILED: jobs.filter(j=>j.status==='FAILED').length }
  const chartColors = isAdmin
    ? { bar: ['#6366f1cc','#10b981cc','#f59e0bcc','#38bdf8cc'], grid: '#252638', text: '#8b8faf', tick: '#8b8faf' }
    : { bar: ['rgba(26,122,74,.7)','rgba(45,158,101,.7)','rgba(14,165,233,.7)','rgba(217,119,6,.7)'], grid: '#d0e8da', text: '#3d6b53', tick: '#85b09a' }

  const barData = {
    labels: Object.keys(grouped),
    datasets: [{ label: 'Revenue (₹)', data: Object.values(grouped), backgroundColor: chartColors.bar, borderRadius: 6, borderWidth: 0 }]
  }
  const donutData = {
    labels: Object.keys(statusCounts),
    datasets: [{ data: Object.values(statusCounts), backgroundColor: isAdmin ? ['#10b981','#f59e0b','#ef4444'] : ['#1a7a4a','#d97706','#dc2626'], borderWidth: 0 }]
  }
  const chartOpts = (label) => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartColors.text, font: { family: 'JetBrains Mono', size: 10 } } } }, scales: { x: { ticks: { color: chartColors.tick }, grid: { color: chartColors.grid } }, y: { ticks: { color: chartColors.tick }, grid: { color: chartColors.grid } } } })
  const donutOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartColors.text, font: { family: 'JetBrains Mono', size: 10 } } } } }

  return (
    <div>
      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Reports', val: stats.total, color: isAdmin ? '#6366f1' : 'var(--usr-accent)' },
          { label: 'Completed', val: stats.completed, color: isAdmin ? '#10b981' : 'var(--usr-accent)' },
          { label: 'In Queue', val: stats.inQueue, color: isAdmin ? '#38bdf8' : 'var(--usr-accent3)' },
          { label: 'Failed', val: stats.failed, color: isAdmin ? '#ef4444' : 'var(--usr-red)' },
        ].map((s, i) => (
          <div key={s.label} className={`${styles.statCard} ${isAdmin ? styles.adminStatCard : styles.userStatCard}`} style={{ '--accent-top': s.color }}>
            <div className={`${styles.statLabel} ${isAdmin ? styles.adminStatLabel : styles.userStatLabel}`}>{s.label}</div>
            <div className={styles.statVal} style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* KPI */}
      <div className={`${styles.panel} ${isAdmin ? styles.adminPanel : styles.userPanel}`}>
        <div className={`${styles.panelHead} ${isAdmin ? styles.adminPanelHead : styles.userPanelHead}`}>
          <span className={`${styles.panelTitle} ${isAdmin ? styles.adminPanelTitle : styles.userPanelTitle}`}>💰 Live KPI Metrics</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-m)', opacity: 0.5 }}>Real-time · Aggregated</span>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.kpiGrid}>
            {[
              { val: '₹2,94,500', label: 'Total Revenue', sub: 'SUM(grand_total)', color: isAdmin ? '#10b981' : '#1a7a4a' },
              { val: '10', label: 'Total Records', sub: 'COUNT(*)', color: isAdmin ? '#6366f1' : '#0ea5e9' },
              { val: '4', label: 'Unpaid', sub: "WHERE status='unpaid'", color: isAdmin ? '#f59e0b' : '#d97706' },
              { val: '6.4%', label: 'Avg Churn', sub: 'AVG(churn_rate)', color: isAdmin ? '#ef4444' : '#dc2626' },
            ].map(k => (
              <div key={k.label} className={`${styles.kpiCard} ${isAdmin ? styles.adminKpiCard : styles.userKpiCard}`}>
                <div style={{ fontFamily: 'var(--font-d)', fontSize: 26, fontWeight: 800, color: k.color }}>{k.val}</div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.5, marginTop: 4 }}>{k.label}</div>
                <div style={{ fontSize: 10, opacity: 0.4, marginTop: 2 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.grid2}>
        <div className={`${styles.panel} ${isAdmin ? styles.adminPanel : styles.userPanel}`}>
          <div className={`${styles.panelHead} ${isAdmin ? styles.adminPanelHead : styles.userPanelHead}`}>
            <span className={`${styles.panelTitle} ${isAdmin ? styles.adminPanelTitle : styles.userPanelTitle}`}>📊 Revenue by Region</span>
          </div>
          <div className={styles.panelBody}>
            <div style={{ height: 220 }}><Bar data={barData} options={chartOpts()} /></div>
          </div>
        </div>
        <div className={`${styles.panel} ${isAdmin ? styles.adminPanel : styles.userPanel}`}>
          <div className={`${styles.panelHead} ${isAdmin ? styles.adminPanelHead : styles.userPanelHead}`}>
            <span className={`${styles.panelTitle} ${isAdmin ? styles.adminPanelTitle : styles.userPanelTitle}`}>📦 Report Status</span>
          </div>
          <div className={styles.panelBody}>
            <div style={{ height: 220 }}><Doughnut data={donutData} options={donutOpts} /></div>
          </div>
        </div>
      </div>

      {/* Jobs table */}
      <ReportsTable isAdmin={isAdmin} jobs={jobs.slice(0, 8)} setJobs={setJobs} toast={toast} onNew={onNew} />
    </div>
  )
}

function ReportsTable({ isAdmin, jobs, setJobs, toast, onNew }) {
  const statusBadge = (s, isAdmin) => {
    const map = {
      COMPLETED: isAdmin ? styles.adminBadgeGreen : styles.userBadgeGreen,
      PROCESSING: isAdmin ? styles.adminBadgeBlue : styles.userBadgeBlue,
      PENDING: isAdmin ? styles.adminBadgeYellow : styles.userBadgeYellow,
      FAILED: isAdmin ? styles.adminBadgeRed : styles.userBadgeRed,
    }
    return <span className={`${styles.statusBadge} ${map[s] || ''}`}>{s}</span>
  }

  return (
    <div className={`${styles.tableWrap} ${isAdmin ? styles.adminTableWrap : styles.userTableWrap}`}>
      <div className={`${styles.tableHeader} ${isAdmin ? styles.adminTableHeader : styles.userTableHeader}`}>
        <span className={`${styles.tableTitle} ${isAdmin ? styles.adminTableTitle : styles.userTableTitle}`}>
          📋 {isAdmin ? 'All Reports' : 'My Recent Reports'}
        </span>
        <button className={`${styles.btnSm} ${isAdmin ? styles.adminBtnPrim : styles.userBtnPrim}`} onClick={onNew}>➕ New</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['Job ID','Report Name','Type','Columns','Status','Created','Actions'].map(h => (
                <th key={h} className={`${styles.th} ${isAdmin ? styles.adminTh : styles.userTh}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, opacity: 0.4, fontSize: 13 }}>No reports yet. Create your first!</td></tr>
            )}
            {jobs.map(job => (
              <tr key={job.id} className={`${styles.tr} ${isAdmin ? styles.adminTr : styles.userTr}`}>
                <td className={`${styles.td} ${isAdmin ? styles.adminTd : styles.userTd}`}>
                  <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, opacity: 0.5 }}>{job.id}</span>
                </td>
                <td className={`${styles.td} ${isAdmin ? styles.adminTd : styles.userTd}`}>
                  <div style={{ fontWeight: 600 }}>{job.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.4, fontFamily: 'var(--font-m)', marginTop: 2 }}>{job.attrs.slice(0,3).join(' · ')}{job.attrs.length > 3 ? '...' : ''}</div>
                </td>
                <td className={`${styles.td} ${isAdmin ? styles.adminTd : styles.userTd}`}>
                  <span style={{ fontSize: 10, background: job.type === 'Y' ? 'rgba(26,122,74,.1)' : 'rgba(14,165,233,.1)', color: job.type === 'Y' ? '#1a7a4a' : '#0ea5e9', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-m)', fontWeight: 600 }}>{job.type === 'Y' ? '🏢 Y' : '🧪 N'}</span>
                </td>
                <td className={`${styles.td} ${isAdmin ? styles.adminTd : styles.userTd}`} style={{ fontSize: 12, opacity: 0.6 }}>{job.attrs.length} cols</td>
                <td className={`${styles.td} ${isAdmin ? styles.adminTd : styles.userTd}`}>
                  {statusBadge(job.status, isAdmin)}
                  {job.status === 'PROCESSING' && (
                    <div style={{ marginTop: 4 }}>
                      <div style={{ width: 72, height: 3, background: isAdmin ? '#1a1b28' : '#d0e8da', borderRadius: 2, overflow: 'hidden', display: 'inline-block' }}>
                        <div style={{ height: '100%', width: `${job.progress}%`, background: isAdmin ? 'linear-gradient(90deg,#6366f1,#38bdf8)' : 'linear-gradient(90deg,#1a7a4a,#2d9e65)', borderRadius: 2, transition: 'width .4s' }} />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-m)', marginLeft: 6, opacity: 0.6 }}>{job.progress}%</span>
                    </div>
                  )}
                </td>
                <td className={`${styles.td} ${isAdmin ? styles.adminTd : styles.userTd}`} style={{ fontSize: 11, opacity: 0.5 }}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className={`${styles.td} ${isAdmin ? styles.adminTd : styles.userTd}`}>
                  {job.status === 'COMPLETED' && (
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className={`${styles.btnXs} ${isAdmin ? styles.adminBtnGreen : styles.userBtnGreen}`} onClick={() => toast('success', '⬇ Downloading', 'Fetching your Excel file...')}>⬇</button>
                      <button className={`${styles.btnXs} ${isAdmin ? styles.adminBtnOrange : styles.userBtnOrange}`} onClick={() => toast('info', '🔁 Rerun', 'Fetching fresh data...')}>🔁</button>
                    </div>
                  )}
                  {job.status === 'FAILED' && (
                    <button className={`${styles.btnXs}`} style={{ background: 'rgba(239,68,68,.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,.2)', borderRadius: 5, padding: '3px 8px', fontSize: 10 }}
                      onClick={() => { setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'PENDING', progress: 0 } : j)); toast('info', '↺ Retrying', `${job.id} requeued`) }}>
                      ↺ Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── ANALYTICS ── */
function AnalyticsSection({ isAdmin, toast }) {
  const [xAxis, setXAxis] = useState('region')
  const [yAxis, setYAxis] = useState('grand_total')
  const [agg, setAgg] = useState('SUM')
  const grouped = {}
  DB_DATA.forEach(r => { const k = r[xAxis] || 'Other'; if (!grouped[k]) grouped[k] = { sum: 0, count: 0 }; grouped[k].sum += (r[yAxis] || 0); grouped[k].count++ })
  const vals = Object.entries(grouped).map(([k, v]) => ({ k, v: agg === 'SUM' ? v.sum : agg === 'COUNT' ? v.count : (v.sum/v.count).toFixed(0) }))
  const colors = isAdmin ? ['#6366f1','#10b981','#f59e0b','#38bdf8','#ec4899'] : ['#1a7a4a','#2d9e65','#0ea5e9','#d97706','#dc2626']
  const data = { labels: vals.map(v => v.k), datasets: [{ label: `${agg}(${yAxis})`, data: vals.map(v => v.v), backgroundColor: colors.map(c => c + 'cc'), borderRadius: 5, borderWidth: 0 }] }
  const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: isAdmin ? '#8b8faf' : '#3d6b53', font: { family: 'JetBrains Mono', size: 10 } } } }, scales: { x: { ticks: { color: isAdmin ? '#8b8faf' : '#85b09a' }, grid: { color: isAdmin ? '#252638' : '#d0e8da' } }, y: { ticks: { color: isAdmin ? '#8b8faf' : '#85b09a' }, grid: { color: isAdmin ? '#252638' : '#d0e8da' } } } }
  const selStyle = (dark) => dark ? { background: '#13141f', border: '1px solid #252638', color: '#eef0f8', borderRadius: 7, padding: '9px 12px', fontSize: 13, width: '100%', fontFamily: 'var(--font-b)' } : { background: '#f5faf7', border: '1.5px solid #d0e8da', color: '#0d2318', borderRadius: 7, padding: '9px 12px', fontSize: 13, width: '100%', fontFamily: 'var(--font-b)' }

  return (
    <div className={`${styles.panel} ${isAdmin ? styles.adminPanel : styles.userPanel}`}>
      <div className={`${styles.panelHead} ${isAdmin ? styles.adminPanelHead : styles.userPanelHead}`}>
        <span className={`${styles.panelTitle} ${isAdmin ? styles.adminPanelTitle : styles.userPanelTitle}`}>📈 Chart Builder</span>
        <button className={`${styles.btnSm} ${isAdmin ? styles.adminBtnPrim : styles.userBtnPrim}`} onClick={() => toast('success','📊 Chart Built',`${agg}(${yAxis}) GROUP BY ${xAxis}`)}>🔄 Generate</button>
      </div>
      <div className={styles.panelBody}>
        <div className={styles.grid2}>
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block', opacity: 0.6 }}>X Axis (Dimension)</label>
              <select style={selStyle(isAdmin)} value={xAxis} onChange={e => setXAxis(e.target.value)}>
                <option value="region">Region</option><option value="plan_type">Plan Type</option>
                <option value="payment_status">Payment Status</option><option value="company_name">Company</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block', opacity: 0.6 }}>Y Axis (Metric)</label>
              <select style={selStyle(isAdmin)} value={yAxis} onChange={e => setYAxis(e.target.value)}>
                <option value="grand_total">Grand Total</option><option value="revenue">Revenue</option>
                <option value="mrr">MRR</option><option value="arr">ARR</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block', opacity: 0.6 }}>Aggregation</label>
              <select style={selStyle(isAdmin)} value={agg} onChange={e => setAgg(e.target.value)}>
                <option>SUM</option><option>COUNT</option><option>AVG</option>
              </select>
            </div>
          </div>
          <div style={{ height: 260 }}><Bar data={data} options={opts} /></div>
        </div>
      </div>
    </div>
  )
}

/* ── CUBE ── */
function CubeSection({ toast }) {
  const [gb, setGb] = useState('region')
  const [agg, setAgg] = useState('SUM')
  const [result, setResult] = useState(null)

  const run = () => {
    const grouped = {}
    DB_DATA.forEach(r => { const k = r[gb] || 'Unknown'; if (!grouped[k]) grouped[k] = { count: 0, total: 0 }; grouped[k].count++; grouped[k].total += r.grand_total || 0 })
    setResult(Object.entries(grouped).map(([k, v]) => ({ key: k, val: agg === 'AVG' ? (v.total/v.count).toFixed(0) : agg === 'COUNT' ? v.count : v.total, count: v.count })))
    toast('success', '🧊 Cube Done', `${Object.keys(grouped).length} groups from ${DB_DATA.length} rows`)
  }

  return (
    <div className={`${styles.panel} ${styles.adminPanel}`}>
      <div className={`${styles.panelHead} ${styles.adminPanelHead}`}>
        <span className={`${styles.panelTitle} ${styles.adminPanelTitle}`}>🧊 Cube Engine — Group By + Aggregation</span>
        <button className={`${styles.btnSm} ${styles.adminBtnPrim}`} onClick={run}>▶ Run Query</button>
      </div>
      <div className={styles.panelBody}>
        <div className={styles.grid2}>
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block', color: '#8b8faf' }}>Group By</label>
              <select style={{ background: '#13141f', border: '1px solid #252638', color: '#eef0f8', borderRadius: 7, padding: '9px 12px', fontSize: 13, width: '100%' }} value={gb} onChange={e => setGb(e.target.value)}>
                <option value="region">Region</option><option value="plan_type">Plan Type</option>
                <option value="payment_status">Payment Status</option><option value="company_name">Company</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block', color: '#8b8faf' }}>Aggregation</label>
              <select style={{ background: '#13141f', border: '1px solid #252638', color: '#eef0f8', borderRadius: 7, padding: '9px 12px', fontSize: 13, width: '100%' }} value={agg} onChange={e => setAgg(e.target.value)}>
                <option>SUM</option><option>COUNT</option><option>AVG</option><option>MAX</option>
              </select>
            </div>
            <div style={{ background: '#13141f', border: '1px solid #252638', borderRadius: 8, padding: '12px 14px', fontSize: 11, color: '#4a4d6a', fontFamily: 'var(--font-m)', lineHeight: 1.7 }}>
              <strong style={{ color: '#818cf8' }}>Generated SQL:</strong><br />
              SELECT {gb}, {agg}(grand_total), COUNT(*)<br />
              FROM report_base_view<br />
              GROUP BY {gb}
            </div>
          </div>
          <div style={{ background: '#13141f', border: '1px solid #252638', borderRadius: 9, overflow: 'auto', maxHeight: 300 }}>
            {!result ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#4a4d6a', fontSize: 13 }}>Click "Run Query" to see results</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  <th style={{ padding: '8px 12px', fontSize: 9, fontFamily: 'var(--font-m)', color: '#4a4d6a', textTransform: 'uppercase', letterSpacing: 1, background: '#1a1b28', textAlign: 'left' }}>{gb}</th>
                  <th style={{ padding: '8px 12px', fontSize: 9, fontFamily: 'var(--font-m)', color: '#4a4d6a', textTransform: 'uppercase', letterSpacing: 1, background: '#1a1b28', textAlign: 'left' }}>{agg}(Grand Total)</th>
                  <th style={{ padding: '8px 12px', fontSize: 9, fontFamily: 'var(--font-m)', color: '#4a4d6a', textTransform: 'uppercase', letterSpacing: 1, background: '#1a1b28', textAlign: 'left' }}>COUNT</th>
                </tr></thead>
                <tbody>
                  {result.map(r => (
                    <tr key={r.key} style={{ borderBottom: '1px solid #252638' }}>
                      <td style={{ padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#eef0f8' }}>{r.key}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, fontFamily: 'var(--font-m)', color: '#10b981' }}>₹{Number(r.val).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, fontFamily: 'var(--font-m)', color: '#38bdf8' }}>{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── HISTORY ── */
function HistorySection({ isAdmin, jobs, setJobs, toast }) {
  return <ReportsTable isAdmin={isAdmin} jobs={jobs} setJobs={setJobs} toast={toast} onNew={() => {}} />
}

/* ── SCHEDULE ── */
function ScheduleSection({ isAdmin, toast }) {
  return (
    <div className={`${styles.panel} ${isAdmin ? styles.adminPanel : styles.userPanel}`}>
      <div className={`${styles.panelHead} ${isAdmin ? styles.adminPanelHead : styles.userPanelHead}`}>
        <span className={`${styles.panelTitle} ${isAdmin ? styles.adminPanelTitle : styles.userPanelTitle}`}>⏰ Scheduled Reports</span>
        <button className={`${styles.btnSm} ${isAdmin ? styles.adminBtnPrim : styles.userBtnPrim}`} onClick={() => toast('info','Coming Soon','Scheduler connects to Spring @Scheduled in backend')}>➕ New Schedule</button>
      </div>
      <div className={styles.panelBody}>
        <div style={{ textAlign: 'center', padding: '48px 0', opacity: 0.4 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏰</div>
          <div style={{ fontSize: 14 }}>No scheduled reports yet.</div>
          <div style={{ fontSize: 12, marginTop: 6, fontFamily: 'var(--font-m)' }}>Spring @Scheduled backend integration ready</div>
        </div>
      </div>
    </div>
  )
}

/* ── SETTINGS ── */
function SettingsSection() {
  const fields = [
    { label: 'ActiveMQ Broker URL', val: 'tcp://localhost:61616' },
    { label: 'Queue Name', val: 'report.generation.queue' },
    { label: 'MySQL DB URL', val: 'jdbc:mysql://localhost:3306/reportforge' },
    { label: 'Storage Path', val: '/reports/' },
    { label: 'Poll Interval', val: '5000ms' },
    { label: 'Worker Threads', val: '3 @JmsListener workers' },
  ]
  return (
    <div className={`${styles.panel} ${styles.adminPanel}`}>
      <div className={`${styles.panelHead} ${styles.adminPanelHead}`}>
        <span className={`${styles.panelTitle} ${styles.adminPanelTitle}`}>⚙️ System Configuration</span>
      </div>
      <div className={styles.panelBody}>
        <div className={styles.grid2}>
          {fields.map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, color: '#8b8faf', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input readOnly value={f.val} style={{ width: '100%', background: '#13141f', border: '1px solid #252638', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#eef0f8', fontFamily: 'var(--font-m)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── BUILDER PLACEHOLDER ── */
function BuilderPlaceholder({ onOpen, isAdmin }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔨</div>
      <div style={{ fontFamily: 'var(--font-d)', fontSize: 24, marginBottom: 12, color: isAdmin ? '#fff' : '#0d2318' }}>Report Builder</div>
      <p style={{ opacity: 0.5, marginBottom: 28 }}>Create dynamic reports with custom columns, grouping & aggregations</p>
      <button className={`${styles.btnSm} ${isAdmin ? styles.adminBtnPrim : styles.userBtnPrim}`} onClick={onOpen} style={{ padding: '12px 32px' }}>➕ Open Builder</button>
    </div>
  )
}

/* ── BUILDER MODAL ── */
function BuilderModal({ isAdmin, onClose, onGenerate }) {
  const [name, setName] = useState('')
  const [attrs, setAttrs] = useState(new Set(['user_name','email']))
  const COLS = ['user_name','email','company_name','region','plan_type','payment_status','grand_total','revenue','mrr','arr','churn_rate','invoice_type']

  const toggle = (col) => setAttrs(prev => { const n = new Set(prev); n.has(col) ? n.delete(col) : n.add(col); return n })

  const submit = () => {
    if (!name.trim()) return
    const job = { id: `RPT-${++jobIdCounter}`, name, type: 'Y', attrs: [...attrs], status: 'PENDING', progress: 0, createdAt: new Date() }
    onGenerate(job)
  }

  const bg = isAdmin ? '#0e0f18' : '#fff'
  const bord = isAdmin ? '#252638' : '#d0e8da'
  const txt = isAdmin ? '#eef0f8' : '#0d2318'
  const txt2 = isAdmin ? '#8b8faf' : '#3d6b53'
  const chipSel = isAdmin ? { border: '1px solid #6366f1', background: 'rgba(99,102,241,.1)', color: '#818cf8' } : { border: '1.5px solid #1a7a4a', background: 'rgba(26,122,74,.08)', color: '#1a7a4a' }
  const chipDef = isAdmin ? { border: '1px solid #252638', background: '#13141f', color: '#8b8faf' } : { border: '1.5px solid #d0e8da', background: '#f5faf7', color: '#3d6b53' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(10px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s' }}>
      <div style={{ background: bg, border: `1px solid ${bord}`, borderRadius: 15, width: 580, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.4)', animation: 'slideUp 0.3s ease' }}>
        <div style={{ padding: '20px 26px', borderBottom: `1px solid ${bord}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-d)', fontSize: 17, fontWeight: 700, color: txt }}>📊 Report Builder</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: txt2, fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: '22px 26px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, color: txt2, display: 'block', marginBottom: 5 }}>Report Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q4 Revenue Analysis" style={{ width: '100%', background: isAdmin ? '#13141f' : '#f5faf7', border: `1.5px solid ${bord}`, borderRadius: 8, padding: '10px 13px', fontSize: 14, color: txt, fontFamily: 'var(--font-b)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontFamily: 'var(--font-m)', textTransform: 'uppercase', letterSpacing: 1, color: txt2, display: 'block', marginBottom: 10 }}>Select Columns</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
              {COLS.map(col => (
                <div key={col} onClick={() => toggle(col)} style={{ ...( attrs.has(col) ? chipSel : chipDef), display: 'flex', alignItems: 'center', gap: 7, padding: '7px 11px', borderRadius: 7, cursor: 'pointer', fontSize: 12, transition: 'all 0.15s', userSelect: 'none' }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, background: attrs.has(col) ? (isAdmin ? '#6366f1' : '#1a7a4a') : 'transparent', color: '#fff', border: `1.5px solid ${attrs.has(col) ? (isAdmin ? '#6366f1' : '#1a7a4a') : bord}`, flexShrink: 0 }}>
                    {attrs.has(col) ? '✓' : ''}
                  </div>
                  {col.replace(/_/g,' ')}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 26px', borderTop: `1px solid ${bord}`, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 8, background: 'transparent', border: `1px solid ${bord}`, color: txt2, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={submit} style={{ padding: '9px 22px', borderRadius: 8, background: isAdmin ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#1a7a4a', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>📨 Queue Report</button>
        </div>
      </div>
    </div>
  )
}

/* ── MQ MODAL ── */
function MQModal({ jobs, onClose }) {
  const pending = jobs.filter(j => j.status === 'PENDING').length
  const processing = jobs.filter(j => j.status === 'PROCESSING').length
  const active = jobs.filter(j => ['PENDING','PROCESSING'].includes(j.status))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(10px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#0e0f18', border: '1px solid #252638', borderRadius: 15, width: 620, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s ease' }}>
        <div style={{ padding: '20px 26px', borderBottom: '1px solid #252638', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-d)', fontSize: 17, fontWeight: 700, color: '#eef0f8' }}>🖥️ ActiveMQ Queue Monitor</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b8faf', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: '22px 26px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {[{ label: 'Pending', val: pending, color: '#f59e0b' }, { label: 'Processing', val: processing, color: '#38bdf8' }, { label: 'Throughput', val: '1.2/s', color: '#10b981' }].map(m => (
              <div key={m.label} style={{ background: '#13141f', border: '1px solid #252638', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontFamily: 'var(--font-m)', color: '#4a4d6a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{m.label}</div>
                <div style={{ fontSize: 26, fontFamily: 'var(--font-d)', fontWeight: 800, color: m.color }}>{m.val}</div>
              </div>
            ))}
          </div>
          {active.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#4a4d6a', fontSize: 13, fontFamily: 'var(--font-m)' }}>Queue empty — all workers idle</div>
          ) : active.map(j => (
            <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#13141f', border: '1px solid #252638', borderRadius: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>📨</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#eef0f8' }}>{j.name}</div>
                <div style={{ fontSize: 11, color: '#4a4d6a', fontFamily: 'var(--font-m)' }}>{j.id}</div>
              </div>
              <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontFamily: 'var(--font-m)', fontWeight: 600, background: j.status === 'PROCESSING' ? 'rgba(56,189,248,.12)' : 'rgba(245,158,11,.12)', color: j.status === 'PROCESSING' ? '#38bdf8' : '#f59e0b', border: `1px solid ${j.status === 'PROCESSING' ? 'rgba(56,189,248,.22)' : 'rgba(245,158,11,.22)'}` }}>{j.status}</span>
            </div>
          ))}
          <div style={{ background: '#13141f', border: '1px solid #252638', borderRadius: 8, padding: '12px 14px', fontSize: 11, color: '#4a4d6a', fontFamily: 'var(--font-m)', marginTop: 14 }}>
            <strong style={{ color: '#818cf8' }}>Broker:</strong> tcp://localhost:61616 &nbsp;|&nbsp; <strong style={{ color: '#818cf8' }}>Queue:</strong> report.generation.queue &nbsp;|&nbsp; <span style={{ color: '#10b981' }}>● RUNNING</span>
          </div>
        </div>
        <div style={{ padding: '14px 26px', borderTop: '1px solid #252638', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 8, background: 'transparent', border: '1px solid #252638', color: '#8b8faf', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

/* ── LOCKED MODAL ── */
function LockedModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 380, textAlign: 'center', animation: 'slideUp 0.3s ease', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontFamily: 'var(--font-d)', fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Admin Access Only</div>
        <p style={{ color: '#6b6960', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>This feature is restricted to Admin users. Upgrade your plan or contact your administrator to gain access.</p>
        <button onClick={onClose} style={{ padding: '12px 32px', borderRadius: 10, background: '#1a7a4a', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Got it</button>
      </div>
    </div>
  )
}
