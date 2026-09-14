<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuestionStore } from '../stores/questionStore'

const questionStore = useQuestionStore()
const selectedParticipantId = ref(questionStore.conversations[0]?.participantId || questionStore.accounts.find((account) => account.id !== questionStore.currentUserId)?.id || 0)
const draft = ref('')

const contacts = computed(() => questionStore.accounts.filter((account) => account.id !== questionStore.currentUserId))
const selectedContact = computed(() => questionStore.getAccount(selectedParticipantId.value))
const activeConversation = computed(() => questionStore.conversations.find((conversation) => conversation.participantId === selectedParticipantId.value))

function sendMessage() {
  const content = draft.value.trim()
  if (!content || !selectedContact.value) return
  questionStore.sendPrivateMessage(selectedContact.value.id, content)
  draft.value = ''
}
</script>

<template>
  <div class="messages-page">
    <section class="messages-heading">
      <div>
        <span class="eyebrow">ESPACE PRIVÉ</span>
        <h1>Vos messages.</h1>
        <p>Échangez directement avec un membre de la communauté.</p>
      </div>
      <span class="message-mark">✉</span>
    </section>

    <section class="messages-layout">
      <aside class="contacts-panel" aria-label="Conversations">
        <div class="panel-heading"><h2>Conversations</h2><span>{{ contacts.length }}</span></div>
        <button v-for="contact in contacts" :key="contact.id" class="contact-button" :class="{ active: selectedParticipantId === contact.id }" type="button" @click="selectedParticipantId = contact.id">
          <span class="contact-avatar">{{ contact.initials }}</span>
          <span class="contact-copy"><strong>{{ contact.name }}</strong><small>{{ questionStore.conversations.find((conversation) => conversation.participantId === contact.id)?.messages.at(-1)?.content || 'Démarrer une conversation' }}</small></span>
        </button>
      </aside>

      <section v-if="selectedContact" class="conversation-panel" aria-label="Conversation privée">
        <header class="conversation-header"><span class="contact-avatar large">{{ selectedContact.initials }}</span><div><h2>{{ selectedContact.name }}</h2><span>Conversation privée</span></div></header>
        <div class="message-list">
          <p v-if="!activeConversation?.messages.length" class="empty-conversation">Cette conversation est vide. Envoyez le premier message.</p>
          <article v-for="message in activeConversation?.messages" :key="message.id" class="message" :class="{ mine: message.senderId === questionStore.currentUserId }">
            <p>{{ message.content }}</p><time>{{ message.sentAt }}</time>
          </article>
        </div>
        <form class="message-form" @submit.prevent="sendMessage">
          <label class="sr-only" for="private-message">Votre message</label>
          <textarea id="private-message" v-model="draft" rows="2" placeholder="Écrire un message..." @keydown.enter.exact.prevent="sendMessage"></textarea>
          <button class="send-button" type="submit" :disabled="!draft.trim()" aria-label="Envoyer le message">→</button>
        </form>
      </section>
    </section>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--coral); font-size: .7rem; font-weight: 800; letter-spacing: .14em; }
.messages-heading { align-items: end; display: flex; justify-content: space-between; margin-bottom: 2.5rem; }.messages-heading h1 { font-family: Georgia, serif; font-size: clamp(2.6rem, 5vw, 4.5rem); line-height: .95; margin: .85rem 0 .75rem; }.messages-heading p { color: var(--muted); }.message-mark { color: var(--coral); font-size: 4rem; transform: rotate(-10deg); }
.messages-layout { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; display: grid; grid-template-columns: 280px 1fr; min-height: 540px; overflow: hidden; }.contacts-panel { background: var(--surface-soft); border-right: 1px solid var(--line); padding: 1.25rem; }.panel-heading { align-items: center; display: flex; justify-content: space-between; margin-bottom: 1rem; }.panel-heading h2, .conversation-header h2 { font-family: Georgia, serif; font-size: 1.3rem; }.panel-heading span { color: var(--muted); font-size: .75rem; }
.contact-button { align-items: center; background: transparent; border: 0; border-radius: 6px; cursor: pointer; display: flex; gap: .7rem; padding: .75rem; text-align: left; width: 100%; }.contact-button:hover, .contact-button.active { background: var(--surface); }.contact-avatar { align-items: center; background: var(--yellow); border-radius: 50%; display: inline-flex; flex: 0 0 38px; font-size: .7rem; font-weight: 800; height: 38px; justify-content: center; width: 38px; }.contact-copy { display: flex; flex-direction: column; min-width: 0; }.contact-copy strong { font-size: .8rem; }.contact-copy small { color: var(--muted); font-size: .68rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.conversation-panel { display: flex; flex-direction: column; min-width: 0; }.conversation-header { align-items: center; border-bottom: 1px solid var(--line); display: flex; gap: .8rem; padding: 1.25rem 1.5rem; }.contact-avatar.large { background: var(--mint); }.conversation-header span:last-child { color: var(--muted); font-size: .72rem; }.message-list { display: flex; flex: 1; flex-direction: column; gap: .8rem; overflow-y: auto; padding: 1.5rem; }.message { align-self: flex-start; max-width: 70%; }.message p { background: var(--surface-soft); border-radius: 4px 12px 12px 12px; padding: .7rem .9rem; }.message time { color: var(--muted); display: block; font-size: .65rem; margin-top: .25rem; }.message.mine { align-self: flex-end; text-align: right; }.message.mine p { background: var(--mint); border-radius: 12px 4px 12px 12px; }.empty-conversation { color: var(--muted); font-size: .85rem; margin: auto; text-align: center; }.message-form { align-items: end; border-top: 1px solid var(--line); display: flex; gap: .7rem; padding: 1rem 1.5rem; }.message-form textarea { background: #fcfcf9; border: 1px solid var(--line); border-radius: 5px; outline: none; padding: .7rem .8rem; resize: none; width: 100%; }.message-form textarea:focus { border-color: var(--green); box-shadow: 0 0 0 3px var(--mint); }.send-button { background: var(--ink); border: 0; border-radius: 5px; color: white; cursor: pointer; font-size: 1.3rem; height: 48px; width: 48px; }.send-button:disabled { cursor: not-allowed; opacity: .4; }.sr-only { height: 1px; margin: -1px; overflow: hidden; position: absolute; width: 1px; clip: rect(0, 0, 0, 0); }
@media (max-width: 680px) { .messages-heading { align-items: start; }.message-mark { font-size: 2.5rem; }.messages-layout { grid-template-columns: 1fr; }.contacts-panel { border-bottom: 1px solid var(--line); border-right: 0; }.contact-button { display: inline-flex; width: auto; }.contacts-panel { overflow-x: auto; white-space: nowrap; }.panel-heading { margin-bottom: .4rem; }.conversation-panel { min-height: 430px; }.message { max-width: 85%; } }
</style>