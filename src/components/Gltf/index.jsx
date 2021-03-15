import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import Orbitcontrols from 'three-orbitcontrols'; //鼠标手势操作组件
// import GLTFLoader from 'three-gltf-loader';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import styles from '../index.less';

const Bbox = () => {
  const boxRef = useRef();

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let scene = new THREE.Scene();

    let axisHelper = new THREE.AxisHelper(450);
    // scene.add(axisHelper);

    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(400, 200, 300);
    scene.add(pointLight);

    let pointLight1 = new THREE.PointLight(0xffffff);
    pointLight1.position.set(-400, -200, -300);
    scene.add(pointLight1);

    let width = boxRef.current.clientWidth; //窗口宽度
    let height = boxRef.current.clientHeight; //窗口高度
    let k = width / height; //窗口宽高比
    let s = 200;
    let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(292, 109, 268);
    camera.lookAt(scene.position);

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.0;
    boxRef.current.appendChild(renderer.domElement);

    /**
     * 加载gltf模型
     */
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./models/multi.glb', gltf => {
      animationFrame(gltf);
    });
    let mixer = null,
      clock = new THREE.Clock();

    const animationFrame = gltf => {
      let model = gltf.scene;
      model.scale.set(300, 300, 300);
      model.position.x = +60;
      model.position.y = -100;
      model.position.z = +60;
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      let animation = gltf.animations[0];
      mixer.clipAction(animation).play();
    };

    const renderBox = () => {
      renderer.render(scene, camera);
      if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
      }
      requestAnimationFrame(renderBox);
    };
    renderBox();
  };

  return <div className={styles.wrap} ref={boxRef}></div>;
};

export default Bbox;
