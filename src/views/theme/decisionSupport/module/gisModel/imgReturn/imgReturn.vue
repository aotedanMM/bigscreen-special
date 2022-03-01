<template>
    <div class="ImgReturn">
        <el-carousel height='810px' trigger="click" arrow="always" indicator-position="none">
            <el-carousel-item v-for="item in 4" :key="item">
                <img src="" alt="">
            </el-carousel-item>
        </el-carousel>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    @Component({
        name: 'ImgReturn',
        components: {},
    })
    export default class ImgReturn extends Vue { }
</script>
<style lang="less" scoped>
    .ImgReturn {
        width: 1200px;
        position: absolute;
        top: 50%;
        left: 50%;
        height: 810px;
        transform: translate(-50%,-50%);
        z-index: 999;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    // .el-carousel__item:nth-child(2n) {
    //     background-color: #99a9bf;
    // }

    // .el-carousel__item:nth-child(2n+1) {
    //     background-color: #d3dce6;
    // }
</style>