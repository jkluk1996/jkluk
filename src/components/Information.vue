<template>
  <div class="text-sm flex flex-wrap">
    <div
      v-if="info"
      class="flex-auto flex-no-shrink min-w-280 w-1/3 pb-1 sm:pr-lg">
      <div
        class="rich-text mb-1"
        v-html="info"/>
        <!-- <img src="../assets/images/2.jpg" style='max-height: 100%; max-width: 100%;'> -->
    </div>

    <div
      v-if="facts"
      class="flex-auto flex-no-shrink min-w-280 w-1/3 pb-1 sm:pr-lg">
      <ul
        
        class="rich-text mb-1 bullets">

        <li
          v-for="fact in facts"
          :key="fact.id"
          class="">{{ fact }}</li>

      </ul>
    </div>


    <div
      v-if="copyright"
      class="flex-auto flex-no-shrink min-w-280 w-1/3 pb-1 sm:pr-lg">
      <div
        v-if="copyright"
        class="rich-text mb-1"
        v-html="copyright"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Information',

  data () {
    return {
      info: this.$store.state.pages.information.info,
      links: this.$store.state.pages.information.links,
      facts: this.$store.state.pages.information.facts,
      copyright: this.$store.state.pages.information.copyright,
    }
  },

  mounted () {
    this.$nextTick(() => { this.$emit('initialized') })
  }
}
</script>
