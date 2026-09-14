import type PrivateMessage from './privateMessage'

export default interface Conversation {
  id: number
  participantId: number
  messages: PrivateMessage[]
}