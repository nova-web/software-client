import Vue from 'vue';
import { checkPhone } from '../../utils/rules';
// 使用 Event Bus
const bus = new Vue({
    data() {
        return {
            addUserRule: {
                phone: [{ validator: checkPhone, trigger: 'blur' }],
                email: [{ message: '请输入邮箱地址', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
            }
        };
    }
});

export default bus;
