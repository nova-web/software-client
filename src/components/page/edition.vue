<template>
  <div class="edition">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          版本列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" @click="addVisible">新增产品</el-button>
      </div>
      <div class="search-box">
        <el-form ref="search" :model="editionSearch" class="demo-form-inline" :inline="true">
          <el-form-item label="产品名称">
            <el-input clearable v-model="editionSearch.name" placeholder="按产品名称搜索" @change="search"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select clearable v-model="editionSearch.publishStatus" @change="search">
              <el-option v-for=" item in pro_status" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本名称">
            <el-input clearable v-model="editionSearch.version" placeholder="按版本名称搜索" @change="search"></el-input>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-date-picker v-model="editionSearch.updatedStart" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
            至
            <el-date-picker v-model="editionSearch.updatedEnd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="search">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" stripe height="531" style="width: 100%">
        <el-table-column label="序号" prop="num" width="50px"></el-table-column>
        <el-table-column label="所属产品" prop="productName"></el-table-column>
        <el-table-column label="版本" prop="version"></el-table-column>
        <el-table-column label="版本类型" prop="stage"></el-table-column>
        <el-table-column label="状态" prop="publishStatusName"></el-table-column>
        <el-table-column label="版本描述" prop="versionLog"></el-table-column>
        <el-table-column label="发布时间" prop="createdAt"></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button size="small" type="text">下载</el-button>
            <el-button size="small" type="text">修改</el-button>
            <el-button size="small" type="text">删除</el-button>
            <el-button size="small" type="text">试用</el-button>
            <el-button size="small" type="text">发布</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="9" :current-page="cur_page" layout="total, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增版本" :visible.sync="addEditionModele" width="30%">
      <div class="add-edition">
        <el-form label-width="90px" :model="addEdition">
          <el-from-item label="版本名称">
            <el-input placeholder="输入适配产品名称"></el-input>
          </el-from-item>
        </el-form>
      </div>
    </el-dialog>
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
        tableData: [],
        editionSearch: {},
        addEdition: {}, //新增版本
        pro_status: [], // 版本状态
        cur_page: 1,
        count: 0
      };
    },
    computed: {
      ...mapGetters(['getDict', 'getCommon', 'getFormatDict'])
    },
    created() {
      this.getEdition();
      this.getAllProduct();
    },
    methods: {
      ...mapActions(['ajax']),
      //获取数据
      getEdition() {
        let d = this.cur_page; //当前页
        let m = 10; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;

        this.ajax({
          name: 'getPackages',
          data: {
            pageNum: this.cur_page,
            ...this.editionSearch
          }
        }).then(res => {
          this.count = res.count;
          res.rows.forEach(item => {
            item.publishStatusName = this.getFormatDict.pro_status[item.publishStatus];
            item.stage = this.getFormatDict.stage[item.stage];
            item.num = count++;
          });
          this.tableData = res.rows;
        })
      },
      //下拉框
      getAllProduct() {
        // this.ajax({
        //   name: 'getAllProduct'
        // }).then(res => {
        //   this.fitPro = res;
        // });
        this.pro_status = this.getDict.filter(item => item.type === 'pro_status');
      },
      //新增
      addVisible() { },
      //搜索
      search() {


        this.getEdition();
      },
      //分页
      handleCurrentChange() { }
    }
  }
</script>
<style scoped lang="less">
  .handle-box {
    margin-bottom: 20px;
  }
  .search-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
</style>

