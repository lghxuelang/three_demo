import * as jsload from 'esri-loader';
/**
 * js api 加载器
 * @param {*} modules
 */
export default function esriLoader(modules) {
  let dojoConfig = {
    async: true,
    // for jsapi ver. >= 4.9 兼容浏览器
    // deps: ['@dojo/framework/shim/main'],
    // for jsapi ver. <= 4.8
    // deps: ['@dojo/shim/main'],
    packages: [
      // {
      //   name: 'sample',
      //   location: 'sample/demo'
      // },
    ],
    has: {
      'esri-promise-compatibility': 1, // Use native Promises by default
      'esri-featurelayer-webgl': 1, // Enable FeatureLayer WebGL capabilities
    },
  };
  let opt = {};
  if (window.appcfg) {
    opt.url = window.appcfg.jsapiUrl;
    opt.dojoConfig = dojoConfig;
  }
  if (!jsload.utils.Promise) {
    jsload.utils.Promise = window['Promise'];
  }
  return jsload.loadModules(modules, opt);
}
