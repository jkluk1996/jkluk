<template>
  <page :title="page_title">
    <transition
      appear
      mode="out-in"
      name="fade">
      <component
        :is="page_slug"
        :key="page_slug"
        @initialized="init"/>
    </transition>
  </page>
</template>

<script>
import Page from '../components/Page.vue'
import Information from '../components/Information.vue'
import Contact from '../components/Contact.vue'

export default {
  name: 'Misc',

  metaInfo () {
    return {
      title: this.page_title
    }
  },

  components: {
    Page,
    Information,
    Contact
  },

  props: {
    page_title: {
      default: '',
      type: String
    },
    page_slug: {
      default: '',
      type: String
    }
  },

  data () {
    return {
      ready: false
    }
  },

  methods: {
    init () {
      this.ready = true
      this.$emit('ready')
    }
  }
}
</script>
