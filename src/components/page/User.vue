<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
        <el-button type="primary" icon="search" @click="addVisible=true">新增用户</el-button>
      </div>
      <el-table :data="UserList" border style="width: 100%" ref="multipleTable" height="550">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="index" label="序号" sortable width="150">
        </el-table-column>
        <el-table-column prop="operator" label="角色" width="120">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120">
        </el-table-column>
        <el-table-column prop="password" label="密码">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="num?num:10">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editUser" :model="editUser" label-width="80px">
        <el-form-item label="角色">
          <el-select v-model="editUser.num" :placeholder="editUser.operator">
            <el-option v-for="item in options" :key="item.num" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUser.password"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editUser.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible=false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteUser">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 新增用户 -->
    <el-dialog title="新增用户" :visible.sync="addVisible" width="30%">
      <el-form :model="addUser" label-width="80px">
        <el-form-item label="角色">
          <el-select v-model="addUser.operator" placeholder="请选择角色">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addUser.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
  import { getNowFormatDate } from '../../utils';

  export default {
    name: 'user',
    data() {
      return {
        num: null,
        UserList: [],
        editUserRow: {
          username: '',
          password: '',
          remark: '',
        },
        addVisible: false,
        addUser: {},
        editVisible: false,
        editUser: {},
        options: [{
          value: 1,
          label: '超级管理员'
        }, {
          value: 2,
          label: '管理员'
        }, {
          value: 3,
          label: '用户'
        }],
        idx: -1,
        delIndex: Number,
        delVisible: false,
        RoleID: Number,
        cur_page: 1,
        multipleSelection: [],
        select_cate: '',
        select_word: ''
      }
    },
    created() {
      this.getUsers();
      let d = 2; //当前页
      let m = 10; //每页显示条数
      let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      let count = (d - 1) * 10;
      arr.forEach(item => {
        count++
        console.log(item, '!!!!!!', count);
      });
    },
    methods: {
      ...mapActions(['ajax']),
      // 分页导航
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getUsers();
      },
      getUsers() {
        this.ajax({
          name: 'getUsers'
        }).then(res => {
          res.forEach((item, index) => {
            item.index = index + 1;
          });
          this.UserList = res;
          this.num = this.UserList.length; //分页
        });
      },
      //新增用户
      saveAdd() {
        this.addVisible = false;
        this.ajax({
          name: 'addUser',
          data: this.addUser
        }).then(res => {
          this.getUsers();
        });
      },
      //编辑
      handleEdit(row, index) {
        this.editVisible = true;
        this.editUser = {
          username: row.username,
          password: row.password,
          remark: row.remark,
        }
        this.idx = row.id;
      },
      // 保存编辑
      saveEdit() {
        this.editVisible = false;
        this.ajax({
          name: 'editUser',
          data: this.editUser,
          id: this.idx
        }).then(res => {
          this.$message.success('修改成功');
          this.getUsers();
        });
      },
      getRoleName(roldId) {
        switch(roldId) {
          case 1:
            this.editUser.roleName = '超级管理员'
            break;
          case 2:
            this.editUser.roleName = '管理员'
            break;
          case 3:
            this.editUser.roleName = '用户'
          default:
            break;
        }
      },
      //删除
      handleDelete(row, index) {
        this.idx = row.id;
        this.delVisible = true;
        this.delIndex = index;
      },
      // 确定删除
      deleteUser() {
        this.delVisible = false;
        this.ajax({
          name: 'deleteUser',
          id: this.idx
        }).then(res => {
          this.$message.success('删除成功');
          this.getUsers();
        });
      }
      // delAll() {
      //   const length = this.multipleSelection.length;
      //   let str = '';
      //   this.del_list = this.del_list.concat(this.multipleSelection);
      //   for(let i = 0; i < length; i++) {
      //     str += this.multipleSelection[i].name + ' ';
      //   }
      //   this.$message.error('删除了' + str);
      //   this.multipleSelection = [];
      // },
      // handleSelectionChange(val) {
      //   this.multipleSelection = val;
      // }
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
