<template>
  <div>
    <button @click="activateXR">Start Hello WebXR</button>
  </div>
</template>

<script>
import * as THREE from 'three'
import { createToast } from 'mosha-vue-toastify';
// import the styling for the toast
import 'mosha-vue-toastify/dist/style.css'
export default {

  data() {
    return {
      xrSession: null,
      webxrPolyfill: null,
    }
  },
  methods: {
    error(error) {
      createToast({
        title: "Something went wrong: " + (error || ""),
        description: 'Please reload the page.'
      },
        {
          transition: 'slide',
          type: 'error',
          showIcon: true,
          timeout: 8000,
        })
    },
    warning(error) {
      createToast({
        title: "Error starting XR session: " + (error || ""),
        description: 'This Demo only works on AR-Compatible Devices'
      },
        {
          transition: 'slide',
          type: 'warning',
          showIcon: true,
          timeout: 6000,
        })
    },
    endSession() {
      if (this.xrSession) {
        this.xrSession.end();
        this.xrSession = null;
      }
    },
    async getXR(usePolyfill) {
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
      let sessionFeatures;
      let session;


      const test = await navigator.xr.isSessionSupported("immersive-ar", ["hit-test"]).then((supported) => {
        if (supported) {
          sessionType = "immersive-ar";
          sessionFeatures = "hit-test";
          console.log('WebXR Session-Mode/Feature: ' + sessionType + '/' + sessionFeatures);
          try {
            session = navigator.xr.requestSession(sessionType, { requiredFeatures: [sessionFeatures] });
            session.updateRenderState({
              baseLayer: new XRWebGLLayer(session, gl)
            });
          } catch (error) {
            console.log("Error starting XR session: " + error)
            this.error(error);
          }

        } else {
          this.warning();
        }
      });

      this.xrSession = session;
      // A 'local' reference space has a native origin that is located
      // near the viewer's position at the time the session was created.
      if (test) {
        try {
          const referenceSpace = await session.requestReferenceSpace('local')
          // Create another XRReferenceSpace that has the viewer as the origin.
          const viewerSpace = await session.requestReferenceSpace('viewer');
          // Perform hit testing using the viewer as origin.
          const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

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

          session.addEventListener("select", (event) => {
            if (flower) {
              const clone = flower.clone();
              clone.position.copy(reticle.position);
              scene.add(clone);
            }
          });

          // Create a render loop that allows us to draw on the AR view.
          const onXRFrame = (time, frame) => {

            // Queue up the next draw request.
            session.requestAnimationFrame(onXRFrame);

            // Bind the graphics framebuffer to the baseLayer's framebuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer)

            // Retrieve the pose of the device.
            // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
            const pose = frame.getViewerPose(referenceSpace);
            if (pose) {
              // In mobile AR, we only have one view.
              const view = pose.views[0];

              const viewport = session.renderState.baseLayer.getViewport(view);
              renderer.setSize(viewport.width, viewport.height)

              // Use the view's transform matrix and projection matrix to configure the THREE.camera.
              camera.matrix.fromArray(view.transform.matrix)
              camera.projectionMatrix.fromArray(view.projectionMatrix);
              camera.updateMatrixWorld(true);

              const hitTestResults = frame.getHitTestResults(hitTestSource);
              if (hitTestResults.length > 0 && reticle) {
                const hitPose = hitTestResults[0].getPose(referenceSpace);
                reticle.visible = true;
                reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
                reticle.updateMatrixWorld(true);
              }

              // Render the scene with THREE.WebGLRenderer.
              renderer.render(scene, camera)
            }
            session.requestAnimationFrame(onXRFrame);
          }
        } catch (error) {
          console.log("Error Setting Reference-Space for AR" + error)
          error(error)
        }
      }



    }
  },
  beforeDestroy() {
    this.endSession();
  },
}
</script>

<style scoped>

</style>