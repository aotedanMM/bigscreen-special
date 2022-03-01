import Vue, { DirectiveOptions } from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/index';
import VueC from 'vue-container';
import VideoPlayer from 'vue-video-player';
import moment from 'moment'; // 导入moment
import echarts from 'echarts';
import 'echarts-gl';

Vue.prototype.$moment = moment; // 赋值使用
Vue.prototype.$moment.locale('zh-cn');
Vue.prototype.$echarts = echarts;
const hls = require('videojs-contrib-hls.js'); // /src/videojs.hlsjs.js
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';

import 'element-ui/packages/theme-chalk/lib/index.css';

import publishObjectPath from '@/util/configRegistry';

import {messagePlugin} from '@/util/message';

// git的公共样式
import '@/assets/css/gisUI/gisCommon.less';

Vue.config.productionTip = false;
// import $ from 'jquery';
// const $ = require('jquery');
// window.$ = $;
// window.jQuery = $;

// ztree树
import 'ztree';
// egis 三维资源根目录
(window as any).EGIS_BASE_URL = './deps/egis/static/';
import * as ElementUI from 'element-ui';
import * as directives from '@/directives';

// 注册全局指令
Object.keys(directives).forEach((key: any) => {
    Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key]);
});

Vue.use(ElementUI);

Vue.use(VueC);

Vue.use(messagePlugin, 'messsageBus');
Vue.use(hls);
Vue.use(VideoPlayer);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
