<template>
    <div class="weatherPanelFrameWrap">
        <div class="top">
             <span class="titleClass">{{title}}</span>
        </div>
        <div class="main">
            <slot ></slot>
        </div>
    </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class WeatherPanelFrame extends Vue {
     @Prop() private title!: string;
        }
</script>

<style scoped lang="less">
    .weatherPanelFrameWrap{
        width: 100%;
        height: 100%;
        color: white;
        .top{
            box-sizing: border-box;
            text-align: left;
            font-size: 18px;
            padding-left: 35px;
            border-bottom:1px solid #50c6fc;
            color: #50c6fc;
            width:100%;
            height: 40px;
           
            margin-bottom:10px;
            .titleClass{
             box-sizing: border-box;
             padding:0 10px;
             display:inline-block;
             height: 40px;
             background: url("../../../../../assets/img/weather/biaotitop.png") center bottom no-repeat;
             background-size:100% 100%;
            }
         
        }
        .main{
            margin-bottom: 10px;
        }
    }
</style>