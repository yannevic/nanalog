import { useEffect, useState } from 'react'

type Phase =
  | { kind: 'idle' }
  | { kind: 'available'; version: string }
  | { kind: 'downloading'; percent: number }
  | { kind: 'ready' }
  | { kind: 'error'; msg: string }

export default function UpdateBanner() {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    window.api.onUpdateAvailable((version) => {
      setDismissed(false)
      setPhase({ kind: 'available', version })
    })
    window.api.onUpdateProgress((percent) => {
      setPhase({ kind: 'downloading', percent })
    })
    window.api.onUpdateDownloaded(() => {
      setPhase({ kind: 'ready' })
    })
    window.api.onUpdateError((msg) => {
      setPhase({ kind: 'error', msg })
    })
  }, [])

  if (dismissed || phase.kind === 'idle') return null

  function handleDownload() {
    window.api.updateStartDownload()
    setPhase({ kind: 'downloading', percent: 0 })
  }

  function handleInstall() {
    window.api.updateInstallNow()
  }

  function renderContent() {
    if (phase.kind === 'available') {
      return (
        <>
          <span style={{ color: 'var(--text)', fontSize: 13 }}>
            🌸 Nova versão disponível:{' '}
            <strong style={{ color: 'var(--rose-deep)' }}>v{phase.version}</strong>
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleDownload} style={btnStyle('primary')}>
              Baixar agora
            </button>
            <button onClick={() => setDismissed(true)} style={btnStyle('ghost')}>
              Agora não
            </button>
          </div>
        </>
      )
    }

    if (phase.kind === 'downloading') {
      return (
        <>
          <span style={{ color: 'var(--text)', fontSize: 13 }}>⬇️ Baixando atualização…</span>
          <div
            style={{
              width: 140,
              height: 6,
              background: 'var(--rose-light)',
              borderRadius: 99,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${phase.percent}%`,
                background: 'linear-gradient(90deg, var(--rose), var(--rose-deep))',
                borderRadius: 99,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </>
      )
    }

    if (phase.kind === 'ready') {
      return (
        <>
          <span style={{ color: 'var(--text)', fontSize: 13 }}>
            ✅ Pronta para instalar! O app vai reiniciar.
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleInstall} style={btnStyle('primary')}>
              Reiniciar e instalar
            </button>
            <button onClick={() => setDismissed(true)} style={btnStyle('ghost')}>
              Depois
            </button>
          </div>
        </>
      )
    }

    if (phase.kind === 'error') {
      return (
        <>
          <span style={{ color: 'var(--rose-deep)', fontSize: 13 }}>
            ⚠️ Erro ao verificar atualização: {phase.msg}
          </span>
          <button onClick={() => setDismissed(true)} style={btnStyle('ghost')}>
            Fechar
          </button>
        </>
      )
    }

    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 100,
        background: 'var(--white)',
        border: '1.5px solid var(--border)',
        borderRadius: 16,
        boxShadow: '0 4px 24px var(--shadow)',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        minWidth: 320,
        maxWidth: 420,
        animation: 'fadeUp 0.3s ease',
      }}
    >
      {renderContent()}
    </div>
  )
}

function btnStyle(variant: 'primary' | 'ghost'): React.CSSProperties {
  if (variant === 'primary') {
    return {
      background: 'linear-gradient(135deg, var(--rose), var(--rose-deep))',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      padding: '6px 14px',
      fontSize: 12,
      fontFamily: 'inherit',
      cursor: 'pointer',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }
  }
  return {
    background: 'transparent',
    color: 'var(--text-soft)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '6px 12px',
    fontSize: 12,
    fontFamily: 'inherit',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }
}
