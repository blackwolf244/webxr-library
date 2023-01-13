<template>
  <h1>{{ $route.params.id }}</h1>
  <Base>
  </Base>
</template>

<script>
import AFrame from './Examples/AFrame.vue'
import Base from './Examples/Base.vue'
export default {
  components: {
    AFrame,
    Base,
  },
};

</script>

<style scoped>

</style>