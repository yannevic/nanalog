import { useState } from 'react'
import type { Project } from '../types/project'
import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'
import StatsBar from '../components/StatsBar'
import NewProjectModal from '../components/NewProjectModal'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  onOpen: (id: number) => void
}

const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function getHeaderDate(): string {
  const now = new Date()
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`
}

function SortableCard({ project, onOpen }: { project: Project; onOpen: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        cursor: 'grab',
      }}
    >
      <ProjectCard project={project} onOpen={onOpen} />
    </div>
  )
}

export default function Home({ onOpen }: Props) {
  const { projects, createProject, reorderProjects } = useProjects()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<Project['status'] | null>(null)

  const filtered = filter ? projects.filter((p) => p.status === filter) : projects

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Pétalas SVG de fundo */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {[
          { top: '-20px', left: '5%' },
          { top: '-20px', left: '25%' },
          { top: '-20px', left: '50%' },
          { top: '-20px', left: '75%' },
          { top: '12%', left: '15%' },
          { top: '12%', left: '38%' },
          { top: '12%', left: '62%' },
          { top: '12%', left: '85%' },
          { top: '25%', left: '5%' },
          { top: '25%', left: '28%' },
          { top: '25%', left: '52%' },
          { top: '25%', left: '76%' },
          { top: '38%', left: '15%' },
          { top: '38%', left: '40%' },
          { top: '38%', left: '65%' },
          { top: '38%', left: '88%' },
          { top: '51%', left: '3%' },
          { top: '51%', left: '27%' },
          { top: '51%', left: '50%' },
          { top: '51%', left: '73%' },
          { top: '64%', left: '13%' },
          { top: '64%', left: '37%' },
          { top: '64%', left: '60%' },
          { top: '64%', left: '83%' },
          { top: '77%', left: '5%' },
          { top: '77%', left: '30%' },
          { top: '77%', left: '55%' },
          { top: '77%', left: '78%' },
          { top: '90%', left: '18%' },
          { top: '90%', left: '43%' },
          { top: '90%', left: '67%' },
          { top: '90%', left: '90%' },
        ].map((pos, i) => (
          <svg
            key={i}
            width="80"
            height="80"
            viewBox="0 0 200 200"
            style={
              {
                position: 'absolute',
                opacity: 0.12,
                top: pos.top,
                left: pos.left,
              } as React.CSSProperties
            }
          >
            <g fill="#a8c5a0">
              <ellipse cx="100" cy="55" rx="16" ry="38" transform="rotate(0 100 100)" />
              <ellipse cx="100" cy="55" rx="16" ry="38" transform="rotate(60 100 100)" />
              <ellipse cx="100" cy="55" rx="16" ry="38" transform="rotate(120 100 100)" />
              <ellipse cx="100" cy="55" rx="16" ry="38" transform="rotate(180 100 100)" />
              <ellipse cx="100" cy="55" rx="16" ry="38" transform="rotate(240 100 100)" />
              <ellipse cx="100" cy="55" rx="16" ry="38" transform="rotate(300 100 100)" />
              <circle cx="100" cy="100" r="14" fill="#c5dfc1" />
            </g>
          </svg>
        ))}
      </div>

      {/* Conteúdo */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '860px',
          margin: '0 auto',
          padding: '1.5rem 1.2rem 3rem',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, var(--rose-light), var(--rose))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🌸
            </div>
            <div
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem',
                color: 'var(--text)',
              }}
            >
              <span style={{ color: 'var(--rose-deep)', fontStyle: 'italic' }}>Nana</span>log
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{getHeaderDate()}</div>
        </header>

        <StatsBar projects={projects} filter={filter} onFilter={setFilter} />

        {/* Título seção */}
        <p
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.05rem',
            color: 'var(--text-soft)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          meus projetos
          <span
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, var(--border), transparent)',
              display: 'inline-block',
            }}
          />
        </p>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={async ({ active, over }) => {
            if (!over || active.id === over.id) return
            const ids = filtered.map((p) => p.id)
            const oldIndex = ids.indexOf(Number(active.id))
            const newIndex = ids.indexOf(Number(over.id))
            const newIds = arrayMove(ids, oldIndex, newIndex)
            await reorderProjects(newIds)
          }}
        >
          <SortableContext items={filtered.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'grid', gap: '12px' }}>
              {filtered.length === 0 && (
                <p
                  style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    padding: '2rem 0',
                  }}
                >
                  nenhum projeto ainda 🌱
                </p>
              )}
              {filtered.map((project) => (
                <SortableCard key={project.id} project={project} onOpen={onOpen} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Botão novo projeto */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            width: '100%',
            padding: '0.95rem',
            borderRadius: '22px',
            border: '2px dashed var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'var(--rose)'
            el.style.color = 'var(--rose-deep)'
            el.style.background = 'var(--rose-pale)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = 'var(--border)'
            el.style.color = 'var(--text-muted)'
            el.style.background = 'transparent'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span> novo projeto
        </button>
      </div>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreate={async (data) => {
            await createProject(data)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
