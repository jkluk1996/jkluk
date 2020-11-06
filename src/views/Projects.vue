<template>
  <page :title="category.title">
    <carousel
      ref="carousel"
      :project-count="projects.length"
      :slides="project.media"
      :single="single"
      :direction="direction"
      @initialized="init"
      @end="carouselEnd"/>

    <footer v-show="ready" class="flex pt-md md:pt-sm">
      <div class="flex flex-wrap flex-auto">
        <div
          class="flex-auto flex-grow flex-no-shrink w-full md:min-w-220 pr-md">
          <div class="flex flex-wrap md:text-lg mb-1 md:mb-md">
            <h1 class="pr-sm flex-grow">{{ project.title }}</h1>
            <div class="pr-sm flex-grow" v-if="project.extra">Teammates: {{ project.extra }}</div>
            <h1 class="pr-md" v-html="project.date"/>
          </div>
          <div
            class="rich-text"
            v-html="category.description"/>
        </div>
      </div>

      <nav
        v-if="!single"
        class="flex-no-grow flex-no-shrink">
        <button
          class="-mt-4 text-lg md:-mt-12 md:text-xl link lineheight-sm mr-sm md:mr-md"
          @click="handlePrevious">
          <span>&lt;</span>
        </button>

        <button
          class="-mt-4 ml-sm text-lg md:-mt-12 md:text-xl link lineheight-sm"
          @click="handleNext">
          <span>&gt;</span>
        </button>
      </nav>
    </footer>
  </page>
</template>

<script>
import Page from '../components/Page.vue'
import Carousel from '../components/Carousel.vue'

export default {
  name: 'Projects',

  metaInfo () {
    return {
      title: this.project.title ? this.project.title : ''
    }
  },

  components: {
    Page,
    Carousel
  },

  data () {
    return {
      category: {},
      projects: [],
      project: {},
      direction: 'forward',
      ready: false,
      hover: false
    }
  },

  computed: {
    index () {
      return this.projects.indexOf(this.project) || 0
    },

    single () {
      return this.projects.length === 1
    },

    previous () {
      if (this.index > 0) {
        return this.projects[this.index - 1]
      } else {
        return this.projects[this.projects.length - 1]
      }
    },

    next () {
      if (this.index < this.projects.length - 1) {
        return this.projects[this.index + 1]
      } else {
        return this.projects[0]
      }
    }
  },

  watch: {
    '$route': 'fetchData'
  },

  beforeRouteUpdate (to, from, next) {
    next()
  },

  created () {
    this.fetchData()
  },

  methods: {
    async fetchData () {
      const categorySlug = this.$route.params.category_slug
      const projectSlug = this.$route.params.project_slug
      const category = this.$store.getters.category(categorySlug)

      if (!category) {
        console.error('category not found')
        return
      }

      if (!projectSlug) {
        this.$router.push({
          name: 'projects',
          params: {
            category_slug: categorySlug,
            project_slug: category.first
          }
        })
        return
      }

      const projects = await this.$store.dispatch('getCategoryProjects', categorySlug)
      const project = this.$store.getters.project({ categorySlug, projectSlug })

      if (!project) {
        console.error('project not found')
        return
      }

      this.category = category
      this.projects = projects
      this.project = project
    },

    init () {
      this.ready = true
      this.$emit('ready')
    },

    handlePrevious () {
      if (this.$refs.carousel) this.$refs.carousel.previous()
    },

    handleNext () {
      if (this.$refs.carousel) this.$refs.carousel.next()
    },

    previousProject () {
      this.direction = 'backward'

      this.$router.push({
        name: 'projects',
        params: {
          category_slug: this.previous.category,
          project_slug: this.previous.slug
        }
      })
    },

    nextProject () {
      this.direction = 'forward'

      this.$router.push({
        name: 'projects',
        params: {
          category_slug: this.next.category,
          project_slug: this.next.slug
        }
      })
    },

    carouselEnd (direction) {
      this.direction = direction

      if (this.direction === 'backward') {
        this.previousProject()
      } else {
        this.nextProject()
      }
    }
  }
}
</script>
