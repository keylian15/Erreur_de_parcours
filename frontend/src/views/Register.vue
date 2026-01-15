<template>
	<section class="register-container">
		<form class="register-form" @submit.prevent="handleRegister">
			<h1>Créer un compte</h1>
			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" v-model="email" required autocomplete="email" />
			</div>
			<div class="form-group">
				<label for="password">Mot de passe</label>
				<input type="password" id="password" v-model="password" required minlength="6" autocomplete="new-password" />
			</div>
			<button class="register-btn" :disabled="loading">S'inscrire</button>
			<p v-if="error" class="error-msg">{{ error }}</p>
			<p v-if="success" class="success-msg">{{ success }}</p>
		</form>
	</section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const router = useRouter()

async function handleRegister() {
	error.value = ''
	success.value = ''
	if (!email.value || !password.value) {
		error.value = 'Veuillez remplir tous les champs.'
		return
	}
	if (password.value.length < 6) {
		error.value = 'Le mot de passe doit contenir au moins 6 caractères.'
		return
	}
	loading.value = true
	try {
		const res = await fetch('/api/users/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email.value, password: password.value })
		})
		const data = await res.json()
		if (res.status === 201) {
			router.push('/login')
			return
		} else if (res.status === 409) {
			error.value = data.error || 'Cet email est déjà utilisé.'
		} else {
			error.value = data.error || 'Erreur lors de la création du compte.'
		}
	} catch (e) {
		error.value = 'Erreur réseau ou serveur.' + e.message
	} finally {
		loading.value = false
	}
}
</script>
