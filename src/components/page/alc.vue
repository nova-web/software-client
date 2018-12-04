<template>

  <div class="alc">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">
      <div class="search-box">
        <div class="handle-box">
        </div>
        <el-form highlight-current-row @current-change="handleCurrentChange" :rules="searchRules" :model="alcSearch" ref="search" class="demo-form-inline" :inline="true">
          <el-form-item label="状态：">
            <el-select class="el-select-width" v-model="alcSearch.status" @change="search" clearable>
              <el-option v-for="item in status" :key="item.num" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="权限名称：" prop="name">
            <el-input style="height: 32px;width: 105px" clearable v-model.trim="alcSearch.name" placeholder="输入权限名称查询" @change="search" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-table">
        <el-table ref="table" @current-change="handleCurrentChange" highlight-current-row :data="alcData" :row-style="showRow" v-bind="$attrs" stripe style="width: 100%" max-height="550" fit :row-class-name="tableRowStatusName">

          <el-table-column type="index" width="50" label="序号">
          </el-table-column>
          <el-table-column width="100">
            <template slot-scope="scope">
              <span v-for="space in scope.row._level" :key="space" class="ms-tree-space" />
              <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index, scope.row)">
              <i v-if="!scope.row._expanded" class="el-icon-arrow-right"/>
              <i v-else class="el-icon-arrow-down"/>
             </span>
            </template>
          </el-table-column>
          <el-table-column label="权限名称">
            <template slot-scope="scope">
              <span v-if="scope.row._level > 0" v-for="space in scope.row._level" :key="space" class="ms-tree-margin" />
              <span>
              {{scope.row.name}}
            </span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span>
              {{scope.row.status === 0?'无效':'有效'}}  
            </span>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="remark">
          </el-table-column>
          <el-table-column label="URL" prop="url">
          </el-table-column>
          <el-table-column label="CODE" prop="code">
          </el-table-column>
          <el-table-column label="更新时间" prop="updatedAt">
          </el-table-column>
          <el-table-column label="操作" width="330">
            <template slot-scope="scope">
              <el-button v-if="getAlcsObj.GNXG" type="text" @click="handelModify(scope.row)">修改</el-button>
              <el-button v-if="getAlcsObj.GNSC" type="text" @click="handleDelete(scope.row)" v-show="scope.row.status === 0">删除</el-button>
              <el-button v-if="getAlcsObj.GNXZ" type="text" @click="handlePeerMenus(scope.row)">新增同级菜单</el-button>
              <el-button v-if="getAlcsObj.GNXZ" type="text" @click="handleLowerLevelMenu(scope.row)">新增下级菜单</el-button>
              <el-button v-if="getAlcsObj.GNSZZT" type="text" @click="nullAndVoid(scope.row, scope.$index)" v-show="scope.row.status === 1">置为无效</el-button>
              <el-button v-if="getAlcsObj.GNSZZT" type="text" @click="setUpToBeValid(scope.row, scope.$index)" v-show="scope.row.status === 0">置为有效</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="修改权限" :visible.sync="editVisible" width="30%" :before-close="editaclDiaClose" :close-on-click-modal="false">
      <el-form ref="editacl" :rules="AlcRule" :model="editFunction" label-width="80px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model.trim="editFunction.name" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model.trim="editFunction.url"></el-input>
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model.trim="editFunction.code"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model.trim="editFunction.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEdit">确 定</el-button>
        <el-button @click="editVisible=false;">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增同级菜单" :visible.sync="addParentModel" width="30%" :before-close="addpeerDiaClose" :close-on-click-modal="false">
      <el-form ref="addpeer" :model="addParentObj" :rules="AlcRule" label-width="80px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model.trim="addParentObj.name"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model.trim="addParentObj.url"></el-input>
        </el-form-item>
        <el-form-item label="code" prop="url">
          <el-input v-model.trim="addParentObj.code"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model.trim="addParentObj.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddParent">确 定</el-button>
        <el-button @click="addParentModel=false;">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增下级菜单" :visible.sync="addLeaverModel" width="30%" :before-close="addleaverDiaClose" :close-on-click-modal="false">
      <el-form ref="addleaver" :model="addLeaverObj" :rules="AlcRule" label-width="80px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model.trim="addLeaverObj.name"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model.trim="addLeaverObj.url"></el-input>
        </el-form-item>
        <el-form-item label="code" prop="url">
          <el-input v-model.trim="addLeaverObj.code"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model.trim="addLeaverObj.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddLeaver">确 定</el-button>
        <el-button @click="addLeaverModel=false;">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteAcls">确 定</el-button>
        <el-button @click="delVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { treeToArray, serialize } from '../../utils';
  import { mapActions, mapGetters } from 'vuex';
  import { checkUsername } from '../../utils/rules';
  export default {
    data() {
      return {
        acls: {}, //表格数据
        indexArr: [],
        status: [
          {
            value: '1',
            label: '有效'
          },
          {
            value: '0',
            label: '无效'
          }
        ],
        searchRules: {  // 搜索框规则
          name: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ]
        },
        AlcRule: {  // 弹出框内容的验证规则 name url code remark
          name: [
            { required: true, validator: checkUsername, trigger: 'blur' },
            { required: true, trigger: 'blur', message: '权限名称不能为空' }],
          url: [{ required: false, message: 'URL不能为空', trigger: 'blur' }],
          code: [{ required: true, message: 'Code不能为空', trigger: 'blur' }],
          remark: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        },
        editVisible: false,
        editFunction: {},
        alcSearch: {},
        idx: Number,
        addParentModel: false, //新增同级菜单
        addParentObj: {}, //同级对象
        addLeaverModel: false,
        addLeaverObj: {},
        delVisible: false, //删除提示框
        currentRow: null,
        columns: {
          type: Array,
          default: () => []
        },
        expandAll: {
          type: Boolean,
          default: false
        },
        searchNameData: [],
        searchArr: [],
        alcData: [], //权限表数据
        treeData: [], //缓存数据
        tmp: []
      }
    },
    created() {
      this.initData();

    },
    methods: {
      ...mapActions(['ajax']),
      initData() {
        this.ajax({
          name: 'getAcls',
          data: {
            ...this.alcSearch
          }
        }).then(res => {
          this.treeData = this.dataExpansion(res);
          this.alcData = this.pageAlcData(res);
        })
      },
      //渲染数据
      pageAlcData(data) {
        let tmp;
        if(data.length > 0) {
          if(!Array.isArray(data)) {
            tmp = [data];
          } else {
            tmp = data;
          }
          const func = treeToArray;
          let tableData = func.apply(null, [tmp, this.expandAll.default]);
          return tableData;
        }
      },
      // 切换下级是否展开
      toggleExpanded(trIndex, row) {
        this.$set(this.alcData[trIndex], '_expanded', !this.alcData[trIndex]._expanded);
      },
      //数据展开
      dataExpansion(data) {
        let tmp = [];
        if(data.length > 0) {
          data.forEach((record) => {
            tmp.push(record);
            if(record.children) {
              const children = this.dataExpansion(record.children);
              tmp = tmp.concat(children);
            }
          })
        }
        return tmp;
      },
      //搜索
      search() {
        // let arr = [];
        // if(this.alcSearch.status) {
        //   if(this.alcSearch.name) {
        //     this.tmp = this.treeData.filter(item => item.status == this.alcSearch.status);
        //     this.tmp = this.tmp.filter(item => item.name.indexOf(this.alcSearch.name) !== -1);
        //     arr = this.tmp.filter(item => !item.parentId);
        //     this.createTree(arr, this.tmp);
        //     this.alcData = this.pageAlcData(arr);
        //   } else {
        //     this.tmp = this.treeData.filter(item => item.status == this.alcSearch.status);
        //     arr = this.tmp.filter(item => !item.parentId);
        //     this.createTree(arr, this.tmp);
        //     this.alcData = this.pageAlcData(arr);
        //   }
        // } else if(this.alcSearch.name) {
        //   this.tmp = this.treeData.filter(item => item.name.indexOf(this.alcSearch.name) !== -1);
        //   arr = this.tmp.filter(item => !item.parentId);
        //   this.createTree(arr, this.tmp);
        //   this.alcData = this.pageAlcData(arr);
        // } else {
        //   this.initData();
        // }
        // this.tmp = [];
        this.initData();
      },
      //树状数据
      createTree(arr, acls) {
        arr.forEach(item => {
          let children = acls.filter(acl => acl.parentId === item.id);
          if(children.length) {
            item.children = children;
            this.createTree(children, acls);
          }
        });
      },
      //展开逻辑
      showRow: function(row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
        this.$set(row.row, '_show', show);
        return show ? 'animation:treeTableShow .3s;' : 'display:none;'
      },
      editaclDiaClose(done) {
        this.$refs.editacl.resetFields();
        done();
      },
      //修改
      handelModify(row) {
        this.editVisible = true;
        this.$nextTick(() => {
          this.idx = row.id;
          this.editFunction = {
            name: row.name,
            remark: row.remark,
            url: row.url,
            code: row.code
          };
        })
      },
      //确认修改
      saveEdit() {
        this.$refs.editacl.validate((valid) => {
          if(valid) {
            this.ajax({
              name: 'putAcls',
              id: this.idx,
              data: this.editFunction
            }).then(res => {
              this.initData();
              this.editVisible = false;
              this.$message.success('操作成功');
            })
          } else {
            return;
          }
        });
      },
      //删除
      handleDelete(row) {
        this.delVisible = true;
        this.idx = row.id;
      },
      deleteAcls() {
        this.ajax({
          name: 'delectAcls',
          id: this.idx
        }).then(res => {
          this.initData();
          this.delVisible = false;
          // this.$message.success('操作成功');
        });
      },
      addpeerDiaClose(done) {
        this.$refs.addpeer.resetFields();
        done();
      },
      //新增同级菜单
      handlePeerMenus(row) {
        this.addParentModel = true;
        this.$nextTick(() => {
          this.addParentObj = {
            name: null,
            remark: null,
            url: null,
            code: null,
            parentId: row.parentId
          }
        })
      },
      //确认新增
      saveAddParent() {
        this.$refs.addpeer.validate((valid) => {
          if(valid) {
            if(!this.addParentObj.parentId) {
              delete this.addParentObj.parentId
            }
            this.ajax({
              name: 'postAclsParent',
              data: this.addParentObj
            }).then(res => {
              this.initData();
              this.addParentModel = false;
              this.$message.success('操作成功');
            })
          }
        });
      },
      addleaverDiaClose(done) {
        this.$refs.addleaver.resetFields();
        done();
      },
      //新增下级菜单
      handleLowerLevelMenu(row) {
        this.addLeaverModel = true;
        this.$nextTick(() => {
          this.addLeaverObj = {
            name: null,
            remark: null,
            url: null,
            code: null,
            parentId: row.id
          }
        })
      },
      saveAddLeaver() {
        this.$refs.addleaver.validate((valid) => {
          if(valid) {
            this.ajax({
              name: 'postAclsParent',
              data: this.addLeaverObj
            }).then(res => {
              this.initData();
              this.addLeaverModel = false;
              this.$message.success('操作成功');
            })
          }
        });
      },
      //置为无效
      nullAndVoid(row) {
        this.setAclStatus(row, 0);
      },
      //置为有效
      setUpToBeValid(row) {
        this.setAclStatus(row, 1);
      },
      // tableRowStatusName 根据有效无效修改 row 样式
      tableRowStatusName({ row, rowIndex }) {
        if(row.status == 0) {
          return 'invalid-row'
        } else {
          return ''
        }
      },
      setAclStatus(row, num) {
        this.ajax({
          name: 'setAclStatus',
          data: { id: row.id, status: num }
        }).then(res => {
          this.$message.success('操作成功');
          this.initData();
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },

      // 图标显示
      iconShow(index, record) {
        return (index === 0 && record.children && record.children.length > 0)
      },
      //数组去重
      uniq(array) {
        var temp = []; //一个新的临时数组
        for(var i = 0; i < array.length; i++) {
          if(temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
          }
        }
        return temp;
      },
      searchData(data, str) {
        data.forEach(item => {
          if(item.name.indexOf(str) !== -1) {
            this.searchArr.push(item);
          } else {
            if(item.children) {
              item.children.forEach(itemSon => {
                if(itemSon.name.indexOf(str) !== -1) {
                  this.searchArr.push(itemSon);
                } else {
                  if(itemSon.children) {
                    itemSon.children.forEach(itemGroundSon => {
                      if(itemGroundSon.name.indexOf(str) !== -1) {
                        this.searchArr.push(itemGroundSon);
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    },
    computed: {
      ...mapGetters(['getAlcs', 'getAlcsObj'])
      // formatData() {
      //   let tmp;
      //   if(this.acls.length > 0 && this.acls.length > 0) {
      //     if(!Array.isArray(this.acls)) {
      //       tmp = [this.acls];
      //     } else {
      //       tmp = this.acls;
      //     }
      //     const func = treeToArray;
      //     let data = func.apply(null, [tmp, this.expandAll.default]);

      //     if(this.alcSearch.status || this.alcSearch.name) {
      //       if(this.alcSearch.status == '0') {
      //         data = data.filter(item => {
      //           return item.status == this.alcSearch.status;
      //         })
      //         data.forEach(item => {
      //           if(item._level > 1) {
      //             item.parent._show = true;
      //             if(item.parent.status == '1') {
      //               item.parent._expanded = true;
      //             }
      //           }
      //           item._show = true;
      //         });
      //       }
      //       if(this.alcSearch.status == '1') {
      //         data = data.filter(item => {
      //           return item.status == this.alcSearch.status;
      //         });
      //         data.forEach(item => {
      //           if(item.children) {
      //             item.children.forEach(itemChildren => {
      //               if(itemChildren.status == '0') {
      //                 item.children = [];
      //               }
      //             })
      //           }
      //         })
      //       }
      //       if(this.alcSearch.name) {
      //         this.searchData(this.acls, this.alcSearch.name);
      //         data = func.apply(null, [this.searchArr, this.expandAll.default]);
      //         this.searchArr = [];
      //         data.forEach(item => {
      //           if(item._level <= 1) {
      //             if(item.parent) {
      //               item.parent._expanded = true;
      //             }
      //           }
      //         })
      //       }
      //       if(this.alcSearch.name && this.alcSearch.status) {
      //         data = data.filter(item => {
      //           if(item.status == this.alcSearch.status) {
      //             if(item.name.indexOf(this.alcSearch.name) !== -1) {
      //               return item;
      //             }
      //           }
      //         })
      //       }
      //     }
      //     return data;
      //   }
      // }
    }
  }
</script>
<style>
  @keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
<style scoped lang="less">
  @color-blue: #2196f3;
  @space-width: 18px;
  .ms-tree-margin {
    display: inline-block;
    width: 12px;
  }
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: @space-width;
    height: 14px;
    &::before {
      content: '';
    }
  }
  .processContainer {
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: @color-blue;
    margin-left: -@space-width;
  }
  .del-dialog-cnt {
    font-size: 16px;
    text-align: center;
  }

  .search-table {
    height: 550px;
    background: #fff;
  }
</style>



