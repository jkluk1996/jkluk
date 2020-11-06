<template>
  <div class="loader">
    <div class="loader__spinner">
      <svg viewBox="25 25 50 50">
        <circle
          class="loader__path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="#000"
          stroke-width="5"
          stroke-miterlimit="10"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',

  computed: {
    active () {
      return this.$store.state.loading
    }
  }
}
</script>