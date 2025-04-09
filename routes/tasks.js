import express from 'express';
import Task from '../models/Task.js';
import protect from '../middleware/auth.js';

const router1 = express.Router();

router1.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    console.log(req.userId) //tasks/ <-- CORRIGÉ ICI
    res.status(200).json({ tasks });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

// ✅ Ajouter une tâche
router1.post('/', protect, async (req, res) => {
  try {
    const { title, description, status, priority } =   req.body;
    console.log(req.userId)
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      user: req.userId // <-- CORRIGÉ ICI
    });

    await newTask.save();
    res.status(201).json({ message: 'Task added successfully', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// ✅ Récupérer une tâche spécifique appartenant à l'utilisateur
router1.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId }); // <-- CORRIGÉ ICI

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// ✅ Mettre à jour une tâche (si elle appartient à l'utilisateur)
router1.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // <-- CORRIGÉ ICI
      { title, description, status, priority },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ error: 'Task not found or unauthorized' });

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ✅ Supprimer une tâche (si elle appartient à l'utilisateur)
router1.delete('/:id', protect, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId // <-- CORRIGÉ ICI
    });

    if (!deletedTask) return res.status(404).json({ error: 'Task not found or unauthorized' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router1;
