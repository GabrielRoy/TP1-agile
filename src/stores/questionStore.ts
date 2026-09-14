import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Question from '../scripts/question'
import type Response from '../scripts/response'
import type Conversation from '../scripts/conversation'
import type PrivateMessage from '../scripts/privateMessage'

export interface Account {
  id: number
  username: string
  name: string
  initials: string
}


export const useQuestionStore = defineStore('questionStoreId', () => {
  const accounts: Account[] = [
    { id: 1, username: 'acc1', name: 'Alice Martin', initials: 'AM' },
    { id: 2, username: 'acc2', name: 'Lucas Bernard', initials: 'LB' },
  ]
  const currentUserId = ref(1)
  const seenResponseCounts = ref<Record<number, number>>({})
  const conversations = ref<Conversation[]>([
    {
      id: 1,
      participantId: 2,
      messages: [
        { id: 1, senderId: 2, content: 'Bonjour Alice, merci pour ta réponse sur le forum !', sentAt: '10:24' },
        { id: 2, senderId: 1, content: 'Avec plaisir ! Bon courage pour tes révisions.', sentAt: '10:26' },
      ],
    },
  ])

  const questions = ref<Question[]>([
    {
      id: 1,
      userId: 1,
      title: 'Comment mieux organiser mes révisions ?',
      content: 'Je cherche une méthode simple pour planifier mes révisions avant les examens. Qu’est-ce qui fonctionne pour vous ?',
      tag: 'Méthodologie',
      isHidden: false,
      responses: [
        { content: 'Commence par découper tes objectifs en petites sessions de 25 minutes. La régularité compte plus que la durée.', id: 1, userId: 2 },
      ],
    },
    {
      id: 2,
      userId: 2,
      title: 'Besoin d’aide pour comprendre les crédits ECTS',
      content: 'Je ne comprends pas bien le nombre de crédits nécessaires pour valider mon année. Où puis-je trouver cette information ?',
      tag: 'Administration',
      isHidden: true,
      responses: [],
    },
    {
      id: 3,
      userId: 3,
      title: 'Un bon endroit pour travailler sur le campus ?',
      content: 'La bibliothèque est complète cette semaine. Avez-vous un endroit calme à conseiller pour travailler quelques heures ?',
      tag: 'Vie étudiante',
      isHidden: false,
      responses: [
        { content: 'Le foyer étudiant est généralement calme en début d’après-midi.', id: 2, userId: 4 },
        { content: 'La salle de travail du bâtiment B est ouverte jusqu’à 19 h.', id: 3, userId: 2 },
      ],
    },
  ])

  // Actions
  function addQuestion(newQuestion: Omit<Question, 'id'>) {
    const id =
      questions.value.length > 0 ? questions.value[questions.value.length - 1]!.id + 1 : 1

    questions.value.push({ ...newQuestion, id, responses: newQuestion.responses || [] })
  }

  function addResponse(questionId: number, content: string, userId = currentUserId.value) {
    const question = questions.value.find((item) => item.id === questionId)
    if (!question) return

    const response: Response = {
      id: Date.now(),
      userId,
      content,
    }
    question.responses.push(response)
  }

  function setCurrentUser(username: string) {
    const account = accounts.find((item) => item.username === username)
    if (account) currentUserId.value = account.id
  }

  function getAccount(userId: number) {
    return accounts.find((account) => account.id === userId)
  }

  function getExternalResponseCount(question: Question) {
    return question.responses.filter((response) => response.userId !== currentUserId.value).length
  }

  function hasNewResponses(question: Question) {
    return getExternalResponseCount(question) > (seenResponseCounts.value[question.id] || 0)
  }

  function markResponsesSeen(questionId: number) {
    const question = questions.value.find((item) => item.id === questionId)
    if (!question || question.userId !== currentUserId.value) return
    seenResponseCounts.value[questionId] = getExternalResponseCount(question)
  }

  function sendPrivateMessage(participantId: number, content: string) {
    const message: PrivateMessage = {
      id: Date.now(),
      senderId: currentUserId.value,
      content,
      sentAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }
    let conversation = conversations.value.find((item) => item.participantId === participantId)
    if (!conversation) {
      conversation = { id: Date.now(), participantId, messages: [] }
      conversations.value.push(conversation)
    }
    conversation.messages.push(message)
  }

  return {
    accounts,
    currentUserId,
    questions,
    conversations,
    addQuestion,
    addResponse,
    setCurrentUser,
    getAccount,
    hasNewResponses,
    markResponsesSeen,
    sendPrivateMessage,
  }
})
