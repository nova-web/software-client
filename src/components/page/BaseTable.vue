<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
        <el-button type="primary" icon="search" @click="adduser">新增用户</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%" ref="multipleTable" height="550">
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
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="num">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色">
          <el-select v-model="form.num" :placeholder="form.operator">
            <el-option v-for="item in options" :key="item.num" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 新增用户 -->
    <el-dialog title="新增用户" :visible.sync="newUser" width="30%">
      <el-form :model="addnewUser" label-width="80px">
        <el-form-item label="角色">
          <el-select v-model="addnewUser.operator" placeholder="请选择角色">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="addnewUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addnewUser.password"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addnewUser.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newUser = false">取 消</el-button>
        <el-button type="primary" @click="updateNewuser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import htp from '../../api/http';
  import { getNowFormatDate } from '../../utils';
  export default {
    name: 'basetable',
    data() {
      return {
        num: null,
        newUser: false,
        url: './static/vuetable.json',
        tableData: [],
        cur_page: 1,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        editVisible: false,
        delVisible: false,
        form: {
          username: '',
          password: '',
          remark: '',
          num: ''
        },
        addnewUser: {
          username: '',
          operator: '',
          remark: '',
          password: '',
          roleId: ''
        },
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
        RoleID: Number
      }
    },
    created() {
      this.getUser();
    },
    computed: {
    },
    watch: {
      addnewUser: {
        handler(val, oldval) {
        },
        deep: true
      }
    },
    methods: {
      // 分页导航
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getUser();
      },
      getUser() {
        htp.get('api/users').then(res => {
          console.log(res);
          if(res.status === 200) {
            this.tableData = res.data.data;
            this.tableData.forEach((item, index) => {
              item.index = index + 1;
              item.num = 2;
            });

            this.num = this.tableData.length; //分页
          }
        })
      },
      adduser() {
        this.newUser = true;
      },
      //新增用户
      updateNewuser() {
        this.newUser = false;
        htp.post('api/users', this.addnewUser).then(res => {
          this.addnewUser.del = false;
          // this.addnewUser.id = res.data.data.userId;
          // this.tableData.push(this.addnewUser);
          this.getUser();
        });
      },
      //编辑
      handleEdit(row, index) {
        this.index = index;
        this.editVisible = true;
        this.form = row;
      },
      // 保存编辑
      saveEdit() {
        let data = {
          username: this.form.username,
          operator: this.form.operator,
          password: this.form.password,
          num: this.form.num
        }
        htp.put('api/users', this.form.id, data).then(res => {
          if(res) {
            // this.form.UpdateTime = getNowFormatDate();
            // this.$set(this.tableData, this.index, this.form);
            // this.editVisible = false;
            this.getUser();
            this.$message.success(`修改第 ${this.index + 1} 行成功`);
          }
        })
      },
      getRoleName(roldId) {
        switch(roldId) {
          case 1:
            this.form.roleName = '超级管理员'
            break;
          case 2:
            this.form.roleName = '管理员'
            break;
          case 3:
            this.form.roleName = '用户'
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
      deleteRow() {
        htp.delete('api/users', { id: this.idx }).then(res => {
          this.tableData.splice(this.delIndex, 1);
          this.tableData.forEach((item, index) => {
            item.index = index + 1;
          });
          this.$message.success('删除成功');
          this.delVisible = false;
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
