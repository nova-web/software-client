<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 角色操作</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
        <el-button type="primary" icon="search" @click="saveRole">保存</el-button>
        <el-button type="primary" icon="search" @click="saveRole">复位</el-button>
        <el-button type="primary" icon="search" @click="saveRole">保存并关闭</el-button>
      </div>
      <el-form :inline="true" :model="editRole" class="form-inline">
        <div>
          <el-form-item label="角色名称">
            <el-input v-model="editRole.name" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editRole.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="权限管理">

          </el-form-item>
        </div>

      </el-form>
    </div>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，收确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible=false">取消</el-button>
        <el-button type="primary" @click="deleteRole">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import htp from '../../api/http';
  import { getNowFormatDate } from '../../utils';

  export default {
    data() {
      return {
        name: '',
        remark: '',
        RoleList: [],
        editRole: {
          name: '',
          remark: '',
        },
        idx: -1,
        delVisible: false,
        delIndex: Number
      };
    },
    created() {
      this.getRole();
    },
    methods: {
      getRole() {
        htp.get('api/roles').then(res => {
          if(res.status === 200) {
            if(res.data.errorCode === 1) {
              res.data.data.forEach((item, index) => {
                item.num = index + 1;
              });
              this.RoleList = res.data.data;
            }
          }
        })
      },
      saveRole() {

      },
      handleEdit(row, index) {
        this.index = index;
        this.editRoleRow = row;
        console.log(this.editRoleRow);
      },
      // 删除
      handleDelete(row, index) {
        this.idx = row.ID;
        this.delVisible = true;
        this.delIndex = index;
      },
      // 确认删除
      deleteRole() {
        htp.delete('api/roles', { id: this.idx }).then(res => {
          this.RoleList.splice(this.delIndex, 1);
          this.RoleList.forEach((item, index) => {
            item.num = index + 1;
          });
          this.$message.success('删除成功');
          this.delVisible = false;
        });
      }
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
    margin: 0 10px;
    display: inline-block;
  }
  .del-dialog-cnt {
    font-size: 16px;
    text-align: center;
  }
</style>