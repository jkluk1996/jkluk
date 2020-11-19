<template>
  <div :class="classObject"
    class="app flex flex-column"
    v-bind:style="styleChosen">
    <header class="heading pb-sm flex">
      <div class="flex-grow">
      <p class="inline-block">
        <router-link to="/">
          <h2 class="link">Jacky Luk</h2>
        </router-link> &nbsp;
        is a Graphic Designer &#38; Illustrator based in Vancouver, BC. Their work includes
      &nbsp;
      <!-- <div>
        <p>Graphic Designer &#38; Illustrator</p>
      </div> -->
      <!-- <a
        :href="link.url"
        class="link inline-block"
        target="_blank"
        rel="noopener">
        {{ Contact }}
      </a> -->

      <router-link
        v-for="(category, i) in $store.state.pages.categories"
        :to="{ name: 'projects', params: { category_slug: category.slug, project_slug: category.first } }"
        :key="category.slug"
        class="inline-block pr-sm">
        <template v-if="i + 1 == $store.state.pages.categories.length">and</template> &nbsp;
        <span class="link">{{ category.title }}</span>
        <template v-if="i + 1 < $store.state.pages.categories.length">,</template>
        <template v-else>.</template>
      </router-link>They can be contacted via
        <a href="mailto:hi@jackyl.uk"
          class="link inline-block"
          target="_blank"
          rel="noopener">
            Email
        </a> or 
        <a
          href="mailto:hi@jackyl.uk"
          class="link inline-block"
          target="_blank"
          rel="noopener">
          Instagram
        </a>.
      </p>
  </div>


      <aside id="options">
        <section>
          <div class="label"> Typeface </div>
          <div class="option"
            v-bind:style="isSelected.Type.A"
            @click="changeType('A')">
            <span>A</span>
          </div>
          <div class="option"
          v-bind:style="isSelected.Type.B"
          @click="changeType('B')">
            <span>B</span>
          </div>
          <div class="option"
          v-bind:style="isSelected.Type.C"
          @click="changeType('C')">
            <span >C</span>
          </div>
          <div class="option"
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
          <div class="danceOption"
          v-bind:style="isSelected.Dance.N"
          @click="changeDance()">
            <span style="padding-bottom: 12px;">☺️</span>
          </div>
          <!-- <div class="option"
          v-bind:style="isSelected.Dance.Y"
          @click="changeDance('Y')">
            <span >Y</span>
          </div> -->
        </section>
      </aside>
    </header>

    <!-- <section class="section pb-md md:pb-2xl">
      <header class="heading">
        <router-link
          v-for="(category, i) in $store.state.pages.categories"
          :to="{ name: 'projects', params: { category_slug: category.slug, project_slug: category.first } }"
          :key="category.slug"
          class="inline-block pr-sm">
          <span class="link">{{ category.title }}</span><template v-if="i + 1 < $store.state.pages.categories.length">,</template>
        </router-link>
      </header>

    </section> -->

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
    <!-- <projects/> -->
    <div id="projects">
        <expandable :scroll-to="'#projects'">
          <router-view name="projects"/>
        </expandable>
      </div>

    <!-- <transition name="fade">
      <section class="section relative flex-1" v-if="isHidden">
        <footer class="inline-block bottomright" v-if="selectedImage">
          <img :src="selectedImage" class="fitimage">
        </footer>
      </section>
  </transition> -->
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  import EventBus from '@/event-bus'
  import Expandable from './components/Expandable.vue'
  // import Projects from './views/Projects.vue'
  // import Info from './components/Info.vue'

  export default {
    name: 'App',

    metaInfo: {
      titleTemplate: title => {
        return title ? `${title} | Jacky Luk` : 'Jacky Luk'
      }
    },

    components: {
      Expandable,
      // Info,
      // Projects
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
          backgroundColor: '#f1f1f1',
          fontFamily: 'NeueHaasGrotesk',
          fontSize: '12px'
        },
        type: 'A',
        dance: false,
        isSelected : {
          Color : {
            A: {
              backgroundColor: "#212121",
              color: "#f1f1f1"
            },
            B: null,
            C: null,
            D: null
          },
          Type : {
            A: {
              backgroundColor: "#212121",
              color: "#f1f1f1"
            },
            B: null,
            C: null,
            D: null
          },
          Dance: {
            N: {
              backgroundColor: "#f1f1f1",
              color: "#212121"
            },
            Y: null
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
      // this.isSelected.Type.A = this.selectedStyle();
      // this.isSelected.Type.B = this.unselectedStyle();
      // this.isSelected.Type.C = this.unselectedStyle();
      // this.isSelected.Type.D = this.unselectedStyle();

      // this.isSelected.Color.A = this.selectedStyle();
      // this.isSelected.Color.B = this.unselectedStyle();
      // this.isSelected.Color.C = this.unselectedStyle();
      // this.isSelected.Color.D = this.unselectedStyle();
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
      selectedStyle () {
        return {
          color: this.styleChosen.backgroundColor,
          backgroundColor: this.styleChosen.color
        }
      },
      unselectedStyle () {
        return {
          color: this.styleChosen.color,
          backgroundColor:this.styleChosen.backgroundColor
        }
      },
      changeType (type) {
        if (type =="A") {
          this.type = 'A';
          this.styleChosen.fontFamily = 'NeueHaasGrotesk';
          this.isSelected.Type.A = this.selectedStyle();
          this.isSelected.Type.B = this.unselectedStyle();
          this.isSelected.Type.C = this.unselectedStyle();
          this.isSelected.Type.D = this.unselectedStyle();
        }
        else if (type =="B") {
          this.type = 'B';
          this.styleChosen.fontFamily = 'CourierPrime';
          this.isSelected.Type.A = this.unselectedStyle();
          this.isSelected.Type.B = this.selectedStyle();
          this.isSelected.Type.C = this.unselectedStyle();
          this.isSelected.Type.D = this.unselectedStyle();
        }
        else if (type =="C") {
          this.type = 'C';
          this.styleChosen.fontFamily = 'Garamond';
          this.isSelected.Type.A = this.unselectedStyle();
          this.isSelected.Type.B = this.unselectedStyle();
          this.isSelected.Type.C = this.selectedStyle();
          this.isSelected.Type.D = this.unselectedStyle();
        }
        else {
          this.type = 'D';
          this.isSelected.Type.A = this.unselectedStyle();
          this.isSelected.Type.B = this.unselectedStyle();
          this.isSelected.Type.C = this.unselectedStyle();
          this.isSelected.Type.D = this.selectedStyle();
        }
      },
      changeColor (color) {
        if (color =="A") {
          this.styleChosen.color = "#212121";
          this.styleChosen.backgroundColor = "#f1f1f1";
          this.isSelected.Color.A = this.selectedStyle();
          this.isSelected.Color.B = this.unselectedStyle();
          this.isSelected.Color.C = this.unselectedStyle();
          this.isSelected.Color.D = this.unselectedStyle();
        }
        else if (color =="B") {
          this.styleChosen.color = "#f1f1f1";
          this.styleChosen.backgroundColor = "#212121";
          this.isSelected.Color.A = this.unselectedStyle();
          this.isSelected.Color.B = this.selectedStyle();
          this.isSelected.Color.C = this.unselectedStyle();
          this.isSelected.Color.D = this.unselectedStyle();
        }
        else if (color =="C") {
          this.styleChosen.color = "#f45b5b";
          this.styleChosen.backgroundColor = "#f1f1f1";
          this.isSelected.Color.A = this.unselectedStyle();
          this.isSelected.Color.B = this.unselectedStyle();
          this.isSelected.Color.C = this.selectedStyle();
          this.isSelected.Color.D = this.unselectedStyle();
        }
        else {
          this.isSelected.Color.A = this.unselectedStyle();
          this.isSelected.Color.B = this.unselectedStyle();
          this.isSelected.Color.C = this.unselectedStyle();
          this.isSelected.Color.D = this.selectedStyle();
        }
        this.changeType(this.type)
        this.changeDance(this.dance)
      },
      changeDance (dance) {
        if (this.dance) {
          this.dance = false;
          this.isSelected.Dance.N = this.unselectedStyle();
        }
        else {
          this.dance = true;
          this.isSelected.Dance.N = this.selectedStyle();
          // this.isSelected.Dance.Y = this.selectedStyle();
        }
      },
    }
  }
</script>



