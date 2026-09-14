import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'Connection',
      component: () => import('../views/ConnectionPageView.vue')
    },
    {
      path: '/forum',
      name: 'Forum',
      component: () => import('../views/ForumView.vue')
    },
    {
      path: '/messages',
      name: 'Messages',
      component: () => import('../views/PrivateMessagesView.vue')
    },
    {
      path: '/selected-question',
      name: 'Question',
      component: () => import('../views/SelectedQuestionView.vue')
    },
    {
      path: '/create-question',
      name: 'CreateQuestion',
      component: () => import("../views/CreateQuestionPage.vue")
    }
  ]
  
  export default routes