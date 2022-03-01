<template>
  <div class="newDetailsProtrusion" v-show="isShowTeamInfo">
    <div class="newDetailsProtrusion-header">
        <span class="newDetailsProtrusion-header-title title-title-title">{{ teamname }}</span>
        <span class="newDetailsProtrusion-header-closebtn detail-container-close" @click="realtimeTeamClose"></span>
    </div>
    <div class="newDetailsProtrusion-selectbtn">
        <p class="baseinfobtn" :class="{'infobgnewDetailsProtrusion':isActive}" @click="BaseInfohandle">基本信息</p>
        <p class="huichuaninfobtn" v-show="banckinfobtn" :class="{'infobgnewDetailsProtrusion':!isActive}" @click="banckMessagehandle(firstSourceAddr)">回传信息<span :class="{'reddotted': isreddotted}"></span></p>
    </div>
    <div class="newDetailsProtrusion-baseinfo-content" v-show="isActive">
      <el-scrollbar class="newDetailsProtrusion-baseinfo-content-top">
        <p><span class="staticfont">队伍名称：</span><span class="TeamName">{{ teamname }}</span></p>
        <div class="newDetailsProtrusion-dataprow"><p><span class="staticfont">类型：</span><span class="TeamLeix" :title="teamtype">{{ teamtype }}</span></p><p><span class="staticfont">总人数(人)：</span><span class="NumberTroops">{{ teamcount }}</span></p></div>
        <p><span class="staticfont">队长：</span><span class="CaptainName">{{ teamleader }}</span><b class="callphonebgimg" :title="callnumber"></b></p>
        <p><span class="staticfont">当前位置：</span><span class="currentLocation">{{ teamcurrentAddress }}</span></p>
        <p><span class="staticfont">历史轨迹：</span><b class="causebg" :class="{'playset':isPlay}" @click="historybtn" v-show="isbtn"></b><b class="stopset" @click="stophistory" v-show="isbtn"></b><span class="teamtimebox">{{teamtimebox}}</span></p>
        <div class="progress-bar-out" style="margin: 15px"></div>
      </el-scrollbar>
        <div class="newDetailsProtrusion-baseinfo-content-bottom">
            <div class="newDetailsProtrusion-baseinfo-content-bottom-top">
                <p class="tongxunzbbg zhuangbeihover">通讯装备</p>
                <p class="xiedaizbbg">携带装备</p>
            </div>
            <div class="newDetailsProtrusion-baseinfo-content-bottom-bottom">
                <div class="newDetailsProtrusion-baseinfo-content-bottom-bottom-title">
                    <p>序号</p>
                    <p>设备类型</p>
                    <p>持有人</p>
                </div>
                <el-scrollbar class="newDetailsProtrusion-baseinfo-content-bottom-bottom-list">
                  <li v-show="equipmentSliceList.length > 0" class="list_" v-for="(item,index) in equipmentSliceList" :key="index" @click="equipmentLi(item)"><p>{{(currentPage - 1) * pageSize + index + 1}}</p><p class="equiomentname">北斗终端<span :class="{'reddotted': item.notReadCount > 0 ? true : false}"></span></p><p>{{item.pername}}</p></li>
                  <p style="color: #00f8fe;" v-show="equipmentSliceList.length <= 0">暂无数据</p>
                </el-scrollbar>
            </div>
        </div>
    </div>
    <div class="newDetailsProtrusion-huichuaninfo-content" v-show="!isActive">
        <div class="infoshuleftline" v-show="backMessageList.length > 0"></div>
        <el-scrollbar class="huichuaninfo-contentbox" v-show="backMessageList.length > 0">
          <div class="newDetailsProtrusion-huichuaninfo-content-datali" 
            v-for="(item, key) in backMessageList" 
            :key="key"
          >
            <p class="">
              <span class="dottedbgicon"></span>
              <span class="duanbaowenbg"></span>
              <span class="huichuandatatime">{{item.sendTime}}</span>
            </p>
            <div class="paddingleftbg">
              <span class="staticfont">发报内容:</span>
              <p class="huichuancontent-box">{{item.content}}</p>
            </div>
            <div class="paddingleftbg">
              <span class="staticfont">发报位置:</span>
              <p class="huichuancontent-box">{{item.address}}',经度:'{{item.longitude}}',纬度:'{{item.latitude}}</p>
            </div>
          </div>
            <!--<p class="historylinebg"></p>-->
            <!--视频回传(以后会有视频回传的内容)-->
            <!--<div class="newDetailsProtrusion-huichuaninfo-content-datali">-->
                <!--<p><span class="dottedbgicon"></span><span class="videohuichuanbg"></span><span class="huichuandatatime"></span></p>-->
                <!--<div class="paddingleftbg"><span class="staticfont">标题:</span><p class="huichuancontent-box"></p></div>-->
                <!--<div class="paddingleftbg"><span class="staticfont">内容:</span><p class="huichuancontent-box"></p></div>-->
            <!--</div>-->
        </el-scrollbar>
        <div class="nocontentbox" v-show="backMessageList.length <= 0"></div>
    </div>
    <div class="newDetailsProtrusion-footer">
        <div class="newDetailsProtrusion-footer-pagenations" v-show="isShowPagenation">
          <el-pagination
            class="constomMyElPage"
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size ="pageSize"
            layout="prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <div class="newDetailsProtrusion-footer-pagenationshuichuaninfo">
        </div>
        <div class="roadguihua" @click="roadPlaning">

        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { realtimeTeam } from '@/api/installServer';
import moment from 'moment';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import popDataDeal from './dataDeal/popDataDeal';
import MapCommon from '@/util/MapCommon';

@Component({
  name: 'RealtimeTeam',
  mixins: [ popDataDeal, MapCommon ],

})
export default class RealtimeTeam extends Vue {
  private backMessageTimer: any = null;
  private teamname: string = '';  // 队伍的名称
  private teamtype: string = '';  // 队伍的类型
  private teamcount: number = 0; // 队伍的人数
  private teamleader: string = ''; // 队长
  private teamcurrentAddress: string = ''; // 当前位置
  private callnumber: number = 0; // 电话号码
  private equipmentList: any[] = [];  // 装备列表数据
  private backMessageList: any[] = []; // 回传信息
  private historyOrbit: any[] = [];  // 历史轨迹数据
  private pageSize: number = 0;  // 条数
  private currentPage: number = 1;  //  页码
  private total: number = 0;  // 总页数
  private isActive: boolean = true;  // 切换的内容隐藏显示 标识
  private isPlay: boolean = false;
  private equipmentSliceList: any = [];
  private isShowPagenation: boolean = false;
  private IsprevPagination: boolean = true;  // true  为前端分页  false  为后端分页
  private isreddotted: boolean = false;  // 是否显示红点
  private teamtimebox: string = '';  // 历史轨迹时间
  private isbtn: boolean = false;  // 是否显示历史轨迹的播放 暂停按钮
  private firstSourceAddr: string = '';
  private banckinfobtn: boolean = true; // 回传信息的按钮
  private historyTrack: boolean = false; // 历史轨迹加载
  private isShowTeamInfo: boolean = true; // 点击路径规划隐藏详情窗开关
  /**
   * 监听分页插件 是否显示
   *
  */
    private watchIsshowPagination() {
        if (this.equipmentList.length > 0 && this.isActive === true) {
            this.isShowPagenation = true;
            this.total = this.equipmentList.length;
            this.pageSize = 4;
        }
        if (this.backMessageList.length >= 0 && this.isActive === false && this.backMessageList.length <= 20) {
            this.isShowPagenation = false;
            if (this.backMessageList.length > 20 ) {
                this.isShowPagenation = true;
                this.total = this.backMessageList.length;
                this.pageSize = 20;
            }
        }
    }


  /**
   * 装备列表的 行点击事件
   * @souceAddr 设备的souceAddr
   *
  */
    private equipmentLi(item: any) {
        this.getbackMessageInfo(item.souceAddr);
        this.isActive = false;
        this.updateMessageStatus(item.souceAddr);
        // this.clearIntervalFn();
        // this.setIntervalFn(item.souceAddr);
    }

  /**
   * 计时器
   * setIntervalFn 开始
   * clearIntervalFn 结束
   *
   */
 /* private setIntervalFn(data: any): void {
    this.backMessageTimer = setInterval(() => {
      this.getbackMessageInfo(data);
    }, 10000);
  }

  private clearIntervalFn(): void {
    clearInterval(this.backMessageTimer);
  }*/

  /**
     * 基本信息点击
     * @souceAddr 设备的souceAddr
     * 当this.isActive为true，基本信息高亮；为false，回传信息高亮
     *
     *
    */
   private BaseInfohandle() {
     const self: any = this;
     self.isActive = true;
     self.IsprevPagination = true;
      // this.clearIntervalFn();
     self.getEquipmemtList(self.data.id);
   }

   /**
    * 回传信息点击
    */

   private banckMessagehandle(firstSourceAddr: any) {
        this.isActive = false;
        this.IsprevPagination = false;
        this.updateMessageStatus(firstSourceAddr);
        this.getbackMessageInfo(firstSourceAddr);
        // this.clearIntervalFn();
        // this.setIntervalFn(firstSourceAddr);
   }



   /**
     *
     * 获取地图功能
     *
    */

   private getMapFunc() {
       let component = null;
       const factory = this.$ioc.resolve('GISFactory-map');
       if (factory) {
             component = factory.rescueHelpFactory.getComponent('rescueTeamInfo');
        }
       return component;

   }


    private getTrackComponent(): void {
      let component = null;
      const factory = this.$ioc.resolve('GISFactory-map');
      if (factory) {
        component = factory.commonFactory.getComponent('historyTrack');
      }
      return component;
    }


   /**
     *
     *  暂停 播放按钮事件
     *
    */
   private historybtn() {
     const self: any = this;
     const trackComponent: any = self.getTrackComponent();
     if (!self.historyTrack) {
       // 播放加载
       trackComponent.load(self.historyOrbit , null, 'reportTime');
       self.historyTrack = true;
     }
     self.isPlay = !self.isPlay;
        // 播放
     if (self.isPlay) {
          trackComponent.play(self.historyOrbit);
          // trackComponent.off('finish');
          trackComponent.on('finish', (data: any) => {
              self.isPlay = false;
          });
        } else { // 暂停
          trackComponent.pause();
        }
   }

   /**
     *
     *  停止播放按钮
     *
    */
   private stophistory() {
       this.isPlay = false;
       const self: any = this;
       const trackComponent: any = self.getTrackComponent();
       self.historyTrack = false;
       trackComponent.finish();

   }



  /**
   * gis传入数据data
   * @data 基本数据的参数
   *
  */
  private getrealtimeTeambaseInfo(data: any) {
      this.teamname = data.name || '暂无数据';
      this.teamtype = data.type || '暂无数据';
      this.teamcount = data.peoplenum || '暂无数据';
      this.teamleader = data.captain || '暂无数据';
      this.callnumber = data.phone || '暂无数据';
      this.teamcurrentAddress = data.address || '暂无数据';
  }

   /**
   * 根据设备类型 获取装备列表
   * @teamid 队伍的id
   *
  */
  private getEquipmemtList(id: string) {
      const self = this;
      const obj = {
          teamIdArray: [ id ],
      };
      realtimeTeam.getEquipmentListServer(obj).then((res: any) => {
        if (res.code === 0 && res.data.length > 0) {
            self.equipmentList = res.data;

            let noread: number = 0;
            self.equipmentList.forEach((item: any) => {
                noread += item.notReadCount;
            });
            if (noread > 0) {
                self.isreddotted = true;
            } else {
                self.isreddotted = false;
            }
            self.watchIsshowPagination();
            self.equipmentSliceList = self.equipmentList.slice(
            (self.currentPage - 1) * self.pageSize,
            self.pageSize * self.currentPage,
            );
            self.firstSourceAddr = res.data[0].souceAddr;
            self.banckinfobtn = true;
            // 历史轨迹
            self.getHistoryOrbitList(res.data[0].souceAddr);
            // 回传信息
            self.getbackMessageInfo(res.data[0].souceAddr);
          } else {
            self.equipmentList = [];
            self.equipmentSliceList = [];
            self.watchIsshowPagination();
            self.banckinfobtn = false;
            self.isreddotted = false;
            self.teamtimebox = '暂无历史轨迹';
            self.backMessageTimer = null;
          }
        }).catch((err: any) => {
            self.equipmentList = [];
            self.equipmentSliceList = [];
            self.watchIsshowPagination();
            self.banckinfobtn = false;
            self.isreddotted = false;
         });
  }

 /**
   * 根据设备类型 获取回传信息
   * @souceAddr 基本数据的参数
   *
  */
  private getbackMessageInfo(souceAddr: string) {
    // console.log('根据设备类型 获取回传信息');
      const self = this;
      const obj = {
            nowPage: 1,
            pageSize: 20,
            startTime: this.$moment(this.$moment().valueOf('x') - 86400000).format('YYYY-MM-DD HH:mm:ss').toString(),
            endTime: this.$moment(this.$moment().valueOf('x')).format('YYYY-MM-DD HH:mm:ss').toString(),
            souceAddr,
      };
      realtimeTeam.getreturnMesssageServer(obj).then((res: any) => {
          if (res.code === 0 && res.data.total > 0) {
            self.backMessageList =  res.data.list;
            self.watchIsshowPagination();  // 是否显示分页
          } else {
              self.backMessageList = [];
              self.watchIsshowPagination();  // 是否显示分页
          }
      }).catch((err: any) => {
         self.backMessageList = [];
         self.watchIsshowPagination();  // 是否显示分页
      });
  }

   /**
   * 根据设备类型 获取历史轨迹
   * @type:1,
   * @souceAddr:data,
   * @startTime:lastDay.format('yyyy-MM-dd hh:mm:ss'),
   * @endTime:today.format('yyyy-MM-dd hh:mm:ss')
  */
    private getHistoryOrbitList(souceAddr: string) {
        const objdata = {
            type: '1',
            souceAddr,
            startTime: this.$moment(this.$moment().valueOf('x') - 2592000000).format('YYYY-MM-DD HH:mm:ss'), //  一个月
            endTime: this.$moment(this.$moment().valueOf('x')).format('YYYY-MM-DD HH:mm:ss'),
        };
        realtimeTeam.getEquipmentHistoryServer(objdata).then((res: any) => {
            if (res.code === 0 && res.data.length > 0) {
                this.historyOrbit = res.data;
                this.teamtimebox = this.timegeshi(res.data);
                this.isbtn = true;
            } else {
                this.historyOrbit = [];
                this.teamtimebox = '暂无历史轨迹';
                this.isbtn = false;
            }
        }).catch((err: any) => {
            this.historyOrbit = [];
            this.teamtimebox = '暂无历史轨迹';
            this.isbtn = false;
        });
    }

  private handleCurrentChange(val: number) {
    // 前端分页
    if (this.IsprevPagination) {
      this.frentPag();
    } else {
      // 后端分页
      this.backPag(val);
    }
  }

  /**
   * 前端分页处理
  */

  private frentPag() {
    this.total = this.equipmentList.length;
    this.equipmentSliceList = this.equipmentList.slice(
      (this.currentPage - 1) * this.pageSize,
      this.pageSize * this.currentPage,
    );

  }

  /**
   * 后端分页处理
  */
  private backPag(val: number) {
    // 后端分页处理，直接调用某一个接口
    const self = this;
    const obj = {
            nowPage: val,
            pageSize: 20,
            startTime: this.$moment(this.$moment().valueOf('x') - 86400000000).format('YYYY-MM-DD HH:mm:ss').toString(),
            endTime: this.$moment(this.$moment().valueOf('x')).format('YYYY-MM-DD HH:mm:ss').toString(),
            souceAddr: this.firstSourceAddr,
      };
    realtimeTeam.getreturnMesssageServer(obj).then((res: any) => {
          if (res.code === 0 && res.data.total > 0) {
            self.backMessageList =  res.data.list;
            self.watchIsshowPagination();  // 是否显示分页
          } else {
              self.backMessageList = [];
              self.watchIsshowPagination();  // 是否显示分页
          }
      }).catch((err: any) => {
         self.backMessageList = [];
         self.watchIsshowPagination();  // 是否显示分页
      });

  }

  private handleSizeChange(val: number) {
    console.log(val);
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
     * 路径规划关闭的时候显示弹窗  接收监听
     * */
    self.isShowTeamInfo = false;
    self.messsageBus.off('showTeamInfo');
    self.messsageBus.on('showTeamInfo', (val: boolean) => {
      self.isShowTeamInfo = val;
    });
    self.pathClick({realTeamName: self.data.name});
  }

   /**
   * 关闭实时队伍弹窗
   *
  */
  private realtimeTeamClose(item: any) {
    const self: any = this;
     // this.clearIntervalFn();
    self.close();
  }


  /**
   * 时间格式
   *
  */
  private timegeshi(arr: any) {
        let str = '';
        let zuotian = arr[0].reportTime.split(' ')[0];
        let zuotianhou = arr[0].reportTime.split(' ')[1];
        zuotianhou = zuotianhou.substr(0, 5);
        zuotian = zuotian.split('-')[1] + '/' + zuotian.split('-')[2];
        let jintian = arr[arr.length - 1].reportTime.split(' ')[0];
        let jintianhou = arr[arr.length - 1].reportTime.split(' ')[1];
        jintianhou = jintianhou.substr(0, 5);
        jintian = jintian.split('-')[1] + '/' + jintian.split('-')[2];
        return str = zuotian + ' ' + zuotianhou + ' - ' + jintian + ' ' + jintianhou ;
    }


  /**
   * 回传信息的更新状态
   *
  */

  private updateMessageStatus(souceAddr: string) {
      const obj = {
          souceAddr,
      };
      realtimeTeam.getUpdataReiceveServer(obj).then((res: any) => {
        if (res.code === 0) {
            this.getEquipmemtList(this.data.id);  // 刷新装备列表  红点会取消
            this.isreddotted = false;  // 回传信息 按钮 红点取消
        }
      }).catch((err: any) => {
          console.log(err);
      });
  }



  /**
   * 页面初始加载 获取数据
   *
  */
  private mounted() {
    const self: any = this;
    self.backMessageTimer = null;
    self.getEquipmemtList(self.data.id);
    self.getrealtimeTeambaseInfo(self.data);
    self.popUpType = self.type;
    self.setGeomPoint(); // 设置当前点位经纬度给geoPoint
    /*this.messsageBus.on('closeRealtimeTeamSetInterval',() => {
      self.clearIntervalFn();
      const component = self.getComponent();
      component.unload();
    });*/
  }

 /* private destroyed(): void {
    const self: any = this;
    const trackComponent: any = self.getTrackComponent();
    self.messsageBus.off('showTeamInfo');
    trackComponent.off('finish');
  }
*/

}
</script>
<style lang="less" scoped>
@realtimeTeam: '../../../../assets/img/realtimeTeam';
  .newDetailsProtrusion{
    position: absolute;
    width: 505px;
    height: 902px;
    background: url("@{realtimeTeam}/newDetailsProtrusion.png") no-repeat;
    background-size: 100% 100%;
    font-size: 20px;
    color: #fff;
    padding: 0 15px 0 8px;
    // margin-top:-20px;
}
.newDetailsProtrusion-header{
    position: relative;
    width: 100%;
    height: 80px;
}
.newDetailsProtrusion-header-title{
    display: inline-block;
    width: 380px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 30px;
    font-family: MicrosoftYaHei;
    font-size: 28px;
    font-weight: bold;
    font-stretch: normal;
    line-height: 30px;
    letter-spacing: 1px;
    color: #ffde00;
    margin-top: 20px;
    margin-left: 36px;
}
.newDetailsProtrusion-header-closebtn{
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    right: 17px;
    top: 18px;
    opacity: 0;
    cursor: pointer;
}
.newDetailsProtrusion-selectbtn{
    width: 100%;
    height: 50px;
    display: flex;
    padding-left: 20px;
}
.newDetailsProtrusion-selectbtn p{
  margin: 0px;
}
.newDetailsProtrusion-selectbtn p:nth-of-type(1){
  margin-right: 10px;
}
.baseinfobtn{
    width: 148px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    background: url("@{realtimeTeam}/selecttitlebg.png") no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
}
.huichuaninfobtn{
    position: relative;
    width: 148px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    background: url("@{realtimeTeam}/selecttitlebg.png") no-repeat;
    background-size: 100% 100%;
    margin-left: 10px;
    cursor: pointer;
}
.infobgnewDetailsProtrusion{
    background: url("@{realtimeTeam}/infobgnewDetailsProtrusion.png") no-repeat;
    background-size: 100% 100%;
}
.newDetailsProtrusion-baseinfo-content{
    width: 100%;
    height: 820px;
}

.newDetailsProtrusion-baseinfo-content-top{
    width: 100%;
    height:692px;
    overflow: hidden;
    overflow-y: auto;
}
.newDetailsProtrusion-baseinfo-content-top p{
    width: 100%;
    line-height: 50px;
    font-size: 24px;
    padding-left: 5px;
    overflow: hidden;
    margin: 0;
}
.newDetailsProtrusion-dataprow{
    width: 100%;
    display: flex;
    font-size: 24px;
    line-height: 50px;
}

.newDetailsProtrusion-baseinfo-content-top p:nth-child(odd){
    background: url("@{realtimeTeam}/poddbgteambg.png") no-repeat;
    background-size: 100% 100%;
}
.newDetailsProtrusion-baseinfo-content-top .newDetailsProtrusion-dataprow p{
    flex: 1;
    margin: 0;
    background: none;
}
.newDetailsProtrusion-baseinfo-content-bottom-top{
    width: 100%;
    height: 40px;
    display: flex;
}
.newDetailsProtrusion-baseinfo-content-bottom-top p{
  margin: 0px;
}
.tongxunzbbg{
    width: 178px;
    height: 40px;
    background: url("@{realtimeTeam}/xiedaizbbg.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
}
.xiedaizbbg{
    width: 178px;
    height: 40px;
    color: #9ca0aa;
    background: url("@{realtimeTeam}/xiedaizbbg.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
}
.zhuangbeihover{
    background: url("@{realtimeTeam}/zhuangbeibg.png") no-repeat;
    background-size: 100% 100%;
    color: #00f8fe;
}
.newDetailsProtrusion-baseinfo-content-bottom{
    width: 100%;
    height: 270px;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom{
    width: 100%;
    height: 88%;
    background: rgba(26,73,108,1);
    overflow: hidden;
    text-align: center;
    line-height: 50px;
    border: 2px solid #286d9e;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-title{
    width: 100%;
    height: 50px;
    display: flex;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-title p{
    // flex: 1;
    text-align: center;
    color: #00f8fe;
    margin: 0;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-title p:nth-child(1){
  width: 20%;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-title p:nth-child(2){
  width: 40%;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-title p:nth-child(3){
  width: 40%;
}

.newDetailsProtrusion-baseinfo-content-bottom-bottom-list{
    width: 100%;
    height: 80%;
    overflow: hidden;
    overflow-y: auto;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-list li{
    width: 100%;
    display: flex;
    cursor: pointer;
    margin: 0
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-list li p{
    // flex: 1;
    text-align: center;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-list li p:nth-child(1){
  width: 20%;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-list li p:nth-child(2){
  width: 40%;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-list li p:nth-child(3){
  width: 40%;
}
.newDetailsProtrusion-baseinfo-content-bottom-bottom-list li:nth-child(odd){
    width: 100%;
    height: 44px;
    background: rgba(33,47,84,1);
    cursor: pointer;
}
.newDetailsProtrusion-huichuaninfo-content{
    width: 100%;
    height: 610px;
    overflow: hidden;
    overflow-y: auto;
}
.newDetailsProtrusion-footer{
    width: 100%;
    // height: 50px;
    display: flex;
    margin-top: 18px;
    position: relative;
}
.newDetailsProtrusion-footer-pagenations{
    // width: 65%;
    height: 100%;
    // margin-left: 6%;
    margin-top: 5px;
}
.newDetailsProtrusion-footer-pagenationshuichuaninfo{
    width: 65%;
    height: 100%;
    margin-left: 6%;
    margin-top: 5px;
    display: none;
}
.roadguihua{
    position: absolute;
    right: 5px;
    width: 118px;
    height: 40px;
    background: url("@{realtimeTeam}/roadguihuabg.png") no-repeat;
    background-size: 100% 100%;
    margin-left: 3%;
    cursor: pointer;
}
.stopset{
    display: inline-block;
    width: 41px;
    height: 40px;
    background: url("@{realtimeTeam}/stopbg.png") no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    vertical-align: middle;
}
.causeteambg{
    display: inline-block;
    width: 41px;
    height: 40px;
    background: url("@{realtimeTeam}/causeteambg.png") no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
    cursor: pointer;
}
.causebg{
    display: inline-block;
    width: 41px;
    height: 40px;
    background: url("@{realtimeTeam}/carplaybg.png") no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    vertical-align: middle;
    margin-left: 5px;
}
b.playset{
    display: inline-block;
    width: 41px;
    height: 40px;
    background: url("@{realtimeTeam}/causebg.png") no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
    margin-left: 5px;
    cursor: pointer;
}
.callphonebgimg{
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url("@{realtimeTeam}/callphometeambg.png") no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
    margin-left: 20px;
    cursor: pointer;
}
.historylinebg{
    width: 453px;
    height: 40px;
    background: url("@{realtimeTeam}/historylinebg.png") no-repeat;
    background-size: 100% 100%;
}
.infoshuleftline{
    position: absolute;
    left: 28px;
    top: 140px;
    width: 2px;
    height: 595px;
    background: url("@{realtimeTeam}/shutiaobgimg.png") no-repeat;
    background-size: 100% 100%;
}
.huichuaninfo-contentbox{
    position: relative;
    width: 100%;
    height: 100%;
}
.dottedbgicon{
    display: inline-block;
    width: 40px;
    height: 36px;
    background: url("@{realtimeTeam}/teandottedbg.png") no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
}
.duanbaowenbg{
    display: inline-block;
    width: 187px;
    height: 38px;
    background: url("@{realtimeTeam}/duanbaowenbg.png") no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
}
.videohuichuanbg{
    display: inline-block;
    width: 187px;
    height: 38px;
    background: url("@{realtimeTeam}/videohuichuanbg.png") no-repeat;
    background-size: 100% 100%;
}
.staticfont{
    color: #00f8fe;
    font-size: 24px;
    display: inline-block;
    vertical-align: middle;
}
.paddingleftbg{
    padding-left: 40px;
    line-height: 40px;
    display: flex;
}
.newDetailsProtrusion-huichuaninfo-content-datali>p{
    line-height: 40px;
}
.nocontentbox{
    position: absolute;
    left: 30%;
    top: 30%;
    width: 200px;
    height: 198px;
    text-align: center;
    background: url("@{realtimeTeam}/nocontentbg.png") no-repeat;
    background-size: 100% 100%;
}
.huichuandatatime{
    vertical-align: middle;
    color:#98b1be;
    margin-left: 15px;
}
.huichuancontent-box{
    display: inline-block;
    margin-left: 20px;
    font-size: 24px;
    flex: 1;
    word-break: break-all;
    margin: 0;
}
.equiomentname{
    position: relative;
}
.reddotted{
    position: absolute;
    width: 18px;
    height: 18px;
    background: #ff2303;
    border-radius: 100%;
    display: inline-block;
    top: 0px;
    right: 0px;
}
.equiomentname .reddotted{
  right: 45px;
}
.newDetailsProtrusion .title-title-title{
    background: none;
    margin-left: 0;
    padding-left: 25px;
}
.TeamName{
    margin-left: 10px;
    vertical-align: middle;
}
.TeamLeix{
    display: inline-block;
    width: 160px;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}
.NumberTroops{
    width: 100px;
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.CaptainName{
    max-width: 250px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 10px;
}
.currentLocation{
    margin-left: 10px;
    vertical-align: middle;
}
.teamtimebox{
    vertical-align: middle;
}
.progress-bar-out {
    width: 470px;
    height: 10px;
    background: #286d9e;
    border-radius:5px;
    border:1px solid #104e80;
    float:left;
}
.progress-bar-in {
    // display: inline-block;
    width: 0px;
    height: 9px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    position: relative;
    background: linear-gradient(to right,#0bb2ff,#98e5f6);
    transition: all 0.03s;
    float:left;
    left:-1px;
}
.progress-bar-ball {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius:50%;
    position: absolute;
    right: -14px;
    top: -2px;
    background: #fde020;
    box-shadow: 0 0 15px #fde020;
    cursor: pointer;
}
.list_ p{
    margin: 0;
}
.reddotted{
    position: absolute;
    width: 18px;
    height: 18px;
    background: #ff2303;
    border-radius: 100%;
    display: inline-block;
    top: 0px;
    right: 0px;
}
</style>
