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

    var axisHelper = new THREE.AxisHelper(450);
    scene.add(axisHelper);

    let geometry = new THREE.Geometry();

    // 创建一个立方体
    // v6----- v5
    // /|  /|
    // v1------v0|
    // | |  | |
    // | |v7---|-|v4
    // |/  |/
    // v2------v3

    let vertices = [
      new THREE.Vector3(10, 10, 10), //v0
      new THREE.Vector3(-10, 10, 10), //v1
      new THREE.Vector3(-10, -10, 10), //v2
      new THREE.Vector3(10, -10, 10), //v3
      new THREE.Vector3(10, -10, -10), //v4
      new THREE.Vector3(10, 10, -10), //v5
      new THREE.Vector3(-10, 10, -10), //v6
      new THREE.Vector3(-10, -10, -10), //v7
    ];
    geometry.vertices = vertices;

    //如果要绘制的面是朝向相机的，那这个面的顶点的书写方式是逆时针绘制的
    // 一个面是有 两个三角形构成
    let faces = [
      new THREE.Face3(0, 1, 2),
      new THREE.Face3(0, 2, 3),
      new THREE.Face3(0, 3, 4),
      new THREE.Face3(0, 4, 5),
      new THREE.Face3(1, 6, 7),
    //   new THREE.Face3(1, 7, 2),
    //   new THREE.Face3(6, 5, 4),
    //   new THREE.Face3(6, 4, 7),
    //   new THREE.Face3(5, 6, 1),
    //   new THREE.Face3(5, 1, 0),
    //   new THREE.Face3(3, 2, 7),
    //   new THREE.Face3(3, 7, 4),
    ];
    geometry.faces = faces;

    geometry.computeFaceNormals();
    geometry.scale(10,2,5);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });

    let cube = new THREE.Mesh(geometry, cubeMaterial);

    scene.add(cube);

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
