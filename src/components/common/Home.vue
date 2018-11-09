<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar ref="sideBar"></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">

          <router-view></router-view>

        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import vHead from './header.vue';
  import vSidebar from './sidebar.vue';
  import vTags from './tags.vue';
  import bus from './bus';
  import { mapGetters } from 'vuex';
  import { getLoc } from '../../utils';
  export default {
    data() {
      return {
        tagsList: [],
        collapse: false
      }
    },
    components: {
      vHead, vSidebar, vTags
    },
    created() {
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })

      // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
      bus.$on('tags', msg => {
        let arr = [];
        for(let i = 0, len = msg.length; i < len; i++) {
          msg[i].name && arr.push(msg[i].name);
        }
        this.tagsList = arr;
      })
    },
    computed: {
    }
  }
</script>
