<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useQuestionStore } from './stores/questionStore'

const route = useRoute()
const router = useRouter()
const questionStore = useQuestionStore()
const isAuthenticated = computed(() => route.path !== '/')
const currentUser = computed(() => questionStore.getAccount(questionStore.currentUserId))

function logout() {
  router.push('/')
}
</script>

<template>
  <div class="app-shell">
    <header v-if="isAuthenticated" class="app-header">
      <RouterLink class="brand" to="/forum"><span class="brand-mark">Q</span><span>Question<span class="brand-accent">&Co</span></span></RouterLink>
      <nav class="main-nav" aria-label="Navigation principale">
        <RouterLink to="/forum">Explorer</RouterLink>
        <RouterLink to="/messages">Messages</RouterLink>
        <RouterLink to="/create-question" class="nav-action">Poser une question <span>+</span></RouterLink>
      </nav>
      <button class="profile-button" type="button" aria-label="Se déconnecter" @click="logout"><span class="avatar">{{ currentUser?.initials }}</span><span class="profile-copy"><strong>{{ currentUser?.name }}</strong><small>Mon espace</small></span><span class="chevron">⌄</span></button>
    </header>
    <main class="main-content"><RouterView /></main>
  </div>
</template>

