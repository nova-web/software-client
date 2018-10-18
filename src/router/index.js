import Vue from 'vue';
import Router from 'vue-router';
import routes from './router';
import store from '../store';
Vue.use(Router);

const router = new Router({
    mode: 'hash',
    linkActiveClass: 'is-active',
    routes
});
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const userName = store.getters.getUsername;
    const token = store.getters.getCommon.token;
    if (!userName && to.path !== '/login' && !token) {
        next('/login');
    } else {
        next();
    }
});
export default router;
