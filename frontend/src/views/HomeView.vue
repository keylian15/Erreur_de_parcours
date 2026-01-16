<template>
	<section class="page-hero">
		<div class="container py-5">
			<div class="row align-items-center g-4">
				<div class="col-12 col-lg-6">
					<n-space vertical size="large">
						<n-tag type="success" round size="large">Plateforme collaborative</n-tag>
						<h1 class="display-5 fw-bold mb-0">
							Bienvenue sur <span class="text-gradient">Erreur de Parcours</span>
						</h1>
						<p class="lead text-muted mb-0">
							Planifiez, priorisez et suivez vos tâches en équipe pour rester concentré sur vos objectifs universitaires.
						</p>
						<n-space size="large" align="center">
							<RouterLink to="/register" v-if="!userEmail" class="text-decoration-none">
								<n-button type="primary" size="large">Commencer maintenant</n-button>
							</RouterLink>
							<RouterLink to="/login" v-if="!userEmail" class="text-decoration-none">
								<n-button size="large">Se connecter</n-button>
							</RouterLink>
							<RouterLink to="/task" v-else class="text-decoration-none">
								<n-button type="primary" size="large">Accéder à mes tâches</n-button>
							</RouterLink>
						</n-space>
						<n-alert v-if="userEmail" type="success" :show-icon="true">
							Vous êtes connecté en tant que <strong>{{ userEmail }}</strong>.
						</n-alert>
					</n-space>
				</div>
				<div class="col-12 col-lg-6" v-if="userEmail">
					<n-card size="large" class="shadow-lg">
						<n-space vertical size="large">
							<h2 class="h4 fw-bold mb-0">Un tableau de bord clair</h2>
							<p class="text-muted mb-0">
								Centralisez les tâches, suivez l’avancement et partagez les responsabilités.
							</p>
							<n-divider />
							<div class="row g-3">
								<div class="col-6">
									<n-statistic label="Projets suivis" :value="12" />
								</div>
								<div class="col-6">
									<n-statistic label="Tâches réalisées" :value="248" />
								</div>
							</div>
							<n-button secondary size="large" @click="$router.push('/task')">
								Ajouter maintenant des tâches
							</n-button>
						</n-space>
					</n-card>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { NSpace, NTag, NButton, NAlert, NCard, NDivider, NStatistic } from 'naive-ui'

const userEmail = ref('')
onMounted(() => {
	userEmail.value = localStorage.getItem('userEmail') || ''
})
</script>
