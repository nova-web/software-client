<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 权限管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
        <el-button type="primary" icon="search" @click="adduser">新增角色</el-button>
        <el-button type="primary" icon="search" @click="" disabled>删除角色</el-button>
        <el-button type="primary" icon="search" @click="" disabled>修改角色</el-button>
      </div>
      <!-- <el-table :data="" border style="width: 100%" ref="multipleTable">
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    methods: {
      adduser() { },
      handleEdit() { },
      handleDelete() { }
    }
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
</style>