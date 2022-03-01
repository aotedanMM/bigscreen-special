<template>
<!-- 表格部分 S -->
  <div class="managementOnduty_table" v-show="showTable" :class="$store.state.controlMoudle.screen2rdFlag ? 'managementOnduty_table_small' :'' ">
      <div class="managementOnduty_table_container">
          <div class="managementOnduty_table_container_title">
              <div class="managementOnduty_table_container_title_left">
                  <span class='title-panel'>应急综合值班值守详情</span>
                  <div>
                      <span>{{month}}月</span>
                      <span class="days_jiao" @click="changeDate">{{days}}日</span>
                      <div v-if="changeDateShow" class = "duty_dateDay_sele">
                        <el-scrollbar class="cmp-scrollbar-y" style="height: 100%;">
                          <ul>
                            <li :class="{'duty_dateDay_seleHover':days==count}" @click="changeDateChange(count)" v-for="count in curMonthDaysArr" :key="count">{{count}}</li>
                          </ul>
                        </el-scrollbar>
                      </div>
                  </div>
              </div>
              <div
                  class="managementOnduty_table_container_title_close"
                  @click="closeTable"
              ></div>
          </div>
          <div class="managementOnduty_table_container_content">
            <div v-if="sectionList.length==0" class="managementOnduty_table_container_content_zanwu">暂无数据</div>
            <div class="managementOnduty_table_container_content_bangong" v-else  v-for = "(item,index) in sectionList" :key='index'>
                <div v-if="item.orgName == '办公厅'">
                  <h2 class="managementOnduty_table_container_content_orgname_01"  >
                    {{item.orgName}}
                  </h2>
                  <div class="managementOnduty_table_container_content_title_01">
                    <p v-for = "(item1,index1) in item.staffs" :key="index1">{{item1.postion}}</p>
                  </div>
                  <div>
                    <ul v-for = "(item1,index1) in item.staffs" :key="index1">
                      <div>
                        <li v-for = "(item2,index2) in item1.staffInfo" :key="index2">{{item2.name}}<br>{{item2.job}}</li>
                      </div> 
                    </ul>
                  </div>
                </div>
                <div v-else-if="item.orgName == '应急指挥中心'">
                    <h2 class="managementOnduty_table_container_content_orgname_02">{{item.orgName}}</h2>
                    <div class="managementOnduty_table_container_content_title_02">
                      <p v-for = "(item1,index1) in item.staffs" :key="index1">{{item1.postion}}</p>
                    </div>
                    <div class="managementOnduty_table_container_content_cont_02">
                        <span>电话：83933123、83933200、83932666</span>
                        <span>传真：83933117、83932911、83932910</span>
                    </div>
                    <div class='managementOnduty_table_container_content_cont_02_bot'>
                      <ul v-for = "(item1,index1) in item.staffs" :key="index1">
                        <div>
                          <li v-for = "(item2,index2) in item1.staffInfo" :key="index2">{{item2.name}}<br>{{item2.job}}</li>
                        </div> 
                      </ul>
                    </div>
                  
                </div>
                <div v-else-if="item.orgName == '火灾防治管理司、林火预警中心'">
                  <h2 class="managementOnduty_table_container_content_orgname_02"> {{item.orgName}}</h2>
                  <div class="managementOnduty_table_container_content_title_04">
                    <p v-for = "(item1,index1) in item.staffs" :key="index1">{{item1.postion}}</p>
                  </div>
                  <div class="managementOnduty_table_container_content_cont_04">
                      <p>电话：83933123、83933200、</p>
                      <p>传真：83933117、83932911、83932910</p>
                  </div>
                  <div class="managementOnduty_table_container_content_cont_huoqing">
                    <ul v-for = "(item1,index1) in item.staffs" :key="index1">
                      <div>
                        <li v-for = "(item2,index2) in item1.staffInfo" :key="index2">{{item2.name}}<br>{{item2.job}}</li>
                      </div> 
                    </ul>
                  </div>
                
                </div>
                <div v-else-if="item.orgName == '防汛抗旱司'">
                    <h2 class="managementOnduty_table_container_content_orgname_01">{{item.orgName}}</h2>
                    <div class="managementOnduty_table_container_content_title_01">
                      <p v-for = "(item1,index1) in item.staffs" :key="index1">{{item1.postion}}</p>
                    </div>
                    <div>
                      <ul v-for = "(item1,index1) in item.staffs" :key="index1">
                        <div>
                          <li v-for = "(item2,index2) in item1.staffInfo" :key="index2">{{item2.name}}<br>{{item2.job}}</li>
                        </div> 
                      </ul>
                    </div>
                </div>
                <div v-else-if="item.orgName == '机关服务中心'">
                    <h2 class="managementOnduty_table_container_content_orgname_last">{{item.orgName}}</h2>
                    <div class="managementOnduty_table_container_content_title_last">
                      <p>18612931356</p>
                    </div>
                    <div class="managementOnduty_table_container_content_cont_jiguan">
                      <ul v-for = "(item1,index1) in item.staffs" :key="index1">
                        <div>
                          <li v-for = "(item2,index2) in item1.staffInfo" :key="index2">{{item2.name}}<br>{{item2.job}}</li>
                        </div> 
                      </ul>
                    </div>
                </div>
                <div v-else>
                    <h2 class="managementOnduty_table_container_content_orgname_03">{{item.orgName}}</h2>
                    <div class='managementOnduty_table_container_content_orgname_03_bot'>
                      <ul v-for = "(item1,index1) in item.staffs" :key="index1">
                        <div>
                          <li v-for = "(item2,index2) in item1.staffInfo" :key="index2">{{item2.name}}<br>{{item2.job}}</li>
                        </div> 
                      </ul>
                    </div>
                  
                </div>
            </div>
          </div>
      </div>
  </div>
<!-- 表格部分 E -->
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { managementOnDutyServer } from '@/api/installServer';

@Component({
  name: 'ManagementTab',
})
export default class ManagementTab extends Vue {
  private showTable: boolean = false;
  private time: string = '';
  private year: string | number = '';
  private month: string | number = '';
  private days: string | number = '';
  private sectionList: any[] = [];
  private curMonthDaysArr: string | number = '';
  private changeDateShow = false;


  private mounted() {
    this.messsageBus.on('ManagementTab', (data: any) => {
      this.showTable = data.showTable;
      this.year = data.year;
      this.month = data.month;
      this.days = data.days;
      // this.time = '2020-01-12';
      this.time = this.year + '-' + this.month + '-' + this.days;
      this.getManagementDuty(this.time);
    });

  }

      // 获取值班信息
  private getManagementDuty(time: any) {
    this.loading = true;
    managementOnDutyServer.getData(time).then((res: any) => {
      const tsData: any = res.data;
      this.sectionList = tsData.staff;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

     /*更改日期查询*/
  private changeDate() {
    if (this.changeDateShow) {
      this.changeDateShow = false;
    } else {
      this.changeDateShow = true;
      const d = new Date();
      this.curMonthDaysArr = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate();
    }
  }
  // 查询新的数据
  private changeDateChange(count: string | number) {
    if (count < 10) {
      this.days = '0' + count;
    } else {
      this.days = count;
    }
    this.changeDateShow = false;
    const time = this.year + '-' + this.month + '-' + this.days;
    this.getManagementDuty(time);
  }

  private closeTable() {
    this.showTable = !this.showTable;
    // 关闭 table，告诉 ManagementOnDuty.vue
    this.messsageBus.$emit('closeTable', this.showTable);
  }

}
</script>

<style lang="less">
.managementOnduty_table_container_content {
  .tableContainer .el-table__header-wrapper .el-table, .el-table__expanded-cell {
    background-color: rgba(0, 0, 0, 0);
  }
  .tableContainer .el-table__header-wrapper.tableContainer  .el-table th, .el-table tr {
    background-color: rgba(0, 0, 0, 0);
  }
  .tableContainer .el-table__header-wrapper .el-table thead.is-group th {
    background-color: rgba(0, 0, 0, 0);
  }
  .tableContainer .el-table thead {
    font-size: 20px;
  }
}
  .tableContainerTwo .el-table, .el-table__expanded-cell {
    background-color: rgba(0, 0, 0, 0);
    color:#fff
  }
  .tableContainer .el-table, .el-table__expanded-cell{
    background-color: rgba(0, 0, 0, 0);
  }
  .tableContainer .el-table th, .el-table tr {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
  }
  .tableContainer .el-table thead.is-group th {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
  }
  .tableContainer .el-table thead {
    color: #fff;
    font-size: 20px;
  }
  .tableContainer .el-table th, .el-table tr{
    background-color: rgba(0, 0, 0, 0)!important;
  }
  .tableContainerTwo .el-table th, .el-table tr{
    background-color: rgba(0, 0, 0, 0);
    font-size: 20px;
  }
</style>
<style lang='less' scoped>
@url : '../../../assets/img/halfScreen/eventAndTopics';
@imgUrl : '../../../assets/img/managementOnDuty';
  .managementOnduty_table {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // right: 0;
    // bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
    &_container {
      background-image: url('@{imgUrl}/secondbg.png');
      background-size: 100% 100%;
      width: 1842px;
      height: 731px;
      &_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:94%;
        height:90px;
        margin:auto;
        &_left {
          display: flex;
          align-items: center;
          padding-top: 4px;
          > span {
          }
          .days_jiao:after{
            content:'';
            display:inline-block;
            width:9px;
            height:5px;
            background-image: url('@{imgUrl}/jiao.png');
            margin-left:5px;
          }
          > div {
            display: flex;
            span {
              margin-left: 20px;
              width: 108px;
              height: 39px;
              color: yellow;
              display: flex;
              justify-content: center;
              align-items: center;
              background-image: url('@{imgUrl}/datebg.png');
            }
          }
        }
        &_close {
          background: url('@{url}/eventAndTopics_close.png') no-repeat 0 0;
          width: 90px;
          height: 48px;
          background-size: 100% 100%;
          background-position: center;
          cursor: pointer;
          margin-right: -50px;
          margin-top: -30px;
          &:hover{
             background-image: url('@{url}/eventAndTopics_close_h.png');
          }
        }
      }
      &_content {
        div {
          font-size: 26px;
          color: #fff;
        }
      }
    }
  }
  .managementOnduty_table_container_content{
    overflow: hidden;
    color: #fff;
    width: 96%;
    margin: auto;
    border: 1px solid rgba(35, 200, 208, 0.5);
    border-bottom: none;
    border-left: none;
    margin-left: 42px;
    margin-top: 15px;
    h2{
      font-size: 26px;
      color: #6fe4fb;
      font-weight:normal;
      text-align: center;
      margin: 0;
      padding:0;
      border: 1px solid rgba(35, 200, 208, 0.5);
      border-right: none;
      border-top: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    >div{
      float:left;
    }
  }
  .managementOnduty_table_container_content_zanwu{
    line-height: 200px;
    text-align: center;
    width: 100%;
    font-size: 26px;
  }
  .managementOnduty_table_container_content_bangong{
    height:280px
  }
  .managementOnduty_table_container_content_orgname_01{
    height: 35px;
  }
  .managementOnduty_table_container_content_orgname_02{
      height: 35px;
      line-height: 35px;
  }
  .managementOnduty_table_container_content_orgname_03{
    width: 190px;
    height: 114px;;
  }
  .managementOnduty_table_container_content_orgname_last{
    width: 200px;
    height: 64px;
  }
  .managementOnduty_table_container_content_title_01{
    height:40px;
    line-height:40px;
  }
  .managementOnduty_table_container_content_title_02{
    height:40px;
    line-height:40px;
  }
  .managementOnduty_table_container_content_title_04{
    height:40px;
    line-height:40px;
  }
  .managementOnduty_table_container_content_title_last{
    height:138px;
    line-height:138px;
  }
  .managementOnduty_table_container_content .managementOnduty_table_container_content_title_04>p{
    width:50%;
  }
  .managementOnduty_table_container_content .managementOnduty_table_container_content_cont_04>p{
    height: 140px;
    width: 50%;
  }
  .managementOnduty_table_container_content .managementOnduty_table_container_content_cont_huoqing>ul{
    width:290px;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content .managementOnduty_table_container_content_cont_jiguan>ul{
    width:193px;
    height:164px;
  }
  .managementOnduty_table_container_content_bangong>div>div{
    display:flex;
  }
  .managementOnduty_table_container_content_cont_02{
    height: 70px;
    border: 1px solid rgba(35, 200, 208, 0.5);
    border-right: none;
    border-top: none;
  }
  .managementOnduty_table_container_content_cont_04{
     width:582px;
  }
  .managementOnduty_table_container_content_cont_02>span{
    display: inline-block;
    width: 100%;
    margin: 0;
    padding:0;
   }
  .managementOnduty_table_container_content ul,.managementOnduty_table_container_content p{
    width: 190px;
    text-align:center;
    margin: 0;
    padding:0;
    border: 1px solid rgba(35, 200, 208, 0.5);
    border-right: none;
    border-top: none;
  }
  .managementOnduty_table_container_content .managementOnduty_table_container_content_title_last p{
     width:100%
   }
  .managementOnduty_table_container_content ul{
    height:203px;
    display:flex;
    align-items: center;
    justify-content: center;
  }

  .managementOnduty_table_container_title_left>div{
    position:relative;
  }
    /*下拉日历*/
  .duty_dateDay_sele {
    position: absolute;
    width: 104px;
    height: 192px;
    background-color: rgba(7, 16, 34, 0.9);
    border: 1px solid #02b2e5;
    left: 149px;
    color: #fff;
    top: 42px;
    cursor: pointer;
  }
  .duty_dateDay_sele li {
      width: 114%;
      height: 39px;
      line-height:39px;
      text-align: center;
      font-size: 20px;
  }

  .duty_dateDay_sele li:hover {
    box-shadow: inset 0 0 20px 5px rgba(227, 255, 95, 0.32), 0px -1px 0 0px #ffd870, 0px 1px 0 0px #ffd870;
    border-left: 1px solid #ffd870;
    border-right: 1px solid #ffd870;
    color: yellow;
  }

  .duty_dateDay_sele li.duty_dateDay_seleHover {
      color: yellow;
  }
  /*小屏样式*/
  .managementOnduty_table_small .managementOnduty_table_container_content_title_last{
    width:100%;
    height:50px;
    line-height:50px;
  }
  .managementOnduty_table_container_content .managementOnduty_table_container_content_cont_02_bot  ul{
    height:131px;
  }
  .managementOnduty_table_container_content .managementOnduty_table_container_content_orgname_03_bot  ul{
    height:164px;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content ul,.managementOnduty_table_small .managementOnduty_table_container_content p{
    width: 120px;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content_cont_02{
    width: 725px;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content .managementOnduty_table_container_content_cont_huoqing>ul{
    width:50%;
    height:63px;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content_orgname_03{
   width: 120px;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content_cont_04,
  .managementOnduty_table_small .managementOnduty_table_container_content .managementOnduty_table_container_content_cont_huoqing{
    width: 436px;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content .managementOnduty_table_container_content_cont_04 > p{
    height: 140px;
    width: 50%;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content .managementOnduty_table_container_content_title_04>p{
    width:50%;
  }
  .managementOnduty_table_small .managementOnduty_table_container_content .managementOnduty_table_container_content_title_last p{
     width:100%
  }
  .managementOnduty_table_small .managementOnduty_table_container_content_orgname_last{
    width: 193px;
    height: 64px;
  }
</style>
