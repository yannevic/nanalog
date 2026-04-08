import { useState, useEffect, useCallback } from 'react'
import type { Project, Commit } from '../types/project'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])

  const load = useCallback(async () => {
    const list = await window.api.listProjects()
    setProjects(list)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function createProject(data: Pick<Project, 'name' | 'version' | 'status' | 'where'>) {
    await window.api.addProject(data)
    await load()
  }

  async function editProject(id: number, data: Partial<Project>) {
    await window.api.updateProject(id, data)
    await load()
  }

  async function removeProject(id: number) {
    await window.api.deleteProject(id)
    await load()
  }

  async function createTask(projectId: number, text: string) {
    await window.api.addTask(projectId, text)
    await load()
  }

  async function toggleTask(id: number, done: boolean) {
    await window.api.updateTask(id, done)
    await load()
  }

  async function removeTask(id: number) {
    await window.api.deleteTask(id)
    await load()
  }

  async function createCommit(projectId: number, type: Commit['type'], msg: string) {
    await window.api.addCommit(projectId, type, msg)
    await load()
  }

  async function deleteCommit(id: number) {
    await window.api.deleteCommit(id)
    await load()
  }

  async function reorderProjects(ids: number[]) {
    await window.api.reorderProjects(ids)
    await load()
  }

  return {
    projects,
    createProject,
    editProject,
    removeProject,
    createTask,
    toggleTask,
    removeTask,
    createCommit,
    deleteCommit,
    reorderProjects,
  }
}
