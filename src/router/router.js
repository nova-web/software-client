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
            }
        ]
    },
    {
        path: '/upload',
        component: resolve => require(['../components/page/upload.vue'], resolve),
        meta: { title: '下载', keepAlive: false, code: '' }
    },
    {
        path: '/login',
        component: resolve => require(['../components/page/login.vue'], resolve)
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
        path: '/product',
        component: resolve => require(['../components/page/product.vue'], resolve),
        meta: { title: '产品管理', keepAlive: false, code: 'CPLB' }
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
        meta: { title: '版本列表', keepAlive: false, code: 'BBLB' }
    },
    {
        path: '/user',
        component: resolve => require(['../components/page/user.vue'], resolve),
        meta: { title: '用户管理', keepAlive: false, code: 'YHGL' }
    },
    {
        path: '/role',
        component: resolve => require(['../components/page/role.vue'], resolve),
        meta: { title: '角色管理', keepAlive: false, code: 'JSGL' }
    },
    {
        path: '/alc',
        component: resolve => require(['../components/page/alc.vue'], resolve),
        meta: { title: '权限管理', keepAlive: false, code: 'GNGL' }
    },
    // nie
    {
        name: 'syslog',
        path: '/syslog',
        component: resolve => require(['../components/page/syslog.vue'], resolve),
        meta: { title: '操作审计', keepAlive: false, code: 'CZSJ' }
    },
    {
        name: 'sysctrl',
        path: '/sysctrl',
        component: resolve => require(['../components/page/sysctrl.vue'], resolve),
        meta: { title: '系统控制', keepAlive: false, code: 'XTKZ' }
    },
    {
        name: 'statistics',
        path: '/statistics',
        component: resolve => require(['../components/page/statistics.vue'], resolve),
        meta: { title: '统计分析', keepAlive: false, code: 'TJFX' }
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
    if (routerArr.length) {
        routes[0].redirect = routerArr[0].path;
    }
}
export default routes;
