import type { Project } from '../types/project'

interface Props {
  projects: Project[]
  filter: Project['status'] | null
  onFilter: (status: Project['status'] | null) => void
}

export default function StatsBar({ projects, filter, onFilter }: Props) {
  const active = projects.filter((p) => p.status === 'active').length
  const paused = projects.filter((p) => p.status === 'paused').length
  const done = projects.filter((p) => p.status === 'done').length

  function handleClick(status: Project['status']) {
    if (filter === status) {
      onFilter(null)
    } else {
      onFilter(status)
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '1.8rem',
      }}
    >
      {(
        [
          {
            status: 'active',
            label: 'ativos',
            icon: '🌱',
            bg: 'var(--green-light)',
            count: active,
          },
          { status: 'paused', label: 'pausados', icon: '🌙', bg: '#fff7e0', count: paused },
          { status: 'done', label: 'concluídos', icon: '✨', bg: '#e8f0fe', count: done },
        ] as { status: Project['status']; label: string; icon: string; bg: string; count: number }[]
      ).map((item) => (
        <div
          key={item.status}
          onClick={() => handleClick(item.status)}
          style={{
            ...statCard,
            cursor: 'pointer',
            outline: filter === item.status ? '2px solid var(--rose)' : '2px solid transparent',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ ...statIcon, background: item.bg }}>{item.icon}</div>
          <div>
            <p style={statLabel}>{item.label}</p>
            <strong style={statNum}>{item.count}</strong>
          </div>
        </div>
      ))}
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
