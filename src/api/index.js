import axios from 'axios';
import api from './api';
import { Loading, Message } from 'element-ui';
import store from '../store';
import qs from 'qs';
import routes from '../router';
import { isArray, getCookie } from '../utils';

let loading = false;
let timer = null;
let loadingInstance;

axios.defaults.timeout = 1000000;

//添加请求拦截器
axios.interceptors.request.use(
    config => {
        loading = true;
        return config;
    },
    error => {
        loading = false;
        loadingInstance.close();
        return Promise.reject(error);
    }
);

//添加响应拦截器
axios.interceptors.response.use(
    response => {
        loading = false;
        if (loadingInstance) {
            loadingInstance.close();
        }
        return response;
    },
    error => {
        console.log(error.response);
        loading = false;
        if (loadingInstance) {
            loadingInstance.close();
        }
        let message = '';
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    message = '错误请求';
                    break;
                case 401:
                    message = '未授权，请重新登录';
                    break;
                case 403:
                    message = '拒绝访问';
                    break;
                case 404:
                    message = '请求错误,未找到该资源';
                    break;
                case 405:
                    message = '请求方法未允许';
                    break;
                case 408:
                    message = '请求超时';
                    break;
                case 500:
                    message = '服务器端出错';
                    break;
                case 501:
                    message = '网络未实现';
                    break;
                case 502:
                    message = '网络错误';
                    break;
                case 503:
                    message = '服务不可用';
                    break;
                case 504:
                    message = '网络超时';
                    break;
                case 505:
                    message = 'http版本不支持该请求';
                    break;
                default:
                    message = `连接错误${error.response.status}`;
            }
        } else {
            error.response = {};
            message = '连接到服务器失败';
        }
        error.response.message = message;
        return Promise.resolve(error.response);
    }
);

//检查接口请求状态

function checkStatus(resolve, reject, response, config) {
    let tipStr = ''; //提示的字符串
    if (response && response.status === 200) {
        if (response.data.errorCode === 1) {
            resolve(response.data.data);
        } else {
            if (!config.error) {
                Message(response.data.errorMsg);
            }
            reject(response.data);
        }
    } else if (response.status === 401) {
        Message(response.message || '请求失败');
        setTimeout(() => {
            routes.push('/login');
        }, 1000);
    } else {
        Message(response.message || '请求失败');
        reject(response.message);
    }
}

let xhr = config => {
    //加载动画
    clearTimeout(timer);
    timer = setTimeout(() => {
        if (loading) {
            loadingInstance = Loading.service();
        }
    }, 2000);

    if (config instanceof Array) {
        return axios.all(config);
    } else {
        let name = config.name;
        let data = config.data || {};
        let { url, method = 'get', isForm } = api[name];
        if (/:id/.test(url)) {
            url = url.replace(':id', config.id);
        }

        if (method === 'post') {
            if (isForm) {
                data = qs.stringify(data);
            } else {
                data = JSON.stringify(data);
            }
        }
        let headers = {
            'x-csrf-token': getCookie('csrfToken'),
            token: store.getters.getCommon.token,
            'Content-Type': isForm ? 'application/x-www-form-urlencoded; charset=UTF-8' : 'application/json; charset=UTF-8'
        };

        switch (method) {
            case 'get':
            case 'delete':
                return new Promise((resolve, reject) => {
                    axios[method](url, {
                        params: data,
                        headers
                    })
                        .then(res => {
                            checkStatus(resolve, reject, res, config);
                        })
                        .catch(res => {
                            reject(res);
                        });
                });
            case 'post':
            case 'put':
                return new Promise((resolve, reject) => {
                    axios[method](url, data, {
                        headers
                    })
                        .then(res => {
                            checkStatus(resolve, reject, res, config);
                        })
                        .catch(res => {
                            reject(res);
                        });
                });
            case 'delete':
                return new Promise((resolve, reject) => {
                    axios
                        .delete(url, {
                            params: data,
                            headers
                        })
                        .then(res => {
                            checkStatus(resolve, reject, res, config);
                        })
                        .catch(res => {
                            reject(res);
                        });
                });
            default:
                break;
        }
    }
};

export { xhr, api };
