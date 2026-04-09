import { useState, useEffect, useMemo } from 'react'
import Home from './pages/Home'
import DetailView from './components/DetailView'
import { useProjects } from './hooks/useProjects'
import TitleBar from './components/TitleBar'

const petalPositions = [
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
]

function PetalBg() {
  return (
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
      {petalPositions.map((pos, i) => (
        <svg
          key={i}
          width="80"
          height="80"
          viewBox="0 0 200 200"
          style={{ position: 'absolute', opacity: 0.12, top: pos.top, left: pos.left }}
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
  )
}

export default function App() {
  const [openProjectId, setOpenProjectId] = useState<number | null>(null)
  const { projects, editProject } = useProjects()

  const openProject = useMemo(
    () => projects.find((p) => p.id === openProjectId) ?? null,
    [projects, openProjectId]
  )

  useEffect(() => {
    if (openProjectId !== null) {
      editProject(openProjectId, { lastSeen: 'agora' })
    }
  }, [openProjectId])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PetalBg />
      <TitleBar />
      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        <div key={openProject ? `project-${openProject.id}` : 'home'} className="fade-up">
          {openProject ? (
            <DetailView project={openProject} onBack={() => setOpenProjectId(null)} />
          ) : (
            <Home onOpen={(id) => setOpenProjectId(id)} />
          )}
        </div>
      </div>
    </div>
  )
}
