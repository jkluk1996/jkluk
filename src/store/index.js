import Vue from 'vue'
import Vuex from 'vuex'
import api from './../api'
// import db from './../../db.json'


Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        pages: {},
        categories: {},
        headerHeight: 0,
        loading: false,
        timers: {}
    },

    getters: {
        category: (state) => (slug) => {
            if (slug) {
                return state.pages.categories.find(category => category.slug === slug)
            } else {
                return null
            }
        },

        project: (state, getters) => ({ categorySlug, projectSlug }) => {
            if (!categorySlug || !projectSlug) return null
            const projects = state.categories[categorySlug]
            if (projects) {
                return projects.find(project => project.slug === projectSlug)
            } else {
                return null
            }
        }
    },

    mutations: {
        SET_PAGES(state, data) {
            Vue.set(state, 'pages', data)
        },
        SET_HEADER_HEIGHT(state, height) {
            state.headerHeight = height
        },
        TIMER_START(state, { timer, delay, cb }) {
            if (!state.timers[timer]) state.timers[timer] = setTimeout(cb, delay)
        },
        TIMER_STOP(state, timer) {
            if (state.timers[timer]) {
                clearTimeout(state.timers[timer])
                state.timers[timer] = null
            }
        },
        LOAD_START(state) {
            state.loading = true
        },
        LOAD_STOP(state) {
            state.loading = false
        }
    },

    actions: {
        async getPages({ state, commit }) {
            // try the store first
            if (Object.keys(state.pages).length) return state.pages
            const { data } = await api().get('/db')
            commit('SET_PAGES', data)
            return data
        },


        async getCategoryProjects({ state }, slug) {
            // try the store first
            const category = state.categories[slug]
            if (category) return category

            const { data } = await api().get(slug)
            Vue.set(state.categories, slug, data)
            return data
        },

        startLoading({ commit }) {
            commit('TIMER_STOP', 'loading')
            commit('TIMER_START', {
                timer: 'loading',
                delay: 1500,
                cb() {
                    commit('LOAD_START')
                }
            })
        },

        stopLoading({ commit }) {
            commit('TIMER_STOP', 'loading')
            commit('TIMER_START', {
                timer: 'loading',
                delay: 500,
                cb() {
                    commit('LOAD_STOP')
                }
            })
        }
    }
})
