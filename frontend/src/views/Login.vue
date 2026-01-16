<template>
	<section class="auth-page">
		<div class="container py-5">
			<div class="row justify-content-center">
				<div class="col-12 col-lg-10">
					<div class="row g-4 align-items-stretch">
						<div class="col-12 col-lg-6">
							<n-card size="large" class="h-100 auth-card">
								<n-space vertical size="large">
									<n-tag type="info" round size="large">Accès sécurisé</n-tag>
									<h1 class="display-6 fw-bold mb-0">Connexion</h1>
									<p class="text-muted mb-0">
										Retrouvez vos projets et suivez vos tâches dès maintenant.
									</p>
									<n-alert v-if="error" type="error" :show-icon="true">
										{{ error }}
									</n-alert>
									<n-space align="center" size="small">
										<span class="text-muted">Nouveau ici ?</span>
										<RouterLink to="/register">Créer un compte</RouterLink>
									</n-space>
								</n-space>
							</n-card>
						</div>
						<div class="col-12 col-lg-6">
							<n-card size="large" class="shadow-lg">
								<form @submit.prevent="handleLogin">
									<n-form>
										<n-form-item label="Email">
											<n-input
												v-model:value="email"
												type="email"
												placeholder="vous@exemple.com"
												autocomplete="email"
											/>
										</n-form-item>
										<n-form-item label="Mot de passe">
											<n-input
												v-model:value="password"
												type="password"
												show-password-on="mousedown"
												placeholder="••••••••"
												autocomplete="current-password"
											/>
										</n-form-item>
										<n-button
											type="primary"
											block
											size="large"
											:loading="loading"
											:disabled="loading"
											html-type="submit"
											@click="handleLogin"
										>
											Se connecter
										</n-button>
									</n-form>
								</form>
								<div class="mt-3 text-center text-muted">
									Pas de compte ? <RouterLink to="/register">Créer un compte</RouterLink>
								</div>
							</n-card>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, NSpace, NTag, NAlert } from 'naive-ui'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleLogin() {
	error.value = ''
	if (!email.value || !password.value) {
		error.value = 'Veuillez remplir tous les champs.'
		return
	}
	loading.value = true
	try {
		const res = await fetch('/api/users/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email.value, password: password.value })
		})
		const data = await res.json()
		if (res.status === 200 && data.token) {
			localStorage.setItem('token', data.token)
			localStorage.setItem('userEmail', email.value)
			window.dispatchEvent(new Event('user-session-changed'))
			router.push('/task')
		} else {
			error.value = data.error || 'Email ou mot de passe incorrect.'
		}
	} catch (e) {
		error.value = 'Erreur réseau ou serveur.'
	} finally {
		loading.value = false
	}
}
</script>