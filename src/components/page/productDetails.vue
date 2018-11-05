<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 产品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/product'}">
          产品列表</el-breadcrumb-item>
        <el-breadcrumb-item>
          产品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="left">
        <div class="title">基本信息</div>
        <div class="content">
          <div class="list">
            <div>产品名称:</div>
            <div>
              {{result.name}}
            </div>
          </div>
          <div class="list">
            <div>产品类型:</div>
            <div>
              {{result.type}}
            </div>
          </div>
          <div class="list">
            <div>最新版本:</div>
            <div>
              {{result.version}}
            </div>
          </div>
          <div class="list">
            <div>状态:</div>
            <div>
              {{result.publishStatus}}
            </div>
          </div>
          <div class="list">
            <div>所属产品线:</div>
            <div>
              {{result.dept}}
            </div>
          </div>
          <div class="list">
            <div>项目经理:</div>
            <div>
              {{result.projectManager}}
            </div>
          </div>
          <div class="list">
            <div>产品阶段:</div>
            <div>
              {{result.stage}}
            </div>
          </div>
          <div class="list">
            <div>示意图:</div>
            <div>
              <img class="img" :src="result.logo" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">产品介绍</div>
        <div class="content">
          {{result.productDesc}}
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
        result: {
          name: null,
          productDesc: null,
          projectManager: null,
          publishStatus: null,
          stage: null,
          type: null,
          version: null,
          area: null,
          dept: null
        }
      };
    },
    created() {
      this.getProductMessage();
    },
    computed: {
      ...mapGetters(['getproductId', 'getDict'])
    },
    methods: {
      ...mapActions(['ajax']),
      getProductMessage() {
        let dict = {};
        this.getDict.forEach(item => {
          if(!dict[item.type]) {
            dict[item.type] = {};
          }
          dict[item.type][item.code] = item.name;
        });

        this.ajax({
          name: 'ProductMessage',
          id: this.getproductId
        }).then(res => {
          [res.result].forEach(item => {
            item.type = dict.package[item.type];
            item.publishStatus = dict.pro_status[item.publishStatus];
            item.stage = dict.stage[item.stage];
            item.area = dict.area[item.area];
            item.dept = dict.dept[item.dept];
          })
          this.result = res.result;
        })
      }
    }
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
  }
  .img {
    width: 200px;
    height: auto;
  }
</style>

