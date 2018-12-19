<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse" @click="collapseChage">
      <img v-if="!collapse" src="../../assets/header/shou.png" alt="">
      <img v-else src="../../assets/header/zhan.png" alt="">
    </div>
    <div class="collapse-b"><img src="../../assets/header/icon_logo.png" alt=""></div>
    <div class="logo">后台管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="isFullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div> -->
        <!-- 用户头像 -->
        <div class="user-avator"><img src="../../assets/header/icon_user.png"></div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
  import bus from '../common/bus';
  export default {
    data() {
      return {
        collapse: false,
        isFullscreen: false,
        name: 'linxin',
        message: 2
      }
    },
    created() {
      window.onresize = () => {
        this.isFullscreen = this.checkFull();
      }
      document.onkeydown = (e) => {
        if(e.keyCode == 122) {
          e.preventDefault();  //阻止F11默认动作
          if(this.isFullscreen) {
            this.exitFull();
          } else {
            this.fullScreen(document.documentElement);
          }
        }
      }
    },
    computed: {
      username() {
        let username = sessionStorage.getItem('userName');
        return username ? username : this.name;
      }
    },
    methods: {
      // 用户名下拉菜单选择事件
      handleCommand(command) {
        if(command == 'loginout') {
          sessionStorage.removeItem('userName');
          sessionStorage.removeItem('Alcs');
          sessionStorage.removeItem('common');
          sessionStorage.removeItem('cacheData');

          this.$router.push('/login');
        }
      },
      // 侧边栏折叠
      collapseChage() {
        this.collapse = !this.collapse;
        bus.$emit('collapse', this.collapse);
      },
      // 全屏事件
      handleFullScreen() {
        if(this.isFullscreen) {
          this.exitFull();
        } else {
          this.fullScreen(document.documentElement);
        }
      },
      fullScreen(element) {
        var requestMethod = element.requestFullScreen || //W3C
          element.webkitRequestFullScreen || //FireFox
          element.mozRequestFullScreen || //Chrome等
          element.msRequestFullScreen; //IE11
        if(requestMethod) {
          requestMethod.call(element);
        } else if(typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
          var wscript = new ActiveXObject("WScript.Shell");
          if(wscript !== null) {
            wscript.SendKeys("{F11}");
          }
        }
      },
      exitFull() {
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
          document.mozCancelFullScreen || //FireFox
          document.webkitExitFullscreen || //Chrome等
          document.webkitExitFullscreen; //IE11
        if(exitMethod) {
          exitMethod.call(document);
        } else if(typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
          var wscript = new ActiveXObject("WScript.Shell");
          if(wscript !== null) {
            wscript.SendKeys("{F11}");
          }
        }
      },
      checkFull() {
        var isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
        //to fix : false || undefined == undefined
        if(isFull === undefined) { isFull = false; }
        return isFull;
      }
    },
    mounted() {
      if(document.body.clientWidth < 1500) {
        this.collapseChage();
      }
    }
  }
</script>
<style scoped lang="less">
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
  }
  .collapse {
    float: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 20px;
  }
  .collapse-b {
    float: left;
    padding-right: 21px;
    box-sizing: border-box;

    padding-top: 2px;
    height: 70px;
    img {
      display: block;
      height: 100%;
    }
  }
  .header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
  }
  .header-right {
    float: right;
    padding-right: 50px;
  }
  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }
  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }
  .btn-bell,
  .btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
  }
  .btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
  }
  .btn-bell .el-icon-bell {
    color: #fff;
  }
  .user-name {
    margin-left: 10px;
  }
  .user-avator {
    margin-left: 20px;
  }
  .user-avator img {
    display: block;
  }
  .el-dropdown-link {
    color: #fff;
    cursor: pointer;
  }
  .el-dropdown-menu__item {
    text-align: center;
  }
</style>
