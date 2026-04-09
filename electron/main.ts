import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import { copyFileSync, existsSync, renameSync } from 'fs'
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
  addPhase,
  deletePhase,
  addTaskToPhase,
} from '../src/lib/db'
import type { Project, Commit } from '../src/types/project'

function backupDatabase() {
  const userData = app.getPath('userData')
  const db = join(userData, 'nanalog.db')
  if (!existsSync(db)) return

  const bak1 = join(userData, 'nanalog.bak1.db')
  const bak2 = join(userData, 'nanalog.bak2.db')
  const bak3 = join(userData, 'nanalog.bak3.db')

  if (existsSync(bak2)) renameSync(bak2, bak3)
  if (existsSync(bak1)) renameSync(bak1, bak2)
  copyFileSync(db, bak1)
}

function setupUpdater(win: BrowserWindow) {
  autoUpdater.autoDownload = false

  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update-available', info.version)
  })

  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('update-progress', Math.floor(progress.percent))
  })

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded')
  })

  autoUpdater.on('error', (err) => {
    win.webContents.send('update-error', err.message)
  })

  ipcMain.handle('update-start-download', () => autoUpdater.downloadUpdate())
  ipcMain.handle('update-install-now', () => {
    autoUpdater.quitAndInstall(false, true)
  })
  ipcMain.handle('update-check', () => autoUpdater.checkForUpdates())
}

function createWindow() {
  const win = new BrowserWindow({
    icon: app.isPackaged
      ? join(process.resourcesPath, 'app.asar.unpacked', 'assets', 'icon.png')
      : join(__dirname, '../assets/icon.png'),
    title: 'Nanalog',
    width: 1200,
    height: 800,
    frame: false,
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

  ipcMain.handle('win-minimize', () => win.minimize())
  ipcMain.handle('win-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })
  ipcMain.handle('win-close', () => win.close())

  ipcMain.handle('get-version', () => app.getVersion())

  setupUpdater(win)

  if (app.isPackaged) {
    autoUpdater.checkForUpdates()
  }
}
app.whenReady().then(() => {
  backupDatabase()
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

  ipcMain.handle('add-phase', (_e, { projectId, name }: { projectId: number; name: string }) =>
    addPhase(projectId, name)
  )

  ipcMain.handle('delete-phase', (_e, id: number) => deletePhase(id))

  ipcMain.handle('add-task-to-phase', (_e, { phaseId, text }: { phaseId: number; text: string }) =>
    addTaskToPhase(phaseId, text)
  )

  ipcMain.handle('delete-commit', (_e, id: number) => deleteCommit(id))

  ipcMain.handle('reorder-projects', (_e, ids: number[]) => reorderProjects(ids))

  createWindow()
  app.setAppUserModelId('Nanalog')

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
