<template>
  <div class="edition">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>版本列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" @click="addVisible">新增版本</el-button>
      </div>
      <div class="search-box">
        <el-form ref="search" :rules="searchRules" :model="editionSearch" class="demo-form-inline" :inline="true">
          <el-form-item label="状态：">
            <el-select class="select-input" clearable v-model="editionSearch.publishStatus" @change="search">
              <el-option v-for=" item in pro_status" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称：" prop="name">
            <el-input class="ent-input" maxlength="30" clearable v-model.trim="editionSearch.name" placeholder="按产品名称搜索" @change="search"></el-input>
          </el-form-item>
          <el-form-item label="版本名称：" prop="version">
            <el-input class="ent-inputs" maxlength="30" clearable v-model.trim="editionSearch.version" placeholder="按版本名称搜索" @change="search"></el-input>
          </el-form-item>
          <el-form-item label="更新时间：">
            <el-date-picker class="ent-inputs" v-model="editionSearch.updatedStart" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
            &nbsp; 至 &nbsp;
            <el-date-picker class="ent-inputs" v-model="editionSearch.updatedEnd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="search">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" stripe height="531" style="width: 100%">
        <el-table-column label="序号" prop="num" width="50px"></el-table-column>

        <el-table-column label="版本" prop="version"></el-table-column>
        <el-table-column label="版本类型" prop="stageName"></el-table-column>
        <el-table-column label="状态" prop="publishStatusName"></el-table-column>
        <el-table-column label="版本描述">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" popper-class="poper-css">
              {{scope.row.versionLog}}
              <div slot="reference" class="name-wrapper">
                {{scope.row.versionLog}}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="适配产品" prop="productName"></el-table-column>
        <el-table-column label="发布时间" prop="createdAt"></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="download(scope.row)">
              <a class="downloadText" :href="scope.row.url">
                下载
              </a>
            </el-button>
            <el-button size="small" type="text" v-if="scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04'" @click="modify(scope.row, scope.$index)">修改</el-button>
            <el-button size="small" type="text" v-if="scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04'" @click="deleteEdition(scope.row, scope.$index)">删除</el-button>
            <el-button size="small" type="text" v-if="scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04'" @click="packageTryout(scope.row, scope.$index)">试用</el-button>
            <el-button size="small" type="text" v-if="scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_02' || scope.row.publishStatus === 'pro_status_04'" @click="packagePublish(scope.row, scope.$index)">发布</el-button>
            <el-button size="small" type="text" v-if="scope.row.publishStatus === 'pro_status_02'" @click="withdrawPublish(scope.row, scope.$index)">撤回</el-button>
            <el-button size="small" type="text" v-if="scope.row.publishStatus === 'pro_status_03'" @click="packageObtained(scope.row, scope.$index)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="10" :current-page="cur_page" layout="total, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增版本" :visible.sync="addEditionModele" width="30%">
      <div class="add-edition">
        <el-form ref="addEdition" :rules="editionRules" label-width="90px" :model="addEdition" class="demo-ruleForm">
          <el-form-item label="版本名称:" prop="version">
            <el-input class="inputs" v-model.trim="addEdition.version" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="版本类型:" prop="stage">
            <el-select class="inputs" clearable v-model="addEdition.stage" placeholder="">
              <el-option v-for="item in stage" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本描述:" prop="versionLog">
            <el-input type="textarea" class="inputs" v-model="addEdition.versionLog" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="产品ID:" prop="productId">
            <el-select class="inputs" v-model="addEdition.productId">
              <el-option v-for="item in fitPro" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本上传:" :rules="[{ required: true} ]">
            <el-upload class="upload-demo" ref="upload" action="" :limit="1" :on-change="getFile" :on-exceed="beyondFile" :on-remove="removeFile" :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
            <transition name="fade">
              <div class="tips" v-show="fileTip">请上传版本包</div>
            </transition>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddEdition">确定</el-button>
        <el-button @click="addCancel();$refs['addEdition'].resetFields();">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改版本" :visible.sync="modifyModel" width="30%">
      <div class="add-edition">
        <el-form ref="changeEdition" :rules="editionRules" label-width="90px" :model="modifyEdition" class="demo-ruleForm">
          <el-form-item label="版本名称:" prop="version">
            <el-input class="inputs" v-model="modifyEdition.version" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="版本类型:" prop="stage">
            <el-select class="inputs" clearable v-model="modifyEdition.stage" placeholder="">
              <el-option v-for="item in stage" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本描述:" prop="versionLog">
            <el-input type="textarea" class="inputs" v-model="modifyEdition.versionLog" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="产品ID:" prop="productId">
            <el-select class="inputs" v-model="modifyEdition.productId">
              <el-option v-for="item in fitPro" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本上传:" prop="packages">
            <el-input v-show="0" class="inputs" v-model="modifyEdition.packages" placeholder=""></el-input>
            <el-upload class="upload-demo" ref="uploadEdition" action="" :file-list="fileList" :limit="1" :on-change="modifyEditionGetFile" :on-exceed="beyondFile" :on-remove="removeEditFile" :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveModifyEdition">确定</el-button>
        <el-button @click="cancelModifyEdition">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import { serialize } from '../../utils';
  import axios from 'axios';
  import { api } from '../../api';
  import { checkUsername } from '../../utils/rules';
  export default {
    data() {
      return {
        modifyModel: false, //修改版本
        addEditionModele: false, //新增版本
        tableData: [],
        modifyEdition: {
        }, //修改版本
        fileList: [{ name: '', url: '' }],
        editionSearch: {
          name: ''
        },
        addEdition: {}, //新增版本
        pro_status: [], // 版本状态
        cur_page: 1,
        count: 0,
        idx: null,
        package: [], //产品类型
        stage: [], //产品阶段
        fitPro: [], //适配产品
        href: '',
        fileTip: false,
        addfile: null, //文件
        file: null,
        searchRules: {
          name: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'change' }
          ]
        },
        editionRules: {
          version: [
            { required: true, message: '版本名称不可为空' }
          ],
          stage: [
            { required: true, message: '版本类型不可为空' }
          ],
          versionLog: [
            {}
          ],
          productId: [
            { required: true, message: '产品ID不可为空' }
          ],
          packages: [
            { required: true, message: '请选择文件', trigger: 'change' },
          ]
        }
      };
    },
    computed: {
      ...mapGetters(['getDict', 'getCommon', 'getFormatDict'])
    },
    created() {
      this.getEdition();
      this.getAllProduct();
    },
    methods: {
      ...mapActions(['ajax']),
      //获取数据
      getEdition() {
        let d = this.cur_page; //当前页
        let m = 10; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getPackages',
          data: {
            pageNum: this.cur_page,
            ...this.editionSearch
          }
        }).then(res => {
          this.count = res.count;
          res.rows.forEach(item => {
            item.publishStatusName = this.getFormatDict.pro_status[item.publishStatus];
            item.stageName = this.getFormatDict.stage[item.stage];
            item.num = count++;
          });
          this.tableData = res.rows;
        })
      },
      //下拉框
      getAllProduct() {
        this.ajax({
          name: 'getAllProduct'
        }).then(res => {
          this.fitPro = res;
        });
        this.pro_status = this.getDict.filter(item => item.type === 'pro_status');
        this.stage = this.getDict.filter(item => item.type === "stage");
      },
      //新增
      addVisible() {
        this.addEditionModele = true;
      },
      //新增确认
      saveAddEdition() {
        let formData = new FormData();
        this.$refs.addEdition.validate(valid => {
          if(valid) {
            delete this.addEdition.package;
            if(this.addfile) {
              Object.keys(this.addEdition).forEach(item => {
                formData.append(item, this.addEdition[item]);
              })
              formData.append("package", this.addfile.raw);
              axios({
                method: 'post',
                url: api.addPackages.url,
                data: formData,
                headers: { 'token': this.getCommon.token }
              }).then(res => {
                if(res.data.errorCode === 1) {
                  this.$message.success('操作成功');
                  this.addfile = null;
                  this.$refs.addEdition.resetFields()
                  this.$refs.upload.clearFiles()
                  this.addEditionModele = false;
                  this.getEdition();
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
            } else {
              this.fileTip = true;
            }
          } else {
            if(!this.addfile) {
              this.fileTip = true;
            }
            return false;
          }
        })

      },
      //移除文件列表中得文件
      removeFile() {
        this.addfile = null;
      },
      //取消新增
      addCancel() {
        this.$refs.addEdition.resetFields()
        this.$refs.upload.clearFiles();
        this.fileTip = false; //文件提示
        this.addEditionModele = false;
      },
      //修改版本
      modify(row) {
        let fileArr = [{ name: '', url: '' }];
        this.modifyEdition = {
          version: row.version,
          stage: row.stage,
          versionLog: row.versionLog,
          productId: row.productId,
          packages: 1
        }
        fileArr.forEach(item => {
          item.name = row.version;
          item.url = row.url;
        });
        this.fileList = serialize(fileArr);
        this.modifyEdition.packages = 1;
        this.idx = row.id;
        this.modifyModel = true;
      },
      //确认修改
      saveModifyEdition() {
        let formData = new FormData();

        this.$refs.changeEdition.validate(valid => {
          if(valid) {
            delete this.modifyEdition.packages;
            Object.keys(this.modifyEdition).forEach(item => {
              formData.append(item, this.modifyEdition[item]);
            });
            if(this.file) {
              formData.append('package', this.file.raw);
            }
            axios({
              method: 'put',
              url: api.putPackages.url + `/${this.idx}`,
              data: formData,
              headers: { 'token': this.getCommon.token }
            }).then(res => {
              if(res.data.status === 1) {
                this.$message.success('操作成功');
                this.modifyModel = false;
                this.$refs.uploadEdition.clearFiles()
                this.getEdition();
              } else {
                this.$message.error(res.data.errorMsg);
              }
            });
          } else {
            this.fileTip = true;
            return false;
          }
        })

      },
      removeEditFile() {
        this.file = null;
        this.modifyEdition.packages = '';
        this.fileList.shift();
      },
      //修改时添加文件
      modifyEditionGetFile(file) {
        this.addfile = file;
        this.$set(this.modifyEdition, 'packages', 1);

      },
      // 取消修改
      cancelModifyEdition() {
        this.modifyModel = false;
      },

      //删除
      deleteEdition(row) {
        this.$confirm('此操作将永久删除该选项，是否继续', '提示', {
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'deletePackage',
            id: row.id
          }).then(res => {
            this.delVisible = false;
            this.getEdition();
            this.$message.success('删除成功');
          })
        })
      },
      //试用
      packageTryout(row) {
        this.$confirm('确定试用该版本？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'packageTryout',
            data: { id: row.id }
          }).then(res => {
            this.$message.success('试用成功');
            this.getEdition();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消试用'
          });
        });
      },
      //发布
      packagePublish(row) {
        this.$confirm('确定发布该版本？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'packagePublish',
            data: { id: row.id }
          }).then(res => {
            this.$message.success('发布成功');
            this.getEdition();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          });
        });
      },
      //撤回
      withdrawPublish(row) {
        this.$confirm('确定撤回该产品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'packageWithdraw',
            data: { id: row.id }
          }).then(res => {
            this.$message.success('撤回成功');
            this.getEdition();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤回'
          });
        });
      },
      packageObtained(row) {
        this.ajax({
          name: 'packageObtained',
          data: { id: row.id }
        }).then(res => {
          this.$message.success('操作成功');
          this.getEdition();
        })
      },
      //下载
      download(row) {
        this.href = row.url;
      },
      //搜索
      search() {
        this.$refs.search.validate(valid => {
          if(valid) {
            this.getEdition();
          } else {
            return
          }
        })

      },
      //获取文件
      getFile(file) {
        this.addfile = file;
        if(this.addfile) {
          this.fileTip = false;
        }
      },
      //上传文件超出限制
      beyondFile() { },


      //分页
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getEdition();
      }
    }
  }
</script>
<style scoped lang="less">
  .handle-box {
    margin-bottom: 20px;
  }
  .search-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .ent-inputs {
    width: 200px;
  }
  .inputs {
    width: 100%;
  }
  .downloadText {
    color: #409eff;
  }
  .addImg {
    width: 200px;
    height: auto;
  }
  .tips {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
  }
  .del-dialog-cnt {
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .select-input {
    width: 122px;
  }
  .ic {
    margin-right: 10px;
    .icon-css {
      font-size: 30px;
      color: #f7ba2a;
    }
  }

  .name-wrapper {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

