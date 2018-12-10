<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">
      <div class="search-box">
        <div class="handle-box">
          <el-button v-if="getAlcsObj.JSXZ" type="primary" icon="el-icon-plus" @click="addRoles">新增角色</el-button>
        </div>
        <el-form ref="search" :rules="searchRules" :model="roleSearch" class="demo-form-inline" :inline="true">
          <el-form-item label="状态：">
            <el-select class="el-select-width" v-model="roleSearch.status" @change="search" clearable>
              <el-option v-for="item in status" :key="item.num" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称：" prop="name">
            <el-input class="el-input-width" v-model.trim="roleSearch.name" @change="search" placeholder="输入角色名称查询" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="RoleList" stripe style="width: 100%" ref="multipleTable" height="550" fit :row-class-name="tableRowStatusName">
        <el-table-column prop="num" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="name" label="角色名称">
        </el-table-column>
        <el-table-column prop="Status" label="状态">
        </el-table-column>
        <el-table-column prop="remark" label="描述">
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间">
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button v-if="getAlcsObj.JSXG" type="text" size="small" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
            <el-button v-if="getAlcsObj.JSSQ" type="text" size="small" @click="handleSetAuthorize(scope.row, scope.$index)">授权</el-button>
            <el-button v-if="!scope.row.isButtonShow && getAlcsObj.JSSC" type="text" size="small" @click="handledeleteRole(scope.row, scope.$index)">删除</el-button>
            <el-button v-if="scope.row.isButtonShow && getAlcsObj.JSSZZT" type="text" size="small" @click="deleteRole(scope.row, scope.$index)">置为无效</el-button>
            <el-button v-if="!scope.row.isButtonShow && getAlcsObj.JSSZZT" type="text" size="small" @click="handleEffective(scope.row, scope.$index)">置为有效</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ve-pagination :cur_page="cur_page" :pageSize="pageSize" :count="count" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" @gofist="gofist" @goLast="goLast"></ve-pagination>
    </div>
    <!-- 授权对话框 -->
    <el-dialog title="授权" :visible.sync="showAcls" width="30%" :close-on-click-modal="false">
      <el-tree :data="aclsTree" show-checkbox node-key="id" ref="tree" :default-expand-all="false" :expand-on-click-node="true" :check-on-click-node="true" @node-click="handleNodeClick" @check="handleCheck" @check-change="checkChange">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCheckedKeys">确定</el-button>
        <el-button @click="showAcls=false;$refs.tree.setCheckedKeys([])">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增对话框 -->
    <el-dialog title="新增角色" :visible.sync="addVisible" width="30%" :before-close="addDiaClose" :close-on-click-modal="false">
      <el-form :model="addRole" ref="addRole" :rules="RoleRule" label-width="100px" label-position="right">
        <div>
          <el-form-item label="角色名称:" prop="name">
            <el-input v-model.trim="addRole.name" placeholder="请输入角色名" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="描述:" prop="remark">
            <el-input type="textarea" class="inputs" v-model.trim="addRole.remark" placeholder="请输入描述" maxlength="30"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveAdd">确定</el-button>
        <el-button @click="cancleAdd">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改角色" :visible.sync="editVisible" width="30%" :before-close="editDiaClose" :close-on-click-modal="false">
      <el-form :model="editRole" ref="editRole" :rules="RoleRule" label-width="80px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="editRole.name" placeholder="请输入角色名" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" :rows="4" v-model.trim="editRole.remark" placeholder="请输入备注" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveEdit">确定</el-button>
        <el-button @click="editVisible=false;$refs.editRole.resetFields()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { serialize } from '../../utils';
  import { checkUsername } from '../../utils/rules';

  export default {
    data() {
      return {
        defaultArr: [2, 3], //默认选中的数组
        cur_page: 1,
        count: 0,
        pageSize: 10,
        roleName: String,
        disabled: false,
        RoleList: [],
        editRoleRow: {
          name: '',
          remark: '',
        },
        role: {
          name: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' },
            { required: true, message: '角色名称不可为空' }
          ],
          remark: [
            {}
          ]
        },
        addVisible: false,
        addRole: {
          name: '',
          remark: '',
        },
        editVisible: false,
        editRole: {},
        idx: -1,
        delIndex: Number,
        searchRules: {  // 搜索框规则
          name: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ]
        },
        //角色搜索
        roleSearch: {
          status: '',
          name: ''
        },
        //状态
        status: [
          {
            value: 1,
            label: '有效'
          },
          {
            value: 0,
            label: '无效'
          }
        ],
        RoleRule: {
          name: [
            { validator: checkUsername, trigger: 'blur' },
            { required: true, trigger: 'blur', message: '角色名称不能为空' }],
          remark: [
            { required: true, message: '描述不能为空', trigger: 'blur' }],
        },
        showAcls: false, //权限树对话框
        aclsTree: [], //权限树
        allaclsTree: [],
        effectiveVisible: false, //置为无效对话框
        deleteRoleVisible: false //删除对话框
      };
    },
    created() {
      this.getRoles(); //获取权限表
      this.getAcls();  //获取权限
    },
    computed: {
      ...mapGetters(['getAlcs', 'getAlcsObj'])
    },
    methods: {
      ...mapActions(['ajax']),
      //获取角色列表
      getRoles() {
        let d = this.cur_page; //当前页
        let m = this.pageSize; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getRoles',
          data: { pageNum: this.cur_page, pageSize: this.pageSize, ...this.roleSearch }
        }).then(res => {
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
      // tableRowStatusName 根据有效无效修改 row 样式
      tableRowStatusName({ row, rowIndex }) {
        if(row.status == 0) {
          return 'invalid-row'
        } else {
          return ''
        }
      },
      //获取权限数
      getAcls() {
        this.ajax({
          name: 'getUserAclTree'
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
      handleNodeClick(data) {
        // console.log('数据', data);
        // this.$refs.tree.getNode();
      },
      handleCheck(data) {
        // 叶子节点  当点击修改删除时将查询功能点击上
        if(data.parentId && !data.children) {
          let firstNode = this.$refs.tree.getNode(data.id);
          while(firstNode.previousSibling) {
            firstNode = firstNode.previousSibling;
          }

          let tempNode = firstNode;
          while(tempNode.nextSibling) {
            tempNode = tempNode.nextSibling;
            if(tempNode.checked) {
              this.$refs.tree.setChecked(firstNode.data.id, true);
            }
          }
        }
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
          // 当前角色拥有的权限将被点击上
          this.$refs.tree.setCheckedKeys(res);
        });

      },
      addRoles() {
        this.addVisible = true;
      },
      addDiaClose(done) {
        this.$refs.addRole.resetFields();
        done();
      },
      // 新增
      saveAdd() {
        this.$refs.addRole.validate((valid) => {
          if(valid) {
            this.ajax({
              name: 'addRole',
              data: this.addRole
            }).then(res => {
              this.$message.success('新增角色成功');
              this.getRoles();
              this.$refs.addRole.resetFields();
              this.addVisible = false;
            });
          }
        });
      },
      cancleAdd() {
        this.addVisible = false;
        this.$refs.addRole.resetFields();
      },
      handleEdit(row, index) {
        this.editVisible = true;
        this.$nextTick(() => {
          this.editRole = {
            name: row.name,
            remark: row.remark
          };
          this.idx = row.id;
        })
      },
      editDiaClose(done) {
        this.$refs.editRole.resetFields();
        done();
      },
      // 修改
      saveEdit() {
        this.$refs.editRole.validate((valid) => {
          if(valid) {
            this.editVisible = false;
            this.ajax({
              name: 'editRole',
              data: this.editRole,
              id: this.idx
            }).then(res => {
              this.$message.success('修改成功');
              this.$refs.editRole.resetFields();
              this.getRoles();
            });
          }
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
        this.$confirm(`删除角色:${row.name},是否确定？`, '提示', {
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'deleteRole',
            id: row.id
          }).then(res => {
            this.getRoles();
          });
        })
      },
      //搜索
      search() {
        this.getRoles();
        this.gofist();
      },
      //分页
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getRoles();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getRoles();
      },
      gofist() {
        this.cur_page = 1;
        this.getRoles();
      },
      goLast() {
        this.cur_page = Math.ceil(this.count / this.pageSize);
        this.getRoles();
      },
      checkChange(data, isChecked) {
        // console.log(data, isChecked);
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
</style>
