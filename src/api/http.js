import axios from 'axios';
import { Loading } from 'element-ui';
var loadingInstance;
var loading;
////添加请求拦截器
axios.interceptors.request.use(
    config => {
        loading = true;
        config.headers.Session = `token`;
        return config;
    },
    error => {
        loading = false;
        return Promise.reject(error);
    }
);

//添加响应拦截
axios.interceptors.response.use(
    response => {
        loading = false;
        if (loadingInstance) {
            loadingInstance.close();
        }
        return response;
    },
    error => {
        loading = false;
        if (loadingInstance) {
            loadingInstance.close();
        }
        return Promise.resolve(error.response);
    }
);
// function downloads(data) {
//     if (!data) {
//         return;
//     }
//     let url = window.URL.createObjectURL(new Blob([data]));
//     let link = document.createElement('a');
//     link.style.display = 'none';
//     link.href = url;
//     link.setAttribute('download', 'a.rar');
//     document.body.appendChild(link);
//     link.click();
// }
export default {
    get(url, data) {
        setTimeout(() => {
            if (loading) {
                loadingInstance = Loading.service({ fullscreen: true });
            }
        }, 2000);
        return axios({
            url: url,
            method: 'get',
            timeout: 5000,
            params: JSON.stringify(data),
            responseType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then(res => {
                return res;
            })
            .catch(error => {
                return error;
            });
    },
    post(url, data) {
        setTimeout(() => {
            if (loading) {
                loadingInstance = Loading.service({ fullscreen: true });
            }
        }, 2000);
        return axios({
            url: url,
            method: 'post',
            timeout: 5000,
            data: JSON.stringify(data),
            responseType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then(res => {
                return res;
            })
            .catch(error => {
                return error;
            });
    },
    delete(url, data) {
        setTimeout(() => {
            if (loading) {
                loadingInstance = Loading.service({ fullscreen: true });
            }
        }, 2000);
        return axios({
            url: `${url}/${data.id}`,
            method: 'delete',
            timeout: 5000,
            responseType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then(res => {
                return res;
            })
            .catch(error => {
                return error;
            });
    },
    put(url, id, data) {
        setTimeout(() => {
            if (loading) {
                loadingInstance = Loading.service({ fullscreen: true });
            }
        }, 2000);
        return axios({
            url: `${url}/${id}`,
            method: 'put',
            timeout: 5000,
            params: data,
            responseType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then(res => {
                return res;
            })
            .catch(error => {
                return error;
            });
    },
    downLoad(url, data) {
        return axios({
            method: 'get',
            url: url,
            data: data,
            responseType: 'blob'
        }).then(response => {
            return response;
            // downloads(response);
        });
    }
};
