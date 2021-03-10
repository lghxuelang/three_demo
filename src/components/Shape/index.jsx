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

    var points = [
      new THREE.Vector2(-50, -50),
      new THREE.Vector2(-60, 0),
      new THREE.Vector2(0, 50),
      new THREE.Vector2(60, 0),
      new THREE.Vector2(50, -50),
      new THREE.Vector2(-50, -50),
    ];
    // 通过顶点定义轮廓
    // var shape = new THREE.Shape(points);
    //   shape.absarc(0,0,100,0,2*Math.PI);//圆弧轮廓
    // shape可以理解为一个需要填充轮廓

    // 圆弧与直线连接
    var shape = new THREE.Shape(); //Shape对象
    var R = 50;
    // 绘制一个半径为R、圆心坐标(0, 0)的半圆弧
    shape.absarc(0, 0, R, 0, Math.PI);
    //从圆弧的一个端点(-R, 0)到(-R, -200)绘制一条直线
    shape.lineTo(-R, -200);
    // 绘制一个半径为R、圆心坐标(0, -200)的半圆弧
    shape.absarc(0, -200, R, Math.PI, 2 * Math.PI);
    //从圆弧的一个端点(R, -200)到(-R, -200)绘制一条直线
    shape.lineTo(R, 0);
    // 所谓填充：ShapeGeometry算法利用顶点计算出三角面face3数据填充轮廓
    var geometry = new THREE.ShapeGeometry(shape);
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
