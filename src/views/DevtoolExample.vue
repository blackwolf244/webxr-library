<template>
  <h1>{{ $route.params.id }}</h1>
  <p v-if="this.$route.params.id == 'WebXR-Threejs-AR'">Only available on AR-Compatiple Devices</p>
  <WebXRThreejsAR v-if="this.$route.params.id == 'WebXR-Threejs-AR'">
  </WebXRThreejsAR>
  <ImmersiveVR v-if="this.$route.params.id == 'WebXR-Threejs-VR'">
  </ImmersiveVR>
  <Babylon v-else-if="this.$route.params.id == 'BabylonJS-VR'">
  </Babylon>
  <!-- <ModelViewer v-else-if="this.$route.params.id == 'model-viewer'">
  </ModelViewer> -->
  <div v-else-if="this.$route.params.id == 'model-viewer'">
    <p>
      Due to cross compatibility issues a example has to be imported via a iframe.
    </p>
    <div id="wrap">
      <iframe id="frame" :src="`/ModelViewer/index.html`" allowfullscreen frameborder="0">
      </iframe>
    </div>
  </div>
  <AFrame v-else-if="this.$route.params.id == 'A-Frame'"></AFrame>
  <div v-else-if="this.$route.params.id == 'Unity'">
    <a class="button" href="https://mygit.th-deg.de/sk20808/webxr-library/-/tree/main/Examples/Unity" target="_blank"
      rel="noopener noreferrer">>>Unity-Example Github Repository</a>
    <div id="wrap">
      <iframe id="frame" :src="`/UnityDeploy/index.html`" allowfullscreen frameborder="0">
      </iframe>
    </div>
  </div>
  <div v-else-if="this.$route.params.id == 'WonderLand-Engine'">
    <a class="button" href="https://mygit.th-deg.de/sk20808/webxr-library/-/tree/main/Examples/Wonderland" target="_blank"
      rel="noopener noreferrer">>>Wonderland-Engine-Example Github Repository</a>
    <div id="wrap">
      <iframe id="frame" :src="`/WonderlandDeploy/index.html`" allowfullscreen frameborder="0">
      </iframe>
    </div>
  </div>


  <h2 v-else>404</h2>
</template>

<script>
import AFrame from './Examples/AFrame.vue'
import WebXRThreejsAR from './Examples/WebXRThreejsAR.vue'
import Babylon from './Examples/babylon.vue'
import ModelViewer from './Examples/modelViewer.vue'
import ImmersiveVR from './Solutions/Dragging.vue'
export default {
  components: {
    AFrame,
    WebXRThreejsAR,
    Babylon,
    ModelViewer,
    ImmersiveVR
  },
};
</script>

<style scoped>
#wrap {
  width: 100%;
  height: 60vh;
}

#frame {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}

#frame {
  -ms-zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.75);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.75);
  -webkit-transform-origin: 0 0;
}

.button {
  height: 30px;
  line-height: 30px;
  padding-left: 5px
}

.button:hover {
  background-color: #000;
  color: #fff;
  font-weight: 700;
  border: none;
  height: fit-content;
}

p {
  letter-spacing: 0.04em;
  font-size: 1rem;
  text-transform: uppercase;
  margin-top: 1rem;
  margin-bottom: 0;
}
</style>