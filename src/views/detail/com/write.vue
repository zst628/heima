<template>
  <div class="write">
    <van-search
      background="pink"
      shape="round"
      left-icon
      v-model="value"
      show-action
      @search="onSearch"
    >
      <template #action>
        <van-button type="primary" size="small" @click="onSearch(value)">发送</van-button>
      </template>
    </van-search>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
    };
  },
  methods: {
    onSearch(val) {
      // 得到token
      var token = JSON.parse(window.localStorage.getItem("loginInfo")).token;
      // 将用户输入内容提交到服务器
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/comments",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        data:{
          target:this.$route.query.artid,
          content:val
        }
      }).then((res) => {
        // 得到评论数据
        var comment =  res.data.data.new_obj;
        // 将新增的评论添加到父组件 commentList中
        this.$parent.commentList.unshift( comment)
        // 清空输入框
        this.value = ''
      });
    },
  },
};
</script>

<style scoped>
.write {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>