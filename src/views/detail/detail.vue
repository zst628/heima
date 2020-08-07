<template>
  <div class="detail">
    <!-- 头部导航 -->
    <van-nav-bar
      class="login_nav"
      :fixed="true"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 标题区域 -->
    <h2>{{detail.title}}</h2>
    <!-- 作者区域 -->
    <van-cell>
      <template #title>
        <div class="auth">
          <div class="img">
            <img :src="detail.aut_photo" alt />
          </div>
          <div class="userMsg">
            <div class="username">{{detail.aut_name}}</div>
            <div>{{detail.pubdate | mytime}}</div>
          </div>
          <div class="btn">
            <van-button @click="follow" v-if="detail.is_followed === false" type="info">+ 关注</van-button>
            <van-button @click="unfollow" v-else type="info">取消关注</van-button>
          </div>
        </div>
      </template>
    </van-cell>
    <!-- 文章内容 -->
    <van-cell>
      <template #title>
        <div v-html="detail.content"></div>
      </template>
    </van-cell>
    <!-- 点赞区域 -->
    <div class="btns">
      <div class="zan">
        <van-button @click="unzan" plain round type="danger" v-if="detail.attitude === 1">
          <van-icon  name="like-o" />点赞
        </van-button>
        <van-button @click="zan" plain round type="default" v-else>
          <van-icon name="like-o" />点赞
        </van-button>
      </div>
      <div class="collect">
        <van-button @click="uncollect" plain round type="danger" v-if="detail.is_collected === true">
          <van-icon name="star-o" />收藏
        </van-button>
        <van-button @click="collect" plain round type="default" v-else>
          <van-icon name="star-o" />收藏
        </van-button>
      </div>
      <div class="dislike">
        <van-button @click="undislike" plain round type="danger" v-if="detail.attitude === 0">
          <van-icon name="delete" />不喜欢
        </van-button>
        <van-button @click="dislike" plain round type="default" v-else>
          <van-icon name="delete" />不喜欢
        </van-button>
      </div>
    </div>
    <!-- 评论区域 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment :myitem="item" v-for="(item,index) in commentList"  :key='index' />
    </van-list>
    <!-- 添加评论区域 -->
    <write />
  </div>
</template>

<script>
//导入组件comment
import comment from "./com/comment.vue";
import write from "./com/write.vue";
import jsonbig from 'json-bigint'
export default {
  data() {
    return {
      loading: false,
      finished: false,
      // 定义一个文章的id
      artId: this.$route.query.artid,
      detail: {},
      // 定义一个分页的标识
      offset:null,
      // 定义一个分页的容量
      limit:10,
      // 定义一个结束的标识
      endid:0,
      // 定义一个评论的列表
      commentList:[]
    };
  },
  methods: {
    // 取消收藏
    uncollect() {
       // 得到文章当前id
      var artid = this.detail.art_id;
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将id提交到服务器 取消收藏
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/article/collections/" + artid,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
        
      }).then((res) => {
        console.log(res);
        // 提示用户已经取消收藏
        this.$toast.success("取消收藏");
        // 手动将文章的态度设置为 false
        this.detail.is_collected = false;
      });
    },
    // 收藏
    collect() {
       // 得到文章当前id
      var artid = this.detail.art_id;
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将id提交到服务器 收藏文章
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/article/collections",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          target: artid,
        },
      }).then((res) => {
        console.log(res);
        // 提示用户已经收藏成功
        this.$toast.success("收藏成功");
        // 手动将文章的态度设置为 true
        this.detail.is_collected = true;
      });
    },
    // 取消不喜欢
    undislike() {
       // 得到文章当前id
      var artid = this.detail.art_id;
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将id提交到服务器 取关作者
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/article/dislikes/" + artid,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((res) => {
        console.log(res);
        this.detail.attitude = -1;
      });
    },
    //不喜欢
    dislike() {
       // 得到文章当前id
      var artid = this.detail.art_id;
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将id提交到服务器 取关作者
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/article/dislikes",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          target: artid,
        },
      }).then((res) => {
        console.log(res);
        // 提示用户已经关注成功
        // this.$toast.success("取关用户成功");
        // 手动将文章的态度设置为 1
        this.detail.attitude = 0;
      });
    },
    // 取消点赞
    unzan() {
      // 得到文章当前id
      var artid = this.detail.art_id;
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将id提交到服务器 取关作者
      this.$http({
        url:
          "http://ttapi.research.itcast.cn/app/v1_0/article/likings/" + artid,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((res) => {
        console.log(res);
        // 手动将文章的态度设置为 -1
        this.detail.attitude = -1;
      });
    },
    // 点赞
    zan() {
      // 得到文章当前id
      var artid = this.detail.art_id;
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将id提交到服务器 取关作者
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/article/likings",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          target: artid,
        },
      }).then((res) => {
        console.log(res);
        // 提示用户已经关注成功
        // this.$toast.success("取关用户成功");
        // 手动将文章的态度设置为 1
        this.detail.attitude = 1;
      });
    },
    // 关注
    follow() {
      // 得到作者当前id
      var id = this.detail.aut_id;
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将id提交到服务器 关注作者
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/user/followings",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          target: id,
        },
      }).then((res) => {
        console.log(res);
        // 提示用户已经关注成功
        this.$toast.success("关注用户成功");
        // 手动将关注的状态设置为 true
        this.detail.is_followed = true;
      });
    },
    // 取消关注
    unfollow() {
      // 得到作者当前id
      var id = this.detail.art_id;
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将id提交到服务器 取关作者
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/user/followings/" + id,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((res) => {
        console.log(res);
        // 提示用户已经关注成功
        this.$toast.success("取关用户成功");
        // 手动将关注的状态设置为 false
        this.detail.is_followed = false;
      });
    },
    onLoad() {
      //得到当前文章的评论数据
      this.$http({
      url: "http://ttapi.research.itcast.cn/app/v1_0/comments",
      method: "GET",
      params: {
        type:'a',
        source:this.artId,
        offset:this.offset,
        limit:this.limit
      },
    }).then((res) => {
      // 复制给数据
      this.offset = res.data.data.last_id
      this.endid = res.data.data.end_id
      this.commentList =this.commentList.concat(res.data.data.results)
      // 将 list 组件的加载状态设置为 false
      this.loading = false
      // 判断数据是否加载完成
      if(this.offset === this.endid){
        this.finished = true
      }
    });
    },
  },
  created() {
    // 得到token
    var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
    // 打开页面是得到文章的id
    this.$http({
      url: "http://ttapi.research.itcast.cn/app/v1_0/articles/" + this.artId,
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
      transformResponse:[function (data) {
          return jsonbig.parse(data)
        }]
    }).then((res) => {
      this.detail = res.data.data;
      // console.log(this.detail);
    });
  },
  components: {
    comment,
    write,
  },
};
</script>

<style scoped>
.login_nav {
  background-color: #3e9df8;
}
.detail >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}
.detail >>> .van-nav-bar__arrow {
  color: #fff;
}
.detail {
  margin-top: 46px;
  margin-bottom: 50px;
}
.detail h2 {
  text-align: center;
  padding: 20px 0px;
}
.auth {
  display: flex;
}
.auth .img img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.auth .userMsg {
  flex: 1;
}
.btns {
  display: flex;
  margin: 30px 0px;
}
.btns .zan,
.btns .dislike {
  flex: 1;
  text-align: center;
}
</style>