<template>
  <div :class="classObject"
    class="app flex flex-column"
    v-bind:style="styleChosen">
    <header class="heading flex pb-lg">
      <transition name="fade">
        <div v-if="this.dance" class="sticky">
          <img :src="danceimage" class="fitimage">
        </div>
      </transition>
      <div class="flex-grow pr-md">
        <p class="inline-block">
          <router-link to="/">
            <h2 class="link">Jacky Luk</h2>
          </router-link> is a Graphic Designer and Illustrator based in Vancouver, BC. My work includes
        &nbsp;
        <router-link
          v-for="(category, i) in $store.state.pages.categories"
          :to="{ name: 'projects', params: { category_slug: category.slug, project_slug: category.first } }"
          :key="category.slug"
          class="inline-block pr-sm">
          <template v-if="i + 1 == $store.state.pages.categories.length">and</template> &nbsp;
          <span class="link">{{ category.title }}</span>
          <template v-if="i + 1 < $store.state.pages.categories.length">,</template>
          <template v-else>.</template>
        </router-link>
        </p>
        <p><br> 

        Get in touch with me at
          <a href="mailto:hi@jackyl.uk"
            class="link inline-block"
            target="_blank"
            rel="noopener">
              hi@jackyl.uk
          </a> or on
          <a
            href="https:\/\/www.instagram.com/jackyl.uk"
            class="link inline-block"
            target="_blank"
            rel="noopener">
            Instagram
          </a>
        </p>
      </div>

      <aside id="options">
        <section>
          <div class="label"> Size </div>
          <div class="flex">
            <div class="option"
              v-bind:style="isSelected.Type.A"
              @click="changeType('A')">
              <span class="optionLetter">A</span>
            </div>
            <div class="option"
            v-bind:style="isSelected.Type.B"
            @click="changeType('B')">
              <span class="optionLetter">B</span>
            </div>
            <div class="option"
            v-bind:style="isSelected.Type.C"
            @click="changeType('C')">
              <span class="optionLetter">C</span>
            </div>
            <div class="option"
            v-bind:style="isSelected.Type.D"
            @click="changeType('D')">
              <span class="optionLetter">D</span>
            </div>
          </div>
        </section>
        <section>
          <div class="label"> Color </div>
          <div class="option"
            v-bind:style="isSelected.Color.A"
            @click="changeColor('A')">
            <span class="optionLetter">B</span>
          </div>
          <div class="option"
            v-bind:style="isSelected.Color.B"
            @click="changeColor('B')">
            <span class="optionLetter">W</span>
          </div>
          <div class="option"
            v-bind:style="isSelected.Color.C"
            @click="changeColor('C')">
            <span class="optionLetter">R</span>
          </div>
          <div class="option"
            v-bind:style="isSelected.Color.D"
            @click="changeColor('D')">
            <span class="optionLetter">V</span>
          </div>
        </section>
        <section>
          <div class="label"> Dance </div>
          <div class="danceOption"
          v-bind:style="isSelected.Dance.N"
          @click="changeDance()">
            <span style="padding-bottom: 1px;">☺️</span>
          </div>
        </section>
      </aside>
    </header>

    <div id="projects">
      <expandable :scroll-to="'#projects'">
        <router-view name="projects"/>
      </expandable>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  import EventBus from '@/event-bus'
  import Expandable from './components/Expandable.vue'

  export default {
    name: 'App',

    metaInfo: {
      titleTemplate: title => {
        return title ? `${title} | Jacky Luk` : 'Jacky Luk'
      }
    },

    components: {
      Expandable
    },

    data () {
      return {
        ready: false,
        danceimage: "https://jkluk.blob.core.windows.net/dancers/dance-black.gif",
        images: null,
        styleChosen: {
          color: '#212121',
          backgroundColor: '#f1f1f1',
          fontSize: '5rem'
        },
        // root: null,
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

    mounted: function() {
        this.root = document.documentElement;
    },

    async beforeCreate () {
      await this.$store.dispatch('getPages')
      this.$nextTick(() => { this.ready = true })
    },

    created () {
      window.addEventListener('resize', this.resize)
      window.addEventListener('orientationchange', this.resize)
      this.resize()
      this.fetchData()
    },

    destroyed () {
      window.removeEventListener('resize')
      window.removeEventListener('orientationchange')
    },

    methods: {
      async fetchData () {
        var category = this.$store.state.pages.dancers;
        this.images = category;
      },
      resize: debounce(function () {
        EventBus.$emit('resize', {
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 250),
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
          this.styleChosen.fontSize = '5rem';
          this.isSelected.Type.A = this.selectedStyle();
          this.isSelected.Type.B = this.unselectedStyle();
          this.isSelected.Type.C = this.unselectedStyle();
          this.isSelected.Type.D = this.unselectedStyle();
        }
        else if (type =="B") {
          this.type = 'B';
          this.styleChosen.fontSize = '6rem';
          this.isSelected.Type.A = this.unselectedStyle();
          this.isSelected.Type.B = this.selectedStyle();
          this.isSelected.Type.C = this.unselectedStyle();
          this.isSelected.Type.D = this.unselectedStyle();
        }
        else if (type =="C") {
          this.type = 'C';
          this.styleChosen.fontSize = '7rem';
          this.isSelected.Type.A = this.unselectedStyle();
          this.isSelected.Type.B = this.unselectedStyle();
          this.isSelected.Type.C = this.selectedStyle();
          this.isSelected.Type.D = this.unselectedStyle();
        }
        else {
          this.type = 'D';
          this.styleChosen.fontSize = '7.5rem';
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
          this.styleChosen.color = "#b6a2f6";
          this.styleChosen.backgroundColor = "#bce8c4";
          this.isSelected.Color.A = this.unselectedStyle();
          this.isSelected.Color.B = this.unselectedStyle();
          this.isSelected.Color.C = this.unselectedStyle();
          this.isSelected.Color.D = this.selectedStyle();
        }
        this.changeType(this.type)
        this.changeDanceStatic(this.dance)
      },
      changeDanceStatic (dance) {
        if (this.dance) {
          this.dance = true;
          this.setDance(this.styleChosen.color)
          this.isSelected.Dance.N = this.selectedStyle();
        }
        else {
          this.dance = false;
          this.isSelected.Dance.N = this.unselectedStyle();
        }
      },
      changeDance (dance) {
        if (this.dance) {
          this.dance = false;
          this.isSelected.Dance.N = this.unselectedStyle();
        }
        else {
          this.dance = true;
          this.setDance(this.styleChosen.color);
          this.isSelected.Dance.N = this.selectedStyle();
        }
      },
      setDance(color) {
        var category = this.$store.state.pages.dancers;
        this.images = category;
        if (color == '#212121') {
          this.danceimage = this.images[0];
        }
        else if (color == '#f1f1f1') {
          this.danceimage = this.images[1];
        }
        else if (color == '#f45b5b') {
          this.danceimage = this.images[2];
        }
        else {
          this.danceimage = this.images[3];
        }
      }
    }
  }
</script>



