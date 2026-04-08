'use client'

const navItems = [
  { key: 'overview', icon: '🏠', label: 'ภาพรวม', group: 'หลัก' },
  { key: 'sales', icon: '💳', label: 'ยอดขาย', group: 'หลัก' },
  { key: 'daily', icon: '📅', label: 'ยอดขายรายวัน', group: 'หลัก' },
  { key: 'history', icon: '📋', label: 'ประวัติการขาย', group: 'รายการ' },
  { key: 'refund', icon: '↩️', label: 'คืนเงิน/เคลม', group: 'รายการ' },
  { key: 'stock', icon: '📦', label: 'สินค้า Stock', group: 'สต็อก' },
  { key: 'rate', icon: '💱', label: 'เรท Stock', group: 'สต็อก' },
]

const groups = ['หลัก', 'รายการ', 'สต็อก']

export default function Sidebar({ active, onNavigate, collapsed }) {
  return (
    <aside style={{
      width: collapsed ? 0 : 190,
      flexShrink: 0,
      overflow: 'hidden',
      background: 'rgba(10,10,20,0.75)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border)',
      position: 'sticky',
      top: 57,
      height: 'calc(100vh - 57px)',
      overflowY: 'auto',
      transition: 'width 0.25s ease',
      paddingTop: collapsed ? 0 : 16,
    }}>
      {groups.map(group => (
        <div key={group} style={{ padding: '0 10px', marginBottom: 4 }}>
          <div style={{
            fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.8px',
            textTransform: 'uppercase', padding: '0 10px', margin: '10px 0 5px',
          }}>
            {group}
          </div>
          {navItems.filter(i => i.group === group).map(item => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 12px', borderRadius: 9, cursor: 'pointer',
                fontSize: '0.85rem', fontWeight: 500,
                width: '100%', textAlign: 'left', fontFamily: 'Kanit, sans-serif',
                marginBottom: 2, border: active === item.key ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                background: active === item.key ? 'rgba(139,92,246,0.2)' : 'transparent',
                color: active === item.key ? 'var(--purple2)' : 'var(--muted)',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (active !== item.key) {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.12)'
                  e.currentTarget.style.color = 'var(--text)'
                }
              }}
              onMouseLeave={e => {
                if (active !== item.key) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--muted)'
                }
              }}
            >
              <span style={{ fontSize: '0.95rem', width: 18, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  )
}
