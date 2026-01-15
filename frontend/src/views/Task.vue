<template>
  <section class="task-container">
    <h1>Mes tâches</h1>
    <form class="add-task-form" @submit.prevent="addTask">
      <input v-model="newTask" type="text" placeholder="Ajouter une tâche..." required />
      <button type="submit">Ajouter</button>
    </form>
    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ done: task.done }">
        <input type="checkbox" :checked="task.done" @change="toggleTask(task)" />
        <span>{{ task.title }}</span>
        <button class="delete-btn" @click="deleteTask(task.id)">🗑️</button>
      </li>
    </ul>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tasks = ref([])
const newTask = ref('')
const error = ref('')

function getToken() {
  return localStorage.getItem('token') || ''
}

async function fetchTasks() {
  error.value = ''
  try {
    const res = await fetch('/api/tasks', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    })
    const data = await res.json()
    if (res.status === 200) {
      tasks.value = data.tasks
    } else {
      error.value = data.error || 'Erreur lors du chargement des tâches.'
    }
  } catch (e) {
    error.value = 'Erreur réseau.'
  }
}

async function addTask() {
  error.value = ''
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ title: newTask.value, done: false })
    })
    const data = await res.json()
    if (res.status === 201) {
      tasks.value.push(data.task)
      newTask.value = ''
    } else {
      error.value = data.error || 'Erreur lors de l\'ajout.'
    }
  } catch (e) {
    error.value = 'Erreur réseau.'
  }
}

async function deleteTask(id) {
  error.value = ''
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    })
    if (res.status === 200) {
      tasks.value = tasks.value.filter(t => t.id !== id)
    } else {
      error.value = 'Erreur lors de la suppression.'
    }
  } catch (e) {
    error.value = 'Erreur réseau.'
  }
}

async function toggleTask(task) {
  error.value = ''
  try {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ done: !task.done })
    })
    if (res.status === 200) {
      task.done = !task.done
    } else {
      error.value = 'Erreur lors de la modification.'
    }
  } catch (e) {
    error.value = 'Erreur réseau.'
  }
}

onMounted(fetchTasks)
</script>

<style scoped>
.task-container {
  max-width: 500px;
  margin: 2rem auto;
  background: rgba(255,255,255,0.05);
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  padding: 2.5rem 2rem;
}
.add-task-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.add-task-form input {
  flex: 1;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.add-task-form button {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.task-list {
  list-style: none;
  padding: 0;
}
.task-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid #eee;
}
.task-list li.done span {
  text-decoration: line-through;
  color: #888;
}
.delete-btn {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
}
.error-msg {
  color: #e74c3c;
  margin-top: 1rem;
}
</style>
