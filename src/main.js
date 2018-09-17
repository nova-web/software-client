import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import 'babel-polyfill';
import Blob from './utils/Blob.js';
import Export2Excel from './utils/Export2Excel.js';
import components from './components/global/index.js'; // 加载公共组件
Object.keys(components).forEach(key => {
    var name = key.replace(/(\w)/, v => v.toUpperCase()); //首字母大写
    Vue.component(`ve${name}`, components[key]);
});
Vue.use(ElementUI, { size: 'small' });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
