// src/controllers/task.controller.js
import { db } from '../config/db.js';

// Créer une tâche
export const createTask = async (req, res) => {
  try {
    const { title, done = false } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }

    const [result] = await db.query(
      'INSERT INTO tasks (title, done, user_id) VALUES (?, ?, ?)',
      [title, done, userId]
    );

    res.status(201).json({
      message: 'Tâche créée avec succès',
      task: {
        id: result.insertId,
        title,
        done,
        user_id: userId
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Obtenir toutes les tâches de l'utilisateur connecté
export const getTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json({ tasks });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Obtenir une tâche par ID (privée à l'utilisateur)
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

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
    const userId = req.userId;

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

    values.push(id, userId);

    const [result] = await db.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
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
    const userId = req.userId;
    const [result] = await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
