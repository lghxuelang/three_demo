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

    //创建两个网格模型mesh1、mesh2
    var geometry = new THREE.BoxGeometry(20, 20, 20);
    var material1 = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    var group = new THREE.Group();

    var mesh1 = new THREE.Mesh(geometry, material1);

    mesh1.position.set(50, 50, 50);
    //把mesh1型插入到组group中，mesh1作为group的子对象
    group.add(mesh1);
    //把group插入到场景中作为场景子对象
    scene.add(group);
    group.position.set(50, 10, 10);
    // .position属性获得本地坐标
    console.log('本地坐标', mesh1.position);
    // getWorldPosition()方法获得世界坐标
    //该语句默认在threejs渲染的过程中执行,如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
    scene.updateMatrixWorld(true);
    var worldPosition = new THREE.Vector3();
    mesh1.getWorldPosition(worldPosition);
    console.log('世界坐标', worldPosition);

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
