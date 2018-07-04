import Vue from 'vue'
import Router from 'vue-router'
import Translate from '@/components/Translate'
import TranslateOut from '@/components/TranslateOut'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '*', //当url不存在 自动跳转到首页
      redirect: '/'
    },
    {
      path: '/',
      name: 'Translate',
      component: Translate,
      children: [{
        path: "/translated/:word/:lang",
        name: 'Translated',
        component: TranslateOut
      }]
    }
  ]
})
