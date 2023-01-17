<template>
  <div class="box">
    <div class="content styled-scrollbars">
      <div class="c-header">
        <h2>WebXR Frameworks</h2>
        <p>A condensed list of starter Projects</p>
      </div>
      <div class="c-content" v-for="page in pages" :key="page.id">
        <a class="button" :href="'#' + page.title">{{ page.title }}</a>
        <div v-if="this.window.width <= 900" class="celement hidden" :id="page.title">
          <h2>{{ page.title }}</h2>
          <p>>{{ page.subtitle }}
          </p>
          <p>>Get Started: <br /> <a>{{ page.starter }}</a></p>
          <p>>Website: <br /> <a>{{ page.website }}</a></p>
          <a class="button" :href="'frameworks/' + page.title">>>>Example</a>
        </div>
      </div>
    </div>
    <div class="info styled-scrollbars hidden" v-for="page in pages" :key="page.id" :id="page.title">
      <h2>{{ page.title }}</h2>
      <p>{{ page.subtitle }}
      </p>
      <p>>Get Started: <br /> <a target="_blank">{{ page.starter }}</a></p>
      <p>>Website: <br /> <a target="_blank">{{ page.website }}</a></p>
      <a class="button" :href="'frameworks/' + page.title">>>>Example</a>
    </div>
  </div>
</template>

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

<script scoped>
import PageEmbed from '../components/PageEmbed.vue'

export default {
  components: {
    PageEmbed
  },
  data() {
    return {
      pages: [
        { id: 1, title: 'A-Frame', subtitle: 'A-Frame is an open-source web framework for building virtual reality (VR) experiences. It is built on top of HTML and JavaScript, making it easy for developers to create VR content using familiar web technologies.', starter: 'https://aframe.io/docs/1.3.0/introduction/', website: 'https://aframe.io/' },
        { id: 2, title: 'WonderLand-Engine', subtitle: 'Wonderland Engine is an open-source 3D engine built on A-Frame, allowing for the development of interactive and immersive VR and AR experiences with advanced features such as physics simulation, advanced lighting, and support for multiple input devices.', starter: 'https://wonderlandengine.com/getting-started/quick-start/', website: 'https://wonderlandengine.com/' },
        { id: 3, title: 'Unity', subtitle: 'Unity is a cross-platform game engine used to create 2D, 3D, AR, and VR experiences. It has a built-in WebXR support which allows developers to create and publish WebXR experiences.', starter: 'https://learn.unity.com/course/create-with-vr', website: 'https://unity.com/' },
        { id: 3, title: 'WebXR-Threejs-AR', subtitle: 'WebXR is a JavaScript API for creating immersive virtual reality (VR) and augmented reality (AR) experiences on the web. Three.js is a JavaScript library for creating and displaying 3D content on web browsers. When combined, the two technologies can be used to create immersive and interactive WebXR experiences.', starter: 'https://developers.google.com/ar/develop/webxr', website: 'https://immersiveweb.dev/' },
      ],
      window: {
        width: 0,
      }
    }
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
  }
}
</script>