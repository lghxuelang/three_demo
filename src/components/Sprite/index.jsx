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
    camera.position.set(292, 109, 268);
    camera.lookAt(scene.position);

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    boxRef.current.appendChild(renderer.domElement);

    // /**
    //  * 精灵创建树林效果
    //  */
    // // 加载树纹理贴图
    // var textureTree = new THREE.TextureLoader().load('./images/tree.png');

    // // 批量创建表示一个树的精灵模型
    // for (let i = 0; i < 100; i++) {
    //   var spriteMaterial = new THREE.SpriteMaterial({
    //     map: textureTree, //设置精灵纹理贴图
    //   });
    //   // 创建精灵模型对象
    //   var sprite = new THREE.Sprite(spriteMaterial);
    //   scene.add(sprite);
    //   // 控制精灵大小,
    //   sprite.scale.set(100, 100, 1); //// 只需要设置x、y两个分量就可以
    //   var k1 = Math.random() - 0.5;
    //   var k2 = Math.random() - 0.5;
    //   // 设置精灵模型位置，在xoz平面上随机分布
    //   sprite.position.set(1000 * k1, 50, 1000 * k2);
    // }

    /**
     * 精灵创建下雨效果
     */
    // 加载雨滴理贴图
    var textureTree = new THREE.TextureLoader().load('./images/rain.png');
    // 批量创建表示雨滴的精灵模型
    let rainGroup = new THREE.Group();
    for (let i = 0; i < 80; i++) {
      var spriteMaterial = new THREE.SpriteMaterial({
        map: textureTree, //设置精灵纹理贴图
      });
      // 创建精灵模型对象
      var sprite = new THREE.Sprite(spriteMaterial);
      //   scene.add(sprite);
      rainGroup.add(sprite);
      // 控制精灵大小,
      sprite.scale.set(8, 10, 1); //// 只需要设置x、y两个分量就可以
      var k1 = Math.random() - 0.5;
      var k2 = Math.random() - 0.5;
      var k3 = Math.random() - 0.5;
      // 设置精灵模型位置，在整个空间上上随机分布
      sprite.position.set(200 * k1, 200 * k3, 200 * k2);
    }

    scene.add(rainGroup);
    var clock = new THREE.Clock();

    const renderBox = () => {
      rainGroup.children.forEach(rain => {
        rain.position.y -= 1*Math.random();
        if (rain.position.y < 0) {
          rain.position.y = 200;
        }
      });
      renderer.render(scene, camera);
      requestAnimationFrame(renderBox);
    };
    renderBox();
    const controls = new Orbitcontrols(camera, renderer.domElement);
    controls.addEventListener('change', renderBox);
  };

  return <div className={styles.wrap} ref={boxRef}></div>;
};

export default Bbox;
