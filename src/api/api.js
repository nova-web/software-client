let api = {
    //字典接口
    dict: { url: 'dict', method: 'get' },
    //登陆
    postLogin: { url: 'login', method: 'post' },
    getUserAclCodes: { url: 'getUserAclCodes', method: 'get' },
    // 用户
    getUsers: { url: 'users' },
    deleteUser: { url: 'users/:id', method: 'delete' },
    addUser: { url: 'users', method: 'post' },
    editUser: { url: 'users/:id', method: 'put' },
    // 角色
    getRoles: { url: 'roles' },
    deleteRole: { url: 'roles/:id', method: 'delete' },
    addRole: { url: 'roles', method: 'post' },
    editRole: { url: 'roles/:id', method: 'put' },
    setRoleStatus: { url: 'setRoleStatus', method: 'post' },
    acls: { url: 'acls', method: 'get' },
    setAuthorize: { url: 'setAuthorize', method: 'post' },
    setUserStatus: { url: 'setUserStatus', method: 'post' },
    //权限
    getRoleAcls: { url: 'getRoleAcls', method: 'get' },
    getAcls: { url: 'acls', method: 'get' },
    putAcls: { url: 'acls/:id', method: 'put' },
    postAclsParent: { url: 'acls', method: 'post' },
    setAclStatus: { url: 'setAclStatus', method: 'post' },
    delectAcls: { url: 'acls/:id', method: 'delete' },
    getUserAclTree: { url: 'getUserAclTree', method: 'get' },
    //产品
    getProduct: { url: 'products' },
    postProduct: { url: 'products', method: 'post' },
    deleteProduct: { url: 'products/:id', method: 'delete' },
    editProduct: { url: 'products', method: 'put' },
    getAllProduct: { url: 'product/all', method: 'get' },
    productTryout: { url: 'product/tryout', method: 'post' }, //试用
    productPublish: { url: 'product/publish', method: 'post' }, //发布
    productObtained: { url: 'product/obtained', method: 'post' }, //下架
    productWithdraw: { url: 'product/withdraw', method: 'post' },
    ProductMessage: { url: 'products/:id', method: 'get' }, //详细信息
    //版本
    getPackages: { url: 'packages', method: 'get' },
    addPackages: { url: 'packages', method: 'post' }
};

for (var k in api) {
    let urlHost = window.htp.apihost;
    let url = api[k].url;

    if (process.env.NODE_ENV === 'development') {
        urlHost = '/proxy/';
    }
    api[k].url = urlHost + url;
}

export default api;
