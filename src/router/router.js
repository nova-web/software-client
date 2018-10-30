import { serialize, getSen } from '../utils';
import store from '../store';
import router from '.';
const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/',
        component: resolve => require(['../components/common/home.vue'], resolve),
        meta: { title: '自述文件' },
        children: [
            {
                path: '/index',
                component: resolve => require(['../components/page/index.vue'], resolve),
                meta: { title: '首页', keepAlive: false, code: '' }
            },
            {
                path: '/upload',
                component: resolve => require(['../components/page/Upload.vue'], resolve),
                meta: { title: '下载', keepAlive: false, code: '' }
            }
        ]
    },
    {
        path: '/login',
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
        path: '/404',
        component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
        path: '/403',
        component: resolve => require(['../components/page/403.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/404'
    }
];

let routerArr = [
    {
        path: '/user',
        component: resolve => require(['../components/page/User.vue'], resolve),
        meta: { title: '用户管理', keepAlive: false, code: 'YHGL' }
    },
    {
        path: '/product',
        component: resolve => require(['../components/page/product.vue'], resolve),
        meta: { title: '产品管理', keepAlive: false, code: 'CPLB' }
    },
    {
        path: '/Role',
        component: resolve => require(['../components/page/Role.vue'], resolve),
        meta: { title: '角色管理', keepAlive: false, code: 'JSGL' }
    },
    {
        path: '/alc',
        component: resolve => require(['../components/page/alc.vue'], resolve),
        meta: { title: '功能管理', keepAlive: false, code: 'GNGL' }
    },
    {
        name: 'productDetails',
        path: '/productDetails',
        component: resolve => require(['../components/page/productDetails.vue'], resolve),
        meta: { title: '产品详情', keepAlive: false, code: 'CPGL' }
    },
    {
        name: 'edition',
        path: '/edition',
        component: resolve => require(['../components/page/edition.vue'], resolve),
        meta: { title: '版本管理', keepAlive: false, code: 'BBLB' }
    }
];
// console.log(store.getters.getAlcs);
if (store.getters.getAlcs.length) {
    routerArr = routerArr.filter(item => {
        return store.getters.getAlcs.findIndex(alcs => alcs.code === item.meta.code) > -1;
    });
    routes.forEach(item => {
        if (item.children) {
            item.children = item.children.concat(routerArr);
        }
    });
}
export default routes;
