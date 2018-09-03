let api = {
    getUsers: { url: 'api/users', method: 'get' },
    getRoles: { url: 'api/roles', method: 'get' },
    deleteRole: { url: 'api/roles/:id', method: 'get' },
    postRole: { url: 'api/roles' }
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
