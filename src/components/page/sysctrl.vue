<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统控制</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">
      <div class="search-box">
        <div class="handle-box">
        </div>
        <el-form ref="search" :model="sysctrlSearch" :rules="searchRules" class="demo-form-inline" :inline="true">
          <el-form-item label="服务状态：">
            <el-select class="el-select-width" v-model="sysctrlSearch.service" @change="search" clearable>
              <el-option v-for="item in service" :key="item.num" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="产品名称：" prop="name">
            <el-input class="el-input-width" v-model="sysctrlSearch.name" @change="search" placeholder="按产品名称搜索" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="SysList" stripe style="width: 100%" ref="multipleTable" height="550" fit :row-class-name="tableRowStatusName">
        <el-table-column prop="num" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="name" label="产品名称">
        </el-table-column>
        <el-table-column prop="service" label="服务状态">
        </el-table-column>

        <el-table-column prop="serviceTime" label="更新时间">
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isButtonShow" type="text" size="small" @click="stopService(scope.row, scope.$index)">暂停服务</el-button>
            <el-button v-if="!scope.row.isButtonShow" type="text" size="small" @click="openService(scope.row, scope.$index)">开通服务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <div class="pagination-left">
          {{(cur_page - 1) * pageSize + 1 === 0 ? 1 : (cur_page - 1) * pageSize + 1}}-{{cur_page * pageSize}} 共 {{count}}
        </div>
        <div class="pagination-right">
          <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" @size-change="handleSizeChange" layout="total,sizes,slot ,prev, pager, next" :total="count">
            <el-button class="btn-next" size="small" @click="gofist">首页</el-button>
          </el-pagination>
          <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" layout=" slot,jumper" :total="count">
            <el-button class="btn-next" size="small" @click="goLast">末页</el-button>
          </el-pagination>
        </div>
      </div>
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
        defaultArr: [2, 3], //默认选中的数组
        cur_page: 1,
        count: 0,
        pageSize: 10,
        disabled: false,
        SysList: [],
        idx: -1,
        //角色搜索
        sysctrlSearch: {
          service: 1,
          name: ''
        },
        //状态
        service: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 1,
            label: '已开通'
          },
          {
            value: 0,
            label: '已关闭'
          },
        ],
        searchRules: {  // 搜索框规则
          name: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'change' }
          ]
        },
      };
    },
    created() {
      this.getSyscontrol(); //获取权限表
    },
    computed: {
      ...mapGetters(['getAlcs', 'getAlcsObj'])
    },
    methods: {
      ...mapActions(['ajax']),
      //获取系统控制列表
      getSyscontrol() {
        let d = this.cur_page; //当前页
        let m = this.pageSize; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getSyscontrol',
          data: { pageNum: this.cur_page, pageSize: this.pageSize, ...this.sysctrlSearch }
        }).then(res => {
          res.rows.forEach((item, index) => {
            switch(item.service) {
              case 0:
                item.service = '已关闭';
                item.isButtonShow = false;
                break;
              case 1:
                item.service = '已开通';
                item.isButtonShow = true;
                break;
              default:
                break;
            }
            item.num = count++;
          });
          this.SysList = res.rows;
          this.count = res.count;
        });
      },
      // tableRowStatusName 根据有效无效修改 row 样式
      tableRowStatusName({ row, rowIndex }) {
        if(row.service == 0) {
          return 'invalid-row'
        } else {
          return ''
        }
      },
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getRoles()
      },
      handleSizeChange(val) {
        this.pageSize = val;
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
      // 暂停服务
      stopService(row, index) {
        this.ajax({
          name: 'setSyscontrolSwitch',
          id: row.id,
          data: { service: 0 }
        }).then(res => {
          this.$message.success('已暂停服务');
          this.getSyscontrol();
        });
      },
      // 开启服务
      openService(row, index) {
        this.ajax({
          name: 'setSyscontrolSwitch',
          id: row.id,
          data: { service: 1 }
        }).then(res => {
          this.$message.success('已开启服务');
          this.getSyscontrol();
        });
      },
      //搜索
      search() {
        this.getSyscontrol();
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
  .handle-box {
    margin-bottom: 20px;
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
