<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>操作审计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="search-box">
        <div class="handle-box">
        </div>
        <el-form ref="search" :model="syslogSearch" :rules="searchRules" class="demo-form-inline" :inline="true">
          <el-form-item label="操作对象：" prop="target">
            <el-input class="el-input-width" v-model="syslogSearch.target" @change="search" clearable placeholder="输入操作对象查询"></el-input>
          </el-form-item>
          <el-form-item label="操作员：" prop="operator">
            <el-input v-model="syslogSearch.operator" class="el-input-width" @change="search" clearable placeholder="输入操作员查询"></el-input>
          </el-form-item>
          <el-form-item label="操作类型：">
            <el-select class="el-select-width" clearable v-model="syslogSearch.operateType" @change="search">
              <el-option v-for="(item, index) in selectOperateType" :value="item.value" :label="item.label" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作描述：" prop="operateContent">
            <el-input class="el-input-width" v-model="syslogSearch.operateContent" @change="search" clearable placeholder="输入操作描述查询"></el-input>
          </el-form-item>
          <el-form-item label="时间：">
            <el-date-picker class="el-input-width" v-model="syslogSearch.startTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="search" clearable :editable="false">
            </el-date-picker>
            &nbsp; 至 &nbsp;
            <el-date-picker class="el-input-width" v-model="syslogSearch.endTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="search" clearable :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="sylogData" stripe style="width: 100%" height="531" fit :row-class-name="tableRowStatusName">
        <el-table-column prop="num" label="序号" width="60px">
        </el-table-column>
        <el-table-column prop="target" label="操作对象" width="280px">
        </el-table-column>
        <el-table-column prop="operateType" label="操作类型" width="90px">
        </el-table-column>
        <el-table-column prop="operateContent" label="操作描述">
        </el-table-column>
        <el-table-column prop="operator" label="操作员" width="80px">
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="100px">
        </el-table-column>
        <el-table-column prop="createdAt" label="操作时间" width="180px">
        </el-table-column>
      </el-table>
      <ve-pagination :cur_page="cur_page" :pageSize="pageSize" :count="count" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" @gofist="gofist" @goLast="goLast"></ve-pagination>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { serialize } from '../../utils';
  import { checkUsername } from '../../utils/rules';

  export default {
    data() {
      return {
        sylogData: [],
        cur_page: 1,
        pageSize: 10,
        count: 0,
        syslogSearch: {
          target: '',
          operator: '',
          operateContent: ''

        },
        selectOperateType: [
          {
            value: 0,
            label: '新增'
          },
          {
            value: 1,
            label: '修改'
          },
          {
            value: 2,
            label: '删除'
          },
          {
            value: 3,
            label: '授权'
          },
          {
            value: 4,
            label: '试用'
          },
          {
            value: 5,
            label: '撤回'
          },
          {
            value: 6,
            label: '发布'
          },
          {
            value: 7,
            label: '下架'
          },
          {
            value: 8,
            label: '置为有效'
          },
          {
            value: 9,
            label: '置为无效'
          }
        ],
        searchRules: {  // 搜索框规则
          target: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ],
          operator: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ],
          operateContent: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ]
        },
      };
    },
    computed: {
      ...mapGetters(['getAlcs', 'getAlcsObj'])
    },
    created() {
      this.getLog();
    },
    methods: {
      ...mapActions(['ajax']),
      getLog() {
        let d = this.cur_page; //当前页
        let m = this.pageSize; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getLogs',
          data: {
            pageNum: this.cur_page,
            pageSize: this.pageSize,
            ...this.syslogSearch
          }
        }).then(res => {
          this.count = res.count;
          this.sylogData = res.rows;
          this.sylogData.forEach(item => {
            item.num = count++;
          })
        });
      },
      // tableRowStatusName 根据有效无效修改 row 样式
      tableRowStatusName({ row, rowIndex }) {
        return 'line-row-padding'
      },
      //分页
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getLog();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.gofist();
        this.getLog();
      },
      gofist() {
        this.cur_page = 1;
        this.getLog();
      },
      goLast() {
        this.cur_page = Math.ceil(this.count / this.pageSize);
        this.getLog();
      },
      //搜索
      search() {
        this.getLog();
        this.gofist();
      }
    }
  }
</script>

<style scoped lang="less">
  .buttons {
    width: 30%;
    margin: auto;
    display: flex;
    justify-content: space-around;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .del-dialog-cnt {
    font-size: 16px;
    text-align: center;
  }
</style>
