<template>
  <h1>{{ $route.params.id }}</h1>
  <AFrame />
</template>

<script>
import AFrame from './Examples/AFrame.vue'
export default {
  components: {
    AFrame
  },
};

</script>

<style scoped>

</style>