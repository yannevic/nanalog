import { useState } from 'react'

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  function handleMinimize() {
    window.api.winMinimize()
  }

  function handleMaximize() {
    window.api.winMaximize()
    setIsMaximized((v) => !v)
  }

  function handleClose() {
    window.api.winClose()
  }

  return (
    <div
      style={
        {
          height: '42px',
          background: 'rgba(168, 197, 160, 0.6)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '1rem',
          paddingRight: '0.5rem',
          WebkitAppRegion: 'drag',
          userSelect: 'none',
          flexShrink: 0,
          zIndex: 10,
          position: 'relative',
        } as React.CSSProperties
      }
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <img
          src="./assets/icon.png"
          alt="Nanalog"
          style={{ width: '28px', height: '28px', objectFit: 'contain' }}
        />
        <span
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.1rem',
            color: 'var(--text)',
          }}
        >
          <span style={{ color: 'var(--rose-deep)', fontStyle: 'italic' }}>Nana</span>log
        </span>
      </div>
      {/* Botões */}
      <div
        style={
          {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            WebkitAppRegion: 'no-drag',
          } as React.CSSProperties
        }
      >
        <span
          style={{
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            fontFamily: 'DM Sans, sans-serif',
            marginRight: '4px',
          }}
        >
          v1.0.0
        </span>
        {/* Minimizar */}
        <button
          onClick={handleMinimize}
          title="minimizar"
          style={btnStyle('#ffd580')}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.75'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
          }}
        >
          <span style={{ fontSize: '10px', lineHeight: 1, marginBottom: '2px', display: 'block' }}>
            —
          </span>
        </button>

        {/* Maximizar */}
        <button
          onClick={handleMaximize}
          title={isMaximized ? 'restaurar' : 'maximizar'}
          style={btnStyle('var(--rose)')}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.75'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
          }}
        >
          <span style={{ fontSize: '9px', lineHeight: 1, display: 'block' }}>
            {isMaximized ? '❐' : '□'}
          </span>
        </button>

        {/* Fechar */}
        <button
          onClick={handleClose}
          title="fechar"
          style={btnStyle('#e07a7a')}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.75'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
          }}
        >
          <span style={{ fontSize: '11px', lineHeight: 1, display: 'block' }}>✕</span>
        </button>
      </div>
    </div>
  )
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    border: 'none',
    background: bg,
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.15s',
    flexShrink: 0,
  }
}
