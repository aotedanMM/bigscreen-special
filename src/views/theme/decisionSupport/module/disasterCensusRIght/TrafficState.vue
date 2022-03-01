<template>
   <div class="panel-traffic-control">
      <el-scrollbar  class="cmp-scrollbar-y" style="height:100%;">         
      <ul>
         <li class="traffic-li road">
               <div class="damage-img"> <img src="../../../../../assets/img/traffic/gonglu.png"></div>
               <div>
                  <div class="damage-num"><i>{{traffic.damage}}</i> <span>处</span> </div>
                  <div class="damage-name">道路损毁</div>
               </div>
         </li>
         <li class="traffic-li traffic">
            <div class="damage-img"> <img src="../../../../../assets/img/traffic/gonglu.png"></div>
               <div>
                  <div class="damage-num"><i>{{traffic.control}}</i> <span>处</span> </div>
                  <div class="damage-name">交通管制</div>
               </div>
         </li>
         <li class="traffic-li traffic">
            <div class="damage-img"> <img src="../../../../../assets/img/traffic/gonglu.png"></div>
               <div>
                  <div class="damage-num"><i>{{traffic.safe}}</i> <span>处</span> </div>
                  <div class="damage-name">绿色通道</div>
               </div>
         </li>
      </ul>
      </el-scrollbar>
   </div>
</template>
<script lang="ts" scoped>
   import { Component, Vue, Watch } from 'vue-property-decorator';
   import { pushDataRequestServe } from '@/api/installServer';
   @Component
   export default class TrafficState extends Vue {
      private traffic: any = {
         damage: 0,
         control: 0,
         safe: 0,
      };
      @Watch('$store.state.eventPushStore.traffic')
      private eventChange(val: any) {
         if　(val > 0) {
            this.getData();
         } else if (val < 0) {
            this.traffic.damage = 0;
            this.traffic.control = 0;
            this.traffic.safe = 0;
         }
      }
      private created() {
         if (this.$store.state.eventPushStore.traffic > -1) {
            this.getData();
         }
      }
      private async getData() {
         const eventId = this.$store.state.eventPushStore.eventId; // 事件id
         const processId = 'traffic';  // 交通id
         const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
         const jsonData = JSON.parse(data.content)[0].data;
         const newData = JSON.parse(jsonData).data;
         this.traffic.control = 0;
         this.traffic.damage = 0;
         this.traffic.safe = 0;
         for (const i of newData) {
            if (i.isblock === '2') {
               this.traffic.control += i.count;
            } else if (i.isblock === '1') {
               this.traffic.damage += i.count;
            } else if (i.isblock === '0') {
               this.traffic.safe += i.count;
            }
         }
      }
   }
</script>
<style scoped lang="less">
.panel-traffic-control{
   height: 100%;
}
.traffic-li{
  display: flex;
  width:80%;
  margin-left:10%;
  margin-top:6%;
}
.damage-img{
  width: 70px;
  height: 80px;
  margin-right:25%;
  margin-top:10px;
}
.damage-num {
  font-size: 32px;
  color: #f0b744;
}
.damage-num i{
  font-weight: 700;
  font-style: normal;
}
.damage-name{
  font-size: 28px;
    color: #c2f4fa;
}
</style>