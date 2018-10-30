<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          产品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <div class="left">
        <div class="title">基本信息</div>
        <div class="content">
          <div class="list" v-for="item in items">
            <div>{{item.title}}</div>
            <div v-if="item.title !== '示意图'">{{item.message}}</div>
            <img v-else :src="item.message" alt="">
          </div>
        </div>
      </div>

      <div class="right">
        <div class="title">产品介绍</div>
        <div class="content">
          {{introduce}}
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import { serialize } from '../../utils';
  import axios from 'axios';
  import { api } from '../../api';
  export default {
    data() {
      return {
        items: [
          {
            title: '产品名称',
            message: 'V-Can',

          },
          {
            title: '产品名称',
            message: 'V-Can'
          },
          {
            title: '示意图',
            message: "../../../static/img/img.jpg"
          }
        ],
        introduce: '121'
      };
    },
    created() { },
    computed: {},
    methods: {}
  }
</script>
<style scoped lang="less">
  .container {
    padding: 30px;
    height: 658px;
    display: flex;
    width: 97%;
    justify-content: space-between;
  }
  .left,
  .right {
    width: 67%;
    height: 100%;
    border: 1px solid #dce3f3;
    .title {
      width: 100%;
      padding: 13px 20px;
      color: #444;
      font-size: 14px;
      background: #f4f7fc;
      border-bottom: 1px solid #dce3f3;
      box-sizing: border-box;
      font-weight: 800;
    }
    .content {
      padding: 26px 20px;
      box-sizing: border-box;
      font-size: 15px;
      color: #444;
      overflow-y: auto;
      .list {
        display: flex;
        padding: 3px 0;
        margin-bottom: 8px;
        align-items: center;
        > div:nth-child(1) {
          align-self: flex-start;
          width: 85px;
          text-align: right;
          margin-right: 30px;
        }
      }
    }
  }
  .left {
    width: 30%;
    // margin-right: 30px;
  }
</style>

