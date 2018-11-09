<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> 产品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/product'}">产品列表</el-breadcrumb-item>
        <el-breadcrumb-item>产品详情</el-breadcrumb-item>
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
            <div>适配产品:</div>
            <div>
              {{result.fitPro.map(item => item.name).join(",")}}
            </div>
          </div>
          <div class="list">
            <div>所属业务区:</div>
            <div>
              {{result.area}}
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
            <div class="img-box">
              <img v-if="result.logo" class="img" :src="result.logo" alt="">
              <div v-else class="img-normal"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">产品介绍</div>
        <div class="content">
          <!-- <p v-for="item in result.productDesc.split('\n')">{{item}}</p> -->
          <p v-if="result.productDesc" v-html="Trim(result.productDesc)"></p>
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
          productDesc: '',
          newproductDesc: '',
          projectManager: null,
          publishStatus: null,
          stage: null,
          type: null,
          version: null,
          area: null,
          dept: null,
          fitPro: []
        }
      };
    },
    created() {
      this.getProductMessage();
    },
    computed: {
      ...mapGetters(['getproductId', 'getDict']),
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
      },
      Trim(str) {
        return str.replace(/\n|\r\n/g, "<br/>");
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
    min-width: 1200px;
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
      width: 100%;
      padding: 26px 20px;
      box-sizing: border-box;
      font-size: 15px;
      color: #444;
      min-width: 300px;
      .list {
        display: flex;
        padding: 3px 0;
        margin-bottom: 8px;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        > div:nth-child(1) {
          align-self: flex-start;
          width: 100px;
          text-align: right;
          margin-right: 30px;
          flex-shrink: 0;
        }
        > div:nth-child(2) {
          padding-right: 8px;
          box-sizing: border-box;
          width: 300px;
        }
      }
    }
  }
  .left {
    width: 30%;
    min-width: 300px;
  }
  .right {
    min-width: 750px;
  }

  .img {
    width: 80%;
    height: auto;
  }
  .img-normal {
    width: 80%;
    height: 200px;
    background: #ccc;
  }
</style>

