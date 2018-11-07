<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>统计分析</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">
      <div class="handle-box">

      </div>
      <div class="search-box">
        <el-form ref="search" :rules="searchRules" :model="scarchStatistics" class="demo-form-inline" :inline="true">
          <el-form-item label="设备S/N号：" prop="deviceId">
            <el-input v-model="scarchStatistics.deviceId"></el-input>
          </el-form-item>
          <el-form-item label="设备名称或IP：" prop="softwareIp">
            <el-input v-model="scarchStatistics.softwareIp"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="statistics" stripe style="width: 100%" ref="multipleTable" height="550" fit :row-class-name="tableRowStatusName">
        <el-table-column prop="num" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="deviceId" label="设备S/N号">
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称">
        </el-table-column>
        <el-table-column prop="deviceInfo.screen" label="带载屏体大小">
        </el-table-column>
        <el-table-column prop="softwareIp" label="终端IP">
        </el-table-column>
        <el-table-column prop="version" label="最新版本">
        </el-table-column>
        <el-table-column prop="deviceStatus" label="状态">
        </el-table-column>
        <el-table-column prop="createdAt" label="更新时间">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <div class="pagination-left">
          {{(cur_page - 1) * pageSize + 1 === 0 ? 1 : (cur_page - 1) * pageSize + 1}}-{{cur_page * pageSize}} 共 {{count}}
        </div>
        <div class="pagination-right">
          <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" @size-change="handleSizeChange" layout="total,sizes,slot ,prev, pager, next" :total="count">
            <el-button size="small" @click="gofist">首页</el-button>
          </el-pagination>
          <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" layout=" slot,jumper" :total="count">
            <el-button size="small" @click="goLast">末页</el-button>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { serialize } from '../../utils';
  import { checkLength, checkUsername } from '../../utils/rules';

  export default {
    data() {
      return {
        statistics: [],
        count: 0,
        cur_page: 1,
        pageSize: 10,
        scarchStatistics: {},
        searchRules: {  // 搜索框规则
          deviceId: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'change' }
          ],
          softwareIp: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'change' }
          ]
        },
      };
    },
    created() {
      this.getProductLogs();
    },
    computed: {
      ...mapGetters(['getAlcs', 'getAlcsObj'])
    },
    methods: {
      ...mapActions(['ajax']),
      //获取角色列表
      getProductLogs() {
        let d = this.cur_page; //当前页
        let m = this.pageSize; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getProductLogs',
          data: {
            pageNum: this.cur_page,
            pageSize: this.pageSize
          }
        }).then(res => {
          this.count = res.count;
          res.rows.forEach(item => {
            item.num = count++;
          });
          this.statistics = res.rows;

        })
      },
      // tableRowStatusName 根据有效无效修改 row 样式
      tableRowStatusName({ row, rowIndex }) {
        return 'line-row-padding'
      },
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getProductLogs()
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
      //搜索
      search() {
        this.getProductLogs();
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
  .search-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
</style>
