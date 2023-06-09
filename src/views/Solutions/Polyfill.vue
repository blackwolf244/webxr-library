<template>
  <div ref="container" class="canvas-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';

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
    const canvas = this.$refs.canvas
    let camera, scene, renderer;
    let controller1, controller2;
    let controllerGrip1, controllerGrip2;
    let originaspect;

    let raycaster;

    const intersected = [];
    const tempMatrix = new THREE.Matrix4();

    let controls, group;

    const xr = await this.getXR("if-needed");
    if (this.webxrPolyfill) {
      console.log('WebXR Polyfill active');
    } else {
      console.log('WebXR Polyfill not active');
    }

    init();
    animate();

    function init() {

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.set(-10, 4, 3);

      controls = new OrbitControls(camera, container);
      controls.target.set(0, 1.6, 0);
      controls.update();

      const floorGeometry = new THREE.PlaneGeometry(4, 4);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 1.0,
        metalness: 0.0
      });

      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = - Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 6, 0);
      light.castShadow = true;
      light.shadow.camera.top = 2;
      light.shadow.camera.bottom = - 2;
      light.shadow.camera.right = 2;
      light.shadow.camera.left = - 2;
      light.shadow.mapSize.set(4096, 4096);
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
        object.position.y = Math.random() * 3;
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

      container.appendChild(VRButton.createButton(renderer));

      // controllers

      controller1 = renderer.xr.getController(0);
      controller1.addEventListener('selectstart', onSelectStart);
      controller1.addEventListener('selectend', onSelectEnd);
      scene.add(controller1);

      controller2 = renderer.xr.getController(1);
      controller2.addEventListener('selectstart', onSelectStart);
      controller2.addEventListener('selectend', onSelectEnd);
      scene.add(controller2);

      const controllerModelFactory = new XRControllerModelFactory();

      controllerGrip1 = renderer.xr.getControllerGrip(0);
      controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
      scene.add(controllerGrip1);

      controllerGrip2 = renderer.xr.getControllerGrip(1);
      controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
      scene.add(controllerGrip2);

      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

      const line = new THREE.Line(geometry);
      line.name = 'line';
      line.scale.z = 5;

      controller1.add(line.clone());
      controller2.add(line.clone());

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
  height: 60vh;
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