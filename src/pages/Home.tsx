import { useState, useEffect } from 'react'
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

const days = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
]
const months = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function DateBadge() {
  const now = useNow()
  const pad = (n: number) => String(n).padStart(2, '0')
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const weekday = days[now.getDay()]
  const day = now.getDate()
  const month = months[now.getMonth()]
  const year = now.getFullYear()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--rose-pale)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '6px 14px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {/* Florzinha */}
      <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>🌸</span>

      {/* Dia da semana */}
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--rose-deep)',
          fontWeight: 500,
        }}
      >
        {weekday}
      </span>

      {/* Separador */}
      <span style={{ color: 'var(--border)', fontSize: '0.7rem' }}>·</span>

      {/* Data */}
      <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>
        {day} de {month} de {year}
      </span>

      {/* Separador */}
      <span style={{ color: 'var(--border)', fontSize: '0.7rem' }}>·</span>

      {/* Horário */}
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'monospace',
          letterSpacing: '0.04em',
          minWidth: '52px',
        }}
      >
        {time}
      </span>
    </div>
  )
}

function SortableCard({ project, onOpen }: { project: Project; onOpen: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: project.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: 'none',
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <ProjectCard
        project={project}
        onOpen={onOpen}
        dragHandle={
          <div
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            style={{
              cursor: 'grab',
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              padding: '0 4px',
              lineHeight: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ⠿
          </div>
        }
      />
    </div>
  )
}

export default function Home({ onOpen }: Props) {
  const { projects, createProject, reorderProjects } = useProjects()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<Project['status'] | null>(null)

  const filtered = filter ? projects.filter((p) => p.status === filter) : projects

  return (
    <div>
      <div
        style={{
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
            flexWrap: 'wrap',
            gap: '8px',
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
          <DateBadge />
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
