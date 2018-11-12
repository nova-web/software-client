<template>
  <div class="login-wrap">

    <div class="ms-login">
      <div class="login-left"></div>
      <div class="login-right">
        <div class="login-right-children">
          <div class="title">
            <div class="title-logo">
              <img class="login-img" src="../../assets/login/icon_logo_blue.png" alt="">
            </div>
            <div class="title-message">
              后台管理系统
            </div>
          </div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
            <el-form-item prop="username">
              <el-input v-model="ruleForm.username" placeholder="username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </div>
          </el-form>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';
  export default {
    data: function() {
      return {
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['ajax']),
      ...mapMutations(['setCommon', 'setUserName', 'setAlcs', 'setDict']),
      postLogin() {
        this.ajax({
          name: 'postLogin',
          data: this.ruleForm
        }).then(res => {
          this.setUserName(res.username);
          this.setCommon({ token: res.token });
          setTimeout(() => {
            this.getUserAclCodes();
          }, 300)
        });
      },
      async getUserAclCodes() {
        await this.ajax({
          name: 'getUserAclCodes'
        }).then(res => {
          this.setAlcs(res);
          // window.location.href = 'http://172.16.6.247:8080/'

        })
        await this.ajax({
          name: 'dict'
        }).then(res => {
          this.setDict(res);
        })
        window.location.reload();
        this.$router.push({ name: 'product' });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.postLogin();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped lang="less">
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/login/img_bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 55%;
    height: 72.5%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    .login-left {
      width: 61%;
      height: 100%;
      background-image: url('../../assets/login/img_front.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-size: cover;
    }
    .login-right {
      width: 49%;
      height: 100%;
      .login-right-children {
        width: 67%;
        height: 56%;
        padding-top: 10%;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          margin: auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          .title-logo {
            width: 100%;
            height: 100%;
            .login-img {
              width: 100%;
              height: 100%;
            }
          }
          .title-message {
            margin-top: -6%;
            font-size: 23px;
            color: #3b93ff;
            font-weight: 550;
          }
        }
      }
    }
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    width: 100%;
    height: 36px;
  }
</style>