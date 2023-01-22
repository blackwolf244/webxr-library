<template>
  <h1>{{ $route.params.id }}</h1>
  <p v-if="this.$route.params.id == 'WebXR-Threejs-AR'">Only available on AR-Compatiple Devices</p>
  <WebXRThreejsAR v-if="this.$route.params.id == 'WebXR-Threejs-AR'">
  </WebXRThreejsAR>
  <AFrame v-else-if="this.$route.params.id == 'A-Frame'"></AFrame>
  <a class="button" v-else-if="this.$route.params.id == 'Unity'"
    href="https://mygit.th-deg.de/sk20808/webxr-library/-/tree/main/Examples/Unity" target="_blank"
    rel="noopener noreferrer">>>Unity-Example Github Repository</a>
  <a class="button" v-else-if="this.$route.params.id == 'WonderLand-Engine'"
    href="https://mygit.th-deg.de/sk20808/webxr-library/-/tree/main/Examples/Wonderland" target="_blank"
    rel="noopener noreferrer">>>Wonderland-Engine-Example Github Repository</a>
  <h2 v-else>404</h2>
</template>

<script scoped>
import AFrame from './Examples/AFrame.vue'
import WebXRThreejsAR from './Examples/WebXRThreejsAR.vue'
export default {
  components: {
    AFrame,
    WebXRThreejsAR,
  },
};
</script>

<style scoped>
.button {
  height: 30px;
  line-height: 30px;
  padding-left: 5px
}

.button:hover {
  background-color: #000;
  color: #fff;
  font-weight: 700;
  border: none
}

p {
  letter-spacing: 0.04em;
  font-size: 1rem;
  text-transform: uppercase;
  margin-top: 1rem;
  margin-bottom: 0;
}
</style>