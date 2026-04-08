export type CommitType = '✨' | '🐛' | '🔧' | '📝' | '🚀'

export type ProjectStatus = 'active' | 'paused' | 'done' | 'abandoned'

export interface Task {
  id: number
  text: string
  done: boolean
}

export interface Commit {
  id: number
  type: CommitType
  msg: string
  date: string
}

export interface Project {
  id: number
  name: string
  version: string
  status: ProjectStatus
  progress: number
  lastSeen: string
  where: string
  tasks: Task[]
  commits: Commit[]
  notes: string
  briefing: string
}