<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '../stores/questionStore'

const router = useRouter()
const questionStore = useQuestionStore()
const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  const account = questionStore.accounts.find((item) => item.username === username.value.trim().toLowerCase())
  if (account && password.value === 'password') {
    questionStore.setCurrentUser(account.username)
    error.value = ''
    router.push('/forum')
    return
  }
  error.value = 'Identifiant ou mot de passe incorrect.'
}
</script>

<template>
  <main class="login-page">
    <section class="welcome-panel">
      <div class="eyebrow">LE FORUM QUI RAPPROCHE</div>
      <h1>Les bonnes questions<br /><em>ouvrent des portes.</em></h1>
      <p>Un espace simple pour demander de l’aide, partager ce que vous savez et avancer ensemble.</p>
      <div class="welcome-stats"><span><strong>24/7</strong> entraide</span><span><strong>100%</strong> bienveillant</span></div>
    </section>
    <section class="login-card">
      <div class="card-kicker">BIENVENUE</div>
      <h2>Ravi de vous revoir.</h2>
      <p class="muted">Connectez-vous pour retrouver la communauté.</p>
      <form @submit.prevent="handleLogin">
        <label for="username">Identifiant étudiant</label>
        <input id="username" v-model="username" autocomplete="username" placeholder="acc1 ou acc2" required />
        <label for="password">Mot de passe</label>
        <input id="password" v-model="password" autocomplete="current-password" type="password" placeholder="Votre mot de passe" required />
        <p v-if="error" class="form-error">{{ error }}</p>
        <button class="primary-button" type="submit">Se connecter <span>→</span></button>
      </form>
      <p class="demo-hint">Démo : <strong>acc1</strong> ou <strong>acc2</strong> / <strong>password</strong></p>
    </section>
  </main>
</template>

<style scoped>
.login-page { align-items: center; display: grid; gap: clamp(2rem, 8vw, 7rem); grid-template-columns: minmax(0, 1fr) minmax(300px, 390px); min-height: 72vh; }
.welcome-panel { max-width: 600px; }
.eyebrow, .card-kicker { color: var(--coral); font-size: .72rem; font-weight: 800; letter-spacing: .14em; }
h1 { font-family: Georgia, serif; font-size: clamp(3rem, 6vw, 5.4rem); line-height: .98; margin: 1.25rem 0 1.5rem; }
h1 em { color: var(--coral); font-weight: normal; }
.welcome-panel > p { color: var(--muted); font-size: 1.05rem; max-width: 420px; }
.welcome-stats { display: flex; gap: 2.5rem; margin-top: 4rem; }
.welcome-stats span { color: var(--muted); font-size: .78rem; text-transform: uppercase; }
.welcome-stats strong { color: var(--ink); display: block; font-family: Georgia, serif; font-size: 1.5rem; text-transform: none; }
.login-card { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; box-shadow: var(--shadow); padding: 2.25rem; }
h2 { font-family: Georgia, serif; font-size: 2rem; line-height: 1.05; margin: .65rem 0 .5rem; }
.muted { color: var(--muted); font-size: .9rem; }
form { display: grid; gap: .55rem; margin-top: 2rem; }
label { font-size: .78rem; font-weight: 800; margin-top: .6rem; }
input, textarea, select { background: #fcfcf9; border: 1px solid var(--line); border-radius: 5px; color: var(--ink); outline: none; padding: .82rem .9rem; width: 100%; }
input:focus, textarea:focus, select:focus { border-color: var(--green); box-shadow: 0 0 0 3px var(--mint); }
.primary-button { background: var(--ink); border: 0; border-radius: 5px; color: white; cursor: pointer; font-weight: 800; margin-top: 1rem; padding: .9rem 1rem; text-align: left; }
.primary-button span { color: var(--yellow); float: right; font-size: 1.2rem; }
.form-error { color: var(--coral); font-size: .78rem; line-height: 1.35; margin-top: .5rem; }
.demo-hint { color: var(--muted); font-size: .72rem; margin-top: 1.5rem; text-align: center; }
@media (max-width: 760px) { .login-page { grid-template-columns: 1fr; min-height: auto; } .welcome-panel { padding-top: 1rem; } h1 { font-size: 3.25rem; } .welcome-stats { margin-top: 2rem; } }
</style>
