<template>
  <ul class="text-lg leading-tight md:text-xl">
    <li
      v-for="link in links"
      :key="link.label">
      <a
        :href="link.url"
        class="link inline-block"
        target="_blank"
        rel="noopener">
        {{ link.label }}
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Contact',

  data () {
    return {
      links: this.$store.state.pages.contact.links
    }
  },

  mounted () {
    this.$nextTick(() => { this.$emit('initialized') })
  }
}
</script>
