<template>
  <div class="qa">
    <!-- 搜索区域 -->
    <van-search
      @input="think"
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
      background="#3296fa"
    />
    <!-- 联想区域 -->
    <van-cell-group v-if="thinkList.length !== 0">
      <van-cell title="联想区域" />
      <van-cell
        @click="onSearch(item.oldItem)"
        icon="search"
        v-for="(item,index) in thinkList"
        :key="index"
      >
        <template #title>
          <!-- 如果要将 value 中的内容当作 html 来解析 需要用到指令 v-html -->
          <div v-html="item.newItem"></div>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 搜索历史区域 -->
    <van-cell-group v-else>
      <van-cell title="历史区域">
        <template #right-icon>
          <van-icon name="delete" @click="delAll" />
        </template>
      </van-cell>
      <van-cell
        @click="onSearch(item)"
        icon="search"
        v-for="(item,index) in historylist"
        :key="index"
        :title="item"
      >
        <template #default>
          <van-icon name="cross" @click.stop="delHistory(index)" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      thinkList: [],
      //定义一个变量保存搜索历史
      historylist: [],
    };
  },
  methods: {
    //删除所有的历史记录
    delAll() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "您确定要清空历史记录吗？",
        })
        .then(() => {
          // 从本地中删除数据
          window.localStorage.removeItem("history");
          // 从数组中删除数据
          this.historylist = [];
        })
        .catch(() => {
          // on cancel
          console.log("取消");
        });
    },
    // 删除历史记录
    delHistory(index) {
      // 删除历史数据中 index 对应数据
      this.historylist.splice(index, 1);
      // 将删除后剩下的数据保存到本地
      window.localStorage.setItem("history", JSON.stringify(this.historylist));
    },
    //点击手机上的完成按钮时执行 点击回车
    onSearch(val) {
      //val 输入框中内容
      console.log(val);
      //跳转到搜索结果页面
      this.$router.push("/searchResult?key=" + val);
      // 将数据保存在 historylist中
      this.historylist.unshift(val);
      // 去重
      this.historylist = [...new Set(this.historylist)];
      // 保存在localStorage中
      window.localStorage.setItem("history", JSON.stringify(this.historylist));
    },
    //点击取消按钮时触发
    onCancel() {
      console.log("onCancel");
    },
    //添加一个联想方法
    think() {
      //判断输入框内容中是否为空
      if (this.value.length === 0) {
        this.thinkList = [];
        return; //如果一旦执行到return 就会停止方法的执行
      }
      //1.0 将输入框中的内容提交到服务器
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/suggestion",
        method: "GET",
        params: {
          q: this.value,
        },
      }).then((res) => {
        //保存起来
        this.thinkList = res.data.data.options;
        // 将所有的关键字用span包裹起来0
        // 由于span包裹的内容 和 不包裹的内容在页面上都要被用到 所以将来遍历数组之后 返回的数据可以为一个对象
        this.thinkList = this.thinkList.map((item) => {
          return {
            oldItem: item,
            newItem: item.replace(
              this.value,
              '<span style="color: red">' + this.value + "</span>"
            ),
          };
        });
      });
    },
  },
  created() {
    // 得到localStorage中的数据
    var data = JSON.parse(window.localStorage.getItem("history"));
    // 在打开页面时应该去localStorage中得到搜索的历史记录
    // 短路运算符  如果第一个为空 执行第二个
    this.historylist = data || [];
  },
};
</script>

<style scoped>
.qa >>> .van-search__action {
  color: #fff;
}
.qa >>> .van-search__action:active {
  background-color: #3296fa;
}
</style>