import { contextBridge, ipcRenderer } from 'electron'
import type { Project, Task, Commit, Phase } from '../src/types/project'

contextBridge.exposeInMainWorld('api', {
  listProjects: (): Promise<Project[]> => ipcRenderer.invoke('list-projects'),

  addProject: (data: Pick<Project, 'name' | 'version' | 'status' | 'where'>): Promise<Project> =>
    ipcRenderer.invoke('add-project', data),

  updateProject: (id: number, data: Partial<Project>): Promise<Project | null> =>
    ipcRenderer.invoke('update-project', { id, data }),

  deleteProject: (id: number): Promise<void> => ipcRenderer.invoke('delete-project', id),

  addTask: (projectId: number, text: string): Promise<Task> =>
    ipcRenderer.invoke('add-task', { projectId, text }),

  updateTask: (id: number, done: boolean): Promise<void> =>
    ipcRenderer.invoke('update-task', { id, done }),

  deleteTask: (id: number): Promise<void> => ipcRenderer.invoke('delete-task', id),

  addPhase: (projectId: number, name: string): Promise<Phase> =>
    ipcRenderer.invoke('add-phase', { projectId, name }),

  deletePhase: (id: number): Promise<void> => ipcRenderer.invoke('delete-phase', id),

  addTaskToPhase: (phaseId: number, text: string): Promise<Task> =>
    ipcRenderer.invoke('add-task-to-phase', { phaseId, text }),

  addCommit: (
    projectId: number,
    type: Commit['type'],
    msg: string,
    version: string
  ): Promise<Commit> => ipcRenderer.invoke('add-commit', { projectId, type, msg, version }),

  deleteCommit: (id: number): Promise<void> => ipcRenderer.invoke('delete-commit', id),

  reorderProjects: (ids: number[]): Promise<void> => ipcRenderer.invoke('reorder-projects', ids),

  winMinimize: (): Promise<void> => ipcRenderer.invoke('win-minimize'),
  winMaximize: (): Promise<void> => ipcRenderer.invoke('win-maximize'),
  winClose: (): Promise<void> => ipcRenderer.invoke('win-close'),
  getVersion: (): Promise<string> => ipcRenderer.invoke('get-version'),
})
