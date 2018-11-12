<template>
  <div class="pagination">
    <div class="pagination-left">
      {{(cur_page - 1) * pageSize + 1 === 0 ? 1 : (cur_page - 1) * pageSize + 1}}-{{Math.min(cur_page * pageSize, count)}} 共 {{count}}
    </div>
    <div class="pagination-right">
      <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" @size-change="handleSizeChange" layout="sizes,slot ,prev, pager, next" :total="count">
        <el-button class="btn-next" size="small" @click="gofist">首页</el-button>
      </el-pagination>
      <el-pagination background layout=" slot,jumper" :total="count" @current-change="handleCurrentChange">
        <el-button class="btn-next" size="small" @click="goLast">末页</el-button>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      cur_page: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 10
      },
      count: {
        type: Number,
        default: 0
      }
    },
    methods: {
      //分页
      handleCurrentChange(val) {
        this.$emit('handleCurrentChange', val);
      },
      handleSizeChange(val) {
        this.$emit('handleSizeChange', val);
      },
      gofist() {
        this.$emit('gofist', 1);
      },
      goLast() {
        this.$emit('goLast', Math.ceil(this.count / this.pageSize));
      }
    }
  }
</script>

<style>
</style>
<!--  old code
<div class="pagination">
    <el-pagination background @current-change="handleCurrentChange" :page-size="9" :current-page="cur_page" layout="a prev, pager, next, jumper" :total="count">
    </el-pagination>
</div> -->
<!-- 
<div class="pagination">
    <div class="pagination-left">
        {{(cur_page - 1) * pageSize + 1 === 0 ? 1 : (cur_page - 1) * pageSize + 1}}-{{Math.min(cur_page * pageSize, count)}} 共 {{count}}
    </div>
    <div class="pagination-right">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" @size-change="handleSizeChange" layout="sizes,slot ,prev, pager, next" :total="count">
        <el-button class="btn-next" size="small" @click="gofist">首页</el-button>
        </el-pagination>
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" :current-page="cur_page" layout=" slot,jumper" :total="count">
        <el-button class="btn-next" size="small" @click="goLast">末页</el-button>
        </el-pagination>
    </div>
</div> -->