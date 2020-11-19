<template>
  <article class="page">
    <header
      ref="header"
      class="heading flex justify-between mt-xs pt-xs pb-md md:mt-md md:pt-md md:pb-xl">
      <div class="flex-1">
        <h2 class="inline-block">{{ title }}</h2>
      </div>

      <div class="flex-no-grow">
        <router-link
          to="/">
          <span class="link link--no-active link--no-transition lineheight-sm">&#215;</span>
        </router-link>
      </div>
    </header>

    <slot/>
  </article>
</template>

<script>
import EventBus from '@/event-bus'

export default {
  name: 'Page',

  props: {
    title: {
      default: '',
      type: String
    }
  },

  mounted () {
    this.resize()
    EventBus.$on('resize', this.resize)
  },

  beforeDestroy () {
    EventBus.$off('resize', this.resize)
  },

  methods: {
    resize () {
      this.$store.commit('SET_HEADER_HEIGHT', this.$refs.header.clientHeight)
    }
  }
}
</script>

<style>
.page .spinner {
  opacity: 0;
}
.is-expanded .page .spinner {
  opacity: 1;
}
</style>
