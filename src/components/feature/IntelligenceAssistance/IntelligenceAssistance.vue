<template>
  <div class='IntelligenceAssistance'>
    <el-scrollbar class="cmp-scrollbar-y" style="height:100%;">
      <ul class='IntelligenceAssistance_cont'>
        <li v-for="(item,index) in arrData" :key='index' @click='moreOpen(item)'><span>{{item.name}}</span></li>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import publishObjectPath from '@/util/configRegistry';
@Component({
  name: 'IntelligenceAssistance',
})
export default class IntelligenceAssistance extends Vue {
    private IntelligenceAssistanceServer = publishObjectPath.value; // 情报辅助链接
    // private internetIntelligence = publishObjectPath.value && publishObjectPath.value.internetIntelligence; // 互联网情报
    private arrData = [
        {
            name: '交通导航图',
            externalLinks: this.IntelligenceAssistanceServer.TrafficNavigationMap,
        },
        {
            name: '互联网情报',
            externalLinks: this.IntelligenceAssistanceServer.internetIntelligence,
        },
    ];
    private moreOpen(item: any) {
        window.open(item.externalLinks);
    }
}
</script>
<style lang="less" scoped>
@url: '../../../assets/img/IntelligenceAssistance';
.IntelligenceAssistance{
    width: 100%;
    height: 100%;
}
.IntelligenceAssistance_cont{
  width: 100%;
  height: 100%;
  li{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 390px;
    height: 100px;
    background:url('@{url}/IntelligenceAssistance_bg.png') no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    &:hover{
      background:url('@{url}/IntelligenceAssistance_bg_active.png') no-repeat;
      background-size: 100% 100%;
    }
    span{
        padding: 20px 50px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        font-stretch: normal;
        line-height: 36px;
        color: #ffffff;
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 2px;
        &:hover{
            background-image: -webkit-linear-gradient(top, #eaf6ff 10%, #fffd97);
            text-shadow: 2px 2px 6px rgba(0,0,0 .5);
        }
    }
  }

}
.IntelligenceAssistance .el-scrollbar__thumb {
    background-image: linear-gradient(0deg, #0a7ccc 0%, #06b4d1 52%, #02ebd5 100%);
}
</style>