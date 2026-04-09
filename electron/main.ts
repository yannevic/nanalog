import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import {
  listProjects,
  addProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask,
  addCommit,
  deleteCommit,
  reorderProjects,
} from '../src/lib/db'
import type { Project, Commit } from '../src/types/project'

function createWindow() {
  const win = new BrowserWindow({
    title: 'Nanalog',
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  ipcMain.handle('list-projects', () => listProjects())

  ipcMain.handle(
    'add-project',
    (_e, data: Pick<Project, 'name' | 'version' | 'status' | 'where'>) => addProject(data)
  )

  ipcMain.handle('update-project', (_e, { id, data }: { id: number; data: Partial<Project> }) =>
    updateProject(id, data)
  )

  ipcMain.handle('delete-project', (_e, id: number) => deleteProject(id))

  ipcMain.handle('add-task', (_e, { projectId, text }: { projectId: number; text: string }) =>
    addTask(projectId, text)
  )

  ipcMain.handle('update-task', (_e, { id, done }: { id: number; done: boolean }) =>
    updateTask(id, done)
  )

  ipcMain.handle('delete-task', (_e, id: number) => deleteTask(id))

  ipcMain.handle(
    'add-commit',
    (
      _e,
      {
        projectId,
        type,
        msg,
        version,
      }: { projectId: number; type: Commit['type']; msg: string; version: string }
    ) => addCommit(projectId, type, msg, version)
  )
  ipcMain.handle('delete-commit', (_e, id: number) => deleteCommit(id))

  ipcMain.handle('reorder-projects', (_e, ids: number[]) => reorderProjects(ids))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
