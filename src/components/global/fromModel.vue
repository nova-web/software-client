<template>
  <div>

    <el-form :model="User" label-width="80px" ref="adduser" :rules="UserRule" class="demo-ruleForm">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model.trim="User.username" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="username">
        <el-input v-model.trim="User.name" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="username">
        <el-input v-model.trim="User.workNumber" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="User.roles" placeholder="请选择角色" multiple collapse-tags>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="User.password"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model.number="User.phone" maxlength="11" clearable></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="User.email" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="User.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { checkPhone, checkUsername } from '../../utils/rules';
  export default {
    props: {
      User: {
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
    methods: {
      save() {
        this.$emit('save');
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

