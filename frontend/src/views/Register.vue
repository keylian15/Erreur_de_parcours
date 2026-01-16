<template>
	<section class="auth-page">
		<div class="container py-5">
			<div class="row justify-content-center">
				<div class="col-12 col-lg-10">
					<div class="row g-4 align-items-stretch">
						<div class="col-12 col-lg-6 order-lg-2">
							<n-card size="large" class="h-100 auth-card">
								<n-space vertical size="large">
									<n-tag type="warning" round size="large">Nouveau compte</n-tag>
									<h1 class="display-6 fw-bold mb-0">Inscription</h1>
									<p class="text-muted mb-0">
										Créez votre espace et commencez à collaborer avec votre équipe.
									</p>
									<n-alert v-if="error" type="error" :show-icon="true">
										{{ error }}
									</n-alert>
									<n-alert v-if="success" type="success" :show-icon="true">
										{{ success }}
									</n-alert>
									<n-space align="center" size="small">
										<span class="text-muted">Déjà inscrit ?</span>
										<RouterLink to="/login">Se connecter</RouterLink>
									</n-space>
								</n-space>
							</n-card>
						</div>
						<div class="col-12 col-lg-6 order-lg-1">
							<n-card size="large" class="shadow-lg">
								<form @submit.prevent="handleRegister">
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
												minlength="6"
												placeholder="6 caractères minimum"
												autocomplete="new-password"
											/>
										</n-form-item>
										<n-button
											type="primary"
											block
											size="large"
											:loading="loading"
											:disabled="loading"
											html-type="submit"
											@click="handleRegister"
										>
											S'inscrire
										</n-button>
									</n-form>
								</form>
								<div class="mt-3 text-center text-muted">
									Déjà un compte ? <RouterLink to="/login">Se connecter</RouterLink>
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
