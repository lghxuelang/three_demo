import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols'; //鼠标手势操作组件

import styles from '../index.less';

const Bbox = () => {
  const boxRef = useRef();

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let scene = new THREE.Scene();

    let axisHelper = new THREE.AxisHelper(450);
    scene.add(axisHelper);

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
    camera.position.set(200, 300, 200);
    camera.lookAt(scene.position);

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0xb9d3ff, 1);
    boxRef.current.appendChild(renderer.domElement);

    // 创建video对象
    let video = document.createElement('video');
    video.src = './videos/movie.ogv'; // 设置视频地址
    video.autoplay = 'autoplay'; //要设置播放
    video.loop = 'loop'; //循环播放

    // video对象作为VideoTexture参数创建纹理对象
    var texture = new THREE.VideoTexture(video);
    // texture.needsUpdate = true;
    var geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
    let normal = new THREE.TextureLoader().load('./images/normal.jpg');
    var material = new THREE.MeshPhongMaterial({
      map: texture, // 设置纹理贴图
      normalMap:normal,
      side: THREE.DoubleSide,
    }); //材质对象Material
    
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    scene.add(mesh); //网格模型添加到场景中
    // material.map = texture;

    const renderBox = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(renderBox);
    };
    renderBox();
    const controls = new Orbitcontrols(camera, renderer.domElement);
    controls.addEventListener('change', renderBox);
  };

  return <div className={styles.wrap} ref={boxRef}></div>;
};

export default Bbox;
