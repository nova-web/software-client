<template>
  <div>
    <el-form :model="data" label-width="80px" ref="adduser" :rules="UserRule" class="demo-ruleForm">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model.trim="data.username" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model.trim="data.name" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="code">
        <el-input v-model.trim="data.code" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="data.roles" placeholder="请选择角色" multiple collapse-tags>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="data.password"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model.number="data.phone" maxlength="11" clearable></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="data.email" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save('adduser')">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { checkPhone, checkUsername } from '../../utils/rules';
  export default {
    props: {
      data: {
        type: Object,
        default: () => { }
      },
      options: {
        type: Array,
        default: () => []
      },
      UserRule: {
        type: Object,
        default: () => { }
      }
    },
    data() {
      return {
      };
    },
    created() {
      console.log(this.options)
    },
    methods: {
      save(adduser) {
        this.$refs[adduser].validate((valid) => {
          if(valid) {
            this.$emit('save');
          } else {

            return false;
          }
        });

      },
      cancel() {
        this.$refs['adduser'].clearValidate();
        this.$emit('cancel');
      }
    }
  }
</script>
<style scoped lang="less">
</style>

