<template>
  <footer>
    <div class="cont">
      <a class="skern" href="https://stefan-kern.web.app/" target="_blank" rel="noreferrer">
        <img src="../assets/sk3.svg" alt="Stefan Kern, Logo" />
      </a>
      <a class="thd" href="https://stefan-kern.web.app/" target="_blank" rel="noreferrer">
        <img src="../assets/THDl.png" alt="Stefan Kern, Logo" />
      </a>

    </div>
  </footer>
</template>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  min-height: 50px;
  max-height: 100px;
  width: 100vw;
  background-color: #d7d7d7;
  display: flex;
}

.cont {
  width: 100%;
  display: flex;
  padding: 15px 4rem;
  justify-content: space-between;
  align-items: center;
}

.thd {
  margin: auto 0;
  float: right;
}

.skern {
  float: left;
  margin: auto 0;

}

.cont a {
  text-decoration: none;
  margin: 0;
  line-height: 0px;
  height: 2.5rem;
}

.info {
  width: 250px;
  height: 100%;
}

/* Larger than desktop */
@media screen and (max-width: 900px) {
  footer {
    height: 60px;
  }

  .cont {
    padding: 15px 2rem;
  }
}
</style>

<script>
export default {
  name: 'Footer'
}
</script>