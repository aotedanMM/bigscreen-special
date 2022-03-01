<template>
  <div
    class="eventInfoPop expert"
    ref="eventInfoPop"
    :style="'height: ' + popHeight + 'px;'"
     v-if="repersityShow"
  >
    <!-- <div>3333333333333</div> -->
    <!-- <input id="eventPopdata"
           type="hidden"
           :value="data" /> -->
    <div class="eventInfoPop_title title_container">
      <div class="eventInfoPop_title_txt title_panel">{{ templateName }}</div>
      <div class="closeDetail" @click="close()"></div>
    </div>
    <div class="eventInfoPop_content">
      <!-- <div class="detailstitle"
           :title="name">{{ removeSpaces(name) }}</div> -->
      <ul>
        <el-scrollbar
          class="scrollbar"
          :wrap-style="'height:100%;max-height: 260px;'"
        >
          <li
            class="multiLineTextWrapPopUp"
            v-for="item of dataFilter"
            :key="item"
          >
            <template
              v-if="
                list[item] === 0 || filterNumFixed(item, labelObj[item], list)
              "
            >
              <span>{{ labelObj[item] }}</span>
              <span
                :title="filterNumFixed(item, labelObj[item], list)"
                class="unit"
              >
                {{ filterNumFixed(item, labelObj[item], list) }}
                <span
                  v-show="filterNumFixed(item, labelObj[item], list) !== '- -'"
                  >{{ unitObj[item] || '' }}</span
                >
              </span>
              <!-- v-if="list[item] && telobj[item] && unitObj[item]" -->
              <img v-if="list[item] && telobj[item]"
                   src="../../../../assets/img/eventInfo/telphoon.png"
                   class="callPhoneCur"
                   @click.stop="handleClickCallup(list,list[item],$event,telPelope,)"
                />
                </template>
            <template v-else>
              <span>{{ labelObj[item] }}：</span>
              <span>无</span>
            </template>
          </li>
          <!-- 救援队伍装备列表 -->
          <!-- <li class="popBtn">
            <equipmentList></equipmentList>
          </li>-->
          <!--按钮列表组件-->
          <!--路径规划-->
          <!--  <span
              class="pathPlanning"
              v-if="isShowPathPlanningBtn"
              @click="pathClick()"
          >路径规划</span>-->
          <!--周边分析-->
          <!-- <span
              class="aroundAnalysis"
              v-if="isAroundAnalysisBtn"
              @click="aroundClick()"
          >周边分析</span>-->
        </el-scrollbar>
        <li class="popBtn">
          <popButtonList
            :btnFilter="btnFilter"
            v-if="btnOnOff"
            @buttonListClick="buttonListClick"
          ></popButtonList>
          <InEventInfo
            :closeFunc="closeFunc"
            :vueThis="vueThis"
            v-if="data.isEventBtn"
            :popupData="data"
          ></InEventInfo>
        </li>
      </ul>
      <div class="detail_container" v-if="!loadingState">
        <div class="rescueTeamsHome_chart">
          <div class="listDistrict_title">
            <span class="f-tit-h2">{{ listName }}</span>
            <span v-if="totalData.length > 0" class="total_num"
              ><i class="num_identify">{{ totalData.length }}</i
              >项</span
            >
            <i
              @click="FnMinimize"
              :class="
                minimize ? 'panel_switch' : 'panel_switch panel-switch-reverse'
              "
            ></i>
          </div>
          <!--  -->
          <div class="tableLists" v-show="minimize && tableData.length > 0">
            <div class="thead" v-if="templateType === 1">
              <span>序号</span>
              <span>物资名称</span>
              <span>数量</span>
            </div>
            <div class="thead" v-if="templateType === 2">
              <span>序号</span>
              <span>装备类型</span>
              <span>数量</span>
            </div>
            <div class="table_container">
              <el-scrollbar style="height:100%" :key="tableData.length">
                <table>
                  <thead>
                    <!-- <tr>
                  <th>物资名称</th>
                  <th>物资类型</th>
                  <th>数量</th>
                </tr> -->
                  </thead>
                  <tbody>
                    <tr v-for="(data, index) in tableData" :key="index">
                      <td>{{ data.numbers }}</td>
                      <td class="tablename">
                        <span :title="data.name">{{ data.name }}</span>
                      </td>
                      <td class="num">
                        <span class="num_identify">{{ data.value }}</span
                        ><span>{{ data.materialnum }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-scrollbar>
            </div>
            <div class="page">
              <el-pagination
                class="constomMyElPage"
                :key="templateType"
                small
                :pager-count="5"
                :current-page.sync="paginationObj.currentPage"
                @current-change="handleCurrentChange"
                :page-size="paginationObj.pageSize"
                layout="prev, pager, next"
                :total="paginationObj.total"
              ></el-pagination>
            </div>
          </div>

          <div v-show="minimize && tableData.length <= 0" class="nodata"></div>
        </div>
      </div>
      <div v-else>
        <div class="loading"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import disasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import { Draggable } from 'draggable-vue-directive';
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
import equipmentList from '@/components/feature/gisModule/popUp/equipmentList.vue';
import popButtonList from '@/components/feature/gisModule/popUp/popButtonList.vue';
import { buttonList } from './dataDeal/buttonList';
import InEventInfo from '@/components/feature/gisModule/popUp/btnComponent/inEventInfo.vue';
import { multiuleInterfaceServer } from '@/api/installServer';
@Component({
  name: 'MaterialTypesFilterPop',
  components: {
    equipmentList,
    popButtonList,
    InEventInfo,
  },
  mixins: [popDataDeal],
  directives: {
    Draggable,
  },
})
export default class MaterialTypesFilterPop extends Vue {
  // 要显示的按钮
  public btnFilter = [
    // 'pathPlanningBtn', // 路径规划
    // 'aroundAnalysisBtn', // 周边分析
    // 'aroundVideoBtn', // 周边分析
    /* 'videoMonitoringBtn', // 视频监控
    'hazardousChemicalsBtn', // 危化物联 */
  ];
  public name: any = '暂无标题';
  public styles: any = {};
  public popUpType: any;
  public geometry: any;
  public coordinates: any;
  public geoPoint: any = [];
  public dataObj: any;
  public list: [] = [];
  public dataAttributes: any;
  public dataChild: any;
  public dataTag: any;
  public dataDeal: any = dataDeal;
  public popHeight: any = 0;
  public templateName: any = '';
  public templateType: any = '';
  public listName: any = '';
  public repersityShow: boolean = true;
  private loadingState: boolean = false;
  private totalData: any = [];
  // 分页
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 10,
    total: 10,
    roundfirm: [],
  };
  private minimize: any = true;
  private infoid: any = '';
  private tableData: any = [];
  // 拖拽
  private draggableValue: any = {
    onPositionChange: this.onPosChanged,
  };
  public buttonListClick(item: any) {
    /*// 如果点击周边分析按钮, 隐藏当前弹框
        if (item === 'aroundAnalysisBtn') {
          (this.$refs.eventInfoPop as any).style.display = 'none';
        }*/
    // 触发点击的回调方法
    buttonList[item].btnClick(this);
  }
  @Watch('templateType')
  public getType(val: any) {
    // console.log(val)
    this.getDatas();
    // console.log(3333,this.infoid);
  }
  public getDatas() {
    this.tableData = [];
    this.loadingState = true;
    // console.log(this.templateType)
    const queryParam = {
      id: this.infoid,
      pageSize: '3',
      pageIndex: '1',
      resourceKey: 'meterialinfo',
    };

    if (this.templateType === 1) {
       multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
           this.paginationObj.total = res.list.length;
           this.paginationObj.pageSize = 10;
           const allData = JSON.parse(JSON.stringify(res.list));
          // this.totalData = JSON.parse(JSON.stringify(result))
           this.totalData = allData.map((item: any, index: any) => {
            item.numbers = index + 1;
            return item;
          });
          // console.log(77777, this.totalData)

           if (this.totalData.length > 0) {
            this.tableData = this.getDetailContent(1, 10, this.totalData);
          }
           this.loadingState = false;
    });
      // installDisasterJudgeServer.repositoryServer
      //   .getMaterialByReposityId({
      //     id: this.infoid,
      //     pageSize: 3,
      //     pageNo: 1,
      //     resourceKey: 'repository',
      //   })
      //   .then((result: any) => {
      //     this.paginationObj.total = result.length;
      //     this.paginationObj.pageSize = 10;
      //     const allData = JSON.parse(JSON.stringify(result));
      //     // this.totalData = JSON.parse(JSON.stringify(result))
      //     this.totalData = allData.map((item: any, index: any) => {
      //       item.numbers = index + 1;
      //       return item;
      //     });
      //     // console.log(77777, this.totalData)

      //     if (this.totalData.length > 0) {
      //       this.tableData = this.getDetailContent(1, 10, this.totalData);
      //     }
      //     this.loadingState = false;
      //   });
    } else if (this.templateType === 2) {
      disasterJudgeServer.rescueTeamServer
        .getEquipmentByTeamId({
          id: this.infoid,
          pageSize: 10,
          pageNo: this.paginationObj.currentPage,
          resourceKey: 'equipment',
        })
        .then((res: any) => {
          //   console.log(4444, res)
          //   console.log(5555,this.infoid);
          this.paginationObj.total = res.data.data.total;
          this.paginationObj.pageSize = 10;
          const allDatas = JSON.parse(JSON.stringify(res)).data.data.list;
          this.tableData = allDatas.map((item: any, index: any) => {
            item.numbers =
              index +
              1 +
              this.paginationObj.pageSize *
                (this.paginationObj.currentPage - 1);
            item.name = item.equiptypename;
            item.value = item.equipnum || 0;
            return item;
          });
          this.loadingState = false;
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }
  @Watch('dataDeal')
  public getInfoid(val: any) {
    console.log(val);
    // this.infoid = val;
  }
  // 列表展开收起
  private FnMinimize() {
    this.minimize = !this.minimize;
  }
  // 进入处置 关闭弹窗
  private closeFunc() {
    const self: any = this;
    self.close();
  }
  private onPosChanged(positionDiff: any, absolutePosition: any, event: any) {
    if (event.target.closest('[draggable-state]')) {
      event.target.closest('[draggable-state]').style.position = 'absolute';
    }
  }
  // 分页数据
  private getDetailContent(num: any, pageSize: any, data: any) {
    const pagedata = [];
    // pageSize 每页条数
    // 设置开始
    const start = pageSize * num - pageSize;
    // 设置结束长度
    let end = pageSize * num;
    end = end > data.length ? data.length : end;
    for (let i = start; i < end; i++) {
      // 所有分页数据 data
      pagedata.push(data[i]);
    }
    // console.log(4444, pagedata)
    return pagedata;
  }

  // 分页点击
  private handleCurrentChange(val: number) {
    if (this.templateType === 1) {
      this.tableData = this.getDetailContent(val, 10, this.totalData);
    } else {
      this.paginationObj.currentPage = val;
      this.getDatas();
    }
  }
  // 数字过滤
  private filterNumFixed(key: any, label: any, list: any) {
    var resultVal: any = JSON.parse(JSON.stringify(list))[key];
    // 这里先把现在数据和元数据进行解地址引用，之后调用了removeSpace方法，这个原因不是很确定，原来的就调用了，于是我没有改动
    if (resultVal !== null && resultVal !== undefined) {
      resultVal = this.removeSpaces(resultVal + ''.trim());
      if (typeof resultVal === 'string') {
        resultVal = resultVal.trim() ? resultVal : '- -';
      }
    } else {
      resultVal = '- -';
    }

    /*const tempVal: any = JSON.parse(JSON.stringify(list))[key];
        if (tempVal !== null && tempVal !== undefined) {
          resultVal = this.removeSpaces(tempVal + ''.trim());
        }*/
    // 对数据进行两位小数保留，如果后期需要三位的话，就注释掉这里，在switch中写。
    // 同时，这里会有隐患，例如以数字开头的文字描述回被强制转换。如果真的有这个情况的话,还是在switch中使用，或者用正则吧
    const pattern = /^(\-|\+)?\d+(\.\d+)?$/;

    if (pattern.test(resultVal)) {
      // 判断是否为纯数字
      resultVal = Math.round(resultVal * 100) / 100;
    }
    // 处理所有电话号码的字段的空格
    switch (key) {
      case 'phone':
      case 'KSFZRBGSDH':
      case 'KSFZRYDDH':
      case 'ZYFZRBGDH':
      case 'ZYFZRYDDH':
      case 'CONCATEMOBTEL':
      case 'legalpersonphone':
      case 'controlphone':
      case 'telephone':
      case 'TEL':
      case 'DUTYTEL':
        if (list.hasOwnProperty(key)) {
          resultVal = list[key] ? list[key].trim() || '- -' : '- -';
        }
        // if (tempVal !== null && tempVal !== undefined) {
        //   resultVal = tempVal.trim();
        //   debugger
        // }
        break;
    }
    switch (label) {
      case '人口数量':
        // resultVal = Math.round(resultVal / 10000 * 100 ) / 100;
        break;
    }
    return resultVal;
  }

  private removeSpaces(val: any) {
    // tslint:disable-next-line:no-debugger
    // debugger;
    if (typeof val === 'string') {
      // const str = val.replace(/(^[\s\n\t]+|[\s\n\t\0]+$)/g, '');
      // console.log('str,val:' , str , val);
      return val.replace(/(^[\s\n\t]+|[\s\n\t\0]+$)/g, '');
    } else {
      return val;
    }
  }

  // private calcHeight() {
  // this.popHeight = $('.eventInfoPop.expert').innerHeight();
  // this.popHeight += 40;
  // }

  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any, name: any) {
    let telName = '';
    const list = Object.values(listObj);
    const objList = Object.keys(listObj);
    list.forEach((item: any, index: any) => {
      if (item === val) {
        const key: any = objList[index];
        const telKey = name[key];
        telName = listObj[telKey] || '';
      }
    });
    this.messsageBus.emit('showCallup', true, listObj, val, event, telName);
  }

  private mounted() {
    // tslint:disable-next-line:no-debugger
    const that: any = this;
    that.popUpType = that.type;
    if (that.popUpType === 'rescueteam') {
      that.repersityShow = false;
      this.messsageBus.emit('rescueTeamHomeData', that.data);
    }
    // console.log(999, that)

    this.name = that.data.name || '- -';
    this.infoid = that.data.id || '- -';
    this.getDatas();
    // console.log(that.isShowPathPlanningBtn);
    // console.log(that.isAroundAnalysisBtn);

    that.setGeomPoint(); // 设置当前点位经纬度给geoPoint
    /*  that.geometry = that.data && that.data.geometry ? that.data.geometry : [];
        that.coordinates = that.data && that.data.geom && that.data.geom.coordinates ? that.data.geom.coordinates : [];
        that.geoPoint = that.geometry ? [that.geometry.x, that.geometry.y] : [];
        that.geoPoint = that.coordinates ? that.coordinates : []; */
    if (that.styleObj) {
      that.styles = that.styleObj;
    }
    /*// 判断是否存在路径规划
    if (that.getPathTypeFilter(that.popUpType)) {
                that.isShowPathPlanning();
            }
    // 判断是否存在周边分析
    if (that.getAroundTypeFilter(that.popUpType)) {
                that.isShowAroundAnalysis();
            }*/
    // if (that.popUpType === 'NearbyDisasterPer※01') { // 从周边分析点出的灾情信息员的弹窗 用专家的ts文件
    //             that.popUpType = 'disinfoper';
    //         }
    if (dataDeal[that.popUpType]) {
      that.popHeight = dataDeal[that.popUpType].popHeight;
      that.templateName = dataDeal[that.popUpType].templateName;
      that.templateType = dataDeal[that.popUpType].templateType;
      that.listName = dataDeal[that.popUpType].listName;
      that.unitObj = dataDeal[that.popUpType].unitObj;
      that.dataFilter = dataDeal[that.popUpType].dataFilter;
      that.telPelope = dataDeal[that.popUpType].telPelope;
      that.labelObj = dataDeal[that.popUpType].labelObj;
      that.telobj = dataDeal[that.popUpType].telobj
        ? dataDeal[that.popUpType].telobj
        : that.telobj;
      // that.telobj = that.telobj.trim();

      that.btnFilter = dataDeal[that.popUpType].btnFilter
        ? dataDeal[that.popUpType].btnFilter
        : that.btnFilter;
      if (
        this.name !== '火点信息' &&
        that.btnFilter.indexOf('fireCreep') > 0
      ) {
        that.btnFilter.splice(
          that.btnFilter.findIndex((item: any) => item === 'fireCreep'),
          1,
        );
      }
      dataDeal[that.popUpType].cb(that);
    } else {
      if (
        that.data &&
        that.data.attributeSet &&
        that.data.attributeSet.attributes
      ) {
        that.dataAttributes = that.data.attributeSet.attributes;
        that.getData(that.dataAttributes);
      } else {
        that.getDatcba(that.data);
      }
    }
  }
}
</script>
<style lang="less" scoped>
@url: '../../../../assets/img/eventInfo';
@popdialog: '../../../../assets/img/popdialog';
@closebg: '../../../../assets/img/halfScreen/eventAndTopics';
@realtimeTeam: '../../../../assets/img/realtimeTeam';
.closeDetail {
  position: absolute;
  right: 15px;
  top: 5px;
  cursor: pointer;
  width: 75px;
  height: 30px;
  background: url('@{closebg}/eventAndTopics_close.png') no-repeat;
  background-size: cover;
  &:hover {
    background-image: url('@{closebg}/eventAndTopics_close_h.png');
  }
}
.title_container {
  line-height: 35px;
  text-align: left;
  white-space: nowrap;
  font-style: italic;
  padding-left: 20px;
  background: url('@{popdialog}/popdialog-title.png') no-repeat;
  background-size: 100% 65px;
  height: 65px;
  line-height: 65px;
}
.title_panel {
  font-weight: 600;
  font-family: 'myHeiti';
  font-size: calc(20px * 1.5);
  color: 00e4ff;
  background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  //   padding-right: 20px;
  height: 65px;
  line-height: 75px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.detailstitle {
  width: 99%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 23px;
  font-weight: 600;
  background-color: rgba(37, 77, 115, 0.7);
  color: #00ffff;
  margin-top: 15px;
}
.total_num {
  position: absolute;
  right: 45px;
  font-size: calc(20px * 1.1) !important;
  > i {
    font-size: calc(20px * 1.2) !important;
  }
}
.table_container {
  height: calc(100% - 80px);
}
.detail_container {
  height: calc(100% - 300px);
}
.thead {
  display: flex;
  justify-content: space-between;
  width: 97%;
  padding: 0 20px;
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  color: #67e1fb;
  font-size: 20px;
  font-weight: normal;
  background-color: rgba(0, 255, 255, 0.1);
}
table {
  width: 97%;
  height: 100%;
  text-align: center;
  background: url(../../../../assets/img/halfScreen/halflist/boxListBgIcon.png)
    50% 0 no-repeat;
  background-size: cover;
  tr {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    justify-content: space-between;
    th {
      color: #67e1fb;
      font-size: 20px;
      font-weight: normal;
      text-align: left;
    }
    td {
      text-align: left;
      color: #fff;
      font-size: 18px;
      flex: 1;
      &:nth-of-type(1) {
        margin-left: 28px;
      }
      cursor: default;
      &.tablename {
        text-align: center;
        margin-left: -28px;
        > span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      &.num {
        text-align: right;
        margin-right: 20px;
      }
    }
  }
}
.num_identify {
  color: #ffe51e;
  font-weight: 600;
  font-size: 20px;
  margin-right: 5px;
}
.tableLists {
  height: calc(100% - 80px);
  padding-left: 10px;
  padding-right: 7px;
  box-sizing: border-box;
}
.eventInfoPop {
  width: 560px;
  height: 400px;
  z-index: 4;
  cursor: default;
  color: #fff;
  //   background: url('@{popdialog}/businessImgBackBig.png') no-repeat;
  background-size: 100% 100%;
  padding: 4px;
  box-sizing: border-box;
  // 组件内样式调整
  .buttonListCon {
    padding-top: 16px;
  }
  &_title {
    &_close {
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 35px;
      background: url('@{closebg}/eventAndTopics_close.png') no-repeat 0 -3px;
      background-size: 100% 100%;
    }
    // &_txt {
    //   text-overflow: ellipsis;
    //   overflow: hidden;
    //   height: 55px;
    //   line-height: 55px;
    //   padding-left: 16px;
    // }
  }
  &_content {
    background: url('@{popdialog}/businessImgBackContent.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    padding: 0 10px;
    height: calc(100% - 70px);
    ul {
      position: relative;
      padding-bottom: 50px;
      box-sizing: border-box;
      padding: 12px 10px;
      height: 260px;
      li {
        font-size: 28px;
        padding: 2px;
        cursor: default;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        > span:first-child {
          color: #0edbe4;
          line-height: 50px;
          width: 140px;
          margin-right: 20px;
        }
        .callPhoneCur {
          cursor: pointer;
          margin-left: 5px;
        }
      }
      li:nth-child(2n-1) {
        background: url('@{popdialog}/list_nowNew.png') no-repeat;
        background-size: 100% 100%;
      }
      li.popBtn {
        background: none;
        position: absolute;
        bottom: 36px;
        right: 0;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
.page {
  margin-top: 8px;
}

.rescueTeamsHome_chart {
  margin-top: 30px;
  height: 100%;
  width: 100%;
  .listDistrict_title {
    position: relative;
    color: #67e1fb;
    letter-spacing: 1px;
    font-weight: normal;
    line-height: 60px;
    display: flex;
    padding: 0 10px;
    &:after {
      content: '';
      background: url(../../../../assets/img/halfScreen/halflist/titlexian.png)
        50% 0 no-repeat;
      position: absolute;
      width: 100%;
      height: 23px;
      top: 50px;
      left: 0;
    }
    .panel_switch {
      width: 34px;
      height: 29px;
      background-size: 100% 100%;
      position: absolute;
      right: 5px;
      top: 15px;
      cursor: pointer;
      background: url('../../../../assets/img/halfScreen/halflist/open.png') 50%
        50% no-repeat;
      transition: transform 0.3s;
    }
    .panel_switch.panel-switch-reverse {
      transform: scale(1, -1);
    }
  }
  .nodata {
    width: 100%;
    height: 200px;
    margin-top: 60px;
    background: url(../../../../assets/img/default/panel/noData.png) 55% 50%
      no-repeat;
  }
}
.multiLineTextWrapPopUp {
  display: flex;
  align-items: center;
  > span:nth-of-type(1) {
    flex: none;
  }
  .unit {
    color: #fff;
  }
  //   > span:nth-of-type(2) {
  //     display: flow-root;
  //     width: 80%;
  //   }
  .loading {
    color: #fff;
    background: url(../../../../assets/img/halfScreen/halflist/loading.gif)
      no-repeat 33px 255px;
    color: #d2e1ec;
    height: 100%;
  }
}
</style>
<style lang="less">
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
.expert {
  .popBtn {
    .infoManagementBtn {
      background: none !important;
      display: block;
      float: right;
      width: 118px !important;
      height: 40px !important;
      border: solid 1px #02e9d5;
      color: white !important;
      padding: 0 5px;
      margin: 10px 1px 1px 10px;
      line-height: 40px !important;
      cursor: pointer;
      background: transparent;
    }
  }
}
</style>
