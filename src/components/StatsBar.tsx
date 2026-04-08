import type { Project } from '../types/project'

interface Props {
  projects: Project[]
}

export default function StatsBar({ projects }: Props) {
  const active = projects.filter(p => p.status === 'active').length
  const paused = projects.filter(p => p.status === 'paused').length
  const done = projects.filter(p => p.status === 'done').length

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginBottom: '1.8rem',
    }}>
      <div style={statCard}>
        <div style={{ ...statIcon, background: 'var(--green-light)' }}>🌱</div>
        <div>
          <p style={statLabel}>ativos</p>
          <strong style={statNum}>{active}</strong>
        </div>
      </div>
      <div style={statCard}>
        <div style={{ ...statIcon, background: '#fff7e0' }}>🌙</div>
        <div>
          <p style={statLabel}>pausados</p>
          <strong style={statNum}>{paused}</strong>
        </div>
      </div>
      <div style={statCard}>
        <div style={{ ...statIcon, background: '#e8f0fe' }}>✨</div>
        <div>
          <p style={statLabel}>concluídos</p>
          <strong style={statNum}>{done}</strong>
        </div>
      </div>
    </div>
  )
}

const statCard: React.CSSProperties = {
  background: 'var(--white)',
  border: '1px solid var(--border)',
  borderRadius: '18px',
  padding: '0.9rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const statIcon: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  flexShrink: 0,
}

const statLabel: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  marginBottom: '1px',
}

const statNum: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 500,
  color: 'var(--text)',
}