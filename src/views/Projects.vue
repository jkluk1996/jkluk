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
          class="flex-auto flex-grow flex-no-shrink w-full md:min-w-220">
          <div class="flex flex-wrap">
            <!-- <h1 class="pr-md" v-html="project.date"/> -->
            <h1 class="pr-sm flex-grow">{{this.index + 1}}/{{projects.length}}</h1>
            <!-- <h1 class="pr-sm flex-grow">{{ project.title }}</h1> -->
            <!-- <div class="pr-sm flex-grow" v-if="project.extra">Team: {{ project.extra }}</div> -->
            <nav
              v-if="!single"
              class="flex-no-grow flex-no-shrink">
              <button
                class="btn -mt-4 md:-mt-12 link lineheight-sm mr-sm md:mr-md"
                @click="handlePrevious">
                <span>&lt;</span>
              </button>

              <button
                class=" btn -mt-4 ml-sm md:-mt-12 link lineheight-sm"
                @click="handleNext">
                <span>&gt;</span>
              </button>
            </nav>
          </div>
          <div class="align-center" v-if="project.extra">Team: {{ project.extra }}</div>
          <!-- <div
            class="rich-text"
            v-html="category.description"/> -->
        </div>
      </div>

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
    // TODO ingoreing this cause calling fetchData twice
    this.fetchData()
  },

  methods: {
    async fetchData () {
      const categorySlug = this.$route.params.category_slug
      const projectSlug = this.$route.params.project_slug
      var category = this.$store.getters.category(categorySlug);

      if (!category) {
        console.error('category not found')
        return
      }

      // if (categorySlug != "home") {
      //   var category = this.$store.getters.category(categorySlug);
      // }
      // else {
      //   var category = {
      //     first : "first"
      //   }
      // }

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

      var newtop = document.getElementById('projects').offsetTop;
      window.scrollTo({ top: newtop, behavior: 'smooth' })
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
