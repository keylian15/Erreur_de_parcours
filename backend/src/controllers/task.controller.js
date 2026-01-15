import { TaskModel } from '../models/task.model.js'

export const getTasks = async (req, res) => {
  const tasks = await TaskModel.findAll()
  res.json(tasks)
}

export const createTask = async (req, res) => {
  const task = await TaskModel.create(req.body.title)
  res.status(201).json(task)
}

export const updateTask = async (req, res) => {
  await TaskModel.update(req.params.id, req.body)
  res.sendStatus(204)
}

export const deleteTask = async (req, res) => {
  await TaskModel.delete(req.params.id)
  res.sendStatus(204)
}
