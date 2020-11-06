<template>
  <div :class="classObject">
    <transition
      name="expand"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave">
      <slot/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Expandable',

  props: {
    scrollTo: {
      default: null,
      type: String
    }
  },

  data () {
    return {
      expanded: false
    }
  },

  computed: {
    classObject () {
      return {
        'is-expanded': this.expanded
      }
    }
  },

  methods: {
    async delay (time = 250) {
      await new Promise(resolve => setTimeout(resolve, time))
    },

    enter (el) {
      el.style.height = '100vh'
      el.style.opacity = 1
    },

    async afterEnter (el) {
      const $child = this.$children[0]
      const ready = $child.ready
      this.scroll()
      if (ready || ready === undefined) {
        this.fit(el)
      } else {
        await new Promise(resolve => { $child.$once('ready', resolve) })
        this.fit(el)
      }
      await this.delay(0)
      this.expanded = true
      Promise.resolve()
    },

    beforeLeave (el) {
      el.style.height = getComputedStyle(el).height
    },

    async leave (el, done) {
      await this.delay()
      await new Promise(resolve => {
        el.addEventListener('transitionend', resolve, { once: true })
        el.style.height = 0
      })
      await this.delay(0)
      return done()
    },

    afterLeave () {
      this.expanded = false
    },

    async fit (el) {
      await this.delay(0)
      el.style.height = 'auto'
      Promise.resolve()
    },

    async scroll () {
      if (this.scrollTo) {
        const target = document.querySelector(this.scrollTo)
        await this.delay()
        if (target) {
          window.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
          })
        }
      }
      Promise.resolve()
    }
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition-duration: .4s;
  transition-property: opacity, height;
  transition-timing-function: linear;
  overflow: hidden;
}

.expand-enter {
  height: 0;
  opacity: 0;
}
</style>
