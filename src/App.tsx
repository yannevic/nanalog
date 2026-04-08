import { useState } from 'react'
import Home from './pages/Home'

export default function App() {
  const [openProjectId, setOpenProjectId] = useState<number | null>(null)

  function handleOpen(id: number) {
    setOpenProjectId(id)
  }

  if (openProjectId !== null) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text)' }}>
        <button
          onClick={() => setOpenProjectId(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--rose-deep)',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}
        >
          ← voltar
        </button>
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          DetailView em breve... 🌸
        </p>
      </div>
    )
  }

  return <Home onOpen={handleOpen} />
}