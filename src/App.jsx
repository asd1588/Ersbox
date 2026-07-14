import { useState, useEffect } from 'react'
import LightRays from './components/LightRays'
import './components/LightRays.css'
import ProfileCard from './components/ProfileCard'
import SpotlightCard from './components/SpotlightCard'
import data from './data'
import { initAnimations } from './animations'
import './components/ProfileCard.css'

const styles = {
  container: { maxWidth: 1700, margin: '0 auto', padding: '0 40px' },
  accent: { color: '#b8b8c4' },
  muted: { color: '#8a8a96' },
  highlight: { color: '#e0e0e6' },
  card: { background: '#14141c', border: '1px solid #1e1e28', borderRadius: 12, padding: 32 },
  sectionLabel: { fontSize: 13, letterSpacing: 4, color: '#8a8a96', marginBottom: 16, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 32, fontWeight: 700, color: '#e0e0e6', marginBottom: 48 },
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const linkStyle = { color: '#8a8a96', textDecoration: 'none', fontSize: 14, cursor: 'pointer', transition: 'color 0.3s' }
  const navItems = data.nav.items

  const handleNavClick = (e, item) => {
    e.preventDefault()
    if (item === '顶部') { window.scrollTo({ top: 0, behavior: 'smooth' }) }
    else { document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' }) }
  }

  const handleContact = (e) => {
    e.preventDefault()
    document.getElementById('联系')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e1e28' }}>
      <div style={{ maxWidth: 1700, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: '#e0e0e6' }}>{data.nav.logo}</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="nav-links">
          {navItems.map(s => (
            <a key={s} href={`#${s}`} style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#e0e0e6'}
              onMouseLeave={e => e.target.style.color = '#8a8a96'}
              onClick={e => handleNavClick(e, s)}>{s}</a>
          ))}
          <a href="#联系" onClick={handleContact}
            style={{ ...linkStyle, border: '1px solid #3a3a48', padding: '8px 20px', borderRadius: 6, color: '#e0e0e6' }}>商务洽谈</a>
        </div>
        <button onClick={() => setOpen(!open)} className="mobile-menu-btn"
          style={{ display: 'none', background: 'none', border: 'none', color: '#e0e0e6', fontSize: 24, cursor: 'pointer' }}>&#9776;</button>
      </div>
      {open && (
        <div style={{ display: 'none', flexDirection: 'column', gap: 12, padding: '12px 40px 20px', borderTop: '1px solid #1e1e28' }} className="mobile-menu">
          {navItems.map(s => (
            <a key={s} href={`#${s}`} style={linkStyle} onClick={e => { handleNavClick(e, s); setOpen(false) }}>{s}</a>
          ))}
          <a href="#联系" onClick={e => { e.preventDefault(); document.getElementById('联系')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{ ...linkStyle, border: '1px solid #3a3a48', padding: '8px 20px', borderRadius: 6, color: '#e0e0e6', textAlign: 'center' }}>商务洽谈</a>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section style={{ height: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#f7f7f7"
          raysSpeed={1.4}
          lightSpread={0.6}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.8}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,15,0.35) 0%, rgba(10,10,15,0.25) 25%, transparent 45%, rgba(10,10,15,0.40) 75%, #0a0a0f 100%)' }} />
      <div style={{ ...styles.container, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div style={{ maxWidth: 680 }}>
            <div data-animate="hero-sub" style={{ fontSize: 13, letterSpacing: 4, color: '#8a8a96', marginBottom: 24, textTransform: 'uppercase' }}>{data.hero.subtitle}</div>
            <h1 data-animate="hero-title" style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, marginBottom: 24, color: '#e0e0e6' }}>
              {data.hero.title.map(function(line, i) { return <span key={i} className="ani-line"><span>{line}</span></span>; })}
            </h1>
            <p data-animate="hero-desc" style={{ fontSize: 17, color: '#8a8a96', lineHeight: 1.8, marginBottom: 40, maxWidth: 520 }}>{data.hero.desc}</p>
            <a href="#联系"
              data-animate="hero-cta"
              style={{ display: 'inline-block', padding: '14px 36px', border: '1px solid #3a3a48', borderRadius: 6, color: '#e0e0e6', textDecoration: 'none', fontSize: 15, letterSpacing: 1, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.target.style.background = '#1e1e28'; e.target.style.borderColor = '#5a5a68' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#3a3a48' }}>商务洽谈</a>
          </div>
          <div data-animate="hero-right" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 340 }}>
              <ProfileCard
                name={data.profile.name}
                title={data.profile.title}
                handle={data.profile.handle}
                status={data.profile.status}
                contactText={data.profile.contactText}
                avatarUrl={data.profile.avatarUrl}
                showUserInfo
                enableTilt={true}
                enableMobileTilt={false}
                behindGlowEnabled
                behindGlowColor={data.profile.behindGlowColor}
                innerGradient={data.profile.innerGradient}
                onContactClick={() => document.getElementById('联系')?.scrollIntoView({ behavior: 'smooth' })}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', color: '#4a4a56', fontSize: 12, letterSpacing: 2 }}>SCROLL</div>
    </section>
  )
} function DataPanel() {
  const items = data.stats;
  return (
    <section style={{ padding: '80px 0' }}>
      <div style={styles.container}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#1e1e28', borderRadius: 12, overflow: 'hidden' }} className="data-grid">
          {items.map((item, i) => (
            <div key={i} style={{ background: '#0a0a0f', padding: '48px 32px', textAlign: 'center' }}>
              <div data-count={item.count} data-suffix={item.suffix} style={{ fontSize: 40, fontWeight: 700, color: '#e0e0e6', letterSpacing: 2, marginBottom: 8 }}>{item.value}</div>
              <div style={{ fontSize: 13, color: '#8a8a96', letterSpacing: 1 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const tags = data.about.tags
  return (
    <section id="经历" style={{ padding: '80px 0' }}>
      <div style={styles.container}>
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 64, alignItems: 'start' }} className="experience-grid">
          <div>
            <div data-animate="parallax" style={{ width: '100%', aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden', border: '1px solid #1e1e28', background: '#14141c' }}>
              <img src="/sw.jpg" alt="商务形象照" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags.map(t => (
                <span key={t} data-animate="tag" style={{ padding: '6px 14px', background: '#14141c', borderRadius: 20, fontSize: 12, color: '#8a8a96', border: '1px solid #1e1e28' }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={styles.sectionLabel}>About</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#e0e0e6', marginBottom: 24 }}>{data.about.name}<br /><span style={{ fontSize: 18, fontWeight: 400, color: '#8a8a96' }}> {data.about.subtitle} </span></h2>
            <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '1px solid #1e1e28' }}>
              <div style={{ position: 'relative', marginBottom: 32 }}>
                <div style={{ position: 'absolute', left: -29, top: 6, width: 10, height: 10, borderRadius: '50%', background: '#3a3a48', border: '2px solid #0a0a0f' }} />
                <div style={{ fontSize: 13, color: '#6a6a76', marginBottom: 4 }}>2024 - 至今</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#e0e0e6', marginBottom: 6 }}>商业咨询 · 信息对接</div>
                <div style={{ fontSize: 13, color: '#8a8a96', lineHeight: 1.7 }}>聚焦信息咨询与商业对接领域，为B端客户提供渠道搭建、交易担保及社群运营服务。</div>
              </div>
              <div style={{ position: 'relative', marginBottom: 32 }}>
                <div style={{ position: 'absolute', left: -29, top: 6, width: 10, height: 10, borderRadius: '50%', background: '#3a3a48', border: '2px solid #0a0a0f' }} />
                <div style={{ fontSize: 13, color: '#6a6a76', marginBottom: 4 }}>2022 - 2024</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#e0e0e6', marginBottom: 6 }}>线上引流 · 社群矩阵运营</div>
                <div style={{ fontSize: 13, color: '#8a8a96', lineHeight: 1.7 }}>搭建并运营5000+人社群矩阵，活跃用户占比68%。个人独立运营社群的95人，共创社群121个。依托养号引流+灵活话术促单模式实现稳定月均转化。</div>
              </div>
              <div style={{ position: 'relative', marginBottom: 32 }}>
                <div style={{ position: 'absolute', left: -29, top: 6, width: 10, height: 10, borderRadius: '50%', background: '#3a3a48', border: '2px solid #0a0a0f' }} />
                <div style={{ fontSize: 13, color: '#6a6a76', marginBottom: 4 }}>2020 - 2022</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#e0e0e6', marginBottom: 6 }}>房产经纪 · 全流程成交</div>
                <div style={{ fontSize: 13, color: '#8a8a96', lineHeight: 1.7 }}>独立完成售房1套（113.75㎡）、租房4间。负责房源挖掘、客户带看、价格比对、房东维护全流程闭环。</div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: -29, top: 6, width: 10, height: 10, borderRadius: '50%', background: '#3a3a48', border: '2px solid #0a0a0f' }} />
                <div style={{ fontSize: 13, color: '#6a6a76', marginBottom: 4 }}>2019 - 2020</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#e0e0e6', marginBottom: 6 }}>电话销售 · 客户开发起步</div>
                <div style={{ fontSize: 13, color: '#8a8a96', lineHeight: 1.7 }}>从电话销售起步，积累客户开发与商务谈判基础能力，建立从客户开发到成交闭环的全链路认知。</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#8a8a96', lineHeight: 1.8, marginTop: 32 }}>{data.about.summary}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const projects = data.projects;
  return (
    <section id="项目" style={{ padding: '80px 0' }}>
      <div style={styles.container}>
        <div data-animate="section-label" style={styles.sectionLabel}>Selected Work</div>
        <h2 style={styles.sectionTitle}>业务案例</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {projects.map((p, i) => (
            <div key={i} data-animate="card" style={{ ...styles.card, display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 32, alignItems: 'center' }} className="project-card">
              <div>
                <div style={{ fontSize: 11, letterSpacing: 2, color: '#4a4a56', textTransform: 'uppercase', marginBottom: 8 }}>{p.tag}</div>
                <div data-count={p.count} data-suffix={p.suffix} style={{ fontSize: 28, fontWeight: 700, color: '#e0e0e6', letterSpacing: 1 }}>{p.metric}</div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#e0e0e6', marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: '#8a8a96', lineHeight: 1.7 }}>{p.desc}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} className="project-tags">
                {p.tags.map(t => (<span key={t} style={{ padding: '4px 10px', background: '#0a0a0f', borderRadius: 4, fontSize: 11, color: '#8a8a96', border: '1px solid #1e1e28' }}>{t}</span>))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Capabilities() {
  const caps = data.capabilities
  return (
    <section id="能力" style={{ padding: '80px 0' }}>
      <div style={styles.container}>
        <div data-animate="section-label" style={styles.sectionLabel}>Capabilities</div>
        <h2 style={styles.sectionTitle}>核心能力</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="capabilities-grid">
          {caps.map((c, i) => (
            <SpotlightCard data-animate="card" spotlightColor='rgba(180,180,200,0.15)' style={{ borderRadius: 12, border: '1px solid #1e1e28', background: '#14141c', padding: 32 }}>
              <div style={{ width: 8, height: 8, background: '#3a3a48', borderRadius: '50%', marginBottom: 20 }} />
              <div style={{ fontSize: 17, fontWeight: 600, color: '#e0e0e6', marginBottom: 10 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: '#8a8a96', lineHeight: 1.7 }}>{c.desc}</div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="联系" style={{ padding: '100px 0 60px', borderTop: '1px solid #1e1e28' }}>
      <div style={styles.container}>
        <div style={{ textAlign: 'center' }}>
          <div data-animate="section-label" style={styles.sectionLabel}>Get in Touch</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#e0e0e6', marginBottom: 16 }}>{data.footer.title}</h2>
          <p style={{ fontSize: 15, color: '#8a8a96', marginBottom: 48 }}>{data.footer.desc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#4a4a56', marginBottom: 8, textTransform: 'uppercase' }}>{data.footer.contacts[0].label}</div>
              <div style={{ fontSize: 18, color: '#e0e0e6' }}>{data.footer.contacts[0].value}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#4a4a56', marginBottom: 8, textTransform: 'uppercase' }}>{data.footer.contacts[1].label}</div>
              <div style={{ fontSize: 18, color: '#e0e0e6' }}>{data.footer.contacts[1].value}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: '#4a4a56', marginBottom: 8, textTransform: 'uppercase' }}>{data.footer.contacts[2].label}</div>
              <div style={{ fontSize: 18, color: '#e0e0e6' }}>{data.footer.contacts[2].value}</div>
            </div>
          </div>
          <div style={{ marginTop: 60, fontSize: 12, color: '#4a4a56', letterSpacing: 1 }}>{data.footer.copyright}</div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useEffect(() => {
    const ctx = initAnimations();
    return () => { if (ctx) ctx.revert(); };
  }, [])
  return (
    <div>
      <style>{`
        .ani-line { display: block; overflow: hidden; }
.ani-line span { display: block; }
[data-animate] { will-change: transform, opacity; }
        @media (max-width: 768px) {
          .nav-links { display: none !important }
          .mobile-menu-btn { display: block !important }
          .mobile-menu { display: flex !important }
          h1 { font-size: 32px !important }
          .data-grid { grid-template-columns: repeat(2, 1fr) !important }
          .experience-grid { grid-template-columns: 1fr !important }
          .project-card { grid-template-columns: 1fr !important; gap: 16px !important }
          .capabilities-grid { grid-template-columns: 1fr !important }
          [style*="padding: 0 40px"] { padding: 0 24px !important }
          .project-tags { display: none !important }
          section { padding: 60px 0 !important }
        }
        @media (max-width: 480px) {
          .data-grid { grid-template-columns: 1fr !important }
        }
      `}</style>
      <Navbar />
      <Hero />
      <DataPanel />
      <Experience />
      <Projects />
      <Capabilities />
      <Footer />
    </div>
  )
}
















