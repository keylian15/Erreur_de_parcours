<template>
	<section class="home-container">
		<div class="home-content">
			<h1>Bienvenue sur <span class="project-name">Erreur de Parcours</span></h1>
			<h2>La plateforme de gestion de tâches collaborative pour étudiants et enseignants</h2>
			<p>
				Organisez vos projets, suivez vos tâches, collaborez efficacement et ne perdez plus jamais le fil de vos parcours universitaires !
			</p>
			<router-link to="/register" class="cta-btn" v-if="!userEmail">Commencer maintenant</router-link>
			<div v-else class="info-msg">
				<span>Vous êtes connecté. <router-link to="/task">Accédez à vos tâches ici !</router-link></span>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const userEmail = ref('')
onMounted(() => {
	userEmail.value = localStorage.getItem('userEmail') || ''
})
</script>
