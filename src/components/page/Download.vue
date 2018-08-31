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
        <el-table-column prop="version" label="版本号"></el-table-column>
        <el-table-column prop="update_time" label="更新时间"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button type="success">查看固件包</el-button>
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
          <el-input v-model="visible.name"></el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="visible.version"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="visible.remark"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="editVisible=false">取消</el-button>
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
        <el-form-item label="版本号">
          <el-input v-model="addVisibles.version"></el-input>
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
  import { getNowFormatDate, serialize } from '../../utils';
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
          name: '',
          version: '',
          remark: ''
        }
      };
    },
    created() {
      this.getEquipment();
    },
    methods: {
      getEquipment() {
        setTimeout(() => {
          this.tableData = [
            {
              id: 1,
              name: '设备1',
              remark: '这是个好设备',
              version: '1.0.0',
              module_id: '',
              update_time: ''
            },
            {
              id: 2,
              name: '设备2',
              remark: '',
              version: '',
              module_id: '',
              update_time: ''
            },
            {
              id: 3,
              name: '设备3',
              remark: '',
              version: '',
              module_id: '',
              update_time: ''
            },
            {
              id: 4,
              name: '设备4',
              remark: '',
              version: '',
              module_id: '',
              update_time: ''
            },
            {
              id: 5,
              name: '设备5',
              remark: '',
              version: '',
              module_id: '',
              update_time: ''
            },
            {
              id: 6,
              name: '设备6',
              remark: '',
              version: '',
              module_id: '',
              update_time: ''
            },
            {
              id: 7,
              name: '设备7',
              remark: '',
              version: '',
              module_id: '',
              update_time: ''
            }
          ];
          this.tableData.forEach((item, index) => {
            item.num = index + 1;
          })
        }, 500)
      },
      addVisible() {
        this.newVisible = true;
      },
      saveVisible() {
        this.newVisible = false;
        this.addVisibles.update_time = getNowFormatDate();
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
      },
      //确认编辑
      saveEdit() {
        this.editVisible = false;
        this.visible.update_time = getNowFormatDate();
        this.$set(this.tableData, this.index, this.visible);
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
