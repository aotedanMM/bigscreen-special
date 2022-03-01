<template>
  <div class="newDetailsProtrusion" v-show="isShowMaterial">
    <div class="newDetailsProtrusion_title-panel">
        物资库详情
    </div>
    <span class="newDetailsProtrusion-header-closebtn detail-container-close" @click="MaterialClose" ></span>
    <div class="newDetailsProtrusion-baseinfo-content">
      <div class="newDetailsProtrusion_title">
            <span>{{ name }}</span>
        </div>
      <el-scrollbar class="newDetailsProtrusion-baseinfo-content-top">
      <div class="scrollbarInnerContainer">
        <p><span class="staticfont">管理机构：</span><span class="TeamLeix" :title="orgname">{{ orgname }}</span></p>
        <p>
          <span class="staticfont">类型：</span>
          <span class="">{{ materialtype }}</span>
          <span style="color: #92edf6;margin-left:30px">级别：</span>
          <span class="">{{ materiallevel }}</span>
        </p>
        <p>
          <span class="staticfont">联系人：</span>
          <span style="display: inline-block; max-width: 300px">
            <span class="CaptainName">{{ materialleader }}</span>
            <span style="margin-left: 5px;vertical-align: middle;" >{{callnumber}}</span>
            <b v-show="callnumber" class="callphonebgimg" :title="callnumber" @click="handleClickCallup(callnumber,callnumber,$event)"></b>
            <span style="margin-left: 5px;" v-show="worktel">
              <span class="currentLocation">{{ worktel }}</span>
              <b class="callphonebgimg" :title="worktel" @click="handleClickCallup(worktel,worktel,$event)"></b>
            </span>
          </span>
        </p>
        <!-- <p><span class="staticfont">办公电话：</span><span class="currentLocation">{{ worktel || '暂无数据' }}</span><b v-show="worktel" class="callphonebgimg" :title="worktel" @click="handleClickCallup(worktel,worktel,$event)"></b></p> -->
        <p><span class="staticfont">地址：</span><span class="currentLocation">{{ materialAddress }}</span></p>
        <p><span class="staticfont">距离事发地：</span><span class="currentLocation">{{ materiallehappened + 'km' }}</span></p>
        <p class="PathPlanning_btn_roadlan" @click="roadPlaning"></p>
        <div class="newDetailsProtrusion-baseinfo-content-bottom">
          <div class="newDetailsProtrusion-baseinfo-content-bottom-top xiedaizbbg">
              物资信息 <span class="list_lens_cont">{{materialDataList.length}}</span>
              <span :class="{list_lens_btn:isShowmaterialDataList,list_lens_btnopen:!isShowmaterialDataList}" v-show="materialDataList.length" @click="cutshowimpotantData"></span>
          </div>
          <div class="newDetailsProtrusion-baseinfo-content-bottom-bottom" v-show="!isShowmaterialDataList">
              <div class="newDetailsProtrusion-baseinfo-content-bottom-bottom-title">
                  <div>序号</div>
                  <div>物资名称</div>
                  <div>数量</div>
              </div>
              <div class="newDetailsProtrusion-baseinfo-content-bottom-bottom-list">
                <li  class="list_" v-for="(item,index) in materialSliceDataList" :key="index"><div class="list_icon"><span>{{(currentPage - 1) * pageSize + index + 1}}</span></div><div class="equiomentname" :title="item.name">{{item.name}}</div><div class="list_mun_Company"><span>{{item.value}}</span>{{item.unit}}</div></li>
              </div>
          </div>
        </div>
      </div>  
      </el-scrollbar>
    </div>
    <div class="newDetailsProtrusion-footer">
        <div class="newDetailsProtrusion-footer-pagenations" v-show="isShowPagenation">
          <el-pagination
            small
            :pager-count="5"
            class="constomMyElPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size ="pageSize"
            layout="prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { realtimeTeam, rescueTeamServer} from '@/api/installServer';
import moment from 'moment';
import popDataDeal from './dataDeal/popDataDeal';
import MapCommon from '@/util/MapCommon';

@Component({
  name: 'MaterialPopup',
  mixins: [ popDataDeal, MapCommon ],

})
export default class MaterialPopup extends Vue {
  private name: string = ''; // 物资库名字
  private orgname: string = '';  // 管理机构
  private materialtype: string = '';  // 物资的类型
  private materiallevel: number = 0; // 物资的级别
  private materialleader: string = ''; // 联系人
  private worktel: string = ''; // 办公电话
  private callnumber: number = 0; // 电话号码
  private materialAddress: string = ''; // 地址
  private materiallehappened: string = ''; // 距离事发地
  private pageSize: number = 4;  // 条数
  private currentPage: number = 1;  //  页码
  private total: number = 0;  // 总页数
  private isShowPagenation: boolean = false;  // 是否显示分页 容器
  private materialDataList: any[] = [];  // 物资信息数据
  private materialSliceDataList: any[] = []; // 切割的物资数据
  private isShowMaterial: boolean = true; // 物资库详情窗开关
  private isShowmaterialDataList: boolean = false;  // 是否显示主要列表
  private historyOrbit: any[] = [];  // 历史轨迹数据
  private materialId: string = '';  // 物资的id

  // 物资列表显示
private cutshowimpotantData() {
  this.isShowmaterialDataList = !this.isShowmaterialDataList;
}

  /**
   * gis传入数据data
   * @data 基本数据的参数
   *
  */
  private getrealtimeTeambaseInfo(data: any) {
    this.name =  data.name || '暂无数据';
    this.orgname = data.SOURCEDEPT || '暂无数据';
    this.materialtype = data.REPERTORYTYPENAME || '暂无数据';
    this.materiallevel = data.LEVELNAME || '暂无数据';
    this.materialleader = data.CONCATEPER || '暂无数据';
    this.callnumber = data.CONCATEMOBTEL ;
    this.worktel = data.TEL;
    this.materialAddress = data.address || '暂无数据';
    this.materialId = data._id;
    this.materialDataList = data.materials;
    this.materiallehappened = data._distance || 0;
    this.materialSliceDataList = this.materialDataList.slice(
      (this.currentPage - 1) * this.pageSize,
      this.pageSize * this.currentPage,
    );
    this.total = data.materials.length;
    if (this.materialDataList.length > 4) {
      this.isShowPagenation = true;
    }
  }

  // 点击页码
  private handleCurrentChange(val: number) {
    this.materialSliceDataList = this.materialDataList.slice(
      (this.currentPage - 1) * this.pageSize,
      this.pageSize * this.currentPage,
    );
  }


  private handleSizeChange(val: number) {
    console.log(val);
  }

 // 打电话
  private handleClickCallup(listObj: any, val: any, event: any) {
    this.messsageBus.emit('showCallup', true, listObj, val, event);
  }
    /**
   * 路径规划
   *
  */
  private roadPlaning(param: any) {
    const self: any = this;
    /**
     * 点击路径规划隐藏当前详情窗,
     * 当点击路径规划的返回时重新展示此弹窗
     * */
    self.isShowMaterial = false;
    /**
     * 路径规划关闭的时候显示弹窗  接收监听
     * */
    self.messsageBus.off('showTeamInfo');
    self.messsageBus.on('showTeamInfo', (val: boolean) => {
      self.isShowMaterial = val;
    });
    self.pathClick();
  }

  // 关闭弹窗
  private MaterialClose() {
    const self = this;
    self.close();
  }

  /**
   * 页面初始加载 获取数据
   *
  */
  private mounted() {
    const self: any = this;
    self.getrealtimeTeambaseInfo(self.data);
    self.setGeomPoint();
  }
}
</script>
<style lang="less" scoped>
 @import url('../../../../assets/css/popUp/RealteamAndMareria.less');
 .CaptainName {
   margin: 0;
 }

 .scrollbarInnerContainer{
   height: 100%;
   width: 100%;
   box-sizing: border-box;
   padding-right: 6px;
 }
 
</style>
