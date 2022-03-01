<template>
  <div class="progressSituationWrap">
    <div class="right" v-if="listDatas.length">
      <div class="right_item f-txt-com" @click="firstDatasFn(firstDatas)">
        <div class="titleWrap">
          <div class="titleClass">最新{{processType(firstDatas.type)}}</div>
          <div class="timeClass">{{firstDatas.progressTime}}</div>
        </div>
        <div class="decClass">{{firstDatas.sendDept || ''}}</div>
        <el-scrollbar class="cmp-scrollbar-y" style="height:46%;">
          <div class="contClass">{{firstDatas.progressCont}}</div>
        </el-scrollbar>
      </div>

      <div class="bottomContainer">
        <el-scrollbar class="cmp-scrollbar-y" style="height:100%" wrap-style="height:100%">
        <div class="right_bottom_wrap" ref="right_bottom_wrap">
          <div
            class="right_item right_list f-txt-com"
            ref="right_list"
            v-for="(item,index) in listDatas"
            :key="index"
            @click="listDatasFn(item)"
          >
            <div class="titleWrap">
              <div class="titleClass" :class="item.typeBg">{{processType(item.type)}}</div>
              <div class="timeClass">{{item.progressTime}}</div>
            </div>
            <div class="contClass" @click="openFn">
              <span>({{item.sendDept || ''}})</span>
              <span>{{item.progressCont}}</span>
            </div>
          </div>
        </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { progressSituationServer } from '@/api/installServer.ts';
import Socketcomponents from '@/util/Socketcomponents';
@Component({
  name: 'ProgressSituation',
})
export default class ProgressSituation extends Vue {
  @Prop({ default: () => [] }) public listDatas!: any;
  @Prop({ default: () => [] }) public firstDatas!: any;

  private colorConfig?: any = {
    救援进展: 'green',
    处置建议: 'blue1',
    灾情上报: 'blue2',
    领导批示: 'red',
    灾情评估: 'blue3',
  };

  private processType( type: string ) {
    switch (type) {
      case '0' :
        return '领导批示';
      case '1' :
        return '救援进展';
      case '2' :
        return '灾情上报';
      case '3' :
        return '处置建议';
      case '4' :
        return '灾情评估';
      default  :
        return '滚动信息';
    }
  }
  private getTimeFormat() {
    const curDay = new Date();
    const year = curDay.getFullYear();
    // const month = (curDay.getMonth() + 1+'').padStart(2, '0');
    // const day = (curDay.getDate()+'').padStart(2, '0');
    // const hour = (curDay.getHours()+'').padStart(2, '0');
    // const minute = (curDay.getMinutes()+'').padStart(2, '0');
    // const second = (curDay.getSeconds() +'').padStart(2, '0');
    const month = curDay.getMonth() + 1 + '';
    const day = curDay.getDate() + '';
    const hour = curDay.getHours() + '';
    const minute = curDay.getMinutes() + '';
    const second = curDay.getSeconds() + '';
    const dealDay = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return dealDay;
  }
  private updateDatas(res: string) {
    const temp = JSON.parse(res);
    const tempTime = this.getTimeFormat();
    const obj = {
      type: temp.msgKind,
      time: tempTime,
      typeBg: this.colorConfig[temp.msgKind],
      dec: temp.dec,
      cont: temp.content,
    };
    this.listDatas.unshift(obj);
    this.firstDatas = this.listDatas[0];
  }
  private created() {
    try {
      Socketcomponents.theProgress((res: any) => {
        this.updateDatas(res);
      });
      Socketcomponents.leaderInstruction((res: any) => {
        this.updateDatas(res);
      });
      Socketcomponents.disposalAdvice((res: any) => {
        this.updateDatas(res);
      });
    } catch (e) {
      // console.error(e);
    }
  }


  // 打开详情弹框
  private openFn() {
    // this.$store.commit('updateShowProgressSituationDetail', true);
  }
  private firstDatasFn(data: any) {
    this.messsageBus.emit('firstDatas', data);
  }
  private listDatasFn(item: any) {
    this.messsageBus.emit('listDatas', item);
  }
}
</script>

<style scoped lang="less">
.progressSituationWrap {
  width: 100%;
  height: 100%;
  box-sizing:border-box;
  padding:0 5px;
  .right {
    width: 100%;
    height: 100%;
    background: url('../../../../assets/img/progressSituation/shouyeshuxian.png')
      13px 10px no-repeat;
    background-size: 2px 100%;
    // font-size: 24px;
    position: relative;

    .bottomContainer {
      width: 100%;
      height: calc(100% - 165px);
      overflow: hidden;
      cursor: pointer;
    }
    .bottomContainer{
      .right_list{
        .titleWrap {
          .titleClass {
            background: #278817;
            color: #fff;
            white-space: nowrap;
          }
          .spanColor3.titleClass{
            background: #0ceff5;
            color: #fff;
          }
        }  
      }
        
    }
    .right_item {
      position: relative;
      max-height: 158px;
      background: url('../../../../assets/img/progressSituation/newYellow.png')
        left top no-repeat;
      background-size: 100% 100%;
      padding-left: 30px;
      margin-bottom: 8px;
      padding-top:3px;
      overflow: hidden;
      box-sizing: border-box;
      cursor:pointer;
      .titleWrap {
        box-sizing: border-box;
        padding: 2px 10px 2px 0px;
        display: flex;

        .titleClass {
          height: 42px;
          line-height: 42px;
          padding: 0 4px;
          border-radius: 7px;
          background: #fffd38;
          color: #000;
          white-space: nowrap;
        }

        .blue1 {
          background: #0ceff5;
          color: #fff;
        }

        .blue2 {
          background: #03499c;
          color: #fff;
        }

        .blue3 {
          background: #0c9eff;
          color: #fff;
        }

        .red {
          background: rgba(219, 13, 13);
          color: #fff;
        }

        .green {
          background: rgba(1, 246, 246, 0.7);
          color: #fff;
        }

        .timeClass {
          line-height: 42px;
          margin-left: 8px;
          color: #adefff;
          white-space: nowrap;
        }
      }

      .decClass {
        box-sizing: border-box;
        // padding: 0 20px;
        color: #00ffed;
      }

      .contClass {
        box-sizing: border-box;
        // padding: 0 20px;
        height: 100%;
        color: #fff;
        word-break: break-all;
        span:first-of-type {
          color: #00ffed;
        }
        span {
          &:nth-child(2) {
            word-break: break-all;
          }
        }
      }
    }

    .right_item:after {
      content: '';
      position: absolute;
      left: 0px;
      top: -1px;
      width: 29px;
      height: 30px;
      background: url('../../../../assets/img/progressSituation/shan.gif') 50%
        top no-repeat;
        background-size:100% 100%;
    }

    .right_list {
      height: auto;
      background: none;
      &:first-of-type{
         .titleWrap{
           .titleClass{
             background:#278817;
             color: #fff;
           }
         }
      }
    }

    .right_list:after {
      content: '';
      position: absolute;
      left: 0px;
      top: 0px;
      width: 30px;
      height: 30px;
      background: url('../../../../assets/img/progressSituation/newthing.gif')
        left top no-repeat;
        background-size:100% 100%;
    }

    .anim {
      transition: all 2s;
    }
  }
}
</style>
<style>
 /* .progressSituationWrap .el-scrollbar__wrap{
    margin-right: -34px !important;
  } */
</style>
