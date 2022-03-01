<template>
    <div class="managementOnDuty">
        <div class="managementOnDuty_tabs">
            <div class="f-txt-com" :class="showType ===1 &&'active'" @click="showType = 1">
                应急管理部
                <span
                    :class="showType !== 1 &&'op-0'"
                    @click="handleTable"
                    class="managementOnDuty_btn-more"
                >更多</span>
            </div>
            <div class="f-txt-com" :class="showType === 2 &&'active'">省应急管理厅 (局)</div>
        </div>
        <div class="managementOnDuty_content">
            <div class="managementOnDuty_content_first" v-if="showType ===1">
                <div class="managementOnDuty_content_first_title">
                    <span>{{leaderLabel}}：{{leaderName?leaderName:"无数据"}}</span>
                    <div
                        class="managementOnDuty_content_first_title_select"
                        @click="showSelecet = !showSelecet"
                    >
                        <div class="managementOnDuty_content_first_title_select_title">
                            <span class='managementOnDuty_content_first_title_select_title_active' :title="bureausName?bureausName:'无数据'">{{bureausName?bureausName:"无数据"}}</span>
                        </div>
                        <div
                            class="managementOnDuty_content_first_title_select_list"
                            v-if="showSelecet"
                            @click="showSelecet = !showSelecet"
                        >
                            <div class="nothingData--bg1" v-if="sectionList.length==0"></div>
                            <el-scrollbar v-else class="cmp-scrollbar-y" style="height:100%;">
                              <li :class="{'managementOnDuty_content_first_title_select_title_active':item.orgName == bureausName}" v-for="(item, index) in sectionList" :key="index" :title = "item.orgName" @click="BureausTable(item)">
                                {{item.orgName}}
                              </li>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
                <ul class="managementOnDuty_content_first_list">
                    <el-scrollbar class="cmp-scrollbar-y" style="height:100%;">
                        <li v-for="(item, index) in bureausList" :key="index">
                            {{item.postion}}：
                            <span v-for="(item1, index1) in item.staffInfo" :key="index1" :title="item1.name">{{item1.name}}<i v-if="item1.tel" @click.stop = 'handleClickCallup(staffInfo,item1.tel,$event,item1.name)'></i></span>
                        </li>
                    </el-scrollbar>
                </ul>
            </div>
            <div class="managementOnDuty_content_second" v-if="showType === 2">
                <div class="managementOnDuty_content_second_div">
                    <el-scrollbar class="cmp-scrollbar-y" style="height: 100%;">
                        <div class="managementOnDuty_content_second_title">北京市值班信息</div>
                        <ul>
                            <li v-for="(item, index) in hallList" :key="index">
                                {{item.label}}：
                                <span>{{item.value}}</span>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
// #d2e1ec
// #ffde00
import data from '../../../views/common/gisModules/disasterSta/sta/data';
@Component({
  name: 'ManagementOnDuty',
})
/**
 *   值班管理
 */
export default class ManagementOnDuty extends Vue {
  private showSelecet = false;
  private showType = 1;
  private showTable = false;
  @Prop() private leaderLabel: any;
  @Prop() private leaderName: any;
  @Prop() private sectionList: any;
  @Prop() private bureausList: any;
  @Prop() private bureausName: any;
  @Prop() private hallList: any;
  @Prop() private year: any;
  @Prop() private month: any;
  @Prop() private days: any;



  // 点击更多 显示table，并将相关数据传过去
  private handleTable() {
    if ( !this.showTable ) {
      this.showTable = !this.showTable;
      const tabData = {
        showTable: this.showTable,
        year: this.year,
        month: this.month,
        days: this.days,
      };
      this.messsageBus.$emit('ManagementTab', tabData);
    }
  }
  // 点击各司局单独展示信息；
  private BureausTable(item: any) {
    this.bureausList = item.staffs;
    this.bureausName = item.orgName;
    this.showSelecet = false;
  }
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any, name: any) {
    this.messsageBus.emit('showCallup', true, listObj, val, event, name);
  }
  private mounted() {
    // table 关闭时改变 showTable
    this.messsageBus.on('closeTable', (showTable: boolean) => {
      this.showTable = !this.showTable;
    });
  }
}
</script>
<style lang='less' scoped>
@imgUrl : '../../../assets/img/managementOnDuty';
.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
    // margin-right: -18px!important;
}
.managementOnDuty {
  height: 100%;
  display: flex;
  flex-direction: column;
  &_tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    flex-shrink: 0;
    background: url('@{imgUrl}/tab_bot.png') no-repeat center 45px;
    margin-top:-15px;
    padding-bottom: 3px;
    > div {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      // font-size: 24px;
      color: #fff;
      cursor: pointer;
      height: 100%;
        padding-bottom:10px;
        box-sizing: border-box;
    white-space: nowrap;
    letter-spacing: -2px;
      &.active {
        color: #ffde00;
        background: url('@{imgUrl}/tabHover.png') no-repeat 50% 30px;
      }
      > span {
        white-space: nowrap;
        border: 1px solid #fade06;
        width: 45px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        border-radius: 8px;
        margin-left: 15px;
        background-image: linear-gradient(
            rgba(129, 120, 49, 0.38),
            rgba(129, 120, 49, 0.38)
          ),
          linear-gradient(#817831, #817831);
        cursor: pointer;
        &.op-0 {
          opacity: 0;
        }
      }
      > span.managementOnDuty_btn-more {
        white-space: nowrap;
      }
    }
  }
  &_content {
    height: calc(100% - 44px);
    display: flex;
    margin-left:24px;
    overflow: hidden;
    &_first,
    &_second {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      width: 100%;
      height:100%;
      margin-right:-1px;
      &_div{
        height:100%;
      }
      &_title {
        font-size: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px!important;
        color: #fff;
        background: url('@{imgUrl}/tit_bj.png') no-repeat center / 100% 100%;
        margin-bottom: 10px;
        > span {
          color: #fff;
          width: 50%;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 8px;
          &:before {
            content: '';
            width: 12px;
            height: 12px;
            background: #00e4ff;
            margin-right: 5px;
            transform: rotateZ(45deg);
          }
        }
        &_select {
          flex-grow: 1;
          color: #d2e1ec;
          display: flex;
          justify-content: space-between;
          flex-shrink: 0;
          align-items: center;
          // width: 50%;
          cursor: pointer;
          position: relative;
          background: url('@{imgUrl}/sell_bj.png') no-repeat center / 100% 100%;
          height: 39px;
          margin-right:20px;
          &_title {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 10px;
            display: flex;
            width: 173px;
            > span {
              overflow: hidden;
              flex-grow: 1;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          &:after {
            content: '';
            border: 15px solid #00e4ff;
            border-radius: 5px;
            border-bottom: transparent;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            flex-shrink: 0;
            margin-top: 5px;
            margin-right: 3px;
          }
          &_list {
            position: absolute;
            top: 100%;
            width: 100%;
            height: 200px;
            background: rgb(4, 21, 47);
            z-index: 1;
          }
        }
      }
      ul {
        padding: 0px;
        margin: 0;
        height: calc(100% - 56px);
        // padding-right:20px;
        li {
          color: #d2e1ec;
          font-size: 24px;
          min-height: 50px;
          display: flex;
          /* align-items: center; */
          overflow: hidden;
          flex-grow: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          // padding-left: 15px;
          margin-bottom: 3px;
          
          > span {
            flex-grow: 0.5;
            /* overflow: hidden;
            text-overflow: ellipsis; */
            line-height: 36px;
            white-space: normal;
          }
        }
      }
    }
    &_second {
      &_title {
        padding-left: 15px;
      }
      ul{
        li{
          background: url("@{imgUrl}/shengjirowbg.png") no-repeat;
          padding-left:  18px;

        }
      }
    }
  }
}
.managementOnDuty_content{
  margin-left: 15px;
}
.managementOnDuty_content_first_title_select_title{
  width: 112px;
}
.managementOnDuty_content_first_title_select .managementOnDuty_content_first_title_select_title_active{
  color: #ffde00;
}
.managementOnDuty_content_first_title_select .managementOnDuty_content_first_title_select_list li:hover{
  color: #ffde00;
}
.managementOnDuty_content_first_title_select_list{
    position: absolute;
    top: 100%;
    width: 100%;
    height: 130px;
    background: #04152f;
    z-index: 1;
}
.el-scrollbar__wrap .el-scrollbar__view li{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.managementOnDuty_content_first_list li span{
  position:relative;
}
.managementOnDuty_content_first_list li span i{
    width: 34px;
    height: 34px;
    background: url("@{imgUrl}/phone1.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    cursor: pointer;
}
</style>