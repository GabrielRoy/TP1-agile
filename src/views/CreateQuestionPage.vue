<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '../stores/questionStore'

const router = useRouter()
const store = useQuestionStore()
const title = ref('')
const content = ref('')
const tag = ref('Méthodologie')
const isHidden = ref(false)
const error = ref('')
const tags = ['Méthodologie', 'Administration', 'Vie étudiante', 'Autre']
const charactersLeft = computed(() => 500 - content.value.length)

function submitQuestion() {
  if (title.value.trim().length < 8) { error.value = 'Ajoutez un titre d’au moins 8 caractères.'; return }
  if (content.value.trim().length < 20) { error.value = 'Décrivez votre question en au moins 20 caractères.'; return }
  store.addQuestion({
    userId: store.currentUserId,
    title: title.value.trim(),
    content: content.value.trim(),
    tag: tag.value,
    isHidden: isHidden.value,
    responses: [
      { id: Date.now(), userId: store.currentUserId === 1 ? 2 : 1, content: 'Merci pour ta question ! Je vais regarder cela et partager une piste rapidement.' },
      { id: Date.now() + 1, userId: store.currentUserId === 1 ? 2 : 1, content: 'Une première idée : échange avec les autres étudiants, leurs expériences peuvent être utiles.' },
    ],
  })
  router.push('/forum')
}
</script>

<template>
  <div class="create-page">
    <RouterLink class="back-link" to="/forum">← Retour aux questions</RouterLink>
    <div class="create-grid">
      <section class="intro"><div class="eyebrow">PRENDRE LA PAROLE</div><h1>Une question,<br /><em>une conversation.</em></h1><p>Votre question peut débloquer quelqu’un d’autre. Décrivez ce qui vous aiderait et la communauté fera le reste.</p><div class="tip"><span>✦</span><div><strong>Petit conseil</strong><p>Un titre précis et quelques détails donnent plus de chances de recevoir une réponse utile.</p></div></div></section>
      <section class="form-panel"><div class="panel-heading"><div><span class="eyebrow">NOUVELLE QUESTION</span><h2>Qu’avez-vous en tête ?</h2></div><span class="step">01 / 01</span></div>
        <form @submit.prevent="submitQuestion">
          <label for="title">Titre de la question</label><input id="title" v-model="title" placeholder="Ex. Comment choisir mon option de cours ?" maxlength="100" required />
          <label for="tag">Catégorie</label><select id="tag" v-model="tag"><option v-for="item in tags" :key="item">{{ item }}</option></select>
          <label for="content">Votre question</label><textarea id="content" v-model="content" rows="7" maxlength="500" placeholder="Expliquez votre situation, vos essais et ce que vous cherchez à comprendre..." required></textarea><small class="counter">{{ charactersLeft }} caractères restants</small>
          <label class="anonymous"><input v-model="isHidden" type="checkbox" /><span class="fake-check">✓</span><span><strong>Publier anonymement</strong><small>Votre nom ne sera pas visible par les autres étudiants.</small></span></label>
          <p v-if="error" class="form-error">{{ error }}</p><button class="primary-button" type="submit">Publier ma question <span>→</span></button>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.back-link { color: var(--muted); display: inline-block; font-size: .78rem; font-weight: 700; margin-bottom: 3.5rem; }.back-link:hover { color: var(--coral); }.create-grid { display: grid; gap: clamp(2.5rem, 8vw, 8rem); grid-template-columns: .8fr 1fr; }.eyebrow { color: var(--coral); font-size: .7rem; font-weight: 800; letter-spacing: .14em; }.intro h1 { font-family: Georgia, serif; font-size: clamp(3rem, 5vw, 4.5rem); line-height: .95; margin: 1rem 0 1.5rem; }.intro h1 em { color: var(--coral); font-weight: normal; }.intro > p { color: var(--muted); max-width: 350px; }.tip { align-items: start; background: var(--mint); border-radius: 6px; display: flex; gap: .8rem; margin-top: 3rem; max-width: 350px; padding: 1rem; }.tip > span { color: var(--coral); }.tip strong { font-size: .78rem; }.tip p { color: var(--muted); font-size: .72rem; line-height: 1.4; margin-top: .25rem; }.form-panel { background: var(--surface); border: 1px solid var(--line); border-radius: 7px; box-shadow: var(--shadow); padding: clamp(1.5rem, 4vw, 2.5rem); }.panel-heading { align-items: start; display: flex; justify-content: space-between; }.panel-heading h2 { font-family: Georgia, serif; font-size: 1.8rem; margin-top: .4rem; }.step { color: var(--muted); font-size: .7rem; }.form-panel form { display: grid; gap: .55rem; margin-top: 2rem; }.form-panel label:not(.anonymous) { font-size: .78rem; font-weight: 800; margin-top: .55rem; }.form-panel input, .form-panel textarea, .form-panel select { background: #fcfcf9; border: 1px solid var(--line); border-radius: 5px; color: var(--ink); outline: none; padding: .8rem .9rem; width: 100%; }.form-panel input:focus, .form-panel textarea:focus, .form-panel select:focus { border-color: var(--green); box-shadow: 0 0 0 3px var(--mint); }.counter { color: var(--muted); font-size: .7rem; text-align: right; }.anonymous { align-items: start; cursor: pointer; display: flex; gap: .7rem; margin-top: 1rem; }.anonymous input { display: none; }.fake-check { align-items: center; border: 1px solid var(--line); border-radius: 4px; color: transparent; display: flex; height: 19px; justify-content: center; width: 19px; }.anonymous input:checked + .fake-check { background: var(--coral); border-color: var(--coral); color: white; }.anonymous strong, .anonymous small { display: block; }.anonymous strong { font-size: .78rem; }.anonymous small { color: var(--muted); font-size: .7rem; margin-top: .2rem; }.form-error { color: var(--coral); font-size: .78rem; }.primary-button { background: var(--ink); border: 0; border-radius: 5px; color: white; cursor: pointer; font-weight: 800; margin-top: 1rem; padding: .9rem 1rem; text-align: left; }.primary-button span { color: var(--yellow); float: right; font-size: 1.2rem; }@media (max-width: 760px) { .back-link { margin-bottom: 2.5rem; }.create-grid { grid-template-columns: 1fr; }.tip { margin-top: 2rem; } }
</style>
