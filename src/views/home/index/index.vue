<template>
  <div class="index">
    <!-- 头部导航 -->
    <!--fixed="true"固定导航栏 fixed是否固定在顶部  -->
    <van-nav-bar class="login_nav" :fixed="true" title="主页" />
    <!-- 频道区域 -->
    <!-- sticky 是否使用粘性定位布局 粘性布局下，标签页滚动到顶部时会自动吸顶。-->
    <!-- :offset-top 粘性定位布局下与顶部的最小距离，支持 px vw rem 单位，默认 px -->
    <van-tabs v-model="active" sticky :offset-top="46">
      <van-tab v-for="(item,index) in channelList " :key="index" :title="item.name">
        <!-- 文章内容区域 -->
        <!-- 使用list组件完成上拉加载更多 -->
        <van-pull-refresh v-model="item.isLoading" @refresh="onRefresh">
          <van-list
            v-model="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <!-- 完善主页的结构与样式 -->
            <van-cell @click="$router.push('/detail?artid=' + subitem.art_id)" v-for="(subitem,subindex) in item.articleList" :key="subindex">
              <template #title>
                <!-- 标题 -->
                <h4>{{subitem.title}}</h4>
                <!-- 图片区域 -->
                <van-grid v-if="subitem.cover.type !==0" :border="false" :column-num="3">
                  <van-grid-item v-for="(imgitem,imgindex) in subitem.cover.images" :key="imgindex">
                    <van-image :src="imgitem" />
                  </van-grid-item>
                </van-grid>
                <!-- 其他信息 -->
                <div class="other">
                  <span>{{subitem.aut_name}}</span>
                  <span>{{subitem.comm_count}}</span>
                  <span>{{subitem.pubdate | mytime}}</span>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>

    <!-- 添加一个容器 -->
    <div class="channelicon" @click="openchannel">
      <van-icon name="bars" />
    </div>
    <!-- 频道弹出层 -->
    <channel ref="mychannel" />
  </div>
</template>

<script>
//导入组件channel
import channel from "./com/channel.vue";
// 导入 json-bigint包
import jsonbig from 'json-bigint'
export default {
  data() {
    return {
      //保存频道数据
      channelList: [],
      //设置当前选择频道下标
      active: 0,
    };
  },
  methods: {
    //打开频道面板
    openchannel() {
      //得到组件channel中的show 改为 true
      const mychannel = this.$refs.mychannel;
      //将show 设置为true
      mychannel.show = true;
    },
    //加载数据时会触发的方法
    //list 组件 上拉触底时触发  & 组件被页面加载时也会触发
    onLoad() {
      //得到当前选中的频道数据
      const currentChannel = this.channelList[this.active];
      //得到当前频道对应的文章数据
      const id = currentChannel.id;
      //发送请求到服务器得到对应的文章数据
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_1/articles",
        method: "GET",
        params: {
          channel_id: id,
          timestamp: Date.now(),
          with_top: 0,
        },
        //在这里接收数据之前 应该使用一个第三方包 将传过来超过js的数据处理范围的数据进行处理
        transformResponse:[function (data) {
          return jsonbig.parse(data)
        }]
      }).then((res) => {
        //将得到的文章数据保存在当前频道下的 articleList数组中
        currentChannel.articleList = currentChannel.articleList.concat(
          res.data.data.results
        );
        //将list的加载状态手动改为 false
        currentChannel.loading = false;
        //判断当前频道下是否有数据
        if (res.data.data.results.length === 0) {
          //说明没有数据 需要将当前频道下的finished改为 true
          currentChannel.finished = true;
        }
      });
    },
    onRefresh() {
      //下拉刷新 清除当前频道下所有的数据
      //当前频道数据
      const currentChannel = this.channelList[this.active];
      //清除数据
      currentChannel.loading = false;
      currentChannel.isLoading = false;
      currentChannel.finished = false;
      currentChannel.articleList = [];
      //重新加载
      this.onLoad();
    },
    //给频道数据添加额外的属性：loading finished isLoading articleList
    addOtherProp() {
      this.channelList.forEach((item) => {
        //添加额外属性 使用this.$set
        this.$set(item, "loading", false);
        this.$set(item, "finished", false);
        this.$set(item, "isLoading", false);
        this.$set(item, "articleList", []);
      });
    },
  },
  //这个方法在 index.vue 被打开时执行
  created() {
    //执行这个方法时 要得到服务器频道接口中的数据
    //得到token
    const myloginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
    //判断token是否存在
    if (myloginInfo && myloginInfo.token) {
      //说明存在
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/user/channels",
        method: "GET",
        //在请求头中携带 token
        headers: {
          Authorization: "Bearer " + myloginInfo.token,
        },
      }).then((res) => {
        //保存数据
        this.channelList = res.data.data.channels;
        //添加额外属性
        this.addOtherProp();
      });
    } else {
      //说明用户未登录
      //从等地中取出数据 假设将来保存频道的数据键位 channels
      const mylocalChannel = JSON.parse(
        window.localStorage.getItem("channels")
      );
      if (mylocalChannel) {
        //直接取出本地数据
        this.channelList = mylocalChannel;
        //添加额外属性
        this.addOtherProp();
      } else {
        //只是得到默认数据
        this.$http({
          url: "http://ttapi.research.itcast.cn/app/v1_0/user/channels",
          method: "GET",
        }).then((res) => {
          //保存数据
          this.channelList = res.data.data.channels;
          //添加额外属性
          this.addOtherProp();
        });
      }
    }
  },
  //将channel组件注册为index子组件
  components: {
    channel: channel,
  },
};
</script>

<style scoped>
.login_nav {
  background-color: #3e9df8;
}
.index >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}
.index {
  margin-top: 46px;
  margin-bottom: 50px;
}
.channelicon {
  position: fixed;
  top: 46px;
  right: 0px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  z-index: 999;
  width: 10%;
  background-color: pink;
}
.index >>> .van-tabs__nav {
  width: 90%;
}
.other span {
  margin-right: 10px;
}
</style>