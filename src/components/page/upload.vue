<template>
  <div>
    <!-- <div class="crumbs"> -->
    <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-date"></i> 表单</el-breadcrumb-item>
        <el-breadcrumb-item>文件上传</el-breadcrumb-item>
      </el-breadcrumb> -->
    <!-- </div> -->
    <div class="container">
      <div class="content-title">上报设备信息</div>
      <div class="content-title">
        <el-button @click="postDataModel = true">上报设备信息</el-button>

      </div>
      <div class="content-title">
        升级固件包
      </div>
      <div class="search-bosx">
        <div>
          <span>Model Id: &nbsp;</span>
          <el-input clearable class="inputs" placeholder="输入modelID" v-model="modelId" @blur="initData"></el-input>
        </div>
        <div>
          <span>版本号: &nbsp;</span>
          <el-input clearable class="inputs" placeholder="输入版本号" v-model="version" @blur="initData"></el-input>
        </div>
        <div>
          <span>版本数量: &nbsp;</span>
          <el-input clearable class="inputs" placeholder="输入获取的版本数量" v-model=" limit" @blur="initData"></el-input>
        </div>
        <el-button type="primary">获取列表</el-button>
      </div>
      <el-table :data="tableData" height="531">

        <el-table-column prop="version" label="版本号"></el-table-column>
        <el-table-column prop="publishStatus" label="状态"></el-table-column>
        <el-table-column prop="versionType" label="版本类型"></el-table-column>
        <el-table-column prop="log" label="日志"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column label="版本号" width="240px">
          <template slot-scope="scope">
            <el-button size="small" type="text">
              <a class="downloadText" :href="scope.row.url">
                更新
              </a>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="上报设备信息" :visible.sync="postDataModel" width="30%" :before-close="editDia">
        <el-form :model="postData" label-width="90px">
          <el-form-item label="model Id:">
            <el-input v-model="postData.modelId"></el-input>
          </el-form-item>
          <el-form-item label="设备ID:">
            <el-input v-model="postData.deviceId"></el-input>
          </el-form-item>
          <el-form-item label="版本:">
            <el-input v-model="postData.version"></el-input>
          </el-form-item>
          <el-form-item label="分辨率:">
            <el-input v-model="postData.deviceInfo.screen"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-input v-model="postData.deviceStatus"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="surePost">确 定</el-button>
          <el-button @click="cancelPost">取 消</el-button>
        </div>
      </el-dialog>
      <!-- <div class="plugins-tips">
        Element UI自带上传组件。 访问地址：
        <a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank">Element UI Upload</a>
      </div> -->
      <!-- <el-upload class="upload-demo" :headers="header" :data="{ 'aaa': 'aaaaa'}" drag action="proxy/upload" :show-file-list="true" :on-progress='uploadIng'>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload> -->
      <!-- <div class="content-title">支持裁剪</div> -->
      <!-- <div class="plugins-tips">
        vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。 访问地址：
        <a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>
      </div> -->
      <!-- <div class="crop-demo">
        <img :src="cropImg" class="pre-img">
        <div class="crop-demo-btn">选择图片
          <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
        </div>
      </div>

      <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
        <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="cure">确 定</el-button>
                </span>
      </el-dialog> -->
    </div>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs';
  import bus from '../common/bus';
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  export default {
    components: {
      VueCropper
    },
    data: function() {
      return {
        defaultSrc: './static/img/img.jpg',
        fileList: [],
        imgSrc: '',
        cropImg: '',
        dialogVisible: false,
        header: {},
        tableData: [],
        postDataModel: false,
        postData: {
          modelId: null,
          deviceId: null,
          version: null,
          deviceInfo: {
            screen: null
          },
          deviceStatus: null
        },
        modelId: '',
        version: '',
        limit: ''
      }
    },
    created() {
      this.cropImg = this.defaultSrc;
    },
    computed: {
      ...mapGetters(['getCommon'])
    },

    methods: {
      ...mapActions(['ajax']),
      initData() {
        this.ajax({
          name: 'packageNewlist',
          data: {
            modelId: this.modelId,
            version: this.version,
            limit: this.limit
          }
        }).then(res => {
          this.tableData = res;
        })
      },
      surePost() {
        this.ajax({
          name: 'productReport',
          data: this.postData
        }).then(res => {
          this.postDataModel = false;

        })
      },
      cancelPost() {
        this.postDataModel = false;
        this.postData = {
          modelId: null,
          deviceId: null,
          version: null,
          deviceInfo: {
            screen: null
          },
          deviceStatus: null
        };
      },
      editDia(done) {
        this.postData = {
          modelId: null,
          deviceId: null,
          version: null,
          deviceInfo: {
            screen: null
          },
          deviceStatus: null
        };
        done();
      },
      uploadIng(event, file, filelists) {
        console.log(event);
        console.log(file);
        console.log(filelists);

      },
      setImage(e) {
        const file = e.target.files[0];
        if(!file.type.includes('image/')) {
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          this.dialogVisible = true;
          this.imgSrc = event.target.result;
          this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      },
      cropImage() {
        this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      },
      cancelCrop() {
        this.dialogVisible = false;
        this.cropImg = this.defaultSrc;
      },
      cure() {
        this.dialogVisible = false;
        console.log(this.cropImg);
      },
      imageuploaded(res) {
        console.log(res)
      },
      handleError() {
        this.$notify.error({
          title: '上传失败',
          message: '图片上传接口上传失败，可更改为自己的服务器接口'
        });
      }
    }
  }
</script>

<style scoped lang="less">
  .search-bosx {
    > div {
      margin-top: 10px;
    }
    span {
      display: inline-block;
      width: 100px;
    }
    .inputs {
      width: 150px;
    }
    .el-button {
      height: 32px;
      margin-left: 173px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
  }
  .pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  .crop-demo {
    display: flex;
    align-items: flex-end;
  }
  .crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
</style>