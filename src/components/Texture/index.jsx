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

    // // 纹理贴图映射到一个矩形平面上
    // var geometry = new THREE.BoxGeometry(204, 102, 100); //矩形平面
    // // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理

    // var textureLoader = new THREE.TextureLoader();
    // textureLoader.load('./images/icon.jpg', texture => {
    //     texture.rotation = Math.PI/4;
    //     texture.center.set(0.5,0.5);
    //   var material = new THREE.MeshLambertMaterial({
    //     // color: 0x0000ff,
    //     // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
    //     map: texture, //设置颜色贴图属性值
    //     side: THREE.DoubleSide,
    //   }); //材质对象Material
    //   var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    //   scene.add(mesh); //网格模型添加到场景中
    // });

    /**
     * 创建一个设置重复纹理的管道
     */
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-80, -40, 0),
      new THREE.Vector3(-70, 40, 0),
      new THREE.Vector3(70, 40, 0),
      new THREE.Vector3(80, -40, 0),
    ]);
    var tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.6, 50, false);
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./images/run.png');
    // 设置阵列模式为 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    texture.repeat.x = 20;
    var tubeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
    });
    texture.needsUpdate = true;

    var mesh = new THREE.Mesh(tubeGeometry, tubeMaterial); //网格模型对象Mesh
    scene.add(mesh); //网格模型添加到场景中

    const renderBox = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(renderBox);
      texture.offset.x -= 0.06;
    };
    renderBox();
    const controls = new Orbitcontrols(camera, renderer.domElement);
    controls.addEventListener('change', renderBox);
  };

  return <div className={styles.wrap} ref={boxRef}></div>;
};

export default Bbox;
