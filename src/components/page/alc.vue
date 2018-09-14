<template>

  <div class="alc">
    <div class="container">
      <el-table :data="formatData" :row-style="showRow" v-bind="$attrs" border>

        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            <span>{{scope.$index}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template slot-scope="scope">
            <span v-for="space in scope.row._level" :key="space" class="ms-tree-space" />
            <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
              <i v-if="!scope.row._expanded" class="el-icon-plus"/>
              <i v-else class="el-icon-minus"/>
             </span>
          </template>
        </el-table-column>
        <el-table-column label="测试">
          <template slot-scope="scope">
            <span>
              {{scope.row.event}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="message(scope.row)">点击</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { treeToArray } from '../../utils'
  export default {
    created() {
    },
    data() {
      return {
        data: [
          {
            id: 1,
            event: '事件1',
            timeLine: 100,
            comment: '无',
            children: [
              {
                id: 2,
                event: '事件2',
                timeLine: 10,
                comment: '无'
              },
              {
                id: 3,
                event: '事件3',
                timeLine: 90,
                comment: '无',
                children: [
                  {
                    id: 4,
                    event: '事件4',
                    timeLine: 5,
                    comment: '无'
                  },
                  {
                    id: 5,
                    event: '事件5',
                    timeLine: 10,
                    comment: '无'
                  },
                  {
                    id: 6,
                    event: '事件6',
                    timeLine: 75,
                    comment: '无',
                    children: [
                      {
                        id: 7,
                        event: '事件7',
                        timeLine: 50,
                        comment: '无',
                        children: [
                          {
                            id: 71,
                            event: '事件71',
                            timeLine: 25,
                            comment: 'xx'
                          },
                          {
                            id: 72,
                            event: '事件72',
                            timeLine: 5,
                            comment: 'xx'
                          },
                          {
                            id: 73,
                            event: '事件73',
                            timeLine: 20,
                            comment: 'xx'
                          }
                        ]
                      },
                      {
                        id: 8,
                        event: '事件8',
                        timeLine: 25,
                        comment: '无'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 1,
            event: '事件1',
            timeLine: 100,
            comment: '无',
            children: [
              {
                id: 2,
                event: '事件2',
                timeLine: 10,
                comment: '无'
              },
              {
                id: 3,
                event: '事件3',
                timeLine: 90,
                comment: '无',
                children: [
                  {
                    id: 4,
                    event: '事件4',
                    timeLine: 5,
                    comment: '无'
                  },
                  {
                    id: 5,
                    event: '事件5',
                    timeLine: 10,
                    comment: '无'
                  },
                  {
                    id: 6,
                    event: '事件6',
                    timeLine: 75,
                    comment: '无',
                    children: [
                      {
                        id: 7,
                        event: '事件7',
                        timeLine: 50,
                        comment: '无',
                        children: [
                          {
                            id: 71,
                            event: '事件71',
                            timeLine: 25,
                            comment: 'xx'
                          },
                          {
                            id: 72,
                            event: '事件72',
                            timeLine: 5,
                            comment: 'xx'
                          },
                          {
                            id: 73,
                            event: '事件73',
                            timeLine: 20,
                            comment: 'xx'
                          }
                        ]
                      },
                      {
                        id: 8,
                        event: '事件8',
                        timeLine: 25,
                        comment: '无'
                      }
                    ]
                  }
                ]
              }
            ]
          }],
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
    methods: {
      showRow: function(row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
        row.row._show = show
        return show ? 'animation:treeTableShow .5s;' : 'display:none;'

      },
      // 切换下级是否展开
      toggleExpanded(trIndex) {
        const record = this.formatData[trIndex]
        record._expanded = !record._expanded
      },
      // 图标显示
      iconShow(index, record) {
        return (index === 0 && record.children && record.children.length > 0)
      },
      message(row) {
        this.$message.info(row.event)
      }
    },
    computed: {
      formatData: function() {
        let tmp
        if(!Array.isArray(this.data)) {
          tmp = [this.data]
        } else {
          tmp = this.data
        }
        const func = treeToArray
        return func.apply(null, [tmp, false])
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
</style>



