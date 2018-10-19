<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" :router="true">
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index" v-show="item.isShow">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" v-show="subItem.isShow">
              <i :class="subItem.icon"></i> {{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-show="item.isShow">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from './bus';
  import { getSen } from '../../utils';
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        collapse: false,
        routeArr: [],
        items: [
          {
            icon: 'el-icon-setting',
            index: '1',
            title: '产品管理',
            isShow: false,
            code: 'CPGL',
            subs: [
              {
                index: '',
                title: '产品列表',
                isShow: false,
                code: ''
              },
              {
                index: '',
                title: '版本列表',
                isShow: false,
                code: ''
              }
            ]
          },
          {
            icon: 'el-icon-setting',
            index: '2',
            title: '权限管理',
            isShow: false,
            code: "QXGL",
            subs: [
              {
                index: 'Role',
                title: '角色管理',
                isShow: false,
                code: 'JSGL'
              },
              {
                index: 'user',
                title: '用户管理',
                isShow: false,
                code: 'YHGL'
              },
              {
                index: 'alc',
                title: '功能管理',
                isShow: false,
                code: 'GNGL'
              }
            ]
          },
          {
            icon: 'el-icon-setting',
            index: '3',
            title: '系统管理',
            code: 'XTGL',
            isShow: false,
            subs: [
              {
                index: '',
                title: '操作审计',
                isShow: false,
                code: 'CZSJ'
              }
            ]
          },
          {
            icon: 'el-icon-tickets',
            index: 'Statistics',
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
        return this.$route.path.replace('/', '');
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })

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
    border-left: 3px solid rgb(32, 160, 255);
    background: rgba(0, 0, 0, 0.6) !important;
  }
</style>
