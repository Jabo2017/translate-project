import Vue from 'vue'
import Router from 'vue-router'
import Translate from '@/components/Translate'
import TranslateOut from '@/components/TranslateOut'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Translate',
      component: Translate,
      children:[
      	{
      		path:"/translated",
      		name:'Translated',
      		component:TranslateOut
      	}
      ]
    }
  ]
})
