import { useState } from 'react'
import type { Project } from '../types/project'

interface Props {
  onClose: () => void
  onCreate: (data: Pick<Project, 'name' | 'version' | 'status' | 'where'>) => Promise<void>
}

export default function NewProjectModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [version, setVersion] = useState('0.1.0')
  const [status, setStatus] = useState<Project['status']>('active')
  const [where, setWhere] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!name.trim()) return
    setLoading(true)
    await onCreate({ name: name.trim(), version, status, where: where.trim() })
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(74, 48, 64, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div
        className="fade-up"
        style={{
          background: 'var(--white)',
          borderRadius: '22px',
          padding: '2rem',
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 8px 40px var(--shadow)',
        }}
      >
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.3rem',
          fontStyle: 'italic',
          color: 'var(--rose-deep)',
        }}>
          Novo projeto 🌸
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Nome</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="ex: Nanalog"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Versão</label>
          <input
            value={version}
            onChange={e => setVersion(e.target.value)}
            placeholder="0.1.0"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Status inicial</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as Project['status'])}
            style={inputStyle}
          >
            <option value="active">🟢 ativo</option>
            <option value="paused">🟡 pausado</option>
            <option value="done">🔵 concluído</option>
            <option value="abandoned">🔴 abandonado</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Onde parei</label>
          <input
            value={where}
            onChange={e => setWhere(e.target.value)}
            placeholder="ex: implementando o banco de dados"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-soft)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '14px',
              border: 'none',
              background: name.trim() ? 'var(--rose)' : 'var(--rose-light)',
              color: name.trim() ? 'var(--white)' : 'var(--rose-deep)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'criando...' : 'criar'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.9rem',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  background: 'var(--rose-pale)',
  color: 'var(--text)',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
}