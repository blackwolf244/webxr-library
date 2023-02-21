<template>
  <div class="box">
    <div class="content styled-scrollbars">
      <div class="c-header">
        <h2>WebXR Issues</h2>
        <p>Issues with the API and it's Framework & Browser Interactions</p>
      </div>
      <div class="c-content" v-for="page in pages" :key="page.id">
        <a class="button" :href="'#' + page.title">{{ page.title }}</a>
        <div v-if="this.window.width <= 900" class="celement hidden" :id="page.title">
          <h2>{{ page.title }}</h2>
          <p class="date">{{ page.date }}</p>
          <p>>{{ page.subtitle }}</p>
          <p>>Source: {{ page.source }}</p>
          <p class="rprod">>Reproducible:
            <ion-icon class="check" v-if="page.reproduction" name="checkmark-outline"></ion-icon>
            <ion-icon v-else name="close-outline"></ion-icon>
          </p>
          <p v-if="page.links" v-for="link in page.links">
            <a target="_blank" rel="noopener noreferrer" :href="link.source">>>>{{ link.title }}</a>
          </p>
          <a v-if="page.example" class="button" :href="'issues/' + page.title + '/example'">>>>Example Experiment</a>
          <a v-if="page.solution" class="button" :href="'issues/' + page.title + '/solution'">>>>Solution Experiment</a>
        </div>
      </div>
    </div>
    <div class="info styled-scrollbars hidden" v-for="page in pages" :key="page.id" :id="page.title">
      <h2>{{ page.title }}</h2>
      <p class="date">{{ page.date }}</p>
      <p>>{{ page.subtitle }}</p>
      <p>>Source: {{ page.source }}</p>
      <p class="rprod">>Reproducible:
        <ion-icon class="check" v-if="page.reproduction" name="checkmark-outline"></ion-icon>
        <ion-icon v-else name="close-outline"></ion-icon>
      </p>
      <p v-if="page.links" v-for="link in page.links">
        <a target="_blank" rel="noopener noreferrer" :href="link.source">>>>{{ link.title }}</a>
      </p>
      <a v-if="page.example" class="button" :href="'issues/' + page.title + '/example'">>>>Example Experiment</a>
      <a v-if="page.solution" class="button" :href="'issues/' + page.title + '/solution'">>>>Solution Experiment</a>
    </div>
  </div>
</template>

<script scoped>
import jsondata from "../data/issues.json"

export default {
  data() {
    return {
      pages: jsondata,
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

<style scoped>
.celement .button {
  height: 30px;
  line-height: 30px;
  padding-left: 5px
}

.celement {
  width: 90%;
  margin-left: 5px;
  padding-left: 1rem;
  border-left: 1px solid #000;
  margin-bottom: 1rem;
  display: none
}

.celement p {
  margin-bottom: 1rem
}

.c-header h2 {
  margin-bottom: .5rem
}

.button {
  width: 90%;
  text-align: left
}

.button:hover {
  background-color: #000;
  color: #fff;
  font-weight: 700;
  border: none
}

p {
  font-size: medium;
  text-transform: uppercase;
  color: #424242
}

.box {
  display: flexbox;
  width: calc(100vw - 8rem)
}

.content {
  width: 40%;
  float: left;
  max-height: calc(100vh - 100px - 17rem);
  overflow-y: scroll;
  padding-right: 1rem;
  padding-top: 10px;
  border-right: 1px solid #000;
  margin-bottom: 0
}

.info {
  float: right;
  max-height: calc(100vh - 100px - 17rem);
  padding-top: 10px;
  padding-left: 1rem;
  overflow-y: scroll;
  width: calc(60% - 3rem)
}

a {
  font-size: small;
  overflow-wrap: break-word;
  color: #000;
  text-decoration: underline
}

a:hover {
  background-color: #000;
  color: #fff;
  font-weight: 700;
  padding: 5px
}

.info p {
  margin-bottom: 1.5rem
}

.styled-scrollbars::-webkit-scrollbar-track {
  background-color: #f8f8f8
}

.styled-scrollbars::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #f8f8f8
}

.styled-scrollbars::-webkit-scrollbar-thumb {
  background-color: #000
}

.hidden {
  display: none
}

:target {
  display: block
}

ion-icon {
  font-size: 1rem;
  color: red;
  contain: content;
  height: 100%
}

ion-icon * {
  z-index: 0
}

.rprod {
  line-height: 1rem;
  display: flex;
  align-items: center
}

.check {
  color: green
}

date {
  font-size: small;
  margin-bottom: 1.5em
}

h2 {
  margin-bottom: 0
}

@media screen and (max-width:900px) {
  .celement {
    display: block
  }

  .celement a {
    border-left: gray solid 3px;
    font-size: 0.7rem;
  }

  .box {
    width: calc(100vw - 4rem)
  }

  .content {
    padding: 0;
    width: 100%;
    max-height: fit-content;
    margin-bottom: 8rem
  }

  .info {
    display: none;
    padding: 0;
    border-right: 1px solid #000;
    margin-bottom: 5rem;
    margin-top: 4rem;
    width: 100%;
    float: none;
    max-height: fit-content
  }

  p {
    font-size: .9rem
  }

  .hidden {
    display: none;
    scroll-margin-top: 9rem
  }

  :target {
    display: block
  }

  date {
    font-size: x-small;
    margin-bottom: 1.5em
  }
}
</style>

