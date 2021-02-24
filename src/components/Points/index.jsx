import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols'; //鼠标手势操作组件

import styles from './index.less';

const Bbox = () => {
  const boxRef = useRef();

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let scene = new THREE.Scene();

    let axisHelper = new THREE.AxisHelper(450);
    scene.add(axisHelper);

    let geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象

    let vertices = new Float32Array([
      0,
      0,
      0, //顶点1坐标
      50,
      0,
      0, //顶点2坐标
      0,
      100,
      0, //顶点3坐标
      0,
      0,
      10, //顶点4坐标
      0,
      0,
      100, //顶点5坐标
      50,
      0,
      10, //顶点6坐标
    ]); // 创建属性缓冲区对象

    let attribue = new THREE.BufferAttribute(vertices, 3);

    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue;

    let pointMetarils = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 10,
    });
    let points = new THREE.Points(geometry, pointMetarils);
    scene.add(points);

    let lineMetarils = new THREE.LineBasicMaterial({
      color: 0x0055ff,
    });
    let line = new THREE.Line(geometry, lineMetarils);
    scene.add(line);

    let meshMetarils = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide, //两面可见
    });
    let mesh = new THREE.Mesh(geometry, meshMetarils);
    scene.add(mesh);

    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(400, 200, 300);
    scene.add(pointLight);

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

    const renderBox = () => {
      renderer.render(scene, camera);
    };
    renderBox();
    const controls = new Orbitcontrols(camera, renderer.domElement);
    controls.addEventListener('change', renderBox);
  };

  return <div className={styles.wrap} ref={boxRef}></div>;
};

export default Bbox;
