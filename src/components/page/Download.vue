<template>
  <div class="download">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 下载管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
        <el-button type="primary" icon="search" @click="addVisible">新增设备</el-button>
      </div>
      <el-table :data="tableData" border height="550" style="width: 100%">
        <el-table-column width="80px" fixed="left" prop="num" label="序号"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="update_time" label="更新时间"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button type="success" @click="handleselect(scope.row, scope.$index)">查看固件包</el-button>
            <el-button type="danger" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" center width="30%">
      <el-form ref="form" :model="visible" label-width="80px">
        <el-form-item label="设备名称">
          <el-input v-model.lazy="visible.name"></el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model.lazy="visible.version"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.lazy="visible.remark"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="cancelEdit">取消</el-button>
          <el-button @click="saveEdit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增设备对话框 -->
    <el-dialog title="新增设备" :visible.sync="newVisible" center width="30%">
      <el-form label-width="80px">
        <el-form-item :model="addVisibles" label="设备名称">
          <el-input v-model="addVisibles.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addVisibles.remark"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="newVisible=false">取消</el-button>
          <el-button @click="saveVisible">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
  import { mapActions } from 'vuex';
  import { serialize } from '../../utils';
  export default {
    data() {
      return {
        num: Number,
        tableData: [],
        delVisible: false,
        index: Number,
        editVisible: false,
        visible: {},
        newVisible: false,
        addVisibles: {
          name: null,
          version: null,
          remark: null
        },
        cancelvisible: {}
      };
    },
    created() {
      this.getEquipment();
    },
    methods: {
      ...mapActions(['ajax']),
      //获取产品列表
      getEquipment() {
        this.ajax({
          name: 'getProduct'
        }).then(res => {
          this.tableData = res;
          this.tableData.forEach((item, index) => {
            item.num = index + 1;
          })
        });
      },
      //新增设备模态框
      addVisible() {
        this.newVisible = true;
      },
      //新增设备确认
      saveVisible() {
        this.newVisible = false;
        // this.addVisibles.update_time = getNowFormatDate();
        this.addVisibles.num = this.tableData.length + 1;
        let obj = serialize(this.addVisibles);
        this.tableData.push(obj);
      },
      //删除
      handleDelete(row, index) {
        this.delVisible = true;
        this.index = index;
      },
      //确认删除
      deleteRow() {
        this.delVisible = false;
        this.tableData.splice(this.index, 1);
        this.tableData.forEach((item, index) => {
          item.num = index + 1;
        })
        this.$message.success('删除成功');
      },
      //编辑
      handleEdit(row, index) {
        this.visible = row;
        this.editVisible = true;
        this.index = index;
        this.cancelvisible = serialize(row);
      },
      //确认编辑
      saveEdit() {
        this.editVisible = false;
        // this.visible.update_time = ;
        this.$set(this.tableData, this.index, this.visible);
      },
      cancelEdit() {
        this.editVisible = false;
        this.$set(this.tableData, this.index, this.cancelvisible);
      },
      handleselect(row, index) {
        this.$router.push({ name: 'Firmware' });
      }
    }
  }
</script>

<style scoped lang="less">
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
</style>
