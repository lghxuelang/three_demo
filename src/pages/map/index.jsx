import React, { useEffect, useRef, useState } from 'react';
import esriLoader from '@/utils/jsapi';

import Foo from '@/components/foo';
import MapModel from '@/components/MapModels';
import styles from './index.less';

const MapPage = () => {
  const mapRef = useRef();
  const [view, setView] = useState(null);
  useEffect(() => {
    initView();
  }, []);

  const initView = async () => {
    const [SceneView, Map, Basemap, TileLayer] = await esriLoader([
      'esri/views/SceneView',
      'esri/Map',
      'esri/Basemap',
      'esri/layers/TileLayer',
    ]);

    const bLayer = new TileLayer({
      url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
      title: '午夜蓝',
    });
    const map = new Map({
      basemap: new Basemap({ baseLayers: [bLayer] }),
    });
    window.scene = new SceneView({
      map,
      container: mapRef.current,
    });
    window.scene.when(() => {
      setView(window.scene);
    });
  };

  return (
    <>
      <div className={styles.wrap} ref={mapRef}></div>
      {view ? <MapModel view={view} /> : <div />}
    </>
  );
};

export default MapPage;
