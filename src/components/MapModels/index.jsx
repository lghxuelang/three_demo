import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import esriLoader from '@/utils/jsapi';

let obj = {};
let earthRadius = 6378137;
const Foo = ({ view }) => {
  useEffect(() => {
    initObj();
    return () => {
      removeObj();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initObj = async () => {
    const [externalRenderers, SpatialReference] = await esriLoader([
      'esri/views/3d/externalRenderers',
      'esri/geometry/SpatialReference',
    ]);
    obj = {
      renderer: null, // three.js renderer
      camera: null, // three.js camera
      scene: null, // three.js scene
      ambient: null, // three.js ambient light source
      sun: null, // three.js sun light source

      mixer: null,
      clock: new THREE.Clock(),

      setup: function(context) {
        this.scene = new THREE.Scene();
        var axisHelper = new THREE.AxisHelper(1.2 * earthRadius);
        this.scene.add(axisHelper);

        this.renderer = new THREE.WebGLRenderer({
          context: context.gl,
          premultipliedAlpha: false,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setViewport(0, 0, view.width, view.height);

        // prevent three.js from clearing the buffers provided by the ArcGIS JS API.
        this.renderer.autoClear = false;

        /**
         * ArcGIS JS API渲染自定义离屏缓冲区，而不是默认的帧缓冲区。
         * 我们必须将这段代码注入到Three.js运行时中，以便绑定这些缓冲区而不是默认的缓冲区。
         */
        var originalSetRenderTarget = this.renderer.setRenderTarget.bind(this.renderer);
        this.renderer.setRenderTarget = function(target) {
          originalSetRenderTarget(target);
          if (target == null) {
            context.bindRenderTarget();
          }
        };

        this.sun = new THREE.DirectionalLight(0xffffff, 0.5);
        this.sun.position.set(-600, 300, 60000);
        this.scene.add(this.sun);

        this.ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambient);

        // setup the camera
        var cam = context.camera;
        this.camera = new THREE.PerspectiveCamera(cam.fovY, cam.aspect, cam.near, cam.far);

        // setup the three.js scene
        ///////////////////////////////////////////////////////////////////////////////////////

        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          './models/multi.glb',
          gltf => {
            this.animationFrame(gltf);
          },
          undefined,
          function(error) {
            console.error('Error loading Model. ', error);
          },
        );

        context.resetWebGLState();
      },
      animationFrame: function(gltf) {
        let model = gltf.scene;
        model.scale.set(300000, 300000, 300000);
        model.rotateX(Math.PI / 4);
        model.rotateY(Math.PI / 2);
        this.scene.add(model);

        this.mixer = new THREE.AnimationMixer(model);
        let animation = gltf.animations[1];
        this.mixer.clipAction(animation).play();
        let renderPos = [0, 0, 0];
        externalRenderers.toRenderCoordinates(
          view,
          [120, 36, 100],
          0,
          SpatialReference.WGS84,
          renderPos,
          0,
          1,
        );
        model.position.set(renderPos[0], renderPos[1], renderPos[2]);
      },
      render: function(context) {
        // update camera parameters
        ///////////////////////////////////////////////////////////////////////////////////
        var cam = context.camera;
        //需要调整相机的视角
        this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
        this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
        this.camera.lookAt(new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]));
        // Projection matrix can be copied directly
        this.camera.projectionMatrix.fromArray(cam.projectionMatrix);
        // update lighting
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        // view.environment.lighting.date = Date.now();
        var l = context.sunLight;
        this.sun.position.set(l.direction[0], l.direction[1], l.direction[2]);
        this.sun.intensity = l.diffuse.intensity;
        this.sun.color = new THREE.Color(
          l.diffuse.color[0],
          l.diffuse.color[1],
          l.diffuse.color[2],
        );
        this.ambient.intensity = l.ambient.intensity;
        this.ambient.color = new THREE.Color(
          l.ambient.color[0],
          l.ambient.color[1],
          l.ambient.color[2],
        );
        // draw the scene
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        this.renderer.resetGLState();
        if (this.mixer) {
          this.mixer.update(this.clock.getDelta());
        }
        this.renderer.render(this.scene, this.camera);
        // as we want to smoothly animate the ISS movement, immediately request a re-render
        externalRenderers.requestRender(view);
        // cleanup
        context.resetWebGLState();
      },
    };
    externalRenderers.add(view, obj);
  };

  const removeObj = async () => {
    const [externalRenderers] = await esriLoader(['esri/views/3d/externalRenderers']);
    externalRenderers.remove(view, obj);
  };
  return <div />;
};

export default Foo;
