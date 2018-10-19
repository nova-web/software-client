<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="search" @click="addVisible=true">新增角色</el-button>
        <!-- <el-button type="primary" icon="search" @click="deleteRole" :disabled="disabled">删除角色</el-button> -->
      </div>
      <div class="search-box">
        <el-form ref="search" :model="roleSearch" class="demo-form-inline" :inline="true">
          <el-form-item label="状态">
            <el-select v-model="roleSearch.status" @change="search">
              <el-option v-for="item in status" :key="item.num" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="角色名称">
            <el-input v-model="roleSearch.username" @change="search" placeholder="按角色名称搜索"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="RoleList" border style="width: 100%" ref="multipleTable" height="550" fit>
        <el-table-column prop="num" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="name" label="角色名称">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column prop="Status" label="状态">
        </el-table-column>

        <el-table-column prop="updatedAt" label="更新时间">
        </el-table-column>
        <el-table-column label="操作" width="310">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
            <el-button size="small" @click="handleSetAuthorize(scope.row, scope.$index)">授权</el-button>
            <el-button v-show="scope.row.isButtonShow" size="small" type="danger" @click="deleteRole(scope.row, scope.$index)">置为无效</el-button>
            <el-button v-show="!scope.row.isButtonShow" size="small" @click="handleEffective(scope.row, scope.$index)">置为有效</el-button>
            <el-button v-show="!scope.row.isButtonShow" size="small" @click="handledeleteRole(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="9" :current-page="cur_page" layout="total, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div>
    </div>
    <!-- 授权对话框 -->
    <el-dialog title="授权" :visible.sync="showAcls" center width="30%">
      <el-tree :data="aclsTree" show-checkbox node-key="id" ref="tree" :default-expand-all="true" :expand-on-click-node="true">
      </el-tree>
      <div class="buttons">
        <el-button @click="showAcls=false;$refs.tree.setCheckedKeys([])">取消</el-button>
        <el-button type="primary" @click="getCheckedKeys">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新增对话框 -->
    <el-dialog title="新增角色" :visible.sync="addVisible" center width="30%">
      <el-form :model="addRole" label-width="80px">
        <div>
          <el-form-item label="角色名称">
            <el-input v-model="addRole.name" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addRole.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="btn">
          <el-button type="primary" @click="addVisible=false">取消</el-button>
          <el-button @click="saveAdd">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改角色" :visible.sync="editVisible" center width="30%">
      <el-form :model="editRole" label-width="80px">
        <div>
          <el-form-item label="角色名称">
            <el-input v-model="editRole.name" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editRole.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="btn">
          <el-button type="primary" @click="editVisible=false;">取消</el-button>
          <el-button @click="saveEdit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="deleteRoleVisible" width="300px" center>
      <div class="del-dialog-cnt">删除角色{{roleName}}，是否确定？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteRoleVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleDeleteRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
  import { serialize } from '../../utils';

  export default {
    data() {
      return {
        cur_page: 1,
        count: 0,
        roleName: String,
        disabled: false,
        RoleList: [],
        editRoleRow: {
          name: '',
          remark: '',
        },
        addVisible: false,
        addRole: {},
        editVisible: false,
        editRole: {},
        idx: -1,
        delVisible: false,
        delIndex: Number,
        //角色搜索
        roleSearch: {
          status: 1
        },
        //状态
        status: [
          {
            value: 0,
            label: '无效'
          },
          {
            value: 1,
            label: '有效'
          }
        ],
        showAcls: false, //权限树对话框
        aclsTree: [], //权限树
        effectiveVisible: false, //置为无效对话框
        deleteRoleVisible: false //删除对话框
      };
    },
    created() {
      this.getRoles(); //获取权限表
      this.getAcls();  //获取功能
    },
    methods: {
      ...mapActions(['ajax']),
      //获取角色列表
      getRoles() {
        let d = this.cur_page; //当前页
        let m = 10; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getRoles',
          data: { pageNum: this.cur_page, ...this.roleSearch }
        }).then(res => {
          console.log(res);
          res.rows.forEach((item, index) => {
            switch(item.status) {
              case 0:
                item.Status = '无效';
                item.isButtonShow = false;
                break;
              case 1:
                item.Status = '有效';
                item.isButtonShow = true;
                break;
              case 2:
                item.Status = '删除'
                break;
              default:
                break;
            }
            item.num = count++;
          });
          this.RoleList = res.rows;
          this.count = res.count;
        });
      },
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getRoles()
      },
      //获取权限数
      getAcls() {
        this.ajax({
          name: 'acls'
        }).then(res => {
          this.aclsTree = this.pageAclsTree(res);
        })
      },
      //配置权限树
      pageAclsTree(data) {
        data.forEach(item => {
          item.label = item.name;
          if(item.children) {
            this.pageAclsTree(item.children);
          }
        });
        return data;
      },
      //授权方法
      getCheckedKeys() {
        let aclsArr = this.$refs.tree.getCheckedKeys();
        this.ajax({
          name: 'setAuthorize',
          data: { id: this.idx, acls: aclsArr }
        }).then(res => {
          if(res.status === 1) {
            this.showAcls = false;
            this.$message.success('操作成功');
          }
        })

      },
      handleSetAuthorize(row, index) {
        this.idx = row.id;
        this.showAcls = true;
        this.ajax({
          name: 'getRoleAcls',
          data: { id: this.idx }
        }).then(res => {
          this.$refs.tree.setCheckedKeys(res);
        });

      },
      // 新增
      saveAdd() {
        this.addVisible = false;
        this.ajax({
          name: 'addRole',
          data: this.addRole
        }).then(res => {
          this.$message.success('操作成功');
          this.getRoles();
        });
      },
      handleEdit(row, index) {
        this.editVisible = true;
        this.editRole = {
          name: row.name,
          remark: row.remark
        };
        this.idx = row.id;
      },
      // 修改
      saveEdit() {
        this.editVisible = false;
        this.ajax({
          name: 'editRole',
          data: this.editRole,
          id: this.idx
        }).then(res => {
          this.$message.success('修改成功');
          this.getRoles();
        });
      },
      // 置为无效
      deleteRole(row, index) {
        this.ajax({
          name: 'setRoleStatus',
          data: { id: row.id, status: 0 }
        }).then(res => {
          this.$message.success('操作成功');
          this.getRoles();
        });
      },
      //置为有效
      handleEffective(row, index) {
        this.ajax({
          name: 'setRoleStatus',
          data: { id: row.id, status: 1 }
        }).then(res => {
          this.$message.success('操作成功');
          this.getRoles();
        });
      },
      //删除
      handledeleteRole(row, index) {
        this.deleteRoleVisible = true;
        this.idx = row.id;
        this.roleName = row.name;
      },
      handleDeleteRoles() {
        this.deleteRoleVisible = false;
        this.ajax({
          name: 'deleteRole',
          id: this.idx
        }).then(res => {
          this.$message.success('操作成功');
          this.getRoles();
        });
      },
      //搜索
      search() {
        this.getRoles();
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