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

    let geometry = new THREE.CylinderGeometry( 50, 50, 200, 80 );
    // let material = new THREE.MeshLambertMaterial({
    //   color: 0x0000ff,
    //   opacity:0.6,
    //   transparent:true, //是否开启透明度
    // //   wireframe:true， //轮廓线
    // });
    let sphereMaterial=new THREE.MeshPhongMaterial({
        color:0x0000ff,
        specular:0x4488ee,
        shininess:12
    });//材质对象
    let mesh = new THREE.Mesh(geometry, sphereMaterial);
    mesh.translateY(120);
    scene.add(mesh);

    let circle = new THREE.SphereGeometry(70,40,40);
    let cMaterial = new THREE.MeshLambertMaterial({
        color:0x00ddff
    });
    let cMesh = new THREE.Mesh(circle,cMaterial);
    scene.add(cMesh);

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

    const renderBox = () => {
      renderer.render(scene, camera);
      //   requestAnimationFrame(renderBox);
      //   mesh.rotateY(0.01);
    };
    renderBox();
    const controls = new Orbitcontrols(camera, renderer.domElement);
    controls.addEventListener('change', renderBox);
  };

  return <div className={styles.wrap} ref={boxRef}></div>;
};

export default Bbox;
