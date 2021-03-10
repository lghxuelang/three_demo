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

    // // 绘制一个U型轮廓
    // var R = 80; //圆弧半径
    // var arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);
    // // 半圆弧的一个端点作为直线的一个端点
    // var line1 = new THREE.LineCurve(new THREE.Vector2(R, 200, 0), new THREE.Vector2(R, 0, 0));
    // var line2 = new THREE.LineCurve(new THREE.Vector2(-R, 0, 0), new THREE.Vector2(-R, 200, 0));
    // // 创建组合曲线对象CurvePath
    // var CurvePath = new THREE.CurvePath();
    // // 把多个线条插入到CurvePath中
    // CurvePath.curves.push(line1, arc, line2);
    // // path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
    // var geometry = new THREE.TubeGeometry(CurvePath, 40, 2, 25);
    // //材质对象
    // var material=new THREE.MeshPhongMaterial({
    //     color:0x0000ff,//三角面颜色
    //     side:THREE.DoubleSide//两面可见
    // });//材质对象
    // //线条模型对象
    // var line = new THREE.Line(geometry, material);
    // scene.add(line); //线条对象添加到场景中

    /**
     * 创建旋转网格模型
     */
    var shape = new THREE.Shape(); //创建Shape对象
    var points = [
      //定位定点
      new THREE.Vector2(50, 60),
      new THREE.Vector2(25, 0),
      new THREE.Vector2(50, -60),
    ];
    shape.splineThru(points); //顶点带入样条插值计算函数
    var splinePoints = shape.getPoints(20); //插值计算细分数20
    var geometry = new THREE.LatheGeometry(splinePoints, 5); //旋转造型
    var material = new THREE.MeshPhongMaterial({
      color: 0xff00ff, //三角面颜色
      side: THREE.DoubleSide, //两面可见
    }); //材质对象
    material.wireframe = false; //线条模式渲染(查看细分数)
    var mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
    scene.add(mesh); //旋转网格模型添加到场景中

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
