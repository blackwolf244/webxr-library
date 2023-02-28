<template>
  <div class="content">
    <div class="left">
      <a-scene embedded>
        <a-assets>
          <img id="groundTexture" crossorigin="anonymous" src="https://cdn.aframe.io/a-painter/images/floor.jpg">
          <img id="skyTexture" crossorigin="anonymous" src="https://cdn.aframe.io/a-painter/images/sky.jpg">
        </a-assets>

        <a-entity id="lightSphere" geometry="primitive: sphere; radius: 0.5" material="color: #FFF; shader: flat"
          light="type: point"
          animation="property: position; dir: alternate; loop: true; to: 4 2 -9; from: -4 2 -9"></a-entity>

        <a-entity class="box" geometry="primitive: box" material="color: red" position="0 0.5 -10"></a-entity>
        <a-entity class="box" geometry="primitive: box" material="color: orange" position="-2 0.5 -8"></a-entity>
        <a-entity class="box" geometry="primitive: box" material="color: yellow" position="2 0.5 -8"></a-entity>
        <a-entity class="box" geometry="primitive: box" material="color: green" position="-4 0.5 -6"></a-entity>
        <a-entity class="box" geometry="primitive: box" material="color: blue" position="4 0.5 -6"></a-entity>

        <a-entity id="sky" geometry="primitive: sphere; thetaLength: 90; radius: 30"
          material="side: back; height: 2048; width: 2048; src: #skyTexture; shader: flat"></a-entity>

        <a-entity light="type: ambient; color: #222"></a-entity>
        <a-entity light="type: directional; color: #111" position="-1 1 0"></a-entity>

        <a-entity id="ground" geometry="primitive: plane; height: 100; width: 100" material="src: #groundTexture"
          rotation="-90 0 0"></a-entity>

        <a-entity oculus-touch-controls="hand: left"></a-entity>
        <a-entity oculus-touch-controls="hand: right"></a-entity>

        <a-entity id="cameraRig">
          <a-entity id="head" position="0 1.4 0" camera wasd-controls look-controls></a-entity>
        </a-entity>

      </a-scene>
    </div>
  </div>
</template>
<script scoped>
import "aframe";

</script>
<style scoped>
.content div {
  border: 1px solid black;
  margin-right: 20px;
  width: 100%;
  height: 55vh;
}
</style>