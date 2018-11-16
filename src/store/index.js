import Vue from 'vue';
import Vuex from 'vuex';
import { serialize, getLoc, setLoc, getSen, setSen } from '../utils';
import { xhr, api } from '../api';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production', //在非生产环境下，使用严格模式
    state: {
        common: getSen('common') || {
            token: '',
            logining: false //登录成功后刷新页面，如果为true则进入系统
        },
        cacheData: getSen('cacheData') || {},
        lang: getLoc('lang') || 'zh',
        productId: getSen('productId') || null,
        userName: getLoc('userName') || null,
        Alcs: getSen('Alcs') || {},
        AlcsObj: getSen('AlcsObj') || {},
        dict: getSen('dict') || [],
        formatDict: getSen('formatDict') || []
    },
    getters: {
        getCommon: state => state.common,
        getCacheData: state => serialize(state.cacheData),
        getLang: state => state.lang,
        getproductId: state => state.productId,
        getUsername: state => state.userName,
        getAlcs: state => state.Alcs,
        getAlcsObj: state => state.AlcsObj,
        getDict: state => state.dict,
        getFormatDict: state => state.formatDict
    },
    mutations: {
        setCommon(state, data) {
            state.common = { ...state.common, ...data };
            setSen('common', state.common);
        },
        setCacheData(state, data) {
            state.cacheData = { ...state.cacheData, ...data };
            setSen('cacheData', state.cacheData);
        },
        setLang(state, data) {
            state.lang = data;
            setLoc('lang', data);
        },
        setProductId(state, data) {
            state.productId = data;
            setSen('productId', data);
        },
        setUserName(state, data) {
            state.userName = data;
            setLoc('userName', data);
        },
        setAlcs(state, data) {
            let obj = {};
            data.forEach(item => {
                obj[item.code] = true;
            });
            state.Alcs = data;
            setSen('Alcs', data);
            state.AlcsObj = obj;
            setSen('AlcsObj', obj);
        },
        setDict(state, data) {
            state.dict = data;
            setSen('dict', data);
            let dict = {};
            data.forEach(item => {
                if (!dict[item.type]) {
                    dict[item.type] = {};
                }
                dict[item.type][item.code] = item.name;
            });
            state.formatDict = dict;
            setSen('formatDict', dict);
        }
    },
    actions: {
        ajax(state, data) {
            let name = data.name;
            let cacheData = state.state.cacheData;

            if (data instanceof Array) {
                return xhr(data);
            } else {
                return new Promise((resolve, reject) => {
                    if (api[name].cache && cacheData[name]) {
                        return resolve(serialize(cacheData[name]));
                    }
                    xhr(data)
                        .then(res => {
                            state.commit('setCacheData', {
                                [name]: serialize(res)
                            });
                            resolve(res);
                        })
                        .catch(res => reject(res));
                });
            }
        }
    }
});
