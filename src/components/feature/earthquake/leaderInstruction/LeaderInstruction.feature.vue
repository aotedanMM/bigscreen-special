<template>
    <div class = "leaderInstructionWrap">
      <el-scrollbar  class="cmp-scrollbar-y" style="width:99%">
       <div class = "content">{{msg}}</div>
      </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop} from 'vue-property-decorator';
// import Socketcomponents from '@/util/Socketcomponents';
/**
  * 领导批示组件
  */
@Component({
  name : 'LeaderInstruction',
})
export default class LeaderInstruction extends Vue {
/**
  * 领导批示内容
  */
  @Prop() public msg?: string  ;
  // private showCont: boolean = false;
  // @Watch('msg')
  // private onChange(val: any) {
  //    this.watchMsg(val);
  // }
  // private watchMsg(opt: any) {
  //    if (opt) {
  //      this.showCont = true;
  //    } else {
  //      this.showCont = false;
  //    }
  // }
  // private updateDatas(res: string) {
  //    const temp = JSON.parse(res);
  //    this.msg = temp.content;
  // }
}
</script>

<style scoped lang = "less">
.leaderInstructionWrap{
    width:100%;
    height:100%;
    display:flex;
    padding:10px 0px 10px 25px;
    box-sizing: border-box;
   .content{
     box-sizing: border-box;
     width:100%;
     height:100%;
     overflow:auto;
     color: #dafbff;
     line-height: 40px;
     font-size: 28px;
     word-break: break-all;
     position: relative;
     text-indent: 38px;
   }
   .content::before {
      width:38px;
      height:38px;
      background:url("../../../../assets/img/leaderInstruction/flag.png") left top no-repeat;
      content: '';
      position: absolute;
      left: 0;
   }
   /* .noDataClass {
      width: 100%;
      text-align: center;
      font-size: 28px;
      color: #bdebef;
      padding-top: 16%;
    } */
  }
</style>