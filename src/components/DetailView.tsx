import React from 'react'
import { useState, useEffect } from 'react'
import { useProjects } from '../hooks/useProjects'
import type { Project, Commit } from '../types/project'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  project: Project
  onBack: () => void
}

type Tab = 'overview' | 'tasks' | 'commits' | 'notes' | 'briefing'

function getStatusLabel(status: Project['status']): string {
  if (status === 'active') return '🟢 ativo'
  if (status === 'paused') return '🟡 pausado'
  if (status === 'done') return '🔵 concluído'
  return '🔴 abandonado'
}

function getBadgeStyle(status: Project['status']): React.CSSProperties {
  if (status === 'active') return { background: 'var(--green-light)', color: '#3a7a4e' }
  if (status === 'paused') return { background: '#fff7e0', color: '#8a6c00' }
  if (status === 'done') return { background: '#e8f0fe', color: '#3355aa' }
  return { background: '#ffeaea', color: '#aa3333' }
}

function getProgressFill(status: Project['status']): React.CSSProperties {
  if (status === 'paused') return { background: 'linear-gradient(90deg, #ffd580, #ffb830)' }
  if (status === 'done') return { background: 'linear-gradient(90deg, #74b9a8, #4fa996)' }
  return { background: 'linear-gradient(90deg, var(--rose), var(--rose-deep))' }
}

function resolveColor(raw: string): string | null {
  if (/^#[0-9a-fA-F]{3,6}$/.test(raw)) return raw
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(raw)) return raw
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(raw)) return raw
  return null
}

function renderFileTree(content: string) {
  const lines = content.split('\n').filter(l => l.trim() !== '')
  return (
    <div style={{
      background: 'var(--rose-pale)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      padding: '1rem 1.2rem',
      fontFamily: 'monospace',
      fontSize: '0.82rem',
      lineHeight: 2,
    }}>
      {lines.map((line, i) => {
        const indent = line.match(/^\s*/)?.[0].length ?? 0
        const name = line.trim()
const isFolder = name.endsWith('/')
const icon = isFolder ? '📁' : '📄'
        return (
          <div key={i} style={{ paddingLeft: `${indent * 10}px`, display: 'flex', alignItems: 'center', gap: '6px', color: isFolder ? 'var(--rose-deep)' : 'var(--text)' }}>
            <span>{icon}</span>
            <span style={{ fontWeight: isFolder ? 600 : 400 }}>{name}</span>
          </div>
        )
      })}
    </div>
  )
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{
        display: 'inline-block', width: '11px', height: '11px',
        borderRadius: '3px', background: color,
        border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0,
      }} />
      <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--rose-deep)' }}>{label}</span>
    </span>
  )
}

function renderWithHex(children: React.ReactNode): React.ReactNode {
  const pattern = /(#[0-9a-fA-F]{3,6}(?![0-9a-fA-F])|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\))/g

  function processNode(node: React.ReactNode): React.ReactNode {
    if (typeof node === 'string') {
      const parts = node.split(pattern)
      if (parts.length === 1) return node
      return parts.map((part, i) => {
        const color = resolveColor(part.trim())
        if (color) return <ColorSwatch key={i} color={color} label={part.trim()} />
        return part
      })
    }
    if (React.isValidElement(node)) {
      const el = node as React.ReactElement<{ children?: React.ReactNode }>
      return React.cloneElement(el, {}, processNode(el.props.children))
    }
    if (Array.isArray(node)) {
      return node.map((child, i) => <React.Fragment key={i}>{processNode(child)}</React.Fragment>)
    }
    return node
  }

  return processNode(children)
}

export default function DetailView({ project: initialProject, onBack }: Props) {
  const { projects, editProject, createTask, toggleTask, removeTask, createCommit } = useProjects()
  const project = projects.find(p => p.id === initialProject.id) ?? initialProject
  const [tab, setTab] = useState<Tab>('overview')
  const [where, setWhere] = useState(project.where)
  const [notes, setNotes] = useState(project.notes)
  const [briefing, setBriefing] = useState(project.briefing)

useEffect(() => {
  setBriefing(project.briefing)
}, [project.briefing])
  const [copied, setCopied] = useState(false)
  const [editingBriefing, setEditingBriefing] = useState(!project.briefing)
  useEffect(() => {
  if (!briefing) return
  const timer = setTimeout(async () => {
    console.log('[briefing] salvando:', briefing.slice(0, 50))
    const result = await editProject(project.id, { briefing })
    console.log('[briefing] resultado:', result)
  }, 600)
  return () => clearTimeout(timer)
}, [briefing, project.id])
  const [newTask, setNewTask] = useState('')
  const [commitMsg, setCommitMsg] = useState('')
  const [commitType, setCommitType] = useState<Commit['type']>('✨')
  const [status, setStatus] = useState<Project['status']>(project.status)
  const [progress, setProgress] = useState(project.progress)
  const [version, setVersion] = useState(project.version)

  async function handleStatusChange(val: Project['status']) {
    setStatus(val)
    await editProject(project.id, { status: val })
  }

  async function handleProgressChange(val: number) {
    setProgress(val)
    await editProject(project.id, { progress: val })
  }

  async function handleWhereSave() {
    await editProject(project.id, { where })
  }

  async function handleNotesSave() {
    await editProject(project.id, { notes })
  }

  async function handleBriefingSave() {
    await editProject(project.id, { briefing })
  }

  function handleCopy() {
    navigator.clipboard.writeText(briefing)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleVersionSave() {
    await editProject(project.id, { version })
  }

  async function handleAddTask() {
    if (!newTask.trim()) return
    if (project.tasks.length >= 10) return
    await createTask(project.id, newTask.trim())
    setNewTask('')
  }

  async function handleToggleTask(id: number, done: boolean) {
    await toggleTask(id, !done)
    const updatedDone = project.tasks.filter(t => t.id === id ? !done : t.done).length
    const pct = project.tasks.length ? Math.round(updatedDone / project.tasks.length * 100) : 0
    await handleProgressChange(pct)
  }

  async function handleAddCommit() {
    if (!commitMsg.trim()) return
    await createCommit(project.id, commitType, commitMsg.trim())
    setCommitMsg('')
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: '🌸 visão geral' },
    { key: 'tasks', label: '📋 tarefas' },
    { key: 'commits', label: '🧾 commits' },
    { key: 'briefing', label: '📌 briefing' },
    { key: 'notes', label: '📝 notas' },
  ]

  return (
    <div className="fade-up" style={{ maxWidth: '860px', margin: '0 auto', padding: '1.5rem 1.2rem 3rem' }}>

      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', color: 'var(--rose-deep)',
          fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
          cursor: 'pointer', padding: 0, marginBottom: '1.2rem',
          display: 'flex', alignItems: 'center', gap: '5px',
        }}
      >
        ← voltar
      </button>

      {/* Header do projeto */}
      <div style={{
        background: 'var(--white)', border: '1px solid var(--border)',
        borderRadius: '22px', padding: '1.3rem 1.4rem', marginBottom: '12px',
      }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '4px' }}>
          {project.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.68rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 500,
            ...getBadgeStyle(status),
          }}>
            {getStatusLabel(status)}
          </span>
          <span style={{
            fontFamily: 'monospace', fontSize: '0.75rem',
            background: 'var(--rose-light)', color: 'var(--rose-deep)',
            padding: '2px 8px', borderRadius: '8px',
          }}>
            {version}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>visto agora</span>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>progresso</span>
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--rose-deep)' }}>{progress}%</span>
          </div>
          <div style={{ height: '8px', background: 'var(--rose-light)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, borderRadius: '10px', transition: 'width 0.4s ease', ...getProgressFill(status) }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '6px 14px', borderRadius: '20px',
              border: '1px solid var(--border)',
              background: tab === t.key ? 'var(--rose)' : 'var(--white)',
              color: tab === t.key ? 'white' : 'var(--text-soft)',
              fontSize: '0.78rem', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div style={panelCard}>
            <h3 style={panelTitle}>💡 onde parei</h3>
            <textarea
              value={where}
              onChange={e => setWhere(e.target.value)}
              onBlur={handleWhereSave}
              placeholder="ex: parei porque a API deu 404, próxima coisa é testar com mock data…"
              rows={3}
              style={textareaStyle}
            />
          </div>
          <div style={panelCard}>
            <h3 style={panelTitle}>📊 ajustar progresso</h3>
            <div style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--rose-deep)', fontFamily: 'Playfair Display, serif' }}>
              {progress}%
            </div>
            <input
              type="range" min={0} max={100} step={1}
              value={progress}
              onChange={e => handleProgressChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--rose-deep)', marginTop: '8px' }}
            />
          </div>
          <div style={{ ...panelCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ ...panelTitle, marginBottom: '2px' }}>🔄 status do projeto</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>muda como aparece no dashboard</p>
            </div>
            <select
              value={status}
              onChange={e => handleStatusChange(e.target.value as Project['status'])}
              style={{
                border: '1.5px solid var(--border)', borderRadius: '12px',
                padding: '6px 10px', fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.82rem', color: 'var(--text)',
                background: 'transparent', outline: 'none', cursor: 'pointer',
              }}
            >
              <option value="active">🟢 ativo</option>
              <option value="paused">🟡 pausado</option>
              <option value="done">🔵 concluído</option>
              <option value="abandoned">🔴 abandonado</option>
            </select>
          </div>
        </div>
      )}

      {/* TASKS */}
      {tab === 'tasks' && (
        <div style={panelCard}>
          <h3 style={panelTitle}>✅ próximos passos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {project.tasks.map(t => (
              <div
                key={t.id}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}
              >
                <input
                  type="checkbox"
                  id={`task-${t.id}`}
                  checked={t.done}
                  onChange={() => handleToggleTask(t.id, t.done)}
                  style={{ width: '17px', height: '17px', accentColor: 'var(--rose-deep)', cursor: 'pointer', flexShrink: 0 }}
                />
                <label
                  htmlFor={`task-${t.id}`}
                  style={{
                    fontSize: '0.85rem', cursor: 'pointer', flex: 1,
                    textDecoration: t.done ? 'line-through' : 'none',
                    color: t.done ? 'var(--text-muted)' : 'var(--text)',
                  } as React.CSSProperties}
                >
                  {t.text}
                </label>
                <button
                  onClick={() => removeTask(t.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0 4px',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {project.tasks.length < 10 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddTask() }}
                placeholder="adicionar tarefa…"
                style={{
                  flex: 1, border: '1.5px solid var(--border)', borderRadius: '10px',
                  padding: '6px 10px', fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.82rem', color: 'var(--text)', background: 'transparent', outline: 'none',
                }}
              />
              <button
                onClick={handleAddTask}
                style={{
                  background: 'var(--rose-light)', color: 'var(--rose-deep)',
                  border: 'none', borderRadius: '10px', padding: '6px 14px',
                  fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                }}
              >
                + add
              </button>
            </div>
          )}
        </div>
      )}

      {/* COMMITS */}
      {tab === 'commits' && (
        <div>
          <div style={panelCard}>
            <h3 style={panelTitle}>📦 versão atual</h3>
            <input
              value={version}
              onChange={e => setVersion(e.target.value)}
              onBlur={handleVersionSave}
              placeholder="ex: v0.1.0"
              style={{
                border: '1.5px solid var(--border)', borderRadius: '10px',
                padding: '7px 10px', fontFamily: 'monospace',
                fontSize: '0.9rem', color: 'var(--rose-deep)',
                background: 'var(--rose-pale)', outline: 'none', width: '160px',
              }}
            />
          </div>
          <div style={panelCard}>
            <h3 style={panelTitle}>🕐 novo commit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={commitType}
                  onChange={e => setCommitType(e.target.value as Commit['type'])}
                  style={{
                    border: '1.5px solid var(--border)', borderRadius: '10px',
                    padding: '7px 10px', fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.82rem', color: 'var(--text)',
                    background: 'transparent', outline: 'none', cursor: 'pointer', minWidth: '120px',
                  }}
                >
                  <option value="✨">✨ feature</option>
                  <option value="🐛">🐛 fix</option>
                  <option value="🔧">🔧 refactor</option>
                  <option value="📝">📝 docs</option>
                  <option value="🚀">🚀 deploy</option>
                </select>
                <input
                  value={commitMsg}
                  onChange={e => setCommitMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddCommit() }}
                  placeholder="o que você fez…"
                  style={{
                    flex: 1, border: '1.5px solid var(--border)', borderRadius: '10px',
                    padding: '7px 10px', fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.82rem', color: 'var(--text)', background: 'transparent', outline: 'none',
                  }}
                />
              </div>
              <button
                onClick={handleAddCommit}
                style={{
                  background: 'linear-gradient(135deg, var(--rose), var(--rose-deep))',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '7px 16px', fontSize: '0.8rem',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 500, cursor: 'pointer',
                }}
              >
                + registrar commit
              </button>
            </div>
          </div>
          <div style={panelCard}>
            <h3 style={panelTitle}>📜 histórico</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {project.commits.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                  nenhum commit ainda
                </p>
              )}
              {project.commits.map(c => (
                <div
                  key={c.id}
                  style={{
                    padding: '10px 12px', borderRadius: '14px',
                    border: '1px solid var(--border)', background: 'var(--rose-pale)',
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                  }}
                >
                  <div style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{c.type}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.83rem', color: 'var(--text)' }}>{c.msg}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{c.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NOTES */}
      {tab === 'notes' && (
        <div style={panelCard}>
          <h3 style={panelTitle}>🌿 notas & ideias</h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={handleNotesSave}
            placeholder="cole links, ideias soltas, insights… tudo vale aqui 🌱"
            style={{ ...textareaStyle, minHeight: '110px', lineHeight: 1.6 }}
          />
        </div>
      )}

      {/* BRIEFING */}
      {tab === 'briefing' && (
        <div style={panelCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ ...panelTitle, marginBottom: 0 }}>📌 briefing do projeto</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? 'var(--green-light)' : 'var(--rose-light)',
                  color: copied ? '#3a7a4e' : 'var(--rose-deep)',
                  border: 'none', borderRadius: '10px',
                  padding: '5px 14px', fontSize: '0.78rem',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ copiado!' : 'copiar'}
              </button>
              <button
  onClick={async () => {
    if (editingBriefing) await handleBriefingSave()
    setEditingBriefing(e => !e)
  }}
  style={{
    background: editingBriefing ? 'var(--rose)' : 'var(--white)',
    color: editingBriefing ? 'white' : 'var(--text-soft)',
    border: '1px solid var(--border)', borderRadius: '10px',
    padding: '5px 14px', fontSize: '0.78rem',
    fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.2s',
  }}
>
  {editingBriefing ? 'salvar' : 'editar'}
</button>
            </div>
          </div>

          {editingBriefing || !briefing ? (
            <textarea
              value={briefing}
              onChange={e => setBriefing(e.target.value)}
              onBlur={handleBriefingSave}
              placeholder="cole aqui o contexto do projeto para continuar de onde parou… (suporta markdown)"
              style={{ ...textareaStyle, minHeight: '300px', lineHeight: 1.6 }}
            />
          ) : (
            <div style={{
              minHeight: '100px',
              maxHeight: '400px',
              overflowY: 'auto',
              color: 'var(--text)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.88rem',
              lineHeight: 1.8,
            }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--rose-deep)', marginBottom: '0.5rem', marginTop: '1rem' }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.4rem', marginTop: '0.9rem' }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '0.3rem', marginTop: '0.8rem' }}>{children}</h3>,
                  p: ({ children }) => (
  <p style={{ marginBottom: '0.6rem', color: 'var(--text)' }}>
    {renderWithHex(children)}
  </p>
),
                  strong: ({ children }) => <strong style={{ color: 'var(--rose-deep)', fontWeight: 600 }}>{children}</strong>,
                  em: ({ children }) => <em style={{ color: 'var(--text-soft)' }}>{children}</em>,
                  ul: ({ children }) => <ul style={{ paddingLeft: '0.5rem', marginBottom: '0.6rem', listStyle: 'none' }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ paddingLeft: '1.2rem', marginBottom: '0.6rem' }}>{children}</ol>,
                  li: ({ children }) => (
                    <li style={{ marginBottom: '0.25rem', color: 'var(--text)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: 'var(--rose)', fontSize: '1rem', lineHeight: 1.5, flexShrink: 0 }}>🌱</span>
                      <span>{children}</span>
                    </li>
                  ),
                  code: ({ children }) => {
  const text = String(children)
  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(text.trim())
  return (
    <code style={{ background: 'var(--rose-pale)', color: 'var(--rose-deep)', padding: '1px 6px', borderRadius: '6px', fontSize: '0.82rem', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {isHex && (
        <span style={{ display: 'inline-block', width: '11px', height: '11px', borderRadius: '3px', background: text.trim(), border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }} />
      )}
      {text}
    </code>
  )
},
                  blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid var(--rose)', paddingLeft: '0.8rem', color: 'var(--text-soft)', margin: '0.5rem 0' }}>{children}</blockquote>,
                  hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.8rem 0' }} />,
                  pre: ({ children }) => {
  const child = React.Children.toArray(children)[0]
  if (React.isValidElement(child)) {
    const el = child as React.ReactElement<{ children?: React.ReactNode }>
    const text = String(el.props.children ?? '')
    return renderFileTree(text)
  }
  return <pre>{children}</pre>
},
                  table: ({ children }) => <div style={{ overflowX: 'auto', marginBottom: '0.6rem' }}><table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.82rem' }}>{children}</table></div>,
                  th: ({ children }) => <th style={{ background: 'var(--rose-light)', color: 'var(--rose-deep)', padding: '6px 10px', textAlign: 'left', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>{children}</th>,
                  td: ({ children }) => (
  <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
    {renderWithHex(children)}
  </td>
),
                }}
              >
                {briefing}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

const panelCard: React.CSSProperties = {
  background: 'var(--white)',
  border: '1px solid var(--border)',
  borderRadius: '18px',
  padding: '1.1rem 1.25rem',
  marginBottom: '10px',
}

const panelTitle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '80px',
  resize: 'vertical',
  border: '1.5px solid var(--border)',
  borderRadius: '12px',
  padding: '0.65rem 0.9rem',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '0.85rem',
  color: 'var(--text)',
  background: 'var(--rose-pale)',
  outline: 'none',
}