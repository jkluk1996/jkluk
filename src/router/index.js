import Vue from 'vue'
import VueRouter from 'vue-router'
import Projects from './../views/Projects.vue'
import Misc from './../views/Misc.vue'
import store from './../store/index.js'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home/first', alias :'/test' },
  {
    path: '/information',
    name: 'information',
    components: {
        misc: Misc
    },
    props: {
        misc: {
            page_title: 'Information',
            page_slug: 'information'
        }
    }
  },
  {
    path: '/contact',
    name: 'contact',
    components: {
        misc: Misc
    },
    props: {
        misc: {
            page_title: 'Contact',
            page_slug: 'contact'
        }
    }
  },
  {
    path: '/dance',
    name: 'dance',
    components: {
        misc: Misc
    },
    props: {
        misc: {
            page_title: 'Dance',
            page_slug: 'dance'
        }
    }
  },
  {
    path: '/:category_slug/:project_slug?',
    name: 'projects',
    components: {
        projects: Projects
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    if (Object.keys(store.state.pages).length) {
        next()
    } else {
        store.dispatch('getPages').then(next)
    }
})

export default router
