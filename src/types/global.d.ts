import type { Project, Task, Commit, Phase } from './project'
declare global {
  interface Window {
    api: {
      listProjects: () => Promise<Project[]>
      addProject: (data: Pick<Project, 'name' | 'version' | 'status' | 'where'>) => Promise<Project>
      updateProject: (id: number, data: Partial<Project>) => Promise<Project | null>
      deleteProject: (id: number) => Promise<void>
      addTask: (projectId: number, text: string) => Promise<Task>
      updateTask: (id: number, done: boolean) => Promise<void>
      deleteTask: (id: number) => Promise<void>
      addPhase: (projectId: number, name: string) => Promise<Phase>
      deletePhase: (id: number) => Promise<void>
      addTaskToPhase: (phaseId: number, text: string) => Promise<Task>
      addCommit: (
        projectId: number,
        type: Commit['type'],
        msg: string,
        version: string
      ) => Promise<Commit>
      deleteCommit: (id: number) => Promise<void>
      reorderProjects: (ids: number[]) => Promise<void>
      winMinimize: () => Promise<void>
      winMaximize: () => Promise<void>
      winClose: () => Promise<void>
      getVersion: () => Promise<string>

      updateCheck: () => Promise<void>
      updateStartDownload: () => Promise<void>
      updateInstallNow: () => Promise<void>
      onUpdateAvailable: (cb: (version: string) => void) => void
      onUpdateProgress: (cb: (percent: number) => void) => void
      onUpdateDownloaded: (cb: () => void) => void
      onUpdateError: (cb: (msg: string) => void) => void
      removeUpdateListeners: () => void
    }
  }
}
