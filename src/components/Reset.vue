<script>
import Footer from "./components/Footer.vue";

export default {
  name: 'App',
  components: {
      Footer
    }
  }
</script>

<template>
<header>
  <h1>WebXR Exploration</h1>
  <p>Analysis of Frameworks and Issues sourrounding the AR and VR API</p>
</header>

<main>
  <ul>
    <li><a class="button" href="about"> About </a></li>
    <li><a class="button" href="frameworks"> Frameworks </a></li>
    <li><a class="button" href="issues"> Issues </a></li>
    <li><a class="button" href="experiments"> Experiments </a></li>
  </ul>
</main>
<Footer></Footer>
</template>


<style scoped>
  header {
    max-height: 200px;
    overflow: hidden;
  }

  h1 {
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 1.8rem;
  }

  p {
    letter-spacing: 0.05em;
    font-size: 1rem;
    text-transform: uppercase;
  }
  li {
    list-style: none;
  }

  a {
    text-align: left;
    width: 90%;
  }

  a:hover {
    background-color: black;
    color: white;
    font: bold;
    border: none;
  }
</style>

