// src/controllers/task.controller.js
import { db } from '../config/db.js';

// Créer une tâche
export const createTask = async (req, res) => {
  try {
    const { title, done = false } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }

    const [result] = await db.query(
      'INSERT INTO tasks (title, done) VALUES (?, ?)',
      [title, done]
    );

    res.status(201).json({
      message: 'Tâche créée avec succès',
      task: {
        id: result.insertId,
        title,
        done
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Obtenir toutes les tâches
export const getTasks = async (req, res) => {
  try {
    const [tasks] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json({ tasks });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Obtenir une tâche par ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({ task: tasks[0] });
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour une tâche
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (done !== undefined) {
      updates.push('done = ?');
      values.push(done);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    values.push(id);

    const [result] = await db.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer une tâche
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
