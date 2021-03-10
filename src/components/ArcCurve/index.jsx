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

    //圆弧
    // let geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    // let arc = new THREE.ArcCurve(100, 100, 50, 0, Math.PI * 2, false);
    // let points = arc.getPoints(50); //分50段，返回51个点
    // geometry.setFromPoints(points);
    // let material = new THREE.LineBasicMaterial({
    //   color: 0xff0000,
    // });
    // let line = new THREE.Line(geometry, material);
    // scene.add(line);

    //三维直线
    // var geometry1 = new THREE.Geometry(); //声明一个几何体对象Geometry
    // var p1 = new THREE.Vector3(10, 10, 10); //顶点1坐标
    // var p2 = new THREE.Vector3(100, 100, 100); //顶点2坐标
    // var p3 = new THREE.Vector3(200,100,150);
    // // var LineCurve = new THREE.LineCurve3(p1, p2);    //三维直线
    // var LineCurve = new THREE.CatmullRomCurve3([p1,p2,p3]);       //三维样条曲线
    // var pointArr = LineCurve.getPoints(10); //线条模型对象
    // geometry1.setFromPoints(pointArr);
    // let material1 = new THREE.LineBasicMaterial({
    //     color: 0xffff00,
    //   });
    // let line1 = new THREE.Line(geometry1, material1);
    // scene.add(line1); //线条对象添加到场景中

    var geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    // 绘制一个U型轮廓
    var R = 80; //圆弧半径
    var arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);
    // 半圆弧的一个端点作为直线的一个端点
    var line1 = new THREE.LineCurve(new THREE.Vector2(R, 200, 0), new THREE.Vector2(R, 0, 0));
    var line2 = new THREE.LineCurve(new THREE.Vector2(-R, 0, 0), new THREE.Vector2(-R, 200, 0));
    // 创建组合曲线对象CurvePath
    var CurvePath = new THREE.CurvePath();
    // 把多个线条插入到CurvePath中
    CurvePath.curves.push(line1, arc, line2);
    //分段数200
    var points = CurvePath.getPoints(200);
    // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    geometry.setFromPoints(points);
    //材质对象
    var material = new THREE.LineBasicMaterial({
      color: 0x000000,
    });
    //线条模型对象
    var line = new THREE.Line(geometry, material);
    scene.add(line); //线条对象添加到场景中

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
