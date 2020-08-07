<template>
  <div class="result">
    <!-- 页面头部 -->
    <van-nav-bar class="login_nav" :fixed="true" title="搜索结果" left-arrow @click-left="onClickLeft" />
    <!-- 文章区域 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell @click="toDetail(item)" v-for="(item,index) in searchList" :key='index' >
        <template #title>
          <!-- 标题 -->
          <h4>{{item.title}}</h4>
          <!-- 图片区域 -->
          <van-grid v-if="item.cover.type !=0" :border="false" :column-num="3">
            <van-grid-item v-for="(imgItem,imgIndex) in item.cover.images" :key="imgIndex">
              <van-image src="imgItem" />
            </van-grid-item>
          </van-grid>
          <!-- 其他信息 -->
          <div class="other">
            <span>{{item.aut_name}}</span>
            <span>{{item.comm_count}}</span>
            <span>{{item.pubdate | mytime}}</span>
          </div>
          <van-grid direction="horizontal" :column-num="3">
            <van-grid-item icon="friends-o" text="留言" />
            <van-grid-item  icon="like-o" text="点赞" />
            <van-grid-item icon="exchange" text="分享" />
          </van-grid>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// 导入 json-bigint包
import jsonbig from 'json-bigint'
export default {
  data() {
    return {
      loading: false,
      finished:false,
      // 搜索关键字
      key:this.$route.query.key,
      // 等以一个页数
      page:1,
      // 定义一个页容量
      perPage:10,
      // 搜索的结果列表
      searchList:[]
    };
  },
  methods: {
    // 跳转到详情页面
    toDetail (item){
      this.$router.push('/detail?artid=' + item.art_id)
    },
    onLoad(){
      // 得到用户登录的token
      const loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
      //判断用户是否登录
      if (loginInfo && loginInfo.token) {
        // 说明已经登录
        // 发送请求到服务器得到要搜索的文章数据
        this.$http({
          url: "http://ttapi.research.itcast.cn/app/v1_0/search",
          method: "GET",
          headers:{
            Authorization: "Bearer " + loginInfo.token,
          },
          params: {
            page:this.page,
            per_page:this.perPage,
            q:this.key
          },
          //添加保留精度的代码
          transformResponse:[function (data) {
          return jsonbig.parse(data)
        }]
        }).then((res) => {
          // 先将数据保存起来
          this.searchList = this.searchList.concat(res.data.data.results)
          // 关闭加载状态
          this.loading = false
          // 将page + 1
          this.page += 1
          // 判断当前数据源是否加载完毕
          if(res.data.data.results.length === 0){
            this.finished = true
          }
        });
      } else {
        //说明没有登录 
        //跳转到登录
        this.$router.push('/login');
      }
    },
    onClickLeft() {
      // 回退到上一个页面
      this.$router.back();
    },
  },

};
</script>

<style scoped>
.login_nav {
  background-color: #3e9df8;
}
.result >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}
.result >>> .van-nav-bar__arrow {
  color: #fff;
}
.result {
  margin-top: 46px;
}
.other span {
  margin-right: 10px;
}
</style>