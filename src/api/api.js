let api = {
    postLogin: { url: 'login' },
    getUsers: { url: 'users', method: 'get' },
    getRoles: { url: 'roles', method: 'get' },
    deleteRole: { url: 'roles/:id', method: 'get' },
    postRole: { url: 'roles' },
    getProduct: { url: 'products' },
    postProduct: { url: 'products', method: 'post' }
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
