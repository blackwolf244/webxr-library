<template>
  <!-- <div ref="container" class="canvas-container">
    <canvas ref="canvas"></canvas>
  </div> -->
  <div ref="container1" class="canvas-container">
    <canvas ref="canvas0"></canvas>
    <canvas ref="canvas1"></canvas>
    <canvas ref="canvas2"></canvas>
    <canvas ref="canvas3"></canvas>
  </div>
  <div>
    <div ref="c0">

    </div>
    <div ref="c1">

    </div>
    <div ref="c2">

    </div>
    <div ref="c3">

    </div>
  </div>
</template>

<script>

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
export default {
  data() {
    return {
      xrSession: null,
    }
  },
  methods: {
    getXR(usePolyfill) {
      let tempXR;

      switch (usePolyfill) {
        case "if-needed":
          tempXR = navigator.xr;
          if (!tempXR) {
            this.webxrPolyfill = new WebXRPolyfill();
            tempXR = this.webxrPolyfill;
          }
          break;
        case "yes":
          this.webxrPolyfill = new WebXRPolyfill();
          tempXR = this.webxrPolyfill;
          break;
        case "no":
        default:
          tempXR = navigator.xr;
          break;
      }

      return tempXR;
    },
  },
  async mounted() {
    const container = this.$refs.container;
    const container1 = this.$refs.container1;
    const canvas = this.$refs.canvas
    const canvas0 = this.$refs.canvas0
    const canvas1 = this.$refs.canvas1
    const canvas2 = this.$refs.canvas2
    const canvas3 = this.$refs.canvas3
    let camera, scene, renderer;
    let controller1, controller2;
    let originaspect;

    let raycaster;

    const intersected = [];
    const tempMatrix = new THREE.Matrix4();

    let group;

    const xr = await this.getXR("if-needed");
    if (this.webxrPolyfill) {
      console.log('WebXR Polyfill active');
    } else {
      console.log('WebXR Polyfill not active');
    }

    init();
    animate();

    function initialize() {
      scene0 = new THREE.Scene();
      scene1 = new THREE.Scene();
      scene2 = new THREE.Scene();
      scene3 = new THREE.Scene();

      scenes = [scene0, scene1, scene2, scene3];

      const controls = new OrbitControls(camera, container);
      controls.minDistance = 0;
      controls.maxDistance = 8;

      scenes.map(scene => scene.add(new THREE.HemisphereLight(0x808080, 0x606060)));

      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 6, 0);
      scenes.map(scene => scene.add(light));

      group = new THREE.Group();
      scenes.map(scene => scene.add(group));

      const geometries = [
        new THREE.BoxGeometry(0.2, 0.2, 0.2),
        new THREE.ConeGeometry(0.2, 0.2, 64),
        new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64),
        new THREE.IcosahedronGeometry(0.2, 8),
        new THREE.TorusGeometry(0.2, 0.04, 64, 32)
      ];

      for (let i = 0; i < 50; i++) {

        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshStandardMaterial({
          color: Math.random() * 0xffffff,
          roughness: 0.7,
          metalness: 0.0
        });

        const object = new THREE.Mesh(geometry, material);

        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4 - 2;
        object.position.z = Math.random() * 4 - 2;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.setScalar(Math.random() + 0.5);

        group.add(object);
      }
      //

      renderer0 = new THREE.WebGLRenderer({ canvas: canvas0, antialias: true, alpha: true });
      renderer1 = new THREE.WebGLRenderer({ canvas: canvas1, antialias: true, alpha: true });
      renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, antialias: true, alpha: true });
      renderer3 = new THREE.WebGLRenderer({ canvas: canvas3, antialias: true, alpha: true });

      renders = [renderer0, renderer0, renderer0, renderer0,]

      renders.map(renderer => renderer.setSize(canvas0.clientWidth, canvas.clientHeight));
      renders.map(renderer => renderer.outputEncoding = THREE.sRGBEncoding);
      renders.map(renderer => renderer.xr.enabled = true);
      renders.map(renderer => container.appendChild(renderer.domElement));

      this.$refs.c0.appendChild(ARButton.createButton(renderer));
      this.$refs.c1.appendChild(VRButton.createButton(renderer));
      this.$refs.c2.appendChild(ARButton.createButton(renderer));
      this.$refs.c3.appendChild(VRButton.createButton(renderer));

      // controllers
      renders.map(renderer => controller1 = renderer.xr.getController(0));
      controller1.addEventListener('selectstart', onSelectStart);
      controller1.addEventListener('selectend', onSelectEnd);
      scene.add(controller1);

      controller2 = renderer.xr.getController(1);
      controller2.addEventListener('selectstart', onSelectStart);
      controller2.addEventListener('selectend', onSelectEnd);
      scene.add(controller2);

      raycaster = new THREE.Raycaster();
      originaspect = container.clientWidth / container.clientHeight
      //

      window.addEventListener('resize', onWindowResize);


    }

    function init() {



      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.set(0, 0, 3);

      const controls = new OrbitControls(camera, container);
      controls.minDistance = 0;
      controls.maxDistance = 8;

      scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 6, 0);
      scene.add(light);

      group = new THREE.Group();
      scene.add(group);

      const geometries = [
        new THREE.BoxGeometry(0.2, 0.2, 0.2),
        new THREE.ConeGeometry(0.2, 0.2, 64),
        new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64),
        new THREE.IcosahedronGeometry(0.2, 8),
        new THREE.TorusGeometry(0.2, 0.04, 64, 32)
      ];

      for (let i = 0; i < 50; i++) {

        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshStandardMaterial({
          color: Math.random() * 0xffffff,
          roughness: 0.7,
          metalness: 0.0
        });

        const object = new THREE.Mesh(geometry, material);

        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4 - 2;
        object.position.z = Math.random() * 4 - 2;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.setScalar(Math.random() + 0.5);

        group.add(object);

      }

      //

      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      container.appendChild(ARButton.createButton(renderer));

      // controllers

      controller1 = renderer.xr.getController(0);
      controller1.addEventListener('selectstart', onSelectStart);
      controller1.addEventListener('selectend', onSelectEnd);
      scene.add(controller1);

      controller2 = renderer.xr.getController(1);
      controller2.addEventListener('selectstart', onSelectStart);
      controller2.addEventListener('selectend', onSelectEnd);
      scene.add(controller2);

      raycaster = new THREE.Raycaster();
      originaspect = container.clientWidth / container.clientHeight
      //

      window.addEventListener('resize', onWindowResize);

    }

    function onWindowResize() {
      camera.aspect = container.clientWidth / (container.clientWidth / originaspect);
      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, (container.clientWidth / originaspect));

    }

    function onSelectStart(event) {

      const controller = event.target;

      const intersections = getIntersections(controller);

      if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        object.material.emissive.b = 1;
        controller.attach(object);

        controller.userData.selected = object;

      }

    }

    function onSelectEnd(event) {

      const controller = event.target;

      if (controller.userData.selected !== undefined) {

        const object = controller.userData.selected;
        object.material.emissive.b = 0;
        group.attach(object);

        controller.userData.selected = undefined;

      }


    }

    function getIntersections(controller) {

      tempMatrix.identity().extractRotation(controller.matrixWorld);

      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

      return raycaster.intersectObjects(group.children, false);

    }

    function intersectObjects(controller) {

      // Do not highlight when already selected

      if (controller.userData.selected !== undefined) return;

      const intersections = getIntersections(controller);

      if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        object.material.emissive.r = 1;
        intersected.push(object);

      }

    }

    function cleanIntersected() {

      while (intersected.length) {

        const object = intersected.pop();
        object.material.emissive.r = 0;

      }

    }

    //

    function animate() {

      renderer.setAnimationLoop(render);

    }

    function render() {

      cleanIntersected();

      intersectObjects(controller1);
      intersectObjects(controller2);

      renderer.render(scene, camera);

    }
  },
}

</script>

<style scoped>
canvas {
  width: 100%;
  height: auto;
}

.canvas-container {
  position: relative;
}

button {
  height: auto;
  width: 100%;
  line-height: 0;
  margin: 0;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>