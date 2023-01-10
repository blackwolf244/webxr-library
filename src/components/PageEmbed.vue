<script>
export default {
  props: [{
    id: String,
    title: String,
    subtitle: String,
    starter: String,
    website: String
  }]
}
</script>

<template>
  <div class="info styled-scrollbars">
      
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}}}
      </p>
      <p>>Get Started: <br/> <a target="_blank">{{ starter }}</a></p>
      <p>>Website: <br/> <a target="_blank">{{ website }}</a></p>
      <a class="button" href="/frameworks/:{{ id }}">>>>Example</a>
      
    </div>
</template>

