<template>
  <div :class="classObject"
    class="app flex flex-column"
    v-bind:style="styleChosen">
    <header class="heading pb-md md:pb-2xl">
      <router-link to="/home">
      <h2
        class="inline-block">Jacky Luk</h2> </router-link>
      <div>
        <p>Graphic Designer &#38; Illustrator</p>
      </div>
      <!-- <a
        :href="link.url"
        class="link inline-block"
        target="_blank"
        rel="noopener">
        {{ Contact }}
      </a> -->
      <a
        href="mailto:hi@jackyl.uk"
        class="link inline-block"
        target="_blank"
        rel="noopener">
        Contact
      </a>
      <a
        href="mailto:hi@jackyl.uk"
        class="link inline-block"
        target="_blank"
        rel="noopener">
        Instagram
      </a>


      <aside id="options">
        <section>
          <div class="label"> Font </div>
          <div class="option"
            v-bind:style="isSelected.Type.A"
            @click="changeType('A')">
            <span>A</span>
          </div>
          <div class="false option"
          v-bind:style="isSelected.Type.B"
          @click="changeType('B')">
            <span>B</span>
          </div>
          <div class="false option"
          v-bind:style="isSelected.Type.C"
          @click="changeType('C')">
            <span >C</span>
          </div>
          <div class="false option"
          v-bind:style="isSelected.Type.D"
          @click="changeType('D')">
            <span >D</span>
          </div>
        </section>
        <section>
          <div class="label"> Color </div>
          <div class="option"
            v-bind:style="isSelected.Color.A"
            @click="changeColor('A')">
            <span class="color color-black">B</span>
          </div>
          <div class="option"
            v-bind:style="isSelected.Color.B"
            @click="changeColor('B')">
            <span class="color color-black">W</span>
          </div>
          <div class="option"
            v-bind:style="isSelected.Color.C"
            @click="changeColor('C')">
            <span class="color color-red">R</span>
          </div>
          <div class="option"
            v-bind:style="isSelected.Color.D"
            @click="changeColor('D')">
            <span class="color color-black">?</span>
          </div>
        </section>
        <section>
          <div class="label"> Dance </div>
          <div class="selected option">
            <span class="">N</span>
          </div>
          <div class="false option">
            <span >Y</span>
          </div>
        </section>
      </aside>
    </header>

    <section class="section pb-md md:pb-2xl">
      <header class="heading">
        <router-link
          v-for="(category, i) in $store.state.pages.categories"
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


    <!-- <projects v-if="$route.params.category_slug !== category.slug"/> -->
    <h1 v-if="$route.params.category_slug == 'information'"><router-view name="misc"/></h1> 
    <!-- <div v-else>test</div> -->
    <!-- <projects /> -->
    <projects v-else/>


    <!-- <img
    v-for=  in $store.state.pages.home"
    :src="url"
    class="media image"
    alt=""> -->


    <!-- <section class="section pb-md md:pb-2xl">
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
    </section> -->
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
  // import Expandable from './components/Expandable.vue'
  import Projects from './views/Projects.vue'
  // import Info from './components/Info.vue'

  export default {
    name: 'App',

    metaInfo: {
      titleTemplate: title => {
        return title ? `${title} | Jacky Luk` : 'Jacky Luk'
      }
    },

    components: {
      // Expandable,
      // Info,
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
        selectedImage: null,
        styleChosen: {
          color: '#212121',
          fontSize: '13px'
        },
        selectedStyle: {
          backgroundColor: '#212121',
          color: '#f1f1f1'
        },
        unselectedStyle: {
          backgroundColor: '#f1f1f1',
          color: '#212121'
        },
        isSelected: {
          Type: {
            A: this.selectedStyle,
            B: this.unselectedStyle,
            C: this.unselectedStyle,
            D: this.unselectedStyle
          },
          Color : {
            A: this.selectedStyle,
            B: this.unselectedStyle,
            C: this.unselectedStyle,
            D: this.unselectedStyle
          }
        },
        counter: 0
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
      },
      changeType (type) {
        if (type =="A") {
          this.isSelected.Type.A = this.selectedStyle;
          this.isSelected.Type.B = this.unselectedStyle;
          this.isSelected.Type.C = this.unselectedStyle;
          this.isSelected.Type.D = this.unselectedStyle;
        }
        else if (type =="B") {
          this.isSelected.Type.A = this.unselectedStyle;
          this.isSelected.Type.B = this.selectedStyle;
          this.isSelected.Type.C = this.unselectedStyle;
          this.isSelected.Type.D = this.unselectedStyle;
        }
        else if (type =="C") {
          this.isSelected.Type.A = this.unselectedStyle;
          this.isSelected.Type.B = this.unselectedStyle;
          this.isSelected.Type.C = this.selectedStyle;
          this.isSelected.Type.D = this.unselectedStyle;
        }
        else {
          this.isSelected.Type.A = this.unselectedStyle;
          this.isSelected.Type.B = this.unselectedStyle;
          this.isSelected.Type.C = this.unselectedStyle;
          this.isSelected.Type.D = this.selectedStyle;
        }
      },
      changeColor (color) {
        if (color =="A") {
          this.styleChosen.color = "#212121";
          this.selectedStyle.backgroundColor = this.styleChosen.color;
          this.isSelected.Color.A = this.selectedStyle;
          this.isSelected.Color.B = this.unselectedStyle;
          this.isSelected.Color.C = this.unselectedStyle;
          this.isSelected.Color.D = this.unselectedStyle;
        }
        else if (color =="B") {
          this.isSelected.Color.A = this.unselectedStyle;
          this.isSelected.Color.B = this.selectedStyle;
          this.isSelected.Color.C = this.unselectedStyle;
          this.isSelected.Color.D = this.unselectedStyle;
        }
        else if (color =="C") {
          this.styleChosen.color = "red";
          this.selectedStyle.backgroundColor = this.styleChosen.color;
          this.isSelected.Color.A = this.unselectedStyle;
          this.isSelected.Color.B = this.unselectedStyle;
          this.isSelected.Color.C = this.selectedStyle;
          this.isSelected.Color.D = this.unselectedStyle;
        }
        else {
          this.isSelected.Color.A = this.unselectedStyle;
          this.isSelected.Color.B = this.unselectedStyle;
          this.isSelected.Color.C = this.unselectedStyle;
          this.isSelected.Color.D = this.selectedStyle;
        }
      }
    }
  }
</script>



