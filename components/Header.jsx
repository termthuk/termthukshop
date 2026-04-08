'use client'
import { useEffect, useState } from 'react'

export default function Header({ onMenuToggle }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px',
      background: 'rgba(7,7,15,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={onMenuToggle}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', padding: 4 }}
          title="Toggle sidebar"
        >
          ☰
        </button>
        <div style={{
          fontSize: '1.25rem', fontWeight: 900,
          background: 'linear-gradient(90deg, #a78bfa, #38bdf8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          TermthukShop
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--muted)' }}>
        <span style={{ color: 'var(--blue)', fontFamily: 'monospace' }}>{time}</span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>
          <span style={{
            display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
            background: 'var(--green)', marginRight: 5,
            animation: 'pulse 1.8s infinite',
          }} />
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>Live</span>
        </span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>2026-04-08</span>
      </div>
    </header>
  )
}
