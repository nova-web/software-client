<template>
  <!-- BBCX BBXZ BBXG BBSC BBFB BBCH BBSY BBXJ -->
  <div class="edition">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>版本列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="search-box">
        <div class="handle-box">
          <el-button v-if="getAlcsObj.BBCX" type="primary" icon="el-icon-plus" @click="addVisible">新增版本</el-button>
        </div>
        <el-form ref="search" :rules="searchRules" :model="editionSearch" class="demo-form-inline" :inline="true">
          <el-form-item label="产品名称：" prop="productName">
            <el-input class="el-input-width" maxlength="30" clearable v-model.trim="editionSearch.productName" placeholder="输入适配产品名称模糊查询" @change="search"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="publishStatus">
            <el-select class="el-select-width" clearable v-model="editionSearch.publishStatus" @change="search">
              <el-option v-for=" item in pro_status" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本名称：" prop="version">
            <el-input class="el-input-width" maxlength="30" clearable v-model.trim="editionSearch.version" placeholder="输入版本名称模糊查询" @change="search"></el-input>
          </el-form-item>
          <el-form-item label="更新时间：">
            <el-date-picker class="el-input-width" v-model="editionSearch.updatedStart" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="search" :editable="false">
            </el-date-picker>
            &nbsp; 至 &nbsp;
            <el-date-picker class="el-input-width" v-model="editionSearch.updatedEnd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="search" :editable="false">
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
        <el-table-column label="版本类型" prop="typeName"></el-table-column>
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
        <el-table-column label="更新时间" prop="updatedAt"></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="download(scope.row)">
              <a class="downloadText" :href="scope.row.url">
                下载
              </a>
            </el-button>
            <el-button size="small" type="text" v-if="(scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04') && getAlcsObj.BBXG" @click="modify(scope.row, scope.$index)">修改</el-button>
            <el-button size="small" type="text" v-if="(scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04') && getAlcsObj.BBSC" @click="deleteEdition(scope.row, scope.$index)">删除</el-button>
            <el-button size="small" type="text" v-if="(scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04') && getAlcsObj.BBSY" @click="packageTryout(scope.row, scope.$index)">试用</el-button>
            <el-button size="small" type="text" v-if="(scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_02' || scope.row.publishStatus === 'pro_status_04') && getAlcsObj.BBFB" @click="packagePublish(scope.row, scope.$index)">发布</el-button>
            <el-button size="small" type="text" v-if="(scope.row.publishStatus === 'pro_status_02') && getAlcsObj.BBCH" @click="withdrawPublish(scope.row, scope.$index)">撤回</el-button>
            <el-button size="small" type="text" v-if="(scope.row.publishStatus === 'pro_status_03') && getAlcsObj.BBXJ" @click="packageObtained(scope.row, scope.$index)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ve-pagination :cur_page="cur_page" :pageSize="pageSize" :count="count" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" @gofist="gofist" @goLast="goLast"></ve-pagination>
    </div>

    <el-dialog title="新增版本" :visible.sync="addEditionModele" width="30%" :before-close="closeAdd" :close-on-click-modal="false">
      <div class="add-edition">
        <el-form ref="addEdition" :rules="editionRules" label-width="90px" :model="addEdition" class="demo-ruleForm">
          <el-form-item label="版本名称:" prop="version">
            <el-input class="inputs" v-model.trim="addEdition.version" placeholder="" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="版本类型:" prop="type">
            <el-select class="inputs" clearable v-model="addEdition.type" placeholder="">
              <el-option v-for="item in type" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本描述:" prop="versionLog">
            <el-input type="textarea" class="inputs" v-model="addEdition.versionLog" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="适配产品:" prop="productId">
            <el-select class="inputs" v-model="addEdition.productId">
              <el-option v-for="item in fitPro" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本上传:" :rules="[{ required: true} ]">
            <el-upload class="upload-demo" :class="addBtnDisabled==true?'disabledX':''" ref="upload" action="" :limit="2" :on-change="getFile" :on-exceed="beyondFile" :on-remove="removeFile" :before-remove="beforeRemove" :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" :disabled="selectDisabled">选取文件</el-button>
            </el-upload>
            <transition name="fade">
              <div class="tips" v-show="fileTip">请上传版本包</div>
            </transition>
          </el-form-item>

          <el-progress v-show="progressModel" class="progress" :percentage="parseInt(progress)" :status="parseInt(progress)===100?'success':''"></el-progress>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddEdition" :disabled="addBtnDisabled">确定</el-button>
        <el-button @click="addCancel();$refs['addEdition'].resetFields();">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改版本" :visible.sync="modifyModel" width="30%" :before-close="closeEdit" :close-on-click-modal="false">
      <div class="add-edition">
        <el-form ref="changeEdition" :rules="editionRules" label-width="90px" :model="modifyEdition" class="demo-ruleForm">
          <el-form-item label="版本名称:" prop="version">
            <el-input class="inputs" v-model="modifyEdition.version" placeholder="请输入版本名称" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="版本类型:" prop="type">
            <el-select class="inputs" clearable v-model="modifyEdition.type" placeholder="">
              <el-option v-for="item in type" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本描述:" prop="versionLog">
            <el-input type="textarea" class="inputs" v-model="modifyEdition.versionLog" placeholder="请输入版本描述"></el-input>
          </el-form-item>
          <el-form-item label="适配产品:" prop="productId">
            <el-select class="inputs" v-model="modifyEdition.productId">
              <el-option v-for="item in fitPro" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本上传:" prop="packages">
            <el-input v-show="0" class="inputs" v-model="modifyEdition.packages" placeholder=""></el-input>
            <el-upload class="upload-demo" :class="editBtnDisabled==true?'disabledXedit':''" ref="uploadEdition" action="" :file-list="fileList" :limit="2" :on-change="modifyEditionGetFile" :on-exceed="beyondFile" :on-remove="removeEditFile" :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" :disabled="editselectDisabled">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-progress v-show="progressModel" class="progress" :percentage="parseInt(progress)" :status="parseInt(progress)===100?'success':''"></el-progress>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveModifyEdition" :disabled="editBtnDisabled">确定</el-button>
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
  const CancelToken = axios.CancelToken;
  let cancel;
  export default {
    data() {
      return {
        modifyModel: false, //修改版本
        addEditionModele: false, //新增版本
        tableData: [],
        modifyEdition: {
          version: '',
          versionLog: '',
          productId: '',
          type: '',
        }, //修改版本
        editselectDisabled: false,
        editBtnDisabled: false,
        fileList: [{ name: '', url: '' }],
        addfileLists: [{ name: '', url: '' }],
        editionSearch: {
          name: '',
          version: ''
        },
        addEdition: {
          version: null,
          stage: [],
          versionLog: null,
          productId: []
        }, //新增版本
        selectDisabled: false,
        addBtnDisabled: false,
        pro_status: [], // 版本状态
        cur_page: 1,
        count: 0,
        pageSize: 10,
        idx: null,
        package: [], //产品类型
        stage: [], //产品阶段
        fitPro: [], //适配产品
        href: '',
        fileTip: false,
        addfile: null, //文件
        file: null,
        searchRules: {
          productName: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ],
          version: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ]
        },
        editionRules: {
          version: [
            { required: true, message: '版本名称不可为空', trigger: 'blur' },
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ],
          stage: [
            { required: true, message: '版本类型不可为空', trigger: 'blur' }
          ],
          versionLog: [
            { required: true, message: '版本描述不可为空', trigger: 'blur' }
          ],
          productId: [
            { required: true, message: '适配产品不可为空', trigger: 'blur' }
          ],
          packages: [
            { required: true, message: '请选择文件', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '版本类型不可为空', trigger: 'blur' },
          ]
        },
        progress: 0,
        progressModel: false,
        cancel: null, //取消请求
      };
    },
    computed: {
      ...mapGetters(['getDict', 'getCommon', 'getFormatDict', 'getAlcsObj'])
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
        let m = this.pageSize; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getPackages',
          data: {
            pageNum: this.cur_page,
            pageSize: this.pageSize,
            ...this.editionSearch
          }
        }).then(res => {
          this.count = res.count;
          res.rows.forEach(item => {
            item.publishStatusName = this.getFormatDict.pro_status[item.publishStatus];
            item.stageName = this.getFormatDict.stage[item.stage];
            item.typeName = this.getFormatDict.version[item.type];
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
        this.stage = this.getDict.filter(item => item.type === 'stage');
        this.type = this.getDict.filter(item => item.type === 'version');
      },
      closeAdd(done) {
        this.$refs.addEdition.resetFields();
        this.progressModel = false;
        this.progress = 0;
        this.fileTip = false; //文件提示
        done();
      },
      //新增
      addVisible() {
        this.addEditionModele = true;
        this.addBtnDisabled = false;
        this.selectDisabled = false;
        this.progressModel = false;
        this.$nextTick(() => {
          this.$refs.upload.clearFiles();
        })
      },
      //新增确认
      saveAddEdition() {
        this.addBtnDisabled = true;
        this.selectDisabled = true;
        let formData = new FormData();
        this.$refs.addEdition.validate(valid => {
          if(valid) {
            delete this.addEdition.package;
            if(this.addfile) {
              // this.addBtnDisabled = true;
              Object.keys(this.addEdition).forEach(item => {
                formData.append(item, this.addEdition[item]);
              })
              axios({
                method: 'post',
                url: api.packagePreAdd.url,
                data: formData,
                headers: { 'token': this.getCommon.token },
                timeout: 1000000
              }).then(res => {
                if(res.data.errorCode === 1) {
                  formData.append("package", this.addfile.raw);
                  axios({
                    method: 'post',
                    url: api.addPackages.url,
                    data: formData,
                    headers: { 'token': this.getCommon.token },
                    timeout: 1000000,
                    cancelToken: new CancelToken(function executor(c) {
                      cancel = c;
                    }),
                    onUploadProgress: (event) => {
                      if(event.lengthComputable) {
                        this.progressModel = true;
                        let complete = (event.loaded / event.total * 100 | 0) + '%';
                        if(parseInt(complete) >= 99) {
                          complete = 99 + '%';
                        }
                        this.progress = complete;
                      }
                    }
                  }).then(res => {
                    if(res.data.errorCode === 1) {
                      this.progress = 100;
                      this.addBtnDisabled = false;
                      this.selectDisabled = false;
                      this.$message.success('操作成功');
                      this.progressModel = false;
                      this.addfile = null;
                      this.$refs.addEdition.resetFields();
                      this.$refs.upload.clearFiles();
                      this.addEditionModele = false;
                      this.getEdition();
                    } else {
                      this.$message.error(res.data.errorMsg);
                    }
                  })
                    .catch(res => {
                      this.$message.error('操作失败');
                    })
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })

            } else {
              this.fileTip = true;
            }
          } else {
            this.addBtnDisabled = false;
            this.selectDisabled = false;
            if(!this.addfile) {
              this.fileTip = true;
            }
            return false;
          }
        })
      },
      beforeRemove(file, fileList) {
        return null
        // if(this.addBtnDisabled == true) {
        //  ${file.name}
        // let ret = this.$confirm(`文件正在上传，无法移除`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   console.log(222);
        // }).catch(() => {
        //   console.log(333);
        // });
        // console.log(111, ret);
        // return this.$confirm(`确定移除 ${file.name}？`);
        // }
      },
      //移除文件列表中得文件
      removeFile() {
        this.addfile = null;
      },
      //取消新增
      addCancel() {
        this.addBtnDisabled = false;
        this.selectDisabled = false;
        this.$refs.addEdition.resetFields()
        this.$refs.upload.clearFiles();
        this.progressModel = false;
        this.progress = 0;
        this.fileTip = false; //文件提示
        this.addEditionModele = false;
        if(typeof cancel === 'function') {
          cancel('终止请求'); //取消请求
        }

      },
      closeEdit(done) {
        this.$refs.changeEdition.resetFields();
        this.progressModel = false;
        this.progress = 0;
        done();
      },
      //修改版本
      modify(row) {
        this.editBtnDisabled = false;
        this.editselectDisabled = false;
        this.progressModel = false;
        let fileArr = [{ name: '', url: '' }];
        this.modifyEdition = {
          version: row.version,
          versionLog: row.versionLog,
          productId: row.productId,
          type: row.type,
          packages: 1
        }
        fileArr.forEach(item => {
          item.name = row.url.slice(row.url.lastIndexOf('/') + 1);
          item.url = row.url;
        });
        this.fileList = serialize(fileArr);
        this.modifyEdition.packages = 1;
        this.idx = row.id;
        this.modifyModel = true;
      },
      //确认修改
      saveModifyEdition() {
        this.editBtnDisabled = true;
        this.editselectDisabled = true;
        let formData = new FormData();
        this.$refs.changeEdition.validate(valid => {
          if(valid) {
            delete this.modifyEdition.packages;
            Object.keys(this.modifyEdition).forEach(item => {
              formData.append(item, this.modifyEdition[item]);
            });
            axios({
              method: 'put',
              url: api.packagePreEdit.url + `/${this.idx}`,
              data: formData,
              headers: { 'token': this.getCommon.token },
              timeout: 1000000
            }).then(res => {
              if(res.data.errorCode === 1) {
                if(this.file) {
                  formData.append('package', this.file.raw);
                }
                axios({
                  method: 'put',
                  url: api.putPackages.url + `/${this.idx}`,
                  data: formData,
                  headers: { 'token': this.getCommon.token },
                  timeout: 1000000,
                  cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                  }),
                  onUploadProgress: (event) => {
                    if(event.lengthComputable) {
                      this.progressModel = true;
                      let complete = (event.loaded / event.total * 100 | 0) + '%';
                      if(parseInt(complete) >= 99) {
                        complete = 99 + '%';
                      }
                      this.progress = complete;
                    }
                  }
                }).then(res => {
                  if(res.data.errorCode === 1) {
                    this.progress = 100;
                    this.editBtnDisabled = false;
                    this.editselectDisabled = false;
                    this.$message.success('操作成功');
                    this.progressModel = false;
                    this.$refs.uploadEdition.clearFiles()
                    this.$refs.changeEdition.resetFields();
                    this.modifyModel = false;
                    this.modifyEdition = {};
                    this.getEdition();
                  } else {
                    this.$message.error(res.data.errorMsg);
                  }
                }).catch(res => {
                  this.$message.error('操作失败');
                })
              } else {
                this.editBtnDisabled = false;
                this.editselectDisabled = false;
                this.modifyEdition.packages = 1;
                this.$message.error(res.data.errorMsg);
              }
            })

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
      modifyEditionGetFile(file, fileList) {
        if(fileList.length > 1) {
          this.file = fileList[1];
          fileList.splice(0, 1);
        }
        this.file = file;
        this.$set(this.modifyEdition, 'packages', 1);
      },
      // 取消修改
      cancelModifyEdition() {
        this.editBtnDisabled = false;
        this.editselectDisabled = false;
        this.$refs.changeEdition.resetFields();
        this.modifyModel = false;
        if(typeof cancel === 'function') {
          cancel('终止请求'); //取消请求
        }
        this.progressModel = false;
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
            this.gofist();
          } else {
            return
          }
        })

      },
      //获取文件
      getFile(file, fileList) {
        if(fileList.length > 1) {
          this.addfile = fileList[1];
          fileList.splice(0, 1);
        }
        this.addfile = file;
        console.log(this.addfile);
        if(this.addfile) {
          this.fileTip = false;
        }
      },
      //上传文件超出限制
      beyondFile(file) {
        console.log('aaaa', file);
      },
      //分页
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getEdition();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getEdition();
      },
      gofist() {
        this.cur_page = 1;
        this.getEdition();
      },
      goLast() {
        this.cur_page = Math.ceil(this.count / this.pageSize);
        this.getEdition();
      }
    }
  }
</script>
<style scoped lang="less">
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
<style lang="less">
  .edition {
    .disabledX {
      .el-upload-list__item .el-icon-close:hover {
        opacity: 0;
        display: none;
      }
      .el-upload-list__item .el-icon-close {
        display: none;
      }
    }
    .disabledXedit {
      .el-upload-list__item .el-icon-close:hover {
        opacity: 0;
        display: none;
      }
      .el-upload-list__item .el-icon-close {
        display: none;
      }
    }
  }
</style>
