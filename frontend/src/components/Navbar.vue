<template>
    <nav class="navbar-custom">
        <n-space justify="space-between" align="center" style="width: 100%">
            <n-space align="center">
                <RouterLink to="/" class="brand-link">
                    <n-gradient-text :size="24" type="info">
                        Erreur de Parcours
                    </n-gradient-text>
                </RouterLink>
                <n-button text tag="a" @click="$router.push('/')">
                    <template #icon>
                        <n-icon><HomeIcon /></n-icon>
                    </template>
                    Home
                </n-button>
                <n-button v-if="userEmail" text tag="a" @click="$router.push('/task')">
                    Tâches
                </n-button>
            </n-space>
            <n-space align="center">
                <template v-if="userEmail">
                    <span class="user-email">{{ userEmail }}</span>
                    <n-button text tag="a" @click="logout">Se déconnecter</n-button>
                </template>
                <template v-else>
                    <n-button text tag="a" @click="$router.push('/login')">
                        Se connecter
                    </n-button>
                    <n-button type="primary" @click="$router.push('/register')">
                        S'inscrire
                    </n-button>
                </template>
            </n-space>
        </n-space>
    </nav>
</template>

<script setup>
import { NSpace, NButton, NGradientText, NIcon } from 'naive-ui'
import { Home as HomeIcon } from '@vicons/ionicons5'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'


const userEmail = ref(localStorage.getItem('userEmail') || '')
const router = useRouter()

function updateUserEmail() {
    userEmail.value = localStorage.getItem('userEmail') || ''
}

// Met à jour userEmail si le localStorage change (autre onglet)
window.addEventListener('storage', updateUserEmail)

// Met à jour userEmail si un event custom est émis (login/logout)
onMounted(() => {
    window.addEventListener('user-session-changed', updateUserEmail)
})
onBeforeUnmount(() => {
    window.removeEventListener('user-session-changed', updateUserEmail)
    window.removeEventListener('storage', updateUserEmail)
})

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    userEmail.value = ''
    window.dispatchEvent(new Event('user-session-changed'))
    router.push('/login')
}
</script>

<style scoped>
.user-email {
    font-weight: 600;
    color: #333;
    background: #f3f3f3;
    border-radius: 6px;
    padding: 0.4em 1em;
    margin-left: 1em;
}
</style>