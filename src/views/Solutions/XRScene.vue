<template>
  <div ref="container" class="canvas-container">
    <button @click="toggleFullscreen"><ion-icon name="expand-outline"></ion-icon></button>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'

export default {
  data() {
    return {
      xrSession: null,
      webxrPolyfill: null,
      raycaster: null,
      mouse: null,
      radius: null,
      room: null,
      spheres: [],
    }
  },
  methods: {
    handleFullscreenChange() {
      if (!document.fullscreenElement) {
        this.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        controls.handleResize();
      }
    },
    toggleFullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen()
        this.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);


      } else {
        this.canvasWidth = this.$refs.canvas.width;
        this.canvasHeight = this.$refs.canvas.height;
        this.$refs.canvas.requestFullscreen();
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    },
    // startRenderLoop() {
    //   const render = () => {
    //     this.renderer.render(this.scene, this.camera)
    //     requestAnimationFrame(render)
    //   }
    //   render()
    // },
    stopRenderLoop() {
      // code to stop the render loop
      cancelAnimationFrame()
    }
  },
  mounted() {
    // Get the canvas element
    const canvas = this.$refs.canvas
    const container = this.$refs.container
    // Initialize WebGL context

    // Create a THREE.Scene
    this.scene = new THREE.Scene()

    // Add a light to the scene
    const light = new THREE.DirectionalLight(0xffffff, 0.5)
    light.position.set(10, 15, 10)
    this.scene.add(light)

    // Create a THREE.WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.xr.enabled = true;
    container.appendChild(this.renderer.domElement);

    container.appendChild(ARButton.createButton(this.renderer));
    // Create a camera
    this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    // Set the camera's position
    this.camera.position.set(0, 0, 5)
    this.camera.lookAt(new THREE.Vector3(0, 0, 3));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Create 20 spheres and add them to the scene
    for (let i = 0; i < 20; i++) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      )
      sphere.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      )
      this.spheres.push(sphere)
      this.scene.add(sphere)
    }
    this.mouse = new THREE.Vector2()
    // Add a raycaster
    this.raycaster = new THREE.Raycaster()


    this.canvasWidth = this.$refs.canvas.width;
    this.canvasHeight = this.$refs.canvas.height;

    document.addEventListener('fullscreenchange', (event) => { this.handleFullscreenChange() });

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerdown', this.onPointerDown);

    // Add event listener for mouse click
    document.addEventListener('pointerdown', (event) => {
      // Calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

      // update the picking ray with the camera and mouse position
      this.raycaster.setFromCamera(this.mouse, this.camera)

      // calculate objects intersecting the picking ray
      const intersects = this.raycaster.intersectObjects(this.spheres, false)

      // if there is one (or more) intersections
      if (intersects.length > 0) {
        // remove the intersected sphere from the scene
        this.scene.remove(intersects[0].object)
        console.log(intersects[0].object + "removed")
        // remove the sphere from the array
        this.spheres.splice(this.spheres.indexOf(intersects[0].object), 1)
      }
    })

    this.renderer.setAnimationLoop(function () {

      this.renderer.render(this.scene, this.camera);

    });
    // this.startRenderLoop()

  },
  beforeDestroy() {
    this.stopRenderLoop();
  }
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
  line-height: 0;
  margin: 0;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>