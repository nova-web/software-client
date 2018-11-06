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

export function checkNormal(rule, value, callback) {
    let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5\s]{1,30}$/; //匹配所有非特殊字符，且长度在0和30之间;
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
export function checkUsername(rule, value, callback) {
    let reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    if (!value) {
        callback();
    }
    setTimeout(() => {
        if (!reg.test(value)) {
            callback();
        } else {
            callback(new Error('不可输入非法字符'));
        }
    }, 100);
}
export function checkLength(rule, value, callback) {
    let reg = /^.{1,30}$/; //匹配任意字符，且长度在1和30之间;
    if (!value) {
        callback();
    }
    setTimeout(() => {
        if (reg.test(value)) {
            callback();
        } else {
            callback(new Error('请输入1~30长度字符'));
        }
    }, 100);
}
