<template>
  <section class="tasks-page">
    <div class="container py-4">
      <div class="row g-4">
        <div class="col-12 col-lg-4">
          <n-card size="large" class="shadow-sm">
            <n-space vertical size="large">
              <div>
                <h2 class="mb-1">Mes tâches</h2>
                <p class="text-muted mb-0">Pilotez vos priorités du jour.</p>
              </div>
              <div class="row g-3">
                <div class="col-6">
                  <n-statistic label="Total" :value="tasks.length" />
                </div>
                <div class="col-6">
                  <n-statistic label="Terminées" :value="doneCount" />
                </div>
              </div>
              <n-divider />
              <form @submit.prevent="addTask">
                <n-form>
                  <n-form-item label="Nouvelle tâche">
                    <n-input v-model:value="newTask" placeholder="Ajouter une tâche..." />
                  </n-form-item>
                  <n-button
                    type="primary"
                    block
                    :disabled="!newTask.trim()"
                    html-type="submit"
                    @click="addTask"
                  >
                    Ajouter
                  </n-button>
                </n-form>
              </form>
              <n-alert v-if="error" type="error" :show-icon="true">{{ error }}</n-alert>
            </n-space>
          </n-card>
        </div>
        <div class="col-12 col-lg-8">
          <n-card size="large" class="shadow-lg">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h3 class="mb-0">Liste</h3>
              <n-tag v-if="tasks.length" type="success">{{ doneCount }} terminées</n-tag>
            </div>
            <n-empty v-if="!tasks.length" description="Aucune tâche pour le moment." />
            <n-list v-else>
              <n-list-item v-for="task in tasks" :key="task.id">
                <div class="d-flex align-items-center justify-content-between w-100">
                  <n-space align="center" size="large">
                    <n-checkbox :checked="task.done" @update:checked="(value) => toggleTask(task, value)">
                      <span
                        v-if="editingId !== task.id"
                        :class="['task-title', { 'text-decoration-line-through text-muted': task.done }]"
                      >
                        {{ task.title }}
                      </span>
                    </n-checkbox>
                    <n-input
                      v-if="editingId === task.id"
                      v-model:value="editingTitle"
                      size="small"
                      placeholder="Nouveau nom"
                      style="min-width: 200px"
                    />
                    <n-tag size="small" :type="task.done ? 'success' : 'warning'">
                      {{ task.done ? 'Terminée' : 'En cours' }}
                    </n-tag>
                  </n-space>
                  <n-space size="small">
                    <n-button
                      v-if="editingId !== task.id"
                      quaternary
                      @click="startEdit(task)"
                    >
                      Modifier
                    </n-button>
                    <n-button
                      v-else
                      quaternary
                      type="primary"
                      @click="saveEdit(task)"
                    >
                      Enregistrer
                    </n-button>
                    <n-button
                      v-if="editingId === task.id"
                      quaternary
                      @click="cancelEdit"
                    >
                      Annuler
                    </n-button>
                    <n-button quaternary type="error" @click="deleteTask(task.id)">Supprimer</n-button>
                  </n-space>
                </div>
              </n-list-item>
            </n-list>
          </n-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NTag,
  NList,
  NListItem,
  NCheckbox,
  NEmpty,
  NAlert,
  NDivider,
  NStatistic
} from 'naive-ui'

const tasks = ref([])
const newTask = ref('')
const error = ref('')
const editingId = ref(null)
const editingTitle = ref('')

const doneCount = computed(() => tasks.value.filter(task => task.done).length)

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
  if (!newTask.value.trim()) {
    error.value = 'Veuillez saisir un titre de tâche.'
    return
  }
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ title: newTask.value.trim(), done: false })
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

function startEdit(task) {
  editingId.value = task.id
  editingTitle.value = task.title
}

function cancelEdit() {
  editingId.value = null
  editingTitle.value = ''
}

async function saveEdit(task) {
  error.value = ''
  const nextTitle = editingTitle.value.trim()
  if (!nextTitle) {
    error.value = 'Le titre ne peut pas être vide.'
    return
  }
  try {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ title: nextTitle })
    })
    if (res.status === 200) {
      task.title = nextTitle
      cancelEdit()
    } else {
      const data = await res.json()
      error.value = data.error || 'Erreur lors de la modification.'
    }
  } catch (e) {
    error.value = 'Erreur réseau.'
  }
}

async function toggleTask(task, checked) {
  error.value = ''
  const nextDone = typeof checked === 'boolean' ? checked : !task.done
  try {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ done: nextDone })
    })
    if (res.status === 200) {
      task.done = nextDone
    } else {
      error.value = 'Erreur lors de la modification.'
    }
  } catch (e) {
    error.value = 'Erreur réseau.'
  }
}

onMounted(fetchTasks)
</script>
