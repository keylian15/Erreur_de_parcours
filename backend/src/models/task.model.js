import { db } from '../config/db.js'

export const TaskModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM tasks')
    return rows
  },

  create: async (title) => {
    const [result] = await db.query(
      'INSERT INTO tasks (title) VALUES (?)',
      [title]
    )
    return { id: result.insertId, title, done: false }
  },

  update: async (id, data) => {
    await db.query(
      'UPDATE tasks SET title = ?, done = ? WHERE id = ?',
      [data.title, data.done, id]
    )
  },

  delete: async (id) => {
    await db.query('DELETE FROM tasks WHERE id = ?', [id])
  }
}
