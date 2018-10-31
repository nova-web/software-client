<template>
  <div class="edition">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>产品管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          版本列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" @click="addVisible">新增产品</el-button>
      </div>
      <div class="search-box">
        <el-form ref="search" :model="editionSearch" class="demo-form-inline" :inline="true">
          <el-form-item label="产品名称">
            <el-input clearable v-model="editionSearch.name" placeholder="按产品名称搜索" @change="search"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select clearable v-model="editionSearch.publishStatus" @change="search">
              <el-option v-for=" item in pro_status" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本名称">
            <el-input clearable v-model="editionSearch.version" placeholder="按版本名称搜索" @change="search"></el-input>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-date-picker v-model="editionSearch.updatedStart" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
            至
            <el-date-picker v-model="editionSearch.updatedEnd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="search">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" border height="531" style="width: 100%">
        <el-table-column label="序号" prop="num" width="50px"></el-table-column>
        <el-table-column label="所属产品" prop="productName"></el-table-column>
        <el-table-column label="版本" prop="version"></el-table-column>
        <el-table-column label="版本类型" prop="stage"></el-table-column>
        <el-table-column label="状态" prop="publishStatusName"></el-table-column>
        <el-table-column label="版本描述" prop="versionLog"></el-table-column>
        <el-table-column label="发布时间" prop="createdAt"></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="download(scope.row)">
              <a class="downloadText" :href="scope.row.url">
                下载
              </a>
            </el-button>
            <el-button size="small" type="text" @click="modify(scope.row, scope.$index)">修改</el-button>
            <el-button size="small" type="text">删除</el-button>
            <el-button size="small" type="text">试用</el-button>
            <el-button size="small" type="text">发布</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="9" :current-page="cur_page" layout="total, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增版本" :visible.sync="addEditionModele" width="30%">
      <div class="add-edition">
        <el-form ref="addEdition" label-width="90px" :model="addEdition" class="demo-ruleForm">
          <el-form-item label="版本名称:">
            <el-input class="inputs" v-model="addEdition.version" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="版本类型:">
            <el-select class="inputs" clearable v-model="addEdition.stage" placeholder="">
              <el-option v-for="item in stage" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本描述:">
            <el-input type="textarea" class="inputs" v-model="addEdition.versionLog" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="产品ID:">
            <el-select class="inputs" v-model="addEdition.productId">
              <el-option v-for="item in fitPro" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本上传:">
            <el-upload class="upload-demo" ref="upload" action="" :limit="1" :on-change="getFile" :on-exceed="beyondFile" :on-remove="removeFile" :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
            <!-- <img class="addImg" :src="file?file.url:''" alt=""> -->
            <div class="tips" v-show="fileTip">请上传版本包</div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取消</el-button>
        <el-button type="primary" @click="saveAddEdition">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改版本" :visible.sync="modifyModel" width="30%">
      <div class="add-edition">
        <el-form ref="addEdition" label-width="90px" :model="modifyEdition" class="demo-ruleForm">
          <el-form-item label="版本名称:">
            <el-input class="inputs" v-model="modifyEdition.version" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="版本类型:">
            <el-select class="inputs" clearable v-model="modifyEdition.stage" placeholder="">
              <el-option v-for="item in stage" :key="item.id" :value="item.code" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本描述:">
            <el-input type="textarea" class="inputs" v-model="modifyEdition.versionLog" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="产品ID:">
            <el-select class="inputs" v-model="modifyEdition.productId">
              <el-option v-for="item in fitPro" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本上传:">
            <el-upload class="upload-demo" ref="upload" action="" :limit="1" :on-change="getFile" :on-exceed="beyondFile" :on-remove="removeFile" :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModifyEdition">取消</el-button>
        <el-button type="primary" @click="saveModifyEdition">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import { serialize } from '../../utils';
  import axios from 'axios';
  import { api } from '../../api';
  export default {
    data() {
      return {
        modifyModel: false, //修改版本
        addEditionModele: false, //新增版本
        tableData: [],
        modifyEdition: {}, //修改版本
        editionSearch: {},
        addEdition: {}, //新增版本
        pro_status: [], // 版本状态
        cur_page: 1,
        count: 0,
        package: [], //产品类型
        stage: [], //产品阶段
        fitPro: [], //适配产品
        href: '',
        fileTip: false,
        file: null //文件
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
            item.stage = this.getFormatDict.stage[item.stage];
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
        Object.keys(this.addEdition).forEach(item => {
          formData.append(item, this.addEdition[item]);
        })
        if(this.file) {
          formData.append("package", this.file.raw);
          axios({
            method: 'post',
            url: api.addPackages.url,
            data: formData,
            headers: { 'token': this.getCommon.token }
          }).then(res => {
            if(res.data.errorCode === 1) {
              this.addEditionModele = false;
              this.$message.success('操作成功');
              this.file = null;
              this.$refs['upload'].clearFiles();
              this.getEdition();
            } else {
              this.$message.error(res.data.errorMsg);
            }
          })
        } else {
          this.fileTip = true;
        }
      },
      //取消新增
      addCancel() {
        this.addEditionModele = false;
        this.fileTip = false; //文件提示
        this.$refs['addEdition'].clearValidate();
      },
      //修改版本
      modify(row) {
        console.log(row);
        this.modifyEdition = {
          version: row.version,
          stage: row.stage,
          versionLog: row.versionLog,
          productId: row.productId
        }
        this.modifyModel = true;
      },
      //确认修改
      saveModifyEdition() { },
      // 取消修改
      cancelModifyEdition() {
        this.modifyModel = false;
      },
      //下载
      download(row) {
        console.log(row);
        this.href = row.url;
      },


      //搜索
      search() {
        this.getEdition();
      },
      //获取文件
      getFile(file) {
        this.file = file;
        if(this.file) {
          this.fileTip = false;
        }
      },
      //上传文件超出限制
      beyondFile() { },
      //移除文件列表中得文件
      removeFile() {
        this.file = null;
      },
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
    color: #dd5145;
  }
</style>

