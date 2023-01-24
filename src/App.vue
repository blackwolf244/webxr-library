<script>
import Footer from "./components/Footer.vue";
import jsondata from "./data/issues.json"
export default {
  name: 'App',
  components: {
    Footer
  },
  methods: {
    onClick() {
      const navLinks = document.querySelector(".nav-links")
      navLinks.classList.toggle('mobile-menu')
    }
  },
}
</script>

<template>
  <header>
    <div class="wrap">
      <nav class="navbar">
        <router-link to="/" class="logo">
          <img src="./assets/WL-B.svg" alt="Stefan Kern, Logo" />
        </router-link>
        <div class="nav-links">
          <ul>
            <li><router-link @click="onClick" to="/frameworks">Frameworks</router-link></li>
            <li><router-link @click="onClick" to="/issues">Issues</router-link></li>
            <li><router-link @click="onClick" to="/experiments">Experiments</router-link></li>
          </ul>
        </div>
        <ion-icon @click="onClick" name="menu-outline" class="menu"></ion-icon>
      </nav>
      <p>Analysis of Frameworks and Issues of the AR and VR API</p>
    </div>

  </header>

  <main>
    <router-view></router-view>
  </main>
  <Footer></Footer>
</template>


<style>
header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding: 1rem 4rem;
  padding-top: 4rem;

}

.logo img {
  width: 85%;

}

.logo {
  z-index: 5;
  line-height: 0;
}

.wrap {
  max-height: 130px;
  width: calc(100% - 8rem);
  background-color: #f8f8f8;
  padding-bottom: 5px;
}

.navbar {

  padding: 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid black;
}

.navbar ul li a {
  color: black;
  padding: 0 10px;
}

.navbar .logo h1 {
  padding: 0;
  margin-bottom: 0;
  color: black;
}

.navbar .nav-links ul {
  display: flex;
}

.navbar li {
  display: flex;
  margin: 0 10px;
  list-style: none;
  margin-bottom: 0;
}

.navbar ul {
  margin-bottom: 0;
}

.navbar li:hover a {
  background-color: black;
  color: white;
  font: bold;
  border: none;
}

.navbar .nav-links ul li a:active {
  background-color: black;
  color: white;
}

.navbar h1:hover {
  background-color: black;
  color: white;
  font: bold;
  padding: 3px;
}

.menu {
  z-index: 5;
  display: none;
}

h1 {
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 1.2em;
}

h2 {
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 1em;
}


header p {
  letter-spacing: 0.04em;
  font-size: 1rem;
  text-transform: uppercase;
  margin-top: 1rem;
  margin-bottom: 0;
}

main {
  padding-top: 10rem;
}



/* Larger than desktop */
@media screen and (max-width: 900px) {
  main {
    padding-top: 10rem;
  }

  .wrap {
    width: calc(100% - 4rem)
  }

  header {
    padding: 1rem 2rem;
  }

  p {
    font-size: 0.9rem;
  }

  .menu {
    display: block;
    font-size: 1.5em;
  }

  .nav-links {
    z-index: 4;
    position: absolute;
    background-color: rgba(228, 228, 228, 0.884);
    backdrop-filter: blur(2px);
    top: 0;
    left: 0;
    width: calc(100% - 4rem);
    height: 100vh;
    display: flex;
    margin-left: -100%;
    padding-left: 1rem;
    align-items: center;
  }

  .mobile-menu {
    margin-left: 0px;
  }

  .nav-links ul {
    padding-top: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200px;
  }

  .nav-links ul li a {
    font-size: 1.1em;
    width: 200px;
  }
}
</style>

