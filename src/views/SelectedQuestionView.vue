<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useQuestionStore } from '../stores/questionStore'

const route = useRoute()
const store = useQuestionStore()
const responseContent = ref('')
const responseError = ref('')
const reportNotice = ref('')
const question = computed(() => store.questions.find((item) => item.id.toString() === route.query.questionId))

watch(question, (value) => {
  if (value?.userId === store.currentUserId) {
    store.markResponsesSeen(value.id)
  }
}, { immediate: true })

function publishResponse() {
  if (!question.value) return
  if (responseContent.value.trim().length < 8) { responseError.value = 'Votre réponse doit contenir au moins 8 caractères.'; return }
  store.addResponse(question.value.id, responseContent.value.trim())
  responseContent.value = ''
  responseError.value = ''
}

function reportContent() {
  reportNotice.value = 'Le signalement a été effectué.'
}
</script>

<template>
  <div class="detail-page">
    <RouterLink class="back-link" to="/forum">← Retour aux questions</RouterLink>
    <p v-if="reportNotice" class="report-notice" role="status">{{ reportNotice }}</p>
    <div v-if="question" class="detail-layout">
      <main>
        <div class="question-header"><span class="tag">{{ question.tag }}</span><span class="question-id">QUESTION #{{ question.id.toString().padStart(2, '0') }} <button class="report-button" type="button" @click="reportContent">Signaler</button></span></div>
        <h1>{{ question.title }}</h1>
        <div class="author-line"><span class="avatar">{{ question.isHidden ? '?' : (store.getAccount(question.userId)?.initials || 'ET') }}</span><span><strong>{{ question.isHidden ? 'Étudiant anonyme' : (store.getAccount(question.userId)?.name || 'Étudiant de la communauté') }}</strong><small>Question publiée récemment</small></span></div>
        <p class="question-content">{{ question.content }}</p>
        <div class="responses-heading"><h2>{{ question.responses.length }} réponse{{ question.responses.length > 1 ? 's' : '' }}</h2><span>La discussion est ouverte</span></div>
        <section v-if="question.responses.length" class="responses"><article v-for="response in question.responses" :key="response.id" class="response"><span class="response-avatar">{{ response.userId === store.currentUserId ? store.getAccount(response.userId)?.initials : (store.getAccount(response.userId)?.initials || 'A') }}</span><div><div class="response-meta"><strong>{{ response.userId === store.currentUserId ? 'Vous' : (store.getAccount(response.userId)?.name || 'Étudiant aidant') }}</strong><small>Réponse de la communauté</small><button class="report-button" type="button" @click="reportContent">Signaler</button></div><p>{{ response.content }}</p></div></article></section>
        <section class="reply-box"><div class="reply-heading"><span class="reply-avatar">É</span><div><strong>Ajouter votre réponse</strong><small>Votre expérience peut faire la différence.</small></div></div><textarea v-model="responseContent" rows="4" placeholder="Partagez une piste, une ressource ou un encouragement..."></textarea><p v-if="responseError" class="form-error">{{ responseError }}</p><button class="primary-button" type="button" @click="publishResponse">Publier la réponse <span>→</span></button></section>
      </main>
      <aside class="side-card"><span class="side-icon">✦</span><h3>Une question vous parle ?</h3><p>Une réponse n’a pas besoin d’être parfaite. Une piste ou une ressource peut déjà beaucoup aider.</p><RouterLink class="side-link" to="/create-question">Poser une autre question <span>→</span></RouterLink></aside>
    </div>
    <div v-else class="empty-state"><h2>Cette question n’existe plus</h2><p>Retournez au forum pour découvrir les autres discussions.</p><RouterLink class="primary-button" to="/forum">Retour au forum</RouterLink></div>
  </div>
</template>

<style scoped>
.back-link { color: var(--muted); display: inline-block; font-size: .78rem; font-weight: 700; margin-bottom: 3rem; }.back-link:hover { color: var(--coral); }.detail-layout { display: grid; gap: 5rem; grid-template-columns: minmax(0, 1fr) 265px; max-width: 980px; }.question-header { align-items: center; display: flex; justify-content: space-between; }.tag { background: #fff1ed; border-radius: 4px; color: var(--coral); font-size: .68rem; font-weight: 800; padding: .3rem .55rem; }.question-id { color: var(--muted); font-size: .68rem; letter-spacing: .1em; }.detail-page h1 { font-family: Georgia, serif; font-size: clamp(2.4rem, 5vw, 4.25rem); line-height: 1; margin: 1.4rem 0; max-width: 760px; }.author-line, .response-meta, .reply-heading { align-items: center; display: flex; gap: .7rem; }.author-line small, .response-meta small, .reply-heading small { color: var(--muted); display: block; font-size: .7rem; }.avatar, .response-avatar, .reply-avatar { align-items: center; background: var(--yellow); border-radius: 50%; display: inline-flex; font-size: .7rem; font-weight: 800; height: 34px; justify-content: center; width: 34px; }.question-content { border-bottom: 1px solid var(--line); font-size: 1rem; line-height: 1.85; margin: 2.2rem 0 2.5rem; padding-bottom: 2.5rem; }.responses-heading { align-items: baseline; display: flex; gap: 1rem; }.responses-heading h2 { font-family: Georgia, serif; font-size: 1.6rem; }.responses-heading span { color: var(--muted); font-size: .72rem; }.responses { display: grid; gap: 1rem; margin-top: 1.5rem; }.response { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; display: flex; gap: .8rem; padding: 1rem; }.response-avatar { background: var(--mint); flex: 0 0 30px; height: 30px; width: 30px; }.response p { font-size: .85rem; margin-top: .7rem; }.response-meta strong { font-size: .78rem; }.reply-box { background: var(--mint); border-radius: 6px; margin-top: 2rem; padding: 1.25rem; }.reply-heading { margin-bottom: 1rem; }.reply-avatar { background: var(--yellow); height: 30px; width: 30px; }.reply-box textarea { background: rgba(255,255,255,.75); border: 1px solid transparent; border-radius: 5px; padding: .8rem; resize: vertical; width: 100%; }.primary-button { background: var(--ink); border: 0; border-radius: 5px; color: white; cursor: pointer; display: inline-block; font-size: .8rem; font-weight: 800; margin-top: .8rem; padding: .75rem 1rem; }.primary-button span { color: var(--yellow); margin-left: .7rem; }.form-error { color: var(--coral); font-size: .75rem; margin-top: .5rem; }.side-card { align-self: start; background: var(--yellow); border-radius: 6px; padding: 1.5rem; transform: rotate(2deg); }.side-icon { color: var(--coral); font-size: 1.4rem; }.side-card h3 { font-family: Georgia, serif; font-size: 1.3rem; line-height: 1.1; margin: .8rem 0; }.side-card p { font-size: .78rem; line-height: 1.5; }.side-link { color: var(--ink); display: block; font-size: .75rem; font-weight: 800; margin-top: 1.5rem; }.side-link span { float: right; font-size: 1.1rem; }.empty-state { margin: 3rem auto; max-width: 450px; text-align: center; }.empty-state h2 { font-family: Georgia, serif; margin-bottom: .5rem; }.empty-state p { color: var(--muted); }.empty-state .primary-button { margin-top: 1.5rem; }
@media (max-width: 760px) { .back-link { margin-bottom: 2rem; }.detail-layout { display: block; }.side-card { margin-top: 2.5rem; }.question-content { margin-top: 1.5rem; } }
.report-notice { background: var(--mint); border: 1px solid #b7d8c5; border-radius: 5px; color: var(--green); font-size: .8rem; margin-bottom: 1.5rem; padding: .7rem 1rem; }
.report-button { background: transparent; border: 0; color: var(--muted); cursor: pointer; font-size: .68rem; letter-spacing: normal; margin-left: .55rem; padding: 0; text-decoration: underline; }
.report-button:hover { color: var(--coral); }
</style>
