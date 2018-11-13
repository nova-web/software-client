<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" @close="close" @open="open" @select="select" :default-active="onRoutes" :collapse="collapse" background-color="#2f2f38" text-color="#fff" active-text-color="#43a3fb" :router="true">
      <!-- <template>
        <el-menu-item index="index">
          <i class="el-icon-tickets"></i>
          <span slot="title">首页</span>
        </el-menu-item>
      </template> -->
      <template v-for="(item, i) in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index" v-show="item.isShow">
            <template slot="title">
              <img class="checkImg" :src="item.preicon" alt="" v-if="item.isClose">
              <img class="checkImg" :src="item.noicon" alt="" v-else>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item class="rel" :class="{'is-active':subItem.index === path}" :style="{color: subItem.index === path ? 'rgb(67, 163, 251)' : '#fff'}" v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" v-show="subItem.isShow">
              <img class="imgs" src="../../assets/sidebar/icon_pressed.png" alt="" v-show="subItem.index === path"> {{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-show="item.isShow">
            <img class="checkImg" :src="item.preicon" alt="" v-if="item.index === path">
            <img class="checkImg" :src="item.noicon" alt="" v-else>
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
  import bus from './bus';
  import { getSen, setSen } from '../../utils';
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        isOpen: "",
        isClose: '',
        path: '',
        collapse: false,
        routeArr: [],
        items: [
          {
            isClose: false,
            noicon: require('../../assets/sidebar/icon_product_normal.png'),
            preicon: require('../../assets/sidebar/icon_product_pressed.png'),
            index: '1',
            title: '产品管理',
            isShow: false,
            code: 'CPGL',
            subs: [
              {
                index: 'product',
                title: '产品列表',
                isShow: false,
                code: 'CPLB'
              },
              {
                index: 'edition',
                title: '版本列表',
                isShow: false,
                code: 'BBLB'
              }
            ]
          },
          {
            isClose: false,
            noicon: require('../../assets/sidebar/icon_admin_normal.png'),
            preicon: require('../../assets/sidebar/icon_admin_pressed.png'),
            index: '2',
            title: '权限管理',
            isShow: false,
            code: "QXGL",
            subs: [
              {
                index: 'user',
                title: '用户管理',
                isShow: false,
                code: 'YHGL'
              },
              {
                index: 'Role',
                title: '角色管理',
                isShow: false,
                code: 'JSGL'
              },
              {
                index: 'alc',
                title: '权限管理',
                isShow: false,
                code: 'GNGL'
              }
            ]
          },
          {
            isClose: false,
            noicon: require('../../assets/sidebar/icon_setting_normal.png'),
            preicon: require('../../assets/sidebar/icon_setting_pressed.png'),
            index: '3',
            title: '系统管理',
            code: 'XTGL',
            isShow: false,
            subs: [
              {
                index: 'syslog',    // 路由
                title: '操作审计',
                isShow: false,
                code: 'CZSJ'
              },
              {
                index: 'sysctrl',
                title: '系统控制',
                isShow: false,
                code: 'XTKZ'
              }
            ]
          },
          {
            isClose: false,
            noicon: require('../../assets/sidebar/icon_analysis_normal.png'),
            preicon: require('../../assets/sidebar/icon_analysis_pressed.png'),
            index: 'statistics',
            title: '统计分析',
            code: 'TJFX',
            isShow: false
          }
        ],
        index: null
      }
    },
    computed: {
      ...mapGetters(['getAlcs']),
      onRoutes() {
        if(this.$route.path.replace('/', '') === 'productDetails') {
          return 'product'
        } else {
          return this.$route.path.replace('/', '');
        }
      }
    },
    created() {
      this.getFathenIndex(this.onRoutes); //渲染icon
      this.select(this.onRoutes); //渲染路由
      if(this.onRoutes === 'productDetails') {
        this.getFathenIndex('product')
        this.select('product');
      }
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
        //折叠后需重新渲染侧边栏
        this.items.forEach(item => {
          item.isClose = false;
        })
        this.getFathenIndex(this.onRoutes);
      })
      bus.$on('tags', msg => {
        // 监听点击标签
        this.getFathenIndex(this.onRoutes);
        this.select(this.onRoutes);
      })
      //重新渲染侧边栏
      this.items.forEach((items, i, Arr) => {
        this.getAlcs.forEach(alcs => {
          if(items.code == alcs.code) {
            this.index = i;
          }
        })
        if(this.index !== null) {
          Arr[this.index].isShow = true;
        }
        if(items.subs) {
          items.subs.forEach((subItem, index, arr) => {
            this.getAlcs.forEach(subAlcs => {
              if(subAlcs.code == subItem.code) {
                arr[index].isShow = true;
              }
            })
          })
        }
      })

    },
    methods: {
      select(index) {
        this.path = index;
      },
      open(index) {
        this.items.forEach(item => {
          if(item.index == index) {
            item.isClose = true;
          }
        });
      },
      close(index) {
        this.items.forEach(item => {
          if(item.index == index) {
            item.isClose = false;
          }
        })
      },
      getFathenIndex(childIndex) {
        let index;
        this.items.forEach((i, ifi) => {
          if(i.subs) {
            i.subs.forEach((item, ins) => {
              if(item.index == childIndex) {
                index = ifi;
              }
            })
          }
        });
        if(index || index === 0) {
          this.open(this.items[index].index);
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
    .sidebar-el-menu {
      .el-menu-item:active {
        background: rgba(0, 0, 0, 0.6);
      }
    }
  }
  .sidebar::-webkit-scrollbar {
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }
  .sidebar > ul {
    height: 100%;
  }
  //点击后样式覆盖

  .el-menu-item.is-active {
    background: #23232b !important;
  }
  .rel {
    position: relative;
    padding-left: 78px !important;
    .imgs {
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .checkImg {
    margin-right: 10px;
  }
  .el-submenu.is-opened {
    .el-submenu__title {
      > span {
        color: #43a3fb !important;
      }
    }
  }
</style>
