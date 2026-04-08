import type { Project } from '../types/project'

interface Props {
  project: Project
  onOpen: (id: number) => void
}

function getBarClass(status: Project['status']): React.CSSProperties {
  if (status === 'active') return { background: 'linear-gradient(90deg, var(--rose), var(--rose-deep))' }
  if (status === 'paused') return { background: 'linear-gradient(90deg, #ffd580, #ffb830)' }
  if (status === 'done') return { background: 'linear-gradient(90deg, #74b9a8, #4fa996)' }
  return { background: 'var(--border)' }
}

function getProgressFill(status: Project['status']): React.CSSProperties {
  if (status === 'paused') return { background: 'linear-gradient(90deg, #ffd580, #ffb830)' }
  if (status === 'done') return { background: 'linear-gradient(90deg, #74b9a8, #4fa996)' }
  return { background: 'linear-gradient(90deg, var(--rose), var(--rose-deep))' }
}

function getBadgeStyle(status: Project['status']): React.CSSProperties {
  if (status === 'active') return { background: 'var(--green-light)', color: '#3a7a4e' }
  if (status === 'paused') return { background: '#fff7e0', color: '#8a6c00' }
  if (status === 'done') return { background: '#e8f0fe', color: '#3355aa' }
  return { background: '#ffeaea', color: '#aa3333' }
}

function getStatusLabel(status: Project['status']): string {
  if (status === 'active') return '🟢 ativo'
  if (status === 'paused') return '🟡 pausado'
  if (status === 'done') return '🔵 concluído'
  return '🔴 abandonado'
}

export default function ProjectCard({ project, onOpen }: Props) {
  const isDone = project.status === 'done' || project.status === 'abandoned'

  return (
    <div
      className="fade-up"
      onClick={() => onOpen(project.id)}
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: '22px',
        padding: '1.1rem 1.25rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = '0 8px 28px var(--shadow)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Barra colorida no topo */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        borderRadius: '22px 22px 0 0',
        ...getBarClass(project.status),
      }} />

      {/* Topo: nome + badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--text)',
          }}>
            {project.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>
            {project.version}
          </div>
        </div>
        <span style={{
          fontSize: '0.68rem',
          padding: '3px 10px',
          borderRadius: '20px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          ...getBadgeStyle(project.status),
        }}>
          {getStatusLabel(project.status)}
        </span>
      </div>

      {/* Onde parei — só se ativo */}
      {project.status === 'active' && project.where && (
        <div style={{
          marginBottom: '0.75rem',
          padding: '0.6rem 0.9rem',
          background: 'var(--rose-pale)',
          borderRadius: '12px',
          borderLeft: '3px solid var(--rose)',
          fontSize: '0.78rem',
          color: 'var(--text-soft)',
          lineHeight: 1.5,
        }}>
          💡 {project.where}
        </div>
      )}

      {/* Rodapé: progresso + lastSeen + botão */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>progresso</span>
            <span>{project.progress}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--rose-light)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${project.progress}%`,
              borderRadius: '10px',
              transition: 'width 0.6s ease',
              ...getProgressFill(project.status),
            }} />
          </div>
        </div>

        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right', minWidth: '80px' }}>
          {project.lastSeen}
        </div>

        <button
          onClick={e => {
            e.stopPropagation()
            onOpen(project.id)
          }}
          disabled={isDone}
          style={{
            background: 'linear-gradient(135deg, var(--rose), var(--rose-deep))',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            padding: '7px 16px',
            fontSize: '0.78rem',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            cursor: isDone ? 'default' : 'pointer',
            whiteSpace: 'nowrap',
            opacity: isDone ? 0.45 : 1,
            transition: 'transform 0.15s, opacity 0.15s',
          }}
        >
          {isDone ? 'ver' : 'continuar →'}
        </button>
      </div>
    </div>
  )
}