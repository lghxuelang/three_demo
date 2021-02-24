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

    //类型数组创建顶点颜色color数据
    var colors = new Float32Array([
      1,
      0,
      0, //顶点1颜色
      0,
      1,
      0, //顶点2颜色
      0,
      0,
      1, //顶点3颜色

      1,
      1,
      0, //顶点4颜色
      0,
      1,
      1, //顶点5颜色
      1,
      0,
      1, //顶点6颜色
    ]);
    // 设置几何体attributes属性的颜色color属性
    geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
    let meshMetarils = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors, //以顶点颜色为准
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
