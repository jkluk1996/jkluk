<template>
  <div
    :class="classObject"
    class="carousel"
    @mousemove="handleOver"
    @mouseleave="handleOut"
    @click.prevent="handleClick">

    <transition
      mode="in-out"
      name="carousel-fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @enter-cancelled="cancelledEnter"
      @before-leave="beforeLeave"
      @leave="leave">

      <div
        v-if="slide"
        v-bind="slide"
        :key="slide.id"
        class="carousel__slide">

        <media
          v-bind="slide"
          class="carousel__media"
          @av-hover="avHover"
          @av-out="avOut"/>

      </div>
    </transition>

    <button
      v-if="!single"
      v-show="hover === 'left'"
      ref="previousCur"
      class="carousel__arrow text-lg md:text-xl link lineheight-sm">
      <span>&lt;</span>
    </button>

    <button
      v-if="!single"
      v-show="hover === 'right'"
      ref="nextCur"
      class="carousel__arrow text-lg md:text-xl link lineheight-sm">
      <span>&gt;</span>
    </button>
    <loader v-if="$store.state.loading"/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import imagesLoaded from 'imagesloaded'
import Hammer from 'hammerjs'
import EventBus from '@/event-bus'
import Media from './Media.vue'
import Loader from './Loader.vue'

export default {
  name: 'Carousel',

  components: {
    Media,
    Loader
  },

  props: {
    slides: {
      default () { return [] },
      type: Array
    },
    single: {
      default: true,
      type: Boolean
    },
    direction: {
      default: 'forward',
      type: String
    },
    projectCount: {
      default: 1,
      type: Number
    }
  },

  data () {
    return {
      media: null,
      initialized: false,
      transitioning: false,
      height: 0,
      index: (this.direction === 'forward') ? 0 : this.slides.length - 1,
      hover: null,
      avHovering: false,
      touching: false,
      touchTimer: null,
      hammer: null
    }
  },

  computed: {
    classObject () {
      return {
        'carousel--single': this.single
      }
    },

    total () {
      return this.slides.length
    },

    slide () {
      return this.slides[this.index] || null
    },

    hasPrevious () {
      return this.index - 1 >= 0
    },

    hasNext () {
      return this.index + 1 < this.total
    }
  },

  watch: {
    slides: 'reset'
  },

  mounted () {
    this.hammer = new Hammer.Manager(this.$el)
    this.hammer.add(new Hammer.Tap())
    this.hammer.add(new Hammer.Swipe({
      direction: Hammer.DIRECTION_HORIZONTAL,
      threshold: 50
    }))
    this.hammer.on('tap', this.handleTap)
    this.hammer.on('swipe', this.handleSwipe)
    document.addEventListener('keyup', this.handleKeyup)
    EventBus.$on('resize', this.resize)
  },

  beforeDestroy () {
    this.hammer.off('tap', this.handleTap)
    this.hammer.off('swipe', this.handleSwipe)
    this.hammer.destroy()
    document.removeEventListener('keyup', this.handleKeyup)
    EventBus.$off('resize', this.resize)
  },

  methods: {
    async delay (time = 250) {
      await new Promise(resolve => setTimeout(resolve, time))
    },

    beforeEnter (el) {
      this.$store.dispatch('startLoading')

      this.transitioning = true

      if (this.initialized) {
        el.style.opacity = '0'
        el.style.position = 'absolute'
        el.style.top = '0'
      }
    },

    async enter (el, done) {
      const image = el.querySelector('.image')
      const video = el.querySelector('.video')

      if (image) {
          this.media = image
          await new Promise(resolve => { imagesLoaded(image, resolve) })
      } else if (video) {
          this.media = video
          await new Promise(resolve => {
            video.addEventListener('loadedmetadata', resolve, { once: true })
          })
      }

      await this.delay(0)
      this.setHeight()
      done()
    },

    async afterEnter (el) {
      if (this.initialized) {
        this.fadeIn(el)
      } else {
        this.initialize()
      }

      this.transitioning = false

      this.$store.dispatch('stopLoading')
    },

    cancelledEnter () {
      this.transitioning = false
    },

    beforeLeave (el) {
      el.style.position = 'absolute'
      el.style.zIndex = '2'
    },

    leave (el) {
      el.style.opacity = '0'
    },

    setHeight () {
      const mediaHeight = this.media.scrollHeight

      if (this.height !== mediaHeight) {
        this.$el.style.height = `${mediaHeight}px`
        this.height = mediaHeight
      }
    },

    fadeIn (el) {
      el.style.opacity = '1'
      el.style.position = 'static'
      el.style.zIndex = '1'
      el.style.top = 'auto'
    },

    hasCursors () {
      return this.$refs.nextCur && this.$refs.previousCur
    },

    handleClick (e) {
      const x = e.pageX - this.$el.offsetLeft
      const width = this.$el.clientWidth

      if (x > width / 2) {
        // clicked right side
        this.next()
      } else {
        // clicked left side
        this.previous()
      }
    },

    handleOver (e) {
      if (this.avHovering || this.touching || !this.hasCursors()) {
        return
      }

      const width = this.$el.clientWidth
      const left = this.$el.offsetLeft
      const x = e.pageX - left

      if (x > width / 2) {
        // hovered over right side
        this.moveCursor(e, this.$refs.nextCur)
        this.hover = 'right'
      } else {
        // hovered over left side
        this.moveCursor(e, this.$refs.previousCur)
        this.hover = 'left'
      }
    },

    handleOut () {
      this.hover = null
    },

    handleKeyup (e) {
      const key = e.key || e.keyCode
      if (key === 'ArrowLeft' || key === 37) this.previous()
      if (key === 'ArrowRight' || key === 39) this.next()
    },

    moveCursor (e, cur) {
      const rect = this.$el.getBoundingClientRect()
      const scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

      cur.style.left = `${e.pageX - rect.left}px`
      cur.style.top = `${(e.pageY - scroll) - rect.top}px`
    },

    handleTouch () {
      this.handleOut()
      this.touching = true
      if (this.touchTimer) {
        clearTimeout(this.touchTimer)
        this.touchTimer = null
      }
      this.touchTimer = setTimeout(() => { this.touching = false }, 1000)
    },

    handleSwipe: debounce(function (e) {
      this.handleTouch()
      if (e.direction === Hammer.DIRECTION_LEFT) {
        this.next()
      } else if (e.direction === Hammer.DIRECTION_RIGHT) {
        this.previous()
      }
      e.preventDefault()
    }, 150),

    handleTap (e) {
      if (e.pointerType !== 'mouse') this.handleTouch()
    },

    next () {
      if (this.transitioning) return

      if (this.hasNext) {
        this.index++
      } else {
        this.$emit('end', 'forward')
      }

      if (this.hasCursors()) {
        this.$refs.nextCur.classList.add('is-active')
        setTimeout(() => {
          this.$refs.nextCur.classList.remove('is-active')
        }, 300)
      }
    },

    previous () {
      if (this.transitioning) return

      if (this.hasPrevious) {
        this.index--
      } else {
        this.$emit('end', 'backward')
      }

      if (this.hasCursors()) {
        this.$refs.previousCur.classList.add('is-active')
        setTimeout(() => {
          this.$refs.previousCur.classList.remove('is-active')
        }, 300)
      }
    },

    initialize () {
      this.initialized = true
      this.$emit('initialized')
    },

    async resize () {
      if (this.media) {
        this.$el.style.height = 'auto'
        await this.delay(0)
        this.setHeight()
      }
    },

    reset () {
      this.index = (this.direction === 'forward') ? 0 : this.slides.length - 1
      this.avHovering = false
    },

    avHover () {
      this.avHovering = true
    },

    avOut () {
      this.avHovering = false
    }
  }
}
</script>

<style>
.carousel {
  cursor: none;
  overflow: hidden;
  position: relative;
  transition: height 0.25s ease-in-out;
}

.carousel--single {
  cursor: default;
}

.carousel__slide {
  will-change: opacity;
  text-align: center;
  width: 100%;
}


.carousel__media {
    display: block;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%
}

.carousel__media {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: auto
}

.carousel__arrow {
  pointer-events: none;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.33s;
  transition-timing-function: ease-in-out;
}
</style>
