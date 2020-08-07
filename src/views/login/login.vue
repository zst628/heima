<template>
  <div class="login">
    <!-- 页面头部 使用 vant 中 navBar 组件 -->
    <van-nav-bar class="login_nav" title="登录" />
    <!-- 输入框区域 使用 vant 中 field 组件-->
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="mobile"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请填写手机号',pattern:/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, 
         trigger: 'onBlur' }]"
        >
          <template #left-icon>
            <i class="iconfont icon-phone"></i>
          </template>
        </van-field>

        <van-field
          class="code"
          v-model="code"
          left-icon="comment-o"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请填写验证码', pattern: /^\d{6}$/, trigger: 'onBlur' }]"
        >
          <template #button>
            <van-button size="mini" type="primary" color="#ccc" round>发送验证码</van-button>
          </template>
          <template #left-icon>
            <i class="iconfont icon-suo"></i>
          </template>
        </van-field>
      </van-cell-group>
      <!-- 登录按钮 使用 vant 中的 button 组件-->
      <div class="btnBox">
        <van-button type="info" size="large">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobile: "13911111111",
      code: "246810",
    };
  },
  methods: {
    onSubmit() {
      //数据提交
      //1.0得到要提交的数据
      //手机号：this.moblie 验证码：code
      //2.提交数据到服务器
      this.$http({
        url: "http://ttapi.research.itcast.cn/app/v1_0/authorizations",
        method: "POST",
        //请求方式为post 传参用data
        data: {
          mobile: this.mobile,
          code: this.code,
        },
      }).then((res) => {
        //接收服务器返回的数据
        var result = res.data.data;
        //将服务器返回的数据存储到 localstorage
        window.localStorage.setItem("loginInfo", JSON.stringify(result));
        console.log(result);
        //跳转到首页  在项目中如果要从一个路由跳转到另一个路由 要使用 this.$router.push('目标路由')
        this.$router.push("/index");
      });
    },
  },
};
</script>

<style scoped>
/* 将来我们这个项目中会有非常多的页面 如果直接写文件与文件之间会影响 */
/* 让文件与文件之间的样式互不干扰  给style添加一个 属性 scoped*/
/* 如果在一个设置了 scoped 属性的组件中想要修改另一个组件中的样式必须添加 >>> */
.login_nav {
  background-color: #3e9df8;
}
.login >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}
.code >>> .van-button__text {
  color: #666;
}
.btnBox {
  margin: 30px 20px;
}
</style>