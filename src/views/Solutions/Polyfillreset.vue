<template>
  <div class="content">
  </div>
</template>

<script scoped>
import * as THREE from 'three'
export default {
  data() {
    return {
      xrSession: null,
      webxrPolyfill: null,
      raycaster: null,
      mouse: null,
      radius: null,
      room: null,
    }
  },
  methods: {
    initScene() {
      this.radius = 0.08

      this.room = new THREE.LineSegments(
        new BoxLineGeometry(6, 6, 6, 10, 10, 10),
        new THREE.LineBasicMaterial({ color: 0x808080 })
      );
      this.room.geometry.translate(0, 3, 0);
      this.scene.add(this.room);

      const geometry = new THREE.IcosahredronBufferGeometry(this.radius, 2);
      for (let i = 0; i < 200; i++) {
        const object = new THREE.Mesh(geometry, new THREE)
      }
    },
    endSession() {
      if (this.xrSession) {
        this.xrSession.end();
        this.xrSession = null;
      }
    },
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
    async activateXR() {
      //Adaptation of the Base Version to work in the current Frame of the project. Added Session-End needed Properties.
      const xr = await this.getXR("if-needed");
      if (this.webxrPolyfill) {
        console.log('WebXR Polyfill active');
      } else {
        console.log('WebXR Polyfill not active');
      }
      // Add a canvas element and initialize a WebGL context that is compatible with WebXR.
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl", { xrCompatible: true });

      const scene = new THREE.Scene();

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
      directionalLight.position.set(10, 15, 10);
      scene.add(directionalLight);

      // Set up the WebGLRenderer, which handles rendering to the session's base layer.
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        preserveDrawingBuffer: true,
        canvas: canvas,
        context: gl
      });
      renderer.autoClear = false;

      // The API directly updates the camera matrices.
      // Disable matrix auto updates so three.js doesn't attempt
      // to handle the matrices independently.
      const camera = new THREE.PerspectiveCamera();
      camera.matrixAutoUpdate = false;

      let sessionType;
      let session;


      await navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
        if (supported) {
          sessionType = "immersive-ar";
          console.log('WebXR Session-Mode/Feature: ' + sessionType + '/' + sessionFeatures);
          try {
            session = navigator.xr.requestSession(sessionType);
            session.updateRenderState({
              baseLayer: new XRWebGLLayer(session, gl)
            });
          } catch (error) {
            console.log("Error starting XR session: ", error)
          }
        } else {
          sessionType = "inline";
          console.log('WebXR Session-Mode/Feature: ' + sessionType);
          try {
            session = navigator.xr.requestSession(sessionType);
            session.updateRenderState({
              baseLayer: new XRWebGLLayer(session, gl)
            });
          } catch (error) {
            console.log("Error starting XR session: ", error)
          }
        }
      });
      console.log('WebXR Session-Mode: ' + sessionType);
      // Initialize a WebXR session using "immersive-ar" or "inline" if it isn't supported.
      // const session = await navigator.xr.requestSession(sessionType, { requiredFeatures: ['hit-test'] })

      this.xrSession = session;
      // A 'local' reference space has a native origin that is located
      // near the viewer's position at the time the session was created.
      var viewerSpace = null;
      // const referenceSpace = await session.requestReferenceSpace('local');
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      let intersects;
      // Create another XRReferenceSpace that has the viewer as the origin.
      if (sessionType == "immersive-ar") {
        viewerSpace = await session.requestReferenceSpace('viewer');
      }

      // Perform hit testing using the viewer as origin.
      // const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

      const loader = new THREE.GLTFLoader();
      let reticle;
      loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", function (gltf) {
        reticle = gltf.scene;
        reticle.visible = false;
        scene.add(reticle);
      })

      let flower;
      loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/sunflower/sunflower.gltf", function (gltf) {
        flower = gltf.scene;
      });

      window.addEventListener('mousemove', this.onMouseMove, false);

      canvas.addEventListener('click', (onClick) => {
        //calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        //update the picking ray with the camera and mouse position
        raycaster.setFromCamera(this.mouse, camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
          const clone = flower.clone();
          clone.position.copy(reticle.position);
          scene.add(clone);
        }
      });

      // session.addEventListener("select", (event) => {
      //   if (flower) {
      //     const clone = flower.clone();
      //     clone.position.copy(reticle.position);
      //     scene.add(clone);
      //   }
      // });

      // Create a render loop that allows us to draw on the AR view.
      const onXRFrame = (time, frame) => {

        // Queue up the next draw request.
        session.requestAnimationFrame(onXRFrame);

        // Bind the graphics framebuffer to the baseLayer's framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer)

        // Retrieve the pose of the device.
        // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
        const pose = frame.getViewerPose();
        if (pose) {
          // In mobile AR, we only have one view.
          const view = pose.views[0];

          const viewport = session.renderState.baseLayer.getViewport(view);
          renderer.setSize(viewport.width, viewport.height)

          // Use the view's transform matrix and projection matrix to configure the THREE.camera.
          camera.matrix.fromArray(view.transform.matrix)
          camera.projectionMatrix.fromArray(view.projectionMatrix);
          camera.updateMatrixWorld(true);

          raycaster.setFromCamera(mouse, camera);
          intersects = raycaster.intersectObjects(scene.children);
          if (intersects.length > 0 && reticle) {
            reticle.visible = true;
            reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
            reticle.updateMatrixWorld(true);
          }

          // const hitTestResults = frame.getHitTestResults(hitTestSource);
          // if (hitTestResults.length > 0 && reticle) {
          //   const hitPose = hitTestResults[0].getPose(referenceSpace);
          //   reticle.visible = true;
          //   reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
          //   reticle.updateMatrixWorld(true);
          // }

          // Render the scene with THREE.WebGLRenderer.
          renderer.render(scene, camera)
        }
      }
      function animate() {
        requestAnimationFrame(animate);
        // render the scene
        renderer.render(scene, camera);
      }
      animate();
    }
  },
  beforeDestroy() {
    this.endSession();
  },
  mounted() {
    this.activateXR();
  }
}
</script>

<style scoped>

</style>