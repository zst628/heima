<template>
    <div>
        <h1>testsd</h1>
        <h3>1.0 vant中的按钮</h3>
        <van-button type="default">默认按钮</van-button>
        <van-button type="primary">主要按钮</van-button>
        <van-button type="info">信息按钮</van-button>
        <van-button type="warning">警告按钮</van-button>
        <van-button type="danger">危险按钮</van-button>
        <h3>2.0 vant中的图标</h3>
        <van-icon name="like-o" /><br>
        <van-icon name="like" />
        <h3>3.0 使用vant中的单元格</h3>
        <van-cell-group>
            <van-cell title="单元格" value="内容" />
            <van-cell title="单元格" value="内容" label="描述信息" />
        </van-cell-group>
        <h3>4.0 给单元格左右两侧添加小星星--vant中的插槽</h3>                     
        <van-cell>
             <template #title>
                  <van-icon name="like" />
                     单元格
                  <van-icon name="like" />
             </template>
              <template #default>
                  <van-icon name="like" />
                     内容
                  <van-icon name="like" />
             </template>
        </van-cell>

        
    </div>
</template>

<script>
export default {
    
}
</script>

<style>

</style>