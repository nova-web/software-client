<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>统计分析</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">
      <div class="search-box">
        <div class="handle-box">
        </div>
        <el-form ref="search" :rules="searchRules" :model="scarchStatistics" class="demo-form-inline" :inline="true">
          <el-form-item label="设备S/N号：" prop="deviceId">
            <el-input class="el-input-width" v-model="scarchStatistics.deviceId" placeholder="输入设备S/N号模糊查询" @change="search" clearable></el-input>
          </el-form-item>
          <el-form-item label="设备名称或IP：" prop="ipName">
            <el-input class="el-input-width" v-model="scarchStatistics.ipName" placeholder="输入设备名称或IP模糊查询" @change="search" clearable></el-input>
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
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span class="abnormal" v-if="scope.row.deviceStatus">{{scope.row.deviceStatus}}</span>
            <span class="normal" v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="更新时间">
        </el-table-column>
      </el-table>
      <ve-pagination :cur_page="cur_page" :pageSize="pageSize" :count="count" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" @gofist="gofist" @goLast="goLast"></ve-pagination>
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
        scarchStatistics: {
          deviceId: '',
          ipName: ''
        },
        searchRules: {  // 搜索框规则
          deviceId: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'change' }
          ],
          ipName: [
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
            pageSize: this.pageSize,
            ...this.scarchStatistics
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
        this.getProductLogs();
      },
      gofist() {
        this.cur_page = 1;
        this.getProductLogs();
      },
      goLast() {
        this.cur_page = Math.ceil(this.count / this.pageSize);
        this.getProductLogs();
      },
      //搜索
      search() {
        this.getProductLogs();
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
  .abnormal {
    color: #ff6c60;
  }
  .normal {
    color: #2fc25b;
  }
</style>
