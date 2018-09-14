<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 固件包</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-row>
        <el-col :span="6">
          <div class="left">
            <div>
              <span></span>: <span></span>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="right">
            <div class="handle-box">
              <el-button type="primary" icon="search" @click="">新增版本</el-button>
            </div>

            <el-form :inline="true" :model="selectFirmward" class="demo-form-inline">
              <el-form-item label="更新时间">
                <el-date-picker v-model="selectFirmward.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="selectFirmward.status" placeholder="请选择状态">
                    <el-option label="内部转测版" :value='1'></el-option>
                    <el-option label="体验版" :value='2'></el-option>
                  </el-select>

                </el-form-item>
                <el-form-item label="版本描述">

                  <el-input v-model="selectFirmward.describe" placeholder="请输入版本描述"></el-input>

                </el-form-item>

                <el-button type="primary">搜索</el-button>

              </el-form-item>
            </el-form>

            <el-table></el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        selectFirmward: {
          describe: '',
          date1: '',
          date2: '',
          time: ''
        }
      };
    },
    methods: {}
  }
</script>
<style scoped>
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
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    border-left: 1px solid #ccc;
    padding: 0 0 0 30px;
  }
</style>

