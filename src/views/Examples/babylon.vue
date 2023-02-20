<template>
  <div ref="content">
    <canvas id="renderCanvas"></canvas>
  </div>
</template>

<script>
import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

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
    this.getXR("if-needed");

    var canvas = document.getElementById("renderCanvas"); // Get the canvas element

    var startRenderLoop = function (engine, canvas) {
      engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
          sceneToRender.render();
        }
      });
    }

    var engine = null;
    var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

    var createScene = async function () {
      // Create scene
      var scene = new BABYLON.Scene(engine);

      // Create simple sphere
      var sphere = BABYLON.Mesh.CreateIcoSphere("sphere", { radius: 0.2, flat: true, subdivisions: 1 }, scene);
      sphere.position.y = 3;
      sphere.material = new BABYLON.StandardMaterial("sphere material", scene)

      // Lights and camera
      var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 1.0), scene);
      light.position = new BABYLON.Vector3(0, 5, -2);
      var camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 5, -10),
        scene
      );
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.attachControl(canvas, true);

      // Default Environment
      var env = scene.createDefaultEnvironment({ enableGroundShadow: true, groundYBias: 2.8 });
      env.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"))

      // Shadows
      var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
      shadowGenerator.useBlurExponentialShadowMap = true;
      shadowGenerator.blurKernel = 32;
      shadowGenerator.addShadowCaster(sphere, true);

      // Enable xr
      const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [env.ground],
      });

      // Runs every frame to rotate the sphere
      scene.onBeforeRenderObservable.add(() => {
        sphere.rotation.y += 0.0001 * scene.getEngine().getDeltaTime();
        sphere.rotation.x += 0.0001 * scene.getEngine().getDeltaTime();
      })

      // GUI
      var plane = BABYLON.Mesh.CreatePlane("plane", 1);
      plane.position = new BABYLON.Vector3(0.4, 4, 0.4)
      var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane);
      var panel = new GUI.StackPanel();
      advancedTexture.addControl(panel);
      var header = new GUI.TextBlock();
      header.text = "Color GUI";
      header.height = "100px";
      header.color = "white";
      header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      header.fontSize = "120"
      panel.addControl(header);
      var picker = new GUI.ColorPicker();
      picker.value = sphere.material.diffuseColor;
      picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      picker.height = "350px";
      picker.width = "350px";
      picker.onValueChangedObservable.add(function (value) {
        sphere.material.diffuseColor.copyFrom(value);
      });
      panel.addControl(picker);

      return scene;
    };

    var colors = {
      seaFoam: BABYLON.Color3.FromHexString("#16a085"),
      green: BABYLON.Color3.FromHexString("#27ae60"),
      blue: BABYLON.Color3.FromHexString("#2980b9"),
      purple: BABYLON.Color3.FromHexString("#8e44ad"),
      navy: BABYLON.Color3.FromHexString("#2c3e50"),
      yellow: BABYLON.Color3.FromHexString("#f39c12"),
      orange: BABYLON.Color3.FromHexString("#d35400"),
      red: BABYLON.Color3.FromHexString("#c0392b"),
      white: BABYLON.Color3.FromHexString("#bdc3c7"),
      gray: BABYLON.Color3.FromHexString("#7f8c8d")
    }
    window.initFunction = async function () {
      var asyncEngineCreation = async function () {
        try {
          return createDefaultEngine();
        } catch (e) {
          console.log(
            "the available createEngine function failed. Creating the default engine instead"
          );
          return createDefaultEngine();
        }
      };

      engine = await asyncEngineCreation();
      if (!engine) throw "engine should not be null.";
      startRenderLoop(engine, canvas);
      scene = createScene();
    };
    initFunction().then(() => {
      scene.then((returnedScene) => {
        sceneToRender = returnedScene;
      });
    });

    // Resize
    window.addEventListener("resize", function () {
      engine.resize();
    });
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: calc(100vh - 400px);
}

.canvas-container {
  position: relative;
}
</style>