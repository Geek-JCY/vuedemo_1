<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->

    <v-header :seller="seller"></v-header>
    <div class="tab b-border-1px">
      <div class="tab-item">
        <router-link :to="{path:'/goods'}">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/ratings'}">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/seller'}">商家</router-link>
      </div>
    </div>
    <!-- 路由外链 -->
    <!-- keep-alive 把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>
<!-- import '@common/stylus/index.styl' -->
<script type="text/ecmascript-6">
import header from './components/header/header.vue';
import {urlParse} from './common/js/util';
import {getSeller} from '@api/api.js';

const ERR_OK = 0;

export default {
  name: 'app',
  data() {
    return {
      seller: {
        id: (() => {  // 这个位置写函数 需要立即执行函数
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    // 获取 seller 数据
    this._getSeller();
  },
  methods: {
    _getSeller() {
      getSeller().then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          // this.seller = response.data;
          // Object.assign 方法 合并对象, 添加 id
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });
    }
  },
  components: {
    'v-header': header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/mixin.styl"
  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      b-border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)

</style>
