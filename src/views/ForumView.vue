<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuestionStore } from '../stores/questionStore'

const questionStore = useQuestionStore()
const search = ref('')
const selectedTag = ref('Toutes')
const sort = ref('new')
const tags = ['Toutes', 'Méthodologie', 'Administration', 'Vie étudiante']
const myQuestions = computed(() => questionStore.questions.filter((question) => question.userId === questionStore.currentUserId))
const unreadQuestionCount = computed(() => myQuestions.value.filter((question) => questionStore.hasNewResponses(question)).length)

const filteredQuestions = computed(() => {
  const term = search.value.trim().toLowerCase()
  const list = questionStore.questions.filter((question) => {
    const matchesSearch = !term || `${question.title} ${question.content}`.toLowerCase().includes(term)
    const matchesTag = selectedTag.value === 'Toutes' || question.tag === selectedTag.value
    return matchesSearch && matchesTag
  })
  return list.sort((a, b) => sort.value === 'old' ? a.id - b.id : sort.value === 'answers' ? b.responses.length - a.responses.length : b.id - a.id)
})

function excerpt(content: string) {
  return content.length > 125 ? `${content.slice(0, 125)}…` : content
}
</script>

<template>
  <div class="forum-page">
    <section class="forum-hero">
      <div>
        <div class="eyebrow">ESPACE D’ENTRAIDE ÉTUDIANTE</div>
        <h1>On avance mieux<br /><em>ensemble.</em></h1>
        <p>Parcourez les questions de la communauté ou lancez une conversation.</p>
      </div>
      <div class="hero-note"><span class="note-icon">✦</span><strong>{{ questionStore.questions.length }} questions</strong><small>partagées par la communauté</small></div>
    </section>

    <section class="toolbar" aria-label="Filtres du forum">
      <label class="search-box"><span>⌕</span><input v-model="search" type="search" placeholder="Rechercher une question..." /></label>
      <div class="tag-filters"><button v-for="tag in tags" :key="tag" type="button" :class="{ active: selectedTag === tag }" @click="selectedTag = tag">{{ tag }}</button></div>
      <select v-model="sort" aria-label="Trier les questions"><option value="new">Plus récentes</option><option value="answers">Plus de réponses</option><option value="old">Plus anciennes</option></select>
    </section>

    <section v-if="myQuestions.length" class="my-questions-panel">
      <div class="section-heading my-heading"><div><span class="eyebrow">MON ESPACE</span><h2>Mes questions</h2></div><span v-if="unreadQuestionCount" class="new-count">{{ unreadQuestionCount }} nouvelle réponse</span><span v-else class="result-count">{{ myQuestions.length }} question{{ myQuestions.length > 1 ? 's' : '' }}</span></div>
      <div class="question-list">
        <RouterLink v-for="question in myQuestions" :key="question.id" class="question-card own-question-card" :to="{ path: '/selected-question', query: { questionId: question.id } }">
          <div class="question-top"><span class="tag">{{ question.tag }}</span><span v-if="questionStore.hasNewResponses(question)" class="new-response"><span class="new-dot"></span>Nouvelle réponse</span><span v-else class="response-count">{{ question.responses.length }} réponse{{ question.responses.length > 1 ? 's' : '' }} <b>→</b></span></div>
          <h3>{{ question.title }}</h3>
          <p>{{ excerpt(question.content) }}</p>
          <div class="question-meta"><span class="mini-avatar">É</span><span>Votre question</span><span class="dot">·</span><span>{{ question.responses.length }} réponse{{ question.responses.length > 1 ? 's' : '' }}</span></div>
        </RouterLink>
      </div>
    </section>

    <div class="section-heading"><div><span class="eyebrow">À DÉCOUVRIR</span><h2>Questions de la communauté</h2></div><span class="result-count">{{ filteredQuestions.length }} résultat{{ filteredQuestions.length > 1 ? 's' : '' }}</span></div>
    <section v-if="filteredQuestions.length" class="question-list">
      <RouterLink v-for="question in filteredQuestions" :key="question.id" class="question-card" :to="{ path: '/selected-question', query: { questionId: question.id } }">
        <div class="question-top"><span class="tag">{{ question.tag }}</span><span class="response-count">{{ question.responses.length }} réponse{{ question.responses.length > 1 ? 's' : '' }} <b>→</b></span></div>
        <h3>{{ question.title }}</h3>
        <p>{{ excerpt(question.content) }}</p>
        <div class="question-meta"><span class="mini-avatar">{{ question.isHidden ? '?' : (questionStore.getAccount(question.userId)?.initials || 'ET') }}</span><span>{{ question.isHidden ? 'Étudiant anonyme' : (questionStore.getAccount(question.userId)?.name || 'Étudiant de la communauté') }}</span><span class="dot">·</span><span>Il y a {{ question.id === 1 ? '2 h' : question.id === 2 ? '5 h' : 'hier' }}</span></div>
      </RouterLink>
    </section>
    <div v-else class="empty-state"><span>⌕</span><h3>Aucune question trouvée</h3><p>Essayez un autre mot-clé ou retirez un filtre.</p></div>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--coral); font-size: .7rem; font-weight: 800; letter-spacing: .14em; }
.forum-hero { align-items: end; display: flex; justify-content: space-between; margin-bottom: 3rem; }
h1 { font-family: Georgia, serif; font-size: clamp(3rem, 6vw, 5rem); line-height: .94; margin: 1rem 0 1.25rem; }
h1 em { color: var(--coral); font-weight: normal; }
.forum-hero p { color: var(--muted); font-size: 1rem; }
.hero-note { background: var(--mint); border-radius: 50% 50% 5px 50%; display: flex; flex-direction: column; height: 154px; justify-content: center; padding: 1.5rem; transform: rotate(4deg); width: 154px; }
.hero-note > * { transform: rotate(-4deg); }.note-icon { color: var(--coral); font-size: 1.4rem; }.hero-note strong { font-family: Georgia, serif; font-size: 1rem; }.hero-note small { color: var(--muted); font-size: .68rem; line-height: 1.25; margin-top: .25rem; }
.toolbar { align-items: center; border-bottom: 1px solid var(--line); border-top: 1px solid var(--line); display: flex; gap: 1rem; padding: 1.1rem 0; }
.search-box { align-items: center; background: white; border: 1px solid var(--line); border-radius: 5px; display: flex; flex: 1; max-width: 310px; padding-left: .8rem; }.search-box span { color: var(--muted); font-size: 1.3rem; }.search-box input { background: transparent; border: 0; padding: .6rem; }.search-box input:focus { box-shadow: none; }
.tag-filters { display: flex; gap: .35rem; overflow-x: auto; }.tag-filters button { background: transparent; border: 0; border-radius: 20px; color: var(--muted); cursor: pointer; font-size: .75rem; padding: .55rem .8rem; white-space: nowrap; }.tag-filters button.active { background: var(--ink); color: white; }
.toolbar select { background: transparent; border: 0; color: var(--muted); font-size: .75rem; margin-left: auto; width: auto; }
.my-questions-panel { background: var(--surface-soft); border: 1px solid var(--line); border-radius: 8px; margin-top: 2rem; padding: 1.4rem; }.my-heading { margin: 0 0 1rem; }.my-questions-panel .question-list { gap: .6rem; }.own-question-card { background: var(--surface); }.new-count { background: var(--coral); border-radius: 20px; color: #fff; font-size: .7rem; font-weight: 800; padding: .35rem .65rem; }.new-response { align-items: center; color: var(--coral-dark); display: inline-flex; font-size: .7rem; font-weight: 800; gap: .35rem; }.new-dot { background: var(--coral); border-radius: 50%; display: inline-block; height: 7px; width: 7px; }
.section-heading { align-items: end; display: flex; justify-content: space-between; margin: 3rem 0 1.25rem; } h2 { font-family: Georgia, serif; font-size: 1.8rem; margin-top: .35rem; }.result-count { color: var(--muted); font-size: .75rem; }
.question-list { display: grid; gap: .8rem; }.question-card { background: var(--surface); border: 1px solid var(--line); border-radius: 7px; color: inherit; padding: 1.45rem 1.6rem; transition: border-color .2s, transform .2s, box-shadow .2s; }.question-card:hover { border-color: var(--coral); box-shadow: var(--shadow); transform: translateY(-2px); }.question-top, .question-meta { align-items: center; display: flex; }.question-top { justify-content: space-between; }.tag { background: #fff1ed; border-radius: 4px; color: var(--coral); font-size: .68rem; font-weight: 800; padding: .3rem .55rem; }.response-count { color: var(--muted); font-size: .7rem; }.response-count b { color: var(--coral); font-size: 1rem; margin-left: .35rem; }.question-card h3 { font-family: Georgia, serif; font-size: 1.25rem; margin: 1.1rem 0 .35rem; }.question-card p { color: var(--muted); font-size: .83rem; }.question-meta { color: var(--muted); font-size: .7rem; gap: .45rem; margin-top: 1.3rem; }.mini-avatar { align-items: center; background: var(--yellow); border-radius: 50%; color: var(--ink); display: inline-flex; font-size: .65rem; font-weight: 800; height: 24px; justify-content: center; width: 24px; }.dot { color: var(--line); }.empty-state { border: 1px dashed var(--line); margin-top: 2rem; padding: 4rem; text-align: center; }.empty-state span { color: var(--coral); font-size: 2rem; }.empty-state h3 { font-family: Georgia, serif; margin: .5rem 0; }.empty-state p { color: var(--muted); font-size: .85rem; }
@media (max-width: 760px) { .forum-hero { align-items: start; gap: 1.5rem; }.hero-note { flex: 0 0 120px; height: 120px; padding: 1rem; width: 120px; }.toolbar { align-items: stretch; flex-direction: column; }.search-box { max-width: none; }.toolbar select { margin-left: 0; }.section-heading { margin-top: 2rem; } }
</style>
