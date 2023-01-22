<template>
  <div class="box">
    <div class="content styled-scrollbars">
      <div class="c-content">
        <div>
          <div>
            <BrowserSupport v-if="active.title === id"></BrowserSupport>
          </div>
          <div v-if="this.window.width <= 900" class="celement" :id="active.title">
            <h2>{{ active.title }}</h2>
            <p>>Source: {{ active.source }}</p>
            <p>>Solution: {{ active.solution }}</p>
            <p class="rprod">>Solved:
              <ion-icon class="check" v-if="active.solved === '-'" name="construct-outline"></ion-icon>
              <ion-icon class="check" v-else-if="active.solved" name="checkmark-outline"></ion-icon>
              <ion-icon v-else name="close-outline"></ion-icon>
            </p>
            <a v-if="active.example" class="button" :href="'issues/' + active.title">>>>Example</a>
            <a v-if="active.link" class="button" target="_blank" rel="noopener noreferrer"
              href="active.link">>>>Reference</a>
          </div>
        </div>
      </div>
    </div>
    <div class="info styled-scrollbars">
      <h2>{{ active.title }}</h2>
      <p>>Source: {{ active.source }}</p>
      <p>>Solution: {{ active.solution }}</p>
      <p class="rprod">>Solved:
        <ion-icon class="check" v-if="active.solved === '-'" name="construct-outline"></ion-icon>
        <ion-icon class="check" v-else-if="active.solved" name="checkmark-outline"></ion-icon>
        <ion-icon v-else name="close-outline"></ion-icon>
      </p>
      <a v-if="active.example" class="button" :href="'issues/' + active.title">>>>Example</a>
      <a v-if="active.link" class="button" target="_blank" rel="noopener noreferrer" href="active.link">>>>Reference</a>
    </div>
  </div>
</template>

<script scoped>
import BrowserSupport from '../views/Solutions/BrowserSupport.vue'

export default {
  components: {
    BrowserSupport
  },
  data() {
    return {
      pages: [
        { id: 1, title: 'Browser-Support', solved: '-', subtitle: 'The WebXR API is not yet supported by all web browsers, and even when it is supported, the level of support can vary between browsers. This can make it difficult to ensure that an XR experience will work on all devices.', source: 'Due to different development cycles, hardware requirements, and prioritization of other technologies, full acccess to the API isnt available for most browsers. In those cases Polyfill allows for a limited support of its featureset.', link: 'https://immersiveweb.dev/#supporttable', example: '', solution: 'WebXR-polyfill is a JavaScript library that allows developers to use the WebXR API in browsers that do not support it natively. It provides a compatibility layer between the WebXR API and the WebVR API' },
        { id: 2, title: 'WebXR-Useability', date: '20.12.23', solved: 'b', subtitle: 'A-Frame is an open-source web framework for building virtual reality (VR) experiences. It is built on top of HTML and JavaScript, making it easy for developers to create VR content using familiar web technologies.', source: 'Pies', example: '', solution: 'https://aframe.io/' },
        { id: 3, title: 'RayCast-Compatibility-Issue', date: '20.12.23', solved: 'b', subtitle: 'A-Frame is an open-source web framework for building virtual reality (VR) experiences. It is built on top of HTML and JavaScript, making it easy for developers to create VR content using familiar web technologies.', source: 'Pies', example: '', solution: 'https://aframe.io/' },
        { id: 4, title: 'Render-Performance-Issue', date: '20.12.23', solved: 'b', subtitle: 'A-Frame is an open-source web framework for building virtual reality (VR) experiences. It is built on top of HTML and JavaScript, making it easy for developers to create VR content using familiar web technologies.', source: 'Pies', example: '', solution: 'https://aframe.io/' },
        { id: 5, title: 'XRSpace-Threats', date: '20.12.23', solved: 'b', subtitle: 'A-Frame is an open-source web framework for building virtual reality (VR) experiences. It is built on top of HTML and JavaScript, making it easy for developers to create VR content using familiar web technologies.', source: 'https://github.com/immersive-web/webxr/issues/752', example: 'https://github.com/immersive-web/webxr/issues/752', solution: 'https://aframe.io/' },
        { id: 6, title: 'Device-Support', date: '20.12.23', solved: 'b', subtitle: 'A-Frame is an open-source web framework for building virtual reality (VR) experiences. It is built on top of HTML and JavaScript, making it easy for developers to create VR content using familiar web technologies.', source: 'https://immersiveweb.dev/#supporttable', example: '', solution: 'https://aframe.io/' },
      ],
      window: {
        width: 0,
      },
      id: this.$route.params.id
    }
  },
  computed: {
    active: function () {
      return [...this.pages.filter(page => page.title === this.id)][0];
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
    }
  },
}
</script>

<style scoped>
.celement .button {
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
}

.celement {
  width: 90%;
  margin-left: 5px;
  padding-left: 1rem;
  border-left: 1px solid black;
  margin-bottom: 1rem;
  display: none;
}

.celement p {
  margin-bottom: 1rem;
}

.c-header h2 {
  margin-bottom: 0.5rem;
}

.c-header p {
  font-size: medium;
}

.button {
  width: 90%;
  text-align: left;
}

.button:hover {
  background-color: black;
  color: white;
  font-weight: bold;
  border: none;
}

p {
  font-size: large;
  text-transform: uppercase;
  color: rgb(66, 66, 66);
}

.box {
  display: flexbox;
  width: calc(100vw - 8rem);
}

.content {
  width: 40%;
  float: left;
  max-height: calc(100vh - 100px - 17rem);
  overflow-y: scroll;
  padding-right: 1rem;
  padding-top: 10px;
  border-right: 1px solid black;
  margin-bottom: 0;
}

.info {
  float: right;
  max-height: calc(100vh - 100px - 17rem);
  padding-top: 10px;
  padding-left: 1rem;
  overflow-y: scroll;
  width: calc(60% - 3rem);
}

a {
  font-size: small;
  overflow-wrap: break-word;
  color: black;
  text-decoration: underline;
}

a:hover {
  background-color: black;
  color: white;
  font-weight: bold;
  padding: 5px;
}

.info p {
  margin-bottom: 1.5rem;
}

.styled-scrollbars::-webkit-scrollbar-track {
  background-color: #f8f8f8;
}

.styled-scrollbars::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #f8f8f8;
}

.styled-scrollbars::-webkit-scrollbar-thumb {
  background-color: black;
}

.hidden {
  display: none;
}

:target {
  display: block;
}

@media screen and (max-width: 900px) {

  .celement a {
    border-left: gray solid 3px;
    font-size: 0.7rem;
  }

  .celement {
    display: block;
  }

  .box {
    width: calc(100vw - 4rem);
  }

  .content {
    padding: 0;
    width: 100%;
    max-height: fit-content;
    margin-bottom: 8rem;
  }

  .info {
    display: none;
    padding: 0;
    border-right: 1px solid black;
    margin-bottom: 5rem;
    margin-top: 4rem;
    width: 100%;
    float: none;
    max-height: fit-content;
  }

  p {
    font-size: 0.9rem;
  }

  .hidden {
    display: none;
    scroll-margin-top: 9rem;
  }

  :target {
    display: block;
  }
}
</style>