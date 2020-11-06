<template>
  <img
    v-if="type === 'image'"
    :src="url"
    class="media image"
    alt="">
  <div
    v-else-if="type === 'video'"
    :class="{ 'video-wrap--clickable': audio }"
    class="media video-wrap"
    @mousemove="handleOver"
    @mouseleave="handleOut"
    @click.prevent="togglePlay">
    <div
      ref="videoWrap"
      class="media video-responsive-wrap">
      <video
        ref="video"
        :muted="!audio"
        :autoplay="!audio"
        :preload="audio ? 'metadata' : 'auto'"
        playsinline
        loop
        class="media video">
        <source
          v-for="source in sources"
          :key="source.id"
          :src="source.url"
          :type="source.type">
      </video>
      <button
        v-if="audio && !playing"
        class="video__play">
        <img
          src="../assets/images/playbutton.svg"
          alt="Play">
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Media',

  props: {
    type: {
      default: '',
      type: String
    },
    url: {
      default: '',
      type: String
    },
    caption: {
      default: '',
      type: String
    },
    size: {
      default () { return {} },
      type: Object
    },
    sources: {
      default () { return [] },
      type: Array
    },
    audio: {
      default: false,
      type: Boolean
    }
  },

  data () {
    return {
      playing: false
    }
  },

  mounted () {
    if (this.type === 'video') {
      const wrap = this.$refs.videoWrap
      const video = this.$refs.video

      video.addEventListener('loadedmetadata', () => {
        const width = video.videoWidth
        const height = video.videoHeight
        const ratio = 100 * (height / width)
        wrap.style.paddingTop = `${ratio}%`
      })
    }
  },

  methods: {
    togglePlay (e) {
      const video = this.$refs.video
      const audio = this.audio

      if (audio) {
        e.stopImmediatePropagation()
      }

      this.playing = !this.playing

      if (this.playing) {
        video.play()
      } else {
        video.pause()
      }
    },

    handleOver () {
      if (this.audio) {
        this.$emit('av-hover')
      }
    },

    handleOut () {
      if (this.audio) {
        this.$emit('av-out')
      }
    },
  }
}
</script>
