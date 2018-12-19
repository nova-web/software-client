// 需求  常规匹配
export function checkUsername(rule, value, callback) {
    let reg = /^[a-zA-Z0-9-\.&#?、@!^%+=*&$_/\u4e00-\u9fa5\s]{1,30}$/; //匹配所有非特殊字符，且长度在0和30之间;
    if (!value) {
        callback();
    }
    setTimeout(() => {
        if (reg.test(value)) {
            callback();
        } else {
            callback(new Error('不可输入非法字符'));
        }
    }, 100);
}
// 文件夹匹配
export function checkFolder(rule, value, callback) {
    let reg = /^[^\^/:*?"<>|]+$/;
    if (!value) {
        callback();
    }
    setTimeout(() => {
        if (reg.test(value)) {
            callback();
        } else {
            callback(new Error('不可输入 /:*?"<>|'));
        }
    }, 100);
}
export function checkPhone(rule, value, callback) {
    const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (!value) {
        // return callback(new Error('电话号码不能为空'));
        callback();
    }
    setTimeout(() => {
        if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'));
        } else {
            if (phoneReg.test(value)) {
                callback();
            } else {
                callback(new Error('电话号码格式不正确'));
            }
        }
    }, 100);
}

export function checkWorkNumber(rule, value, callback) {
    let reg = /^[A-Za-z0-9]+$/;
    setTimeout(() => {
        if (reg.test(value)) {
            callback();
        } else {
            callback(new Error('工号格式不正确'));
        }
    }, 100);
}
// 匹配所有特殊字符
export function checkSpecial(rule, value, callback) {
    let reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    if (!value) {
        callback();
    }
    setTimeout(() => {
        if (!reg.test(value)) {
            callback();
        } else {
            callback(new Error('请输入特殊字符'));
        }
    }, 100);
}
