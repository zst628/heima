<template>
  <div class="channel">
    <!-- 频道弹出层 -->
    <!--show 控制面板的现实与隐藏 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '70%' }">
      <!-- 我的频道 -->
      <van-cell title="我的频道 ">
        <template #default>
          <van-button
            v-if="iconsShow === false"
            @click="iconsShow=true"
            class="myeditbtn"
            plain
            round
            size="mini"
            type="danger"
          >编辑</van-button>
          <van-button
            v-else
            @click="iconsShow=false"
            class="myeditbtn"
            plain
            round
            size="mini"
            type="danger"
          >完成</van-button>
        </template>
      </van-cell>
      <!-- 我的频道列表 -->
      <van-grid>
        <van-grid-item
          @click="changeIndex(index)"
          class="itemf"
          :class="{active: index === $parent.active}"
          v-for="(item,index) in $parent.channelList"
          :key="index"
        >
          <template #text>
            {{item.name}}
            <!-- 阻止事件冒泡 stop -->
            <van-icon
              @click.stop="delChannel(index)"
              v-if="iconsShow && index !==0"
              class="icons"
              name="clear"
            />
          </template>
        </van-grid-item>
      </van-grid>
      <!-- 频道推荐 -->
      <van-cell title="频道推荐" />
      <!-- 频道推荐列表 -->
      <van-grid>
        <van-grid-item
          @click="addChannel(item)"
          v-for="(item,index) in tuijianChannel"
          :key="index"
          :text="item.name"
        />
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      //控制xx的显示与隐藏
      iconsShow: false,
      //所有频道数据
      allChannel: [],
    };
  },
  methods: {
    //改变选中频道的下标
    changeIndex(index) {
      //修改父组件中的 active 属性
      this.$parent.active = index;
    },
    //添加频道
    addChannel(item) {
      //添加额外属性
      this.$set(item, "loading", false);
      this.$set(item, "isLoading", false);
      this.$set(item, "finished", false);
      this.$set(item, "articleList", []);
      //将 item 添加到我的频道中
      this.$parent.channelList.push(item);
      // 保存修改之后的频道数据
      //判断用户是否登录
      var loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
      //判断用户是否登录
      if (loginInfo && loginInfo.token) {
        //已经登录 将修改后的频道数据提交到服务器
        //生成提交到服务器中的数据
        // 1.0 由于 seq 默认从 1  开始 而 index 从 0 开始 所以需要给 seq + 1
        // 2.0 由于推荐数据是不允许操作的 所以应该从数组中将推荐数据干掉
        // 3.0 seq = 1 的顺序永远是为推荐保留的
        var mychannel = this.$parent.channelList.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2,
          };
        });
        this.$http({
          url: "http://ttapi.research.itcast.cn/app/v1_0/user/channels",
          method: "PUT",
          headers: {
            Authorization: "Bearer " + loginInfo.token,
          },
          data: {
            channels: mychannel,
          },
        }).then((res) => {
          console.log(res);
          console.log("操作成功");
        });
      } else {
        //没有登录 将修改后的频道数据保存到本地
        //要保存的修改后的数据是 ： this.$parent.channelList
        window.localStorage.setItem(
          "channels",
          JSON.stringify(this.$parent.channelList)
        );
      }
    },
    //删除频道
    delChannel(index) {
      // 从我的频道中删除index对应的元素
      this.$parent.channelList.splice(index, 1);
      //当前点击的下标大于要删除的下标 使删除的下标-1
      if(index<this.$parent.active){
        this.$parent.active = this.$parent.active -1
      }
      var loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
      // 判断用户是否登录
      if (loginInfo && loginInfo.token) {
        var mychannel = this.$parent.channelList.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2,
          };
        });
        this.$http({
          url: "http://ttapi.research.itcast.cn/app/v1_0/user/channels",
          method: "PUT",
          headers: {
            Authorization: "Bearer " + loginInfo.token,
          },
          data: {
            channels: mychannel,
          },
        }).then((res) => {
          console.log(res);
          console.log("操作成功");
        });
      } else {
        window.localStorage.setItem(
          "channels",
          JSON.stringify(this.$parent.channelList)
        );
      }
    },
  },
  //打开页面就执行 created方法
  created() {
    //得到所有的频道数据
    this.$http({
      url: "http://ttapi.research.itcast.cn/app/v1_0/channels",
      method: "GET",
    }).then((res) => {
      //保存所有频道数据
      this.allChannel = res.data.data.channels;
    });
  },
  //定义计算属性
  computed: {
    //计算频道数据
    tuijianChannel() {
      //根据我的频道数据 全部频道数据 计算出推荐数据
      //1.0 得到我的频道数据中的所有数据的 ids 集合
      var ids = this.$parent.channelList.map((item) => {
        return item.id;
      });
      //2.0 遍历所有频道数据 判断 id 是否在ids中存在
      var newChannel = this.allChannel.filter((item) => {
        return !ids.includes(item.id);
      });
      return newChannel;
    },
  },
};
</script>

<style scoped>
.myeditbtn {
  padding: 0px 13px;
}
.icons {
  position: absolute;
  top: 0;
  right: 0;
  color: #666;
}
.channel >>> .van-grid-item__content {
  font-style: 12px;
}
.active {
  color: red;
}
</style>