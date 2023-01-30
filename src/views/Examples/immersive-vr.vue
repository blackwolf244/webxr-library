<template>
  <div ref="content">
  </div>
</template>

<script>
import { createToast } from 'mosha-vue-toastify';
// import the styling for the toast
import 'mosha-vue-toastify/dist/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

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
    function vrbutton() {
      const button = document.createElement('button');
      async function onSessionStarted(session) {

        session.addEventListener('end', onSessionEnded);

        await renderer.xr.setSession(session);
        button.textContent = 'EXIT VR';

        currentSession = session;

      }

      function onSessionEnded( /*event*/) {

        currentSession.removeEventListener('end', onSessionEnded);

        button.textContent = 'ENTER VR';

        currentSession = null;

      }

      button.textContent = 'ENTER VR';
      button.onclick = function () {

        if (currentSession === null) {

          // WebXR's requestReferenceSpace only works if the corresponding feature
          // was requested at session creation time. For simplicity, just ask for
          // the interesting ones as optional features, but be aware that the
          // requestReferenceSpace call will fail if it turns out to be unavailable.
          // ('local' is always available for immersive sessions and doesn't need to
          // be requested separately.)

          const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'] };
          navigator.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted);

        } else {

          currentSession.end();

        }

      };
      function disableButton() {

        button.style.display = '';

        button.style.cursor = 'auto';
        button.style.left = 'calc(50% - 75px)';
        button.style.width = '150px';

        button.onmouseenter = null;
        button.onmouseleave = null;

        button.onclick = null;

      }
      function showWebXRNotFound() {

        disableButton();

        button.textContent = 'VR NOT SUPPORTED';

      }
      function showVRNotAllowed(exception) {

        disableButton();

        console.warn('Exception when trying to call xr.isSessionSupported', exception);

        button.textContent = 'VR NOT ALLOWED';

      }

      if ('xr' in navigator) {

        button.id = 'VRButton';

        navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {

          supported ? showEnterVR() : showWebXRNotFound();

          if (supported) {

            button.click();

          }

        }).catch(showVRNotAllowed);

        return button;

      } else {

        const message = document.createElement('a');

        if (window.isSecureContext === false) {

          message.href = document.location.href.replace(/^http:/, 'https:');
          message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

        } else {

          message.href = 'https://immersiveweb.dev/';
          message.innerHTML = 'WEBXR NOT AVAILABLE';

        }

        message.style.left = 'calc(50% - 90px)';
        message.style.width = '180px';
        message.style.textDecoration = 'none';

        stylizeElement(message);

        return message;

      }
    }
    await function vr() {
      const test = navigator.xr.isSessionSupported("immersive-vr", { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'] }).then((supported) => {
        if (supported) {
          try {
            const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'] };
            session = navigator.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted);
          } catch (error) {
            console.log("Error starting XR session: " + error)
            this.error(error);
          }

        } else {
          this.warning();
        }
      });

      if (test) {
        try {
          const referenceSpace = session.requestReferenceSpace('local')
          // Create another XRReferenceSpace that has the viewer as the origin.
          const viewerSpace = session.requestReferenceSpace('viewer');
          // Perform hit testing using the viewer as origin.
          const hitTestSource = session.requestHitTestSource({ space: viewerSpace });

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

    function init() {

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.set(0, 0, 3);

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