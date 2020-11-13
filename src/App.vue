<template>
  <div :class="classObject"
    class="app flex flex-column">
    <header class="heading pb-md md:pb-2xl">
      <router-link to="/home">
      <h2
        class="inline-block">Jacky Luk</h2> </router-link>
      <div>
        <p>Graphic Designer</p>
      </div>

      <router-link to="/information">
        Info
      </router-link>
    </header>

    <!-- <ul>
      <li 
          v-for="link in $store.state.pages.home"
          :key="link.url">
        <img
          :src="link.url"
          class="media image"
          alt="">
      </li>

    </ul> -->


    <projects/>

    <!-- <img
    v-for=  in $store.state.pages.home"
    :src="url"
    class="media image"
    alt=""> -->

    <section class="section pb-md md:pb-2xl">
      <header class="heading">
        <router-link
          v-for="(category, i) in $store.state.pages.categories"
          v-if="$route.params.category_slug !== category.slug"
          :to="{ name: 'projects', params: { category_slug: category.slug, project_slug: category.first } }"
          :key="category.slug"
          class="inline-block pr-sm">
          <span class="link">{{ category.title }}</span><template v-if="i + 1 < $store.state.pages.categories.length">,</template>
        </router-link>
      </header>

      <!-- <div id="projects">
        <expandable :scroll-to="'#projects'">
          <router-view name="projects"/>
        </expandable>
      </div> -->
    </section>

    <section class="section pb-md md:pb-2xl">
      <header class="heading">
        <router-link
          v-if="$route.path !== '/information'"
          to="/information"
          class="inline-block pr-sm">
          <span class="link">Information</span>,
        </router-link>

        <router-link
          v-if="$route.path !== '/contact'"
          to="/contact"
          class="inline-block pr-sm">
          <span class="link">Contact</span>,
        </router-link>

        <span class="link inline-block dance" 
              v-on:click="isHidden = !isHidden"
              @click="generate()"
              v-bind:class="{ danceActive: isHidden }">
            Dance
        </span>

      </header>

      <div id="misc">
        <expandable :scroll-to="'#misc'">
          <router-view name="misc"/>
        </expandable>
      </div>
    </section>
    <transition name="fade">
      <section class="section relative flex-1" v-if="isHidden">
        <footer class="inline-block bottomright" v-if="selectedImage">
          <img :src="selectedImage" class="fitimage">
        </footer>
      </section>
  </transition>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  import EventBus from '@/event-bus'
  import Expandable from './components/Expandable.vue'
  import Projects from './views/Projects.vue'

  export default {
    name: 'App',

    metaInfo: {
      titleTemplate: title => {
        return title ? `${title} | Jacky Luk` : 'Jacky Luk'
      }
    },

    components: {
      Expandable,
      Projects
    },

    data () {
      return {
        ready: false,
        isHidden: false,
        images: [
          'https://jkluk.blob.core.windows.net/dancers/dance1.gif',
          'https://jkluk.blob.core.windows.net/dancers/dance2.gif',
          'https://jkluk.blob.core.windows.net/dancers/dance3.gif'
        ],
        imageIndex: -1,
        selectedImage: null
        }
    },

    computed: {
      classObject () {
        return {
          'is-ready': this.ready,
        }
      }
    },

    async beforeCreate () {
      await this.$store.dispatch('getPages')
      this.$nextTick(() => { this.ready = true })
    },

    created () {
      window.addEventListener('resize', this.resize)
      window.addEventListener('orientationchange', this.resize)
      this.resize()
    },

    destroyed () {
      window.removeEventListener('resize')
      window.removeEventListener('orientationchange')
    },

    methods: {
      resize: debounce(function () {
        EventBus.$emit('resize', {
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 250),
      incrementItem (items) {
        this.imageIndex = this.imageIndex + 1
        return items[((this.imageIndex) % items.length)];
      },
      generate () {
        if (this.isHidden == true) {
          this.selectedImage = this.incrementItem(this.images)
        }
      }
    }
  }
</script>



