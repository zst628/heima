<template>
  <div>
    <van-cell class="commnet">
      <template #title>
        <div class="box">
          <div class="img">
            <img :src="myitem.aut_photo" alt />
          </div>
          <div class="msg">
            <div class="auth">{{myitem.aut_name}}</div>
            <div class="content">{{myitem.content}}</div>
            <div class="oth">
              <span>{{myitem.pubdate | mytime}}</span>
              <span>{{myitem.reply_count}}</span>
            </div>
          </div>
          <div class="like">
            <van-icon name="like-o" />
          </div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  // 接收父组件传的数据
  props: ["myitem"],
};
</script>

<style scoped>
.box {
  display: flex;
}
.img img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.msg {
  flex: 1;
}
.msg .auth {
  color: #0094ff;
}
.msg .content {
  padding-left: 10px;
}
.msg .oth span:nth-child(2) {
  margin-left: 20px;
  background-color: #ccc;
  padding: 3px 8px;
  border-radius: 8px;
}
</style>