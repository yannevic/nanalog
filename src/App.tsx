import { useState, useEffect } from 'react'
import Home from './pages/Home'
import DetailView from './components/DetailView'
import { useProjects } from './hooks/useProjects'

export default function App() {
  const [openProjectId, setOpenProjectId] = useState<number | null>(null)
  const { projects, editProject } = useProjects()

  const openProject = projects.find(p => p.id === openProjectId) ?? null

  useEffect(() => {
    if (openProjectId !== null) {
      editProject(openProjectId, { lastSeen: 'agora' })
    }
  }, [openProjectId])

  if (openProject !== null && openProject !== undefined) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <DetailView
          project={openProject}
          onBack={() => setOpenProjectId(null)}
        />
      </div>
    )
  }

  return <Home onOpen={id => setOpenProjectId(id)} />
}