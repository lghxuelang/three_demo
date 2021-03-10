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

    /**
     * 创建扫描网格模型
     */
    var shape = new THREE.Shape();
    /**四条直线绘制一个矩形轮廓*/
    shape.moveTo(0, 0); //起点
    shape.lineTo(0, 10); //第2点
    shape.lineTo(10, 10); //第3点
    shape.lineTo(10, 0); //第4点
    shape.lineTo(0, 0); //第5点

    /**创建轮廓的扫描轨迹(3D样条曲线)*/
    var curve = new THREE.SplineCurve3([
      new THREE.Vector3(-10, -50, -50),
      new THREE.Vector3(10, 0, 0),
      new THREE.Vector3(8, 50, 50),
      new THREE.Vector3(-5, 0, 100),
      new THREE.Vector3(-5, 100, 100),
    ]);
    var geometry = new THREE.ExtrudeGeometry( //拉伸造型
      shape, //二维轮廓
      //拉伸参数
      {
        bevelEnabled: false, //无倒角
        extrudePath: curve, //选择扫描轨迹
        steps: 50, //扫描方向细分数
      },
    );
    var material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide, //两面可见
      wireframe: false, //是否显示网格线
    }); //材质对象
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象
    scene.add(mesh);

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
