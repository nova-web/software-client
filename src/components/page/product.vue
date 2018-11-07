<template>
  <div class="download">
    <div class="crumbs">
      <el-breadcrumb>
        <!-- <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>
          <!-- <i class="el-icon-tickets"></i> -->产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="search-box">
        <div class="handle-box">
          <el-button type="primary" icon="el-icon-plus" @click="addVisible">新增产品</el-button>
        </div>
        <el-form ref="search" :rules="searchRules" :model="productSearch" class="demo-form-inline" :inline="true">
          <el-form-item label="状态：">
            <el-select clearable v-model="productSearch.publishStatus" @change="search">
              <el-option v-for=" item in pro_status" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型：">
            <el-select clearable v-model="productSearch.type" @change="search">
              <el-option v-for=" item in package" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称：" prop="name">
            <el-input clearable v-model="productSearch.name" placeholder="按产品名称搜索" @change="search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" stripe height="531" style="width: 100%">
        <el-table-column width="60px" prop="num" label="序号"></el-table-column>
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            <div class="active" @click="handleselect(scope.row, scope.$index)">
              <span>{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="model" label="产品型号"></el-table-column>
        <el-table-column prop="type" label="产品类型"></el-table-column>
        <el-table-column prop="version" label="最新版本"></el-table-column>
        <el-table-column prop="publishStateName" label="状态"></el-table-column>
        <el-table-column prop="stage" label="产品阶段"></el-table-column>
        <el-table-column prop="area" label="所属业务区域"></el-table-column>
        <el-table-column prop="dept" label="所属产品线"></el-table-column>
        <el-table-column width="160" prop="updatedAt" label="更新时间"></el-table-column>
        <el-table-column width="300px" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row, scope.$index)" v-if="scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04'">修改</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row, scope.$index)" v-if="scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04'">删除</el-button>
            <el-button size="small" type="text" @click="handleOnTrial(scope.row, scope.$index)" v-if="scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04'">试用</el-button>
            <el-button size="small" type="text" @click="handleselectdevice(scope.row, scope.$index)" v-if="scope.row.publishStatus === 'pro_status_01' || scope.row.publishStatus === 'pro_status_04' || scope.row.publishStatus === 'pro_status_02'">发布</el-button>
            <el-button size="small" type="text" @click="handleObtained(scope.row, scope.$index)" v-if="scope.row.publishStatus === 'pro_status_03'">下架</el-button>
            <el-button size="small" type="text" @click="productWithdraw(scope.row, scope.$index)" v-if="scope.row.publishStatus === 'pro_status_02'">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="9" :current-page="cur_page" layout="total, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div> -->
      <div class="pagination">
        <div class="pagination-left">
          {{(cur_page - 1) * pageSize + 1 === 0 ? 1 : (cur_page - 1) * pageSize + 1}}-{{cur_page * pageSize}} 共 {{count}}
        </div>
        <div class="pagination-right">
          <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" @size-change="handleSizeChange" layout="total,sizes,slot ,prev, pager, next" :total="count">
            <el-button icon="el-icon-d-arrow-left" size="small" @click="gofist"></el-button>
          </el-pagination>
          <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" layout=" slot" :total="count">
            <el-button icon="el-icon-d-arrow-right" size="small" @click="goLast"></el-button>
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="editProductModel" width="30%">

      <el-form :rules="ProRule" ref="editpro" :model="editProduct" label-width="90px" label-position="left">
        <el-form-item label="Model ID:" prop="modelId">
          <el-input v-model="editProduct.modelId"></el-input>
        </el-form-item>
        <el-form-item label="产品名称:" prop="name">
          <el-input v-model="editProduct.name"></el-input>
        </el-form-item>
        <el-form-item label="产品型号:" prop="model">
          <el-input v-model="editProduct.model"></el-input>
        </el-form-item>
        <el-form-item label="产品类型:" prop="type">
          <el-select class="inputs" clearable v-model="editProduct.type" @change="editProduct.stage=null">
            <el-option v-for=" item in package" :key="item.id" :value="item.code" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品阶段:" prop="stage">
          <el-select class="inputs" clearable v-model="editProduct.stage">
            <el-option v-for="item in editStage(editProduct.type)" :key="item.id" :value="item.code" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适配产品:" prop="fitPro">
          <el-select class="inputs" filterable multiple clearable collapse-tags v-model="editProduct.fitPro">
            <el-option v-for="item in fitPro" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务区域:" prop="area">
          <el-select class="inputs" clearable v-model="editProduct.area">
            <el-option v-for="item in area" :key="item.id" :value="item.code" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属产品线:" prop="dept">
          <el-select class="inputs" clearable v-model="editProduct.dept">
            <el-option v-for="item in dept" :key="item.id" :value="item.code" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目经理:" prop="projectManager">
          <el-input v-model="editProduct.projectManager"></el-input>
        </el-form-item>
        <el-form-item label="产品介绍:" prop="productDesc">
          <el-input v-model="editProduct.productDesc" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="示意图:" prop="upload">
          <el-upload class="upload-demo" ref="uploadEdit" accept="image/jpeg,image/gif,image/png" action="" :limit="1" :on-change="getFile" :on-exceed="beyondFile" :on-remove="removeFile" :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEditProductModel">确 定</el-button>
        <el-button @click="editProductModel = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增产品对话框 -->
    <el-dialog title="新增产品" :visible.sync="addProductModel" width="30%">
      <div class="add-product">
        <el-form label-width="90px" :model="addProduct" ref="addpro" :rules="ProRule" class="demo-ruleForm">
          <el-form-item label="Model ID:" prop="modelId">
            <el-input v-model.trim="addProduct.modelId" placeholder="输入产品ID"></el-input>
          </el-form-item>
          <el-form-item label="产品名称:" prop="name">
            <el-input v-model.trim="addProduct.name" placeholder="输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品型号:" prop="model">
            <el-input v-model.trim="addProduct.model" placeholder="输入产品型号"></el-input>
          </el-form-item>
          <el-form-item label="产品类型:" prop="type">
            <el-select class="inputs" clearable v-model="addProduct.type" placeholder="请选择产品类型">
              <el-option v-for=" item in package" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品阶段:" prop="stage">
            <el-select class="inputs" clearable v-model="addProduct.stage" placeholder="请选择产品类型">
              <el-option v-for="item in stage" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适配产品:" prop="fitPro">
            <el-select class="inputs" filterable multiple clearable collapse-tags v-model="addProduct.fitPro" placeholder="请选择适配产品, 可多选">
              <el-option v-for="item in fitPro" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务区域:" prop="area">
            <el-select class="inputs" clearable v-model="addProduct.area" placeholder="请选择业务区域">
              <el-option v-for="item in area" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属产品线:" prop="dept">
            <el-select class="inputs" clearable v-model="addProduct.dept" placeholder="请选择所属产品线">
              <el-option v-for="item in dept" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目经理:" prop="projectManager">
            <el-input v-model="addProduct.projectManager" placeholder="输入产品项目经理"></el-input>
          </el-form-item>
          <el-form-item label="产品介绍:" prop="productDesc">
            <el-input v-model="addProduct.productDesc" type="textarea" :rows="2" placeholder="输入产品介绍说明"></el-input>
          </el-form-item>
          <el-form-item label="示意图:" prop="upload">
            <el-upload class="upload-demo" ref="upload" accept="image/jpeg,image/gif,image/png" action="" :limit="1" :on-change="getFile" :on-exceed="beyondFile" :on-remove="removeFile" :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddProduct('addProduct')">确定</el-button>
        <el-button @click="addProductModel=false;$refs['addpro'].resetFields();">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import { serialize } from '../../utils';
  import axios from 'axios';
  import { api } from '../../api';
  import { checkFolder, checkUsername } from '../../utils/rules';
  export default {
    data() {
      return {
        num: Number,
        tableData: [],
        index: Number,
        editProductModel: false,
        editProduct: {}, //修改产品
        addProductModel: false,
        addProduct: {},
        searchRules: {  // 搜索框规则
          name: [
            { validator: checkUsername, message: '不可输入特殊字符', trigger: 'blur' }
          ]
        },
        ProRule: {
          modelId: [
            { required: true, validator: checkFolder, trigger: 'blur' },
            { required: true, message: 'Model ID不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, validator: checkUsername, trigger: 'blur' },
            { required: true, trigger: 'blur', message: '产品名称不能为空' }],
          model: [
            { required: true, validator: checkUsername, trigger: 'blur' },
            { required: true, trigger: 'blur', message: '产品型号不能为空' }],
          type: [{ required: true, message: '请选择产品类型', trigger: 'blur' }],
          stage: [{ required: true, message: '请选择产品阶段', trigger: 'blur' }],
          // fitPro: [{ required: true, message: '请选择适配产品', trigger: 'blur' }],
          area: [{ required: true, message: '请选择业务区域', trigger: 'blur' }],
          dept: [{ required: true, message: '请选择所属产品线', trigger: 'blur' }],
          projectManager: [
            { required: true, validator: checkUsername, trigger: 'blur' },
            { required: true, trigger: 'blur', message: '请输入产品项目经理' }]
        },
        cancelvisible: {
          fitPro: []
        },
        count: 0,
        cur_page: 1,
        pageSize: 10,
        package: [], //产品类型
        stage: [], //产品阶段
        fitPro: [], //适配产品
        area: [], //业务区域
        dept: [], //所属产品线
        pro_status: [], //产品状态
        productSearch: {}, //产品搜索
        file: null //文件
      };
    },
    computed: {
      ...mapGetters(['getDict', 'getCommon'])
    },
    created() {
      this.getEquipment();
      this.getAllProduct(); //获取所有产品
    },
    methods: {
      ...mapActions(['ajax']),
      ...mapMutations(['setProductId']),
      //获取产品列表
      getEquipment() {
        let d = this.cur_page; //当前页
        let m = this.pageSize; //每页显示条数
        let count = (parseInt(d) - 1) * m + 1 === 0 ? 1 : (parseInt(d) - 1) * m + 1;
        this.ajax({
          name: 'getProduct',
          data: {
            pageNum: this.cur_page,
            pageSize: this.pageSize,
            ...this.productSearch
          }
        }).then(res => {
          this.count = res.count;
          let dict = {};
          this.getDict.forEach(item => {
            if(!dict[item.type]) {
              dict[item.type] = {};
            }
            dict[item.type][item.code] = item.name;
          })
          res.rows.forEach((item, index) => {
            item.type = dict.package[item.type];
            item.publishStateName = dict.pro_status[item.publishStatus];
            item.stage = dict.stage[item.stage];
            item.area = dict.area[item.area];
            item.dept = dict.dept[item.dept];
            item.num = count++;
          })
          this.tableData = res.rows;
        });
      },
      getAllProduct() {
        this.ajax({
          name: 'getAllProduct'
        }).then(res => {
          this.fitPro = res;
        });
        this.package = this.getDict.filter(item => item.type === "package");
        this.stage = this.getDict.filter(item => item.type === "stage");
        this.area = this.getDict.filter(item => item.type === "area");
        this.dept = this.getDict.filter(item => item.type === "dept");
        this.pro_status = this.getDict.filter(item => item.type === 'pro_status');
      },
      //新增设备模态框
      addVisible() {
        this.addProductModel = true;
      },
      //获取文件
      getFile(file) {
        if(file.size > (1024 * 1024 * 3)) {
          this.$message.warning('文件超出限制');
        } else {
          this.file = file;
        }
      },
      //移除文件列表中的文件
      removeFile() {
        this.file = null;
      },
      //新增产品确认
      saveAddProduct(formName) {
        this.$refs.addpro.validate((valid) => {
          if(valid) {
            let formData = new FormData();
            this.addProduct.modelId = this.addProduct.modelId.replace(/\\/g, "");
            Object.keys(this.addProduct).forEach(item => {
              formData.append(item, this.addProduct[item]);
            });
            if(this.file) {
              formData.append("logo", this.file.raw);
            }

            this.axAjax('post', api.postProduct.url, formData, null)
              .then(res => {
                if(res.data.errorCode === 1) {
                  this.addProductModel = false;
                  this.$message.success('操作成功');
                  this.file = null;
                  this.$refs.addpro.resetFields();
                  this.$refs['upload'].clearFiles()
                  this.getEquipment();
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
          } else {
            return false;
          }
        });
      },
      //axios
      axAjax(methods, api, datas, params) {
        return axios({
          method: methods,
          url: api,
          data: datas,
          params: params,
          headers: { 'token': this.getCommon.token }
        })
      },
      //上传文件超出限制
      beyondFile() {
        this.$message.warning('超出上传文件数量限制');
      },
      //删除
      handleDelete(row, index) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'deleteProduct',
            id: row.id
          }).then(res => {
            this.getEquipment()
            this.$message.success('删除成功');
          })
        })
      },

      //编辑
      editStage(val) {
        if(val == 'package_01') {
          return this.getDict.filter(item => item.type === "stage").filter(item => item.code !== "stage_01" && item.code !== "stage_02" && item.code !== "stage_03");
        }
        if(val == 'package_02') {
          return this.getDict.filter(item => item.type === "stage").filter(item => item.code == "stage_01" || item.code == "stage_02" || item.code == "stage_03");
        }
        if(!val) {
          return this.getDict.filter(item => item.type === "stage")
        }
      },
      handleEdit(row, index) {
        let dict = {};
        this.getDict.forEach(item => {
          if(!dict[item.type]) {
            dict[item.type] = {};
          }
          dict[item.type][item.name] = item.code;
        });
        console.log(row);
        this.editProduct = {
          modelId: row.modelId,
          name: row.name,
          model: row.model,
          type: dict.package[row.type],
          stage: dict.stage[row.stage],
          fitPro: row.fitPro,
          area: dict.area[row.area],
          dept: dict.dept[row.dept],
          projectManager: row.projectManager,
          productDesc: row.productDesc || ''
        };
        this.editProductModel = true;
        this.idx = row.id;
      },
      //确认编辑
      saveEditProductModel() {
        this.$refs.editpro.validate((valid) => {
          if(valid) {
            let formData = new FormData();
            this.editProduct.modelId = this.editProduct.modelId.replace(/\\/g, "");
            Object.keys(this.editProduct).forEach(item => {
              formData.append(item, this.editProduct[item]);
            });
            if(this.file) {
              formData.append("logo", this.file.raw);
            }
            axios({
              method: 'put',
              url: api.editProduct.url + `/${this.idx}`,
              data: formData,
              headers: { 'token': this.getCommon.token }
            }).then(res => {
              if(res.data.errorCode === 1) {
                this.$refs['uploadEdit'].clearFiles();
                this.$refs['editpro'].resetFields();
                this.editProductModel = false;
                this.getEquipment();
                this.$message.success('操作成功');
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
          }
        });
      },
      cancelEdit() {
        this.editVisible = false;
        this.$refs['editpro'].resetFields();
      },
      //试用
      handleOnTrial(row, index) {
        this.$confirm('确定试用该产品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'productTryout',
            data: { id: row.id }
          }).then(res => {
            this.getEquipment();
            this.$message({
              type: 'success',
              message: '试用成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消试用'
          });
        });
      },
      //发布
      handleselectdevice(row, index) {
        this.$confirm('确定发布该产品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'productPublish',
            data: { id: row.id }
          }).then(res => {
            this.getEquipment();
            this.$message.success('发布成功');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          });
        });
      },
      //下架
      handleObtained(row, index) {
        this.$confirm('确定下架该产品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'productObtained',
            data: { id: row.id }
          }).then(res => {
            this.getEquipment();
            this.$message.success('下架成功');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下架'
          });
        });
      },
      //撤回
      productWithdraw(row, index) {
        this.$confirm('确定撤回该产品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ajax({
            name: 'productWithdraw',
            data: { id: row.id }
          }).then(res => {
            this.getEquipment();
            this.$message.success('撤回成功');
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤回'
          });
        });
      },
      handleselect(row, index) {
        this.setProductId(row.id);
        setTimeout(() => {
          this.$router.push({ name: 'productDetails' });
        }, 100)
      },
      //分页
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getEquipment();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getEquipment();
      },
      gofist() {
        this.cur_page = 1;
        this.getEquipment();
      },
      goLast() {
        this.cur_page = Math.ceil(this.count / this.pageSize);
        this.getEquipment();
      },
      search() {
        this.getEquipment();
      }
    },
    watch: {
      'addProduct.type'(val) {
        if(this.addProduct.stage) {
          this.addProduct.stage = "";
        }
        if(val == 'package_01') {
          this.stage = this.getDict.filter(item => item.type === "stage").filter(item => item.code !== "stage_01" && item.code !== "stage_02" && item.code !== "stage_03");
        }
        if(val == 'package_02') {
          this.stage = this.getDict.filter(item => item.type === "stage").filter(item => item.code == "stage_01" || item.code == "stage_02" || item.code == "stage_03");
        }
        if(val == "") {
          this.stage = this.getDict.filter(item => item.type === "stage")
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .handle-box {
    // margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .active {
    text-decoration: underline;
    color: blue;
    padding: none;
  }
  .active:hover {
    cursor: pointer;
  }

  .inputs {
    width: 100%;
  }
</style>
