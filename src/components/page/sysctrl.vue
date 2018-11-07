<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统控制</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">
      <!-- <div class="handle-box">
        <el-button v-if="getAlcsObj.JSXZ" type="primary" icon="search" @click="addVisible=true">新增角色</el-button>
      </div> -->
      <div class="search-box">
        <el-form ref="search" :model="sysctrlSearch" :rules="searchRules" class="demo-form-inline" :inline="true">
          <el-form-item label="服务状态：">
            <el-select v-model="sysctrlSearch.service" @change="search">
              <el-option v-for="item in service" :key="item.num" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="产品名称：" prop="username">
            <el-input v-model="sysctrlSearch.username" @change="search" placeholder="按产品名称搜索"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="SysList" stripe style="width: 100%" ref="multipleTable" height="550" fit :row-class-name="tableRowStatusName">
        <el-table-column prop="num" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="name" label="产品名称">
        </el-table-column>
        <el-table-column prop="service" label="服务状态">
        </el-table-column>

        <el-table-column prop="serviceTime" label="更新时间">
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isButtonShow" type="text" size="small" @click="deleteRole(scope.row, scope.$index)">暂停服务</el-button>
            <el-button v-if="!scope.row.isButtonShow" type="text" size="small" @click="handleEffective(scope.row, scope.$index)">开通服务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <div class="pagination-left">
          {{(cur_page - 1) * pageSize + 1 === 0 ? 1 : (cur_page - 1) * pageSize + 1}}-{{cur_page * pageSize}} 共 {{count}}
        </div>
        <div class="pagination-right">
          <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" @size-change="handleSizeChange" layout="total,sizes,slot ,prev, pager, next" :total="count">
            <el-button size="small" @click="gofist">首页</el-button>
          </el-pagination>
          <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" layout=" slot,jumper" :total="count">
            <el-button size="small" @click="goLast">末页</el-button>
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 授权对话框 -->
    <el-dialog title="授权" :visible.sync="showAcls" width="30%">
      <el-tree :data="aclsTree" show-checkbox node-key="id" ref="tree" :default-expand-all="false" :expand-on-click-node="true">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCheckedKeys">确定</el-button>
        <el-button @click="showAcls=false;$refs.tree.setCheckedKeys([])">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增对话框 -->
    <el-dialog title="新增角色" :visible.sync="addVisible" width="30%">
      <el-form :model="addRole" label-width="80px" label-position="left">
        <div>
          <el-form-item label="角色名称">
            <el-input v-model="addRole.name" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" class="inputs" v-model="addRole.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveAdd">确定</el-button>
        <el-button @click="addVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改角色" :visible.sync="editVisible" width="30%">
      <el-form :model="editRole" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="editRole.name" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="4" v-model="editRole.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveEdit">确定</el-button>
        <el-button @click="editVisible=false;">取消</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="deleteRoleVisible" width="600px">
      <div class="del-dialog-cnt">
        <div class="ic">
          <i class="el-icon-info icon-css"></i>
        </div>
        <div>删除角色：{{roleName}}，是否确定？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDeleteRoles">确 定</el-button>
        <el-button @click="deleteRoleVisible=false">取 消</el-button>
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
        SysList: [],
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
        sysctrlSearch: {
          service: 1
        },
        //状态
        service: [
          {
            value: 0,
            label: '已关闭'
          },
          {
            value: 1,
            label: '已开通'
          }
        ],
        showAcls: false, //权限树对话框
        aclsTree: [], //权限树
        effectiveVisible: false, //置为无效对话框
        deleteRoleVisible: false, //删除对话框
        searchRules: {  // 搜索框规则
          username: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'change' }
          ]
        },
      };
    },
    created() {
      this.getSyscontrol(); //获取权限表
    },
    computed: {
      ...mapGetters(['getAlcs', 'getAlcsObj'])
    },
    methods: {
      ...mapActions(['ajax']),
      //获取角色列表
      getSyscontrol() {
        let d = this.cur_page; //当前页
        let m = this.pageSize; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getSyscontrol',
          data: { pageNum: this.cur_page, pageSize: this.pageSize, ...this.sysctrlSearch }
        }).then(res => {
          res.rows.forEach((item, index) => {
            switch(item.service) {
              case 0:
                item.service = '已关闭';
                item.isButtonShow = false;
                break;
              case 1:
                item.service = '已开通';
                item.isButtonShow = true;
                break;
              default:
                break;
            }
            item.num = count++;
          });
          this.SysList = res.rows;
          this.count = res.count;
        });
      },
      // tableRowStatusName 根据有效无效修改 row 样式
      tableRowStatusName({ row, rowIndex }) {
        if(row.service == 0) {
          return 'invalid-row'
        } else {
          return ''
        }
      },
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getRoles()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getLog();
      },
      gofist() {
        this.cur_page = 1;
        this.getLog();
      },
      goLast() {
        this.cur_page = Math.ceil(this.count / this.pageSize);
        this.getLog();
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
      //授权方法
      getCheckedKeys() {
        let aclsArr = this.$refs.tree.getCheckedKeys();
        this.ajax({
          name: 'setAuthorize',
          data: { id: this.idx, acls: aclsArr }
        }).then(res => {
          if(res.service === 1) {
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
          console.log(res);
          this.$refs.tree.setCheckedKeys(res);
        });

      },
      // 新增
      saveAdd() {
        this.ajax({
          name: 'addRole',
          data: this.addRole
        }).then(res => {
          this.$message.success('操作成功');
          this.getRoles();
          this.addVisible = false;
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
          data: { id: row.id, service: 0 }
        }).then(res => {
          this.$message.success('操作成功');
          this.getRoles();
        });
      },
      //置为有效
      handleEffective(row, index) {
        this.ajax({
          name: 'setRoleStatus',
          data: { id: row.id, service: 1 }
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
