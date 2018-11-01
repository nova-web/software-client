<template>

  <div class="alc">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>功能管理</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="container">
      <div class="search-box">

        <el-form highlight-current-row @current-change="handleCurrentChange" :model="alcSearch" ref="search" class="demo-form-inline" :inline="true">
          <el-form-item label="状态">
            <el-select v-model="alcSearch.status" @change="search" clearable>
              <el-option v-for="item in status" :key="item.num" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="功能名称">
            <el-input v-model="alcSearch.name" placeholder="按功能名称搜索" @input="search"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-table">
        <el-table ref="table" @current-change="handleCurrentChange" highlight-current-row :data="formatData" :row-style="showRow" v-bind="$attrs" stripe style="width: 100%" max-height="550">

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
          <el-table-column label="功能名称">
            <template slot-scope="scope">
              <!-- <span v-for="space in scope.row._level" :key="space" class="ms-tree-space" /> -->
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

    <el-dialog title="修改功能" :visible.sync="editVisible" width="30%">
      <el-form ref="editUser" :model="editFunction" label-width="80px">
        <el-form-item label="功能名称">
          <el-input v-model="editFunction.name"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="editFunction.url"></el-input>
        </el-form-item>
        <el-form-item label="code">
          <el-input v-model="editFunction.code"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editFunction.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增同级菜单" :visible.sync="addParentModel" width="30%">
      <el-form ref="editUser" :model="addParentObj" label-width="80px">
        <el-form-item label="功能名称">
          <el-input v-model="addParentObj.name"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="addParentObj.url"></el-input>
        </el-form-item>
        <el-form-item label="code">
          <el-input v-model="addParentObj.code"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addParentObj.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addParentModel=false">取 消</el-button>
        <el-button type="primary" @click="saveAddParent">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增下级菜单" :visible.sync="addLeaverModel" width="30%">
      <el-form ref="editUser" :model="addLeaverObj" label-width="80px">
        <el-form-item label="功能名称">
          <el-input v-model="addLeaverObj.name"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="addLeaverObj.url"></el-input>
        </el-form-item>
        <el-form-item label="code">
          <el-input v-model="addLeaverObj.code"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addLeaverObj.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLeaverModel=false">取 消</el-button>
        <el-button type="primary" @click="saveAddLeaver">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteAcls">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { treeToArray, serialize } from '../../utils';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    data() {
      return {
        acls: {}, //表格数据
        indexArr: [],
        status: [
          {
            value: '0',
            label: '无效'
          },
          {
            value: '1',
            label: '有效'
          }
        ],
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
        }
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
          data: { ...this.alcSearch }
        }).then(res => {
          this.acls = res;
          if(this.indexArr.length) {
            this.indexArr.forEach(item => {
              this.formatData[item]._expanded = true;
            })
          }
        })
      },
      //修改
      handelModify(row) {
        this.editVisible = true;
        this.idx = row.id;
        this.editFunction = {
          name: row.name,
          remark: row.remark,
          url: row.url,
          code: row.code
        };
      },
      //确认修改
      saveEdit() {
        console.log(this.editFunction);
        this.ajax({
          name: 'putAcls',
          id: this.idx,
          data: this.editFunction
        }).then(res => {
          this.initData();
          this.editVisible = false;
          this.$message.success('操作成功');
        })
      },
      //删除
      handleDelete(row) {
        console.log(row);
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
          this.$message.success('操作成功');
        });
      },
      //新增同级菜单
      handlePeerMenus(row) {
        this.addParentModel = true;
        this.addParentObj = {
          name: null,
          remark: null,
          url: null,
          code: null,
          parentId: row.parentId
        }
      },
      //确认新增
      saveAddParent() {
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
      },
      //新增下级菜单
      handleLowerLevelMenu(row) {

        this.addLeaverModel = true;
        this.addLeaverObj = {
          name: null,
          remark: null,
          url: null,
          code: null,
          parentId: row.id
        }
      },
      saveAddLeaver() {
        this.ajax({
          name: 'postAclsParent',
          data: this.addLeaverObj
        }).then(res => {
          this.initData();
          this.addLeaverModel = false;
          this.$message.success('操作成功');
        })
      },
      //置为无效
      nullAndVoid(row) {
        this.setAclStatus(row, 0);
      },
      //置为有效
      setUpToBeValid(row) {
        this.setAclStatus(row, 1);
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
      //搜索
      search() {
        this.initData();
      },
      showRow: function(row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
        row.row._show = show
        return show ? 'animation:treeTableShow .3s;' : 'display:none;'
      },
      // 切换下级是否展开
      toggleExpanded(trIndex, row) {
        const record = this.formatData[trIndex]
        this.indexArr.push(trIndex);
        if(row._expanded) {
          this.indexArr = this.indexArr.filter(item => {
            return item !== trIndex;
          })
        }
        record._expanded = !record._expanded
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
      }
    },
    computed: {
      ...mapGetters(['getAlcs', 'getAlcsObj']),
      formatData: function() {
        let tmp
        if(!Array.isArray(this.acls)) {
          tmp = [this.acls]
        } else {
          tmp = this.acls
        }
        const func = treeToArray
        let searchArr = [];
        let childrenArrs = []
        if(this.alcSearch.status || this.alcSearch.name) {
          if(this.alcSearch.status) {
            tmp.forEach(item => {
              if(item.status == this.alcSearch.status) {
                searchArr.push(item);
                searchArr.forEach(item => {
                  if(item.children) {
                    item.children.forEach(items => {
                      if(items.status == this.alcSearch.status) {
                        childrenArrs.push(items);
                      }
                    })
                  }
                  item.children = serialize(childrenArrs);
                  childrenArrs = [];
                })
              } else {
                if(item.children) {
                  item.children.forEach(itemChild => {
                    if(itemChild.status == this.alcSearch.status) {
                      searchArr.push(itemChild);
                    }
                  })
                }
              }

            })
            tmp = serialize(searchArr);

            searchArr = [];
          }
          if(this.alcSearch.name) {
            tmp.forEach(item => {
              if(item.name == this.alcSearch.name) {
                searchArr.push(item);
              } else {
                if(item.children) {
                  item.children.forEach(itemChild => {
                    if(itemChild.name == this.alcSearch.name) {
                      searchArr.push(itemChild);
                    }
                  })
                }
              }
            })
            tmp = serialize(searchArr);
            searchArr = [];
          }
          if(this.alcSearch.name && this.alcSearch.status) {
            tmp.forEach(item => {
              if(item.name == this.alcSearch.name && item.status == this.alcSearch.status) {
                searchArr.push(item);
              } else {
                if(item.children) {
                  item.children.forEach(itemChild => {
                    if(itemChild.name == this.alcSearch.name && itemChild.status == this.alcSearch.status) {
                      searchArr.push(itemChild);
                    }
                  })
                }
              }
            })
            tmp = serialize(searchArr);
            searchArr = [];
          }
        }
        return func.apply(null, [tmp, this.expandAll.default])
      }
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
  .search-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .search-table {
    height: 550px;
    background: #fff;
  }
</style>



