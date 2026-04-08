import Database from 'better-sqlite3'
import { join } from 'path'
import { app } from 'electron'
import type { Project, Task, Commit } from '../types/project'

const db = new Database(join(app.getPath('userData'), 'nanalog.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '0.1.0',
    status TEXT NOT NULL DEFAULT 'active',
    progress INTEGER NOT NULL DEFAULT 0,
    lastSeen TEXT NOT NULL,
    where_stopped TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    briefing TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS commits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    msg TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );
`)

function getProjectFull(id: number): Project | null {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Record<string, unknown> | undefined
  if (!row) return null

  const tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY id ASC').all(id) as Task[]
  const commits = db.prepare('SELECT * FROM commits WHERE project_id = ? ORDER BY id DESC').all(id) as Commit[]

  return {
    id: row.id as number,
    name: row.name as string,
    version: row.version as string,
    status: row.status as Project['status'],
    progress: row.progress as number,
    lastSeen: row.lastSeen as string,
    where: row.where_stopped as string,
    notes: row.notes as string,
    briefing: row.briefing as string,
    tasks,
    commits,
  }
}

export function listProjects(): Project[] {
  const rows = db.prepare('SELECT id FROM projects ORDER BY id DESC').all() as { id: number }[]
  return rows.map(r => getProjectFull(r.id)).filter(Boolean) as Project[]
}

export function addProject(data: Pick<Project, 'name' | 'version' | 'status' | 'where'>): Project {
  const now = new Date().toISOString()
  const result = db.prepare(`
    INSERT INTO projects (name, version, status, progress, lastSeen, where_stopped, notes)
    VALUES (?, ?, ?, 0, ?, ?, '')
  `).run(data.name, data.version, data.status, now, data.where)

  return getProjectFull(result.lastInsertRowid as number)!
}

export function updateProject(id: number, data: Partial<Pick<Project, 'name' | 'version' | 'status' | 'progress' | 'lastSeen' | 'where' | 'notes' | 'briefing'>>): Project | null {
  if (data.name !== undefined) db.prepare('UPDATE projects SET name = ? WHERE id = ?').run(data.name, id)
  if (data.version !== undefined) db.prepare('UPDATE projects SET version = ? WHERE id = ?').run(data.version, id)
  if (data.status !== undefined) db.prepare('UPDATE projects SET status = ? WHERE id = ?').run(data.status, id)
  if (data.progress !== undefined) db.prepare('UPDATE projects SET progress = ? WHERE id = ?').run(data.progress, id)
  if (data.lastSeen !== undefined) db.prepare('UPDATE projects SET lastSeen = ? WHERE id = ?').run(data.lastSeen, id)
  if (data.where !== undefined) db.prepare('UPDATE projects SET where_stopped = ? WHERE id = ?').run(data.where, id)
  if (data.notes !== undefined) db.prepare('UPDATE projects SET notes = ? WHERE id = ?').run(data.notes, id)
  if (data.briefing !== undefined) db.prepare('UPDATE projects SET briefing = ? WHERE id = ?').run(data.briefing, id)

  return getProjectFull(id)
}

export function deleteProject(id: number): void {
  db.prepare('DELETE FROM projects WHERE id = ?').run(id)
}

export function addTask(projectId: number, text: string): Task {
  const result = db.prepare('INSERT INTO tasks (project_id, text, done) VALUES (?, ?, 0)').run(projectId, text)
  return { id: result.lastInsertRowid as number, text, done: false }
}

export function updateTask(id: number, done: boolean): void {
  db.prepare('UPDATE tasks SET done = ? WHERE id = ?').run(done ? 1 : 0, id)
}

export function deleteTask(id: number): void {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
}

export function addCommit(projectId: number, type: Commit['type'], msg: string): Commit {
  const date = new Date().toISOString()
  const result = db.prepare('INSERT INTO commits (project_id, type, msg, date) VALUES (?, ?, ?, ?)').run(projectId, type, msg, date)
  return { id: result.lastInsertRowid as number, type, msg, date }
}