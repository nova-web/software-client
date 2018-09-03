const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        meta: { title: '自述文件' },
        children: [
            {
                path: '/dashboard',
                component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                meta: { title: '系统首页', keepAlive: false }
            },
            {
                path: '/table',
                component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                meta: { title: '用户管理', keepAlive: false }
            },
            {
                path: '/download',
                component: resolve => require(['../components/page/Download.vue'], resolve),
                meta: { title: '下载管理', keepAlive: false }
            },
            {
                path: '/Role',
                component: resolve => require(['../components/page/Role.vue'], resolve),
                meta: { title: '角色管理', keepAlive: false }
            },
            {
<<<<<<< HEAD
                path: '/Role/RoleOperation',
                component: resolve => require(['../components/page/RoleOperation.vue'], resolve),
                meta: { title: '角色操作', keepAlive: false }
            },
            {
=======
>>>>>>> d91c6a853d32317d01bee6df85af1e9218dfe90b
                name: 'Firmware',
                path: '/Firmware',
                component: resolve => require(['../components/page/Firmware.vue'], resolve),
                meta: { title: '固件包', keepAlive: false }
            },
            {
                path: '/tabs',
                component: resolve => require(['../components/page/Tabs.vue'], resolve),
                meta: { title: 'tab选项卡' }
            },
            {
                path: '/form',
                component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                meta: { title: '基本表单' }
            },
            {
                // 富文本编辑器组件
                path: '/editor',
                component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                meta: { title: '富文本编辑器' }
            },
            {
                // markdown组件
                path: '/markdown',
                component: resolve => require(['../components/page/Markdown.vue'], resolve),
                meta: { title: 'markdown编辑器' }
            },
            {
                // 图片上传组件
                path: '/upload',
                component: resolve => require(['../components/page/Upload.vue'], resolve),
                meta: { title: '文件上传', keepAlive: false }
            },
            {
                // vue-schart组件
                path: '/charts',
                component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                meta: { title: 'schart图表' }
            },
            {
                // 拖拽列表组件
                path: '/drag',
                component: resolve => require(['../components/page/DragList.vue'], resolve),
                meta: { title: '拖拽列表' }
            },
            {
                // 权限页面
                path: '/permission',
                component: resolve => require(['../components/page/Permission.vue'], resolve),
                meta: { title: '权限测试', permission: true }
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

export default routes;
