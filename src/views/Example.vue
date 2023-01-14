<template>
  <h1>{{ $route.params.id }}</h1>
  <WebXRThreejsAR v-if="this.$route.params.id == 'WebXR-Threejs-AR'">
  </WebXRThreejsAR>
  <AFrame v-else-if="this.$route.params.id == 'A-Frame'"></AFrame>
  <h2 v-else>404</h2>
</template>

<script>
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

</style>