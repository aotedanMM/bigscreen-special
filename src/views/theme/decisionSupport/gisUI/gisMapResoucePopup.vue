<template>
  <div class="resourcePopup">
    <div class="resourcespecial-tittle">资源查询</div>
    <span class="resourcespecial-closebtn" @click="closeIsResource"></span>
    <input
      type="hidden"
      id="resourcespecialkeyresourec-hide_codes"
      class="resourcespecialkeyresourec-hideInf"
    />
    <ul class="resourcespecial-closebtnthree">
      <li
        :class="[
          'resourcespecial-tab-item',
          { 'resourcespecial-active': item.isActive },
        ]"
        v-for="(item, index) in tanArr"
        @click="tabNavResource(item, index)"
        :key="item.index"
      >{{ item.name }}</li>
    </ul>
    <div class="resourcespecial-tab-content">
      <div class="resourcespecial-main-content">
        <div class="resourcespecial-keyWord">
          <div class="resourcespecial-analysistitle-box" v-show="isShowTitleOne">
            <div class="resourcespecial-analysistitle">请输入关键字</div>
            <input
              type="text"
              v-model="inputvalueWorld"
              class="resourcespecialkeywords"
              placeholder="资源名称"
            />
          </div>
          <div class="resourcespecial-analysistitle-box" v-show="isShowTitleTwo">
            <div class="resourcespecial-analysistitleImg">
              <div
                :class="['resourcespecial-analysistitleImgActive',{'analysistitleImgActive': item.isShowActive}]"
                v-for="item in buffArrTitle"
                :key="item.code"
                @click="tabBuffClick(item)"
              >
                <div :code="item.code" :class="[item.childClass,'resourcespecial-img']"></div>
              </div>
              <div class="resourcespecial-analysistitleradius">
                <div class="resourcespecial-radiusword">缓冲半径</div>
                <input class="resourcespecial-radiusnums" type="text" v-model="initInput" @input="handleInput" />
                <span class="resourcespecial-unit">km</span>
                <!--  <div class="resourcespecial-drawbtn">绘制</div>不需要点击绘制按钮-->
              </div>
            </div>
          </div>
          <div class="resourcespecial-analysistitle-box" v-show="isShowTitleThree">
            <div class="resourcespecial-analysistitle">请选择行政区划</div>
            <div class="resourcespecial-analysistitle-all">
              <div class="resourcespecial-fenlanBox">
                <input
                  type="text"
                  id="resourcespecialkeyresourec-xingz"
                  class="resourcespecialkeyresourec"
                  placeholder="请选择行政区划"
                  v-model="inputvalueOrg"
                  @click="isOrgDivision"
                />
                <input
                  type="hidden"
                  id="resourcespecialkeyresourec-dis_hide_codes"
                  class="resourcespecialkeyresourec-hideInf"
                />
              </div>
              <!--<div class="resourcespecialSearchBtn0"></div>不需要该按钮-->
            </div>
            <div id="resourcespecial-fenlanBox">
              <divisionOrgzTree ref="mychildOrg" @customClickOrg="handleCustomClickOrg"></divisionOrgzTree>
            </div>
          </div>
          <div class="resourcespecial-analysistitle">请选择资源类型</div>
          <div class="resourcespecial-analysistitle-all" v-if="isShowTitleTwo">
            <input
              type="text"
              id="resourcespecialkeyresourec-guanjianzi2"
              class="resourcespecialkeyresourec"
              placeholder="请输入资源类型关键字"
              v-model="inputvalueBuff"
            />
            <div class="resourcespecialSearchBtn"></div>
          </div>
          <div class="resourcespecial-analysistitle-all" v-else>
            <input
              type="text"
              id="resourcespecialkeyresourec-guanjianzi2"
              class="resourcespecialkeyresourec"
              placeholder="请输入资源类型关键字"
              v-model="inputvalue"
            />
            <div class="resourcespecialSearchBtn"></div>
          </div>
          <ul id="resourcespecial-ztree2">
            <resourcePopupzTree @customClick="handleCustomClick" ref="mychild"></resourcePopupzTree>
          </ul>
          <div class="resource-listSelect2">
            <p>
              已选
              <span>{{dataArr.length}}</span>项
            </p>
            <ul class="resource-listSelect-ul2">
              <li class="ztreelibg" v-for="(item) in dataArr" :key="item.code" :code="item.code">
                <span class="ztreelibgdotted"></span>
                {{itemobj.name+'-'+item.name}}
                <span class="ResourcetypeCount"></span>
                <span class="closeztreeli" @click="closeLiNodeFn(item)"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="resourcespecialBtnAll">
      <div
        class="resourcespecialbtnlist resourcespecialDepart"
        id="resourcespecialBtnlist"
        @click="initQueryData"
      >查询</div>
      <div class="resourcespecialbtnlist" id="resourcespecialBtnlistClear">清空</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { resourceanalysisServer } from '@/api/feature/normal/installNormalServer.ts';
import resourcePopupzTree from '@/components/feature/gisModle/gisMapResourcePopup/resourcePopupzTree.vue';
import divisionOrgzTree from '@/components/feature/gisModle/gisMapResourcePopup/divisionOrgzTree.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'GisMapResoucePopup',
  mixins: [MapCommon],
  components: {
    resourcePopupzTree,
    divisionOrgzTree,
  },
})
export default class GisMapResoucePopup extends Vue {
  private dataArr = [];
  private dataArrOrg = [];
  private itemobj = '';
  private inputvalue: any = '';
  private inputvalueBuff: any = ''; // 缓冲区 关键字参数
  private inputvalueWorld: any = ''; // 关键字和行政区划 关键字参数
  private inputvalueOrg: any = '';
  private isShowTitleOne = true;
  private isShowTitleTwo = false;
  private isShowTitleThree = false;
  private initInput: any = 50; // 初始化缓冲区 距离
  private buffDataArr: any = []; // 缓冲区 地图标点数据 往后台传参数
  private resourceKeys: any = []; // 获取资源树 点击后的 code值
  private resourceKeysOrg: any = ''; // 获取组织机构树 点击后的 code值
  private dataParame: any = {
    level: 1,
    name: '',
    adcode: '',
    sub: 2,
    polygon: false,
    eId: 'siptea',
  };
  private buffArrTitle = [
    {
      code: 'DrawPoint',
      childClass: 'resourcespecial-imgOne',
      isShowActive: true,
    },
    {
      code: 'DrawLine',
      childClass: 'resourcespecial-imgTwo',
      isShowActive: false,
    },
    {
      code: 'DrawPolygon',
      childClass: 'resourcespecial-imgThree',
      isShowActive: false,
    },
  ];
  private tanArr = [
    { name: '关键字', isActive: true },
    { name: '缓冲区', isActive: false },
    { name: '行政区划', isActive: false },
  ];
  @Emit('isHidePopupResouce')
  private closeIsResource() {
    return 1;
  }
  private tabNavResource(item: any, index: number) {
    this.tanArr.forEach((p1, p2) => {
      p1.isActive = false;
    });
    item.isActive = true;
    this.dataArr = [];
    this.inputvalue = '';
    if (item.name === '关键字') {
      this.isShowTitleOne = true;
      this.isShowTitleTwo = false;
      this.isShowTitleThree = false;
      (this.$refs as any).mychild.initTree(
        resourceanalysisServer.getTreeData(),
      );
    } else if (item.name === '缓冲区') {
      this.isShowTitleOne = false;
      this.isShowTitleTwo = true;
      this.isShowTitleThree = false;
      (this.$refs as any).mychild.initTree(
        resourceanalysisServer.getTreeBuffData(),
      );
    } else if (item.name === '行政区划') {
      this.isShowTitleOne = false;
      this.isShowTitleTwo = false;
      this.isShowTitleThree = true;
      (this.$refs as any).mychild.initTree(
        resourceanalysisServer.getTreeData(),
      );
      this.inputvalueOrg = '';
      (this.$refs as any).mychildOrg.initTreeOrg(
        resourceanalysisServer.getDistrict(this.dataParame),
      );
    }
  }

  // 查询半径只能输入整数或小数
  private handleInput(e: any) {
    this.initInput = this.initInput.replace(/[^\d|^\\.]/g, '');
  }

  // 暴露gis的方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('resourceAnalysis');
    return component;
  }
  // 缓冲区 点击 切换
  private tabBuffClick(parame: any) {
    this.getComponent().load();
    this.buffArrTitle.forEach((item: any) => {
      item.isShowActive = false;
      if (parame.code === item.code) {
        item.isShowActive = true;
      }
      if (parame.code === 'DrawPoint') {
        this.getComponent().DrawPoint(this.initInput, this.dataCallBack);
      } else if (parame.code === 'DrawLine') {
        this.getComponent().DrawPolyline(this.initInput, this.dataCallBack);
      } else if (parame.code === 'DrawLine') {
        this.getComponent().DrawPolygon(this.initInput, this.dataCallBack);
      }
    });
  }
  // 返还的数据
  private dataCallBack(res: any) {
    console.log(res);
    this.buffDataArr = res;
  }
  private isOrgDivision() {
    $('#resourcespecial-fenlanBox').slideToggle();
    $('#resourcespecial-fenlanBox').css('zIndex', 4);
    (this.$refs as any).mychildOrg.initTreeOrg(
      resourceanalysisServer.getDistrict(this.dataParame),
    );
  }
  // 点击资源数 返还过来的数据
  private handleCustomClick(payload: any) {
    const than = this;
    than.inputvalue = '';
    this.dataArr = payload.parame;
    this.itemobj = payload.itemobj;
    this.dataArr.forEach((p1: any, p2: any) => {
      than.inputvalue += p1.name + ',';
      than.resourceKeys.push(p1.code);
    });
    console.log(this.dataArr);
  }
  // 点击行政区划组织机构数 返还过来的数据
  private handleCustomClickOrg(payload: any) {
    const than = this;
    than.inputvalueOrg = '';
    this.dataArrOrg = payload;
    this.dataArrOrg.forEach((p1: any, p2: any) => {
      than.inputvalueOrg += p1.name + ',';
      than.resourceKeysOrg += p1.adcode;
    });
  }

  private closeLiNodeFn(index: any) {
    const than = this;
    this.dataArr.forEach((p1: any, p2: any) => {
      if (p1.id === index.id) {
        this.dataArr.splice(p2, 1);
        (this.$refs as any).mychild.unchecknode(p1.code);
      }
    });
    than.inputvalue = [];
    this.dataArr.forEach((p1: any, p2: any) => {
      than.inputvalue += p1.name + ',';
    });
  }
  // 查询的方法
  private initQueryData() {
    if (!this.isShowTitleOne && this.isShowTitleTwo && !this.isShowTitleThree) {
      // 缓冲区
      // 缓冲区 查询
      const opts = {
        Keyword: this.inputvalueBuff,
        districtCode: '',
        point: [111.25802, 36.57948],
        buffer: this.buffDataArr,
        resourceKeys: this.resourceKeys,
        flatTag: true,
      };
      resourceanalysisServer.getNearbyList(opts).then((res: any) => {
        console.log(res);
        this.getComponent().addPointsOnMap(res.list);
      });
    } else if (
      this.isShowTitleOne &&
      !this.isShowTitleTwo &&
      !this.isShowTitleThree
    ) {
      // 关键字
      const opts = {
        Keyword: this.inputvalueWorld,
        districtCode: '',
        resourceKeys: this.resourceKeys,
        flatTag: true,
      };
      resourceanalysisServer.getNearbyList(opts).then((res: any) => {
        console.log(res);
        this.getComponent().addPointsOnMap(res.list);
      });
    } else if (
      !this.isShowTitleOne &&
      !this.isShowTitleTwo &&
      this.isShowTitleThree
    ) {
      // 行政区划
      const opts = {
        Keyword: '',
        districtCode: this.resourceKeysOrg,
        resourceKeys: this.resourceKeys,
        flatTag: true,
      };
      resourceanalysisServer.getNearbyList(opts).then((res: any) => {
        console.log(res);
        this.getComponent().addPointsOnMap(res.list);
      });
    }
  }
  private mounted() {
    (this.$refs as any).mychild.initTree(resourceanalysisServer.getTreeData());
  }
}
</script>
<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.resourcePopup {
  right: 192px;
  opacity: 1;
  display: block;
  position: absolute;
  margin: 0px;
  z-index: 1002;
  top: 52px;
  width: 531px;
  height: 818px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecBg.png)
    no-repeat;
  background-size: 100% 100%;
  padding: 0 30px;
  animation: myfirst 2.5s;
  transform: scale(.8);
}
@keyframes myfirst {
  from {
    right: -531px;
    opacity: 0;
  }
  to {
    right: 192px;
    opacity: 1;
  }
}
.resourcespecial-tittle {
  font-size: 30px;
  color: #fda100;
  height: 46px;
  line-height: 30px;
  margin-left: 55px;
  text-align: left;
  cursor: move;
  width: 100%;
  margin-top: 32px;
}
.resourcespecial-closebtn {
  cursor: pointer;
  text-align: center;
  position: absolute;
  right: -9px;
  top: 0px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecClose.png)
    no-repeat;
  width: 106px;
  height: 103px;
  background-size: 100% 100%;
  z-index: 1000;
}
.resourcespecial-closebtnthree {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
}
.resourcespecial-tab-item {
  /*width:200px;*/
  /*height:73px;*/
  line-height: 73px;
  margin: 0px 0px 0px 0px;
  text-align: center;
  flex: 1;
  cursor: pointer;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursetabMr.png)
    no-repeat;
  color: #d2e1ec;
  font-size: 26px;
}
.resourcespecial-active {
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursetabActive.png)
    no-repeat;
  color: #53efff;
  font-size: 26px;
}
.resourcespecialBtnAll {
  display: flex;
  position: absolute;
  right: 80px;
  /* margin-right: 10px; */
  top: 92.4%;
}
.resourcespecialBtnAll .resourcespecialbtnlist {
  width: 90px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialdrawBtn.png)
    no-repeat;
  background-size: 100% 100%;
  font-size: 28px;
  color: #fff;
  margin-right: 10px;
}
.resourcespecial-analysistitle-box {
  width: 100%;
}
.resourcespecial-analysistitle {
  width: 100%;
  height: 47px;
  line-height: 44px;
  border-radius: 4px;
  padding-left: 10px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialtitlebg.png)
    no-repeat;
  background-size: 100% 100%;
  color: #13e6fc;
  margin: 6px 0 10px 10px;
  font-size: 28px;
  padding-left: 23px;
}
.resourcespecial-analysistitleImg {
  display: flex;
  width: 100%;
  padding-left: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.resourcespecial-analysistitleImgActive {
  margin-right: 22px;
  margin-bottom: 6px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.analysistitleImgActive {
  background: url(../../../../assets/img/gisUI/gitMapResource/huanchongactive.png)
    no-repeat;
  background-size: 100% 100%;
  width: 56px;
  height: 56px;
}
.resourcespecial-imgOne {
  width: 32px;
  height: 32px;
  background: url(../../../../assets/img/gisUI/gitMapResource/huanchongtu1.png)
    no-repeat;
  background-size: 100% 100%;
}
.resourcespecial-imgTwo {
  width: 32px;
  height: 32px;
  background: url(../../../../assets/img/gisUI/gitMapResource/huanchongtu2.png)
    no-repeat;
  background-size: 100% 100%;
}
.resourcespecial-imgThree {
  width: 32px;
  height: 32px;
  background: url(../../../../assets/img/gisUI/gitMapResource/huanchongtu3.png)
    no-repeat;
  background-size: 100% 100%;
}
.resourcespecial-analysistitleradius {
  display: flex;
}
.resourcespecial-radiusnums {
  width: 106px;
  height: 45px;
  margin: 0 5px 0 5px;
  background: rgba(19, 68, 84, 0.8);
  font-size: 28px;
  border: 1px solid #00f0ea;
  color: #fff;
  line-height: 45px;
  text-align: center;
  border-radius: 5px;
}
.resourcespecial-drawbtn {
  width: 55px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialdrawBtn.png)
    no-repeat;
  background-size: 100% 100%;
  font-size: 22px;
  color: #fff;
}

.resourcespecial-radiusword,
.resourcespecial-unit {
  color: #fff;
  font-size: 28px;
}
.resourcespecialkeywords,
.resourcespecialkeyres,
.resourcespecialkeydepart,
.resourcespecialkeyresourec {
  width: 470px;
  height: 47px;
  line-height: 47px;
  outline: none;
  border: 1px solid #00f0ea;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 10px;
  padding: 0 10px 0 10px;
  background-image: linear-gradient(
      0deg,
      rgba(19, 67, 82, 0.82) 0%,
      rgba(34, 63, 76, 0.82) 44%,
      rgba(28, 65, 79, 0.82) 100%
    ),
    linear-gradient(#003967, #003967);

  font-size: 28px;
  color: #11aaba;
}
.resourcespecialkeywords {
  margin-bottom: 5px;
}
.resourcespecialkeyresourec {
  padding-right: 55px;
  margin-bottom: 4px;
}
.resourcespecialkeyres,
.resourcespecialkeydepart,
.resourcespecialkeyresourec::-webkit-input-placeholder {
  color: #11aaba;
}
.resourcespecialkeywords::-webkit-input-placeholder {
  color: #11aaba;
}
.resourcespecialSearchBtn {
  width: 23px;
  height: 26px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialsearchBtn.png)
    no-repeat;
  background-size: 100% 100%;
  position: relative;
  right: -439px;
  top: -38px;
  cursor: pointer;
}
.resourcespecial-analysistitle-alla {
  width: 500px;
  margin-left: 92px;
}
.resource-special-boxpu-addressbg {
  width: 41px;
  height: 47px;
  background: url(../../../../assets/img/gisUI/gitMapResource/addressbg.png)
    no-repeat;
  background-size: 100% 100%;
}

.resource-special-boxpu-address .resource-special-boxpu-addressbg_contont {
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*查询按钮 查到的数据  弹窗*/
.resourcespecial-listdataall {
  width: 1103px;
  height: 1034px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialDetailBg.png)
    no-repeat;
  background-size: 100% 100%;
  display: none;
  position: absolute;
  left: 97%;
  top: -36px;
}
.resourcespecial-listdataallclose {
  width: 49px;
  height: 32px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialDetailBgClose.png)
    no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  position: absolute;
  right: 49px;
  top: 105px;
}
.resource-special-boxpuaa {
  width: 929px;
  height: 92px;
  /* line-height: 114px; */
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: url(../../../../assets/img/gisUI/gitMapResource/resourdetalistbgMr.png)
    no-repeat;
  background-size: 100% 100%;
  margin: 5px;
  border-radius: 7px;
  cursor: pointer;
  padding: 3px 0 0 10px;
}
.resource-special-boxpuaa:hover {
  width: 929px;
  height: 92px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: url(../../../../assets/img/gisUI/gitMapResource/resourdetalistbgActive.png)
    no-repeat;
  background-size: 100% 100%;
  margin: 5px;
  border-radius: 7px;
  cursor: pointer;
  padding: 3px 0 0 10px;
}
.resource-special-boxpuaactive {
  width: 929px;
  height: 92px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: url(../../../../assets/img/gisUI/gitMapResource/resourdetalistbgActive.png)
    no-repeat;
  background-size: 100% 100%;
  margin: 5px;
  border-radius: 7px;
  cursor: pointer;
  padding: 3px 0 0 10px;
}

.resource-special-boxpu-name {
  color: #d2e1ec;
  font-size: 28px;
  width: 926px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.resource-special-boxpu-address {
  color: #d2e1ec;
  font-size: 28px;
  display: flex;
  width: 926px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#resourcespecial-fenlanBox {
  display: none;
  position: absolute;
  margin-top: 15px;
  width: calc(94% - 35px);
  background-color: #09284f;
  overflow-y: scroll;
  height: 300px;
  border-radius: 8px;
  margin-left: 2%;
}
.resourcespecialkeyresourec-hideInf {
  display: none;
}
.resourcespecial-fenlanBox {
  width: 480px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
#resourcespecialkeyresourec-xingz {
  width: 100%;
}
.resourcespecial-analysistitle-all .resourcespecialSearchBtn0 {
  width: 23px;
  height: 26px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialsearchBtn.png)
    no-repeat;
  background-size: 100% 100%;
  position: relative;
  right: -439px;
  top: -38px;
}
.resourcespecial-chaxunziyuan {
  height: 60%;
  width: 100%;
  padding: 0 3% 0;
}
#resourcespecial-ztree {
  width: 88%;
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 50.5%;
  margin-left: 2%;
  height: 19.5%;
  background: url(../../../../assets/img/gisUI/gitMapResource/ztreeulbg.png)
    no-repeat;
  background-size: 100% 100%;
  margin-top: -27px;
}
#resourcespecial-ztree1 {
  width: 88%;
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 52.5%;
  margin-left: 2%;
  margin-top: -29px;
  height: 19.5%;
  background: url(../../../../assets/img/gisUI/gitMapResource/ztreeulbg.png)
    no-repeat;
  background-size: 100% 100%;
}
#resourcespecial-ztree2 {
  width: 88%;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 48%;
  margin-left: 2%;
  height: 19.5%;
  background: url(../../../../assets/img/gisUI/gitMapResource/ztreeulbg.png)
    no-repeat;
  background-size: 100% 100%;
  padding-top: -5px;
}
#jiuyuandui {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 35%;
  margin-left: 2%;
}
#jiuyuandui2 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 35%;
  margin-left: 2%;
}
#jiuyuandui1 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 38%;
  margin-left: 2%;
}
#zhuangbei {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 40%;
  margin-left: 2%;
}
#zhuangbei2 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 40%;
  margin-left: 2%;
}
#zhuangbei1 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 43%;
  margin-left: 2%;
}
#yingjiziyuan {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 45%;
  margin-left: 2%;
}
#yingjiziyuan2 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 45%;
  margin-left: 2%;
}
#yingjiziyuan1 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 48%;
  margin-left: 2%;
}
#zhongdiansheshi {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  margin-left: 2%;
}
#zhongdiansheshi2 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  margin-left: 2%;
}
#zhongdiansheshi1 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 53%;
  margin-left: 2%;
}
#fanghumubiao {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 55%;
  margin-left: 2%;
}
#fanghumubiao2 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 55%;
  margin-left: 2%;
}
#fanghumubiao1 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 58%;
  margin-left: 2%;
}
#zhongdianqiye {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 60%;
  margin-left: 2%;
}
#zhongdianqiye2 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 60%;
  margin-left: 2%;
}
#zhongdianqiye1 {
  width: 88%;
  /*background-color: #09284f;*/
  color: #fff;
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  top: 63%;
  margin-left: 2%;
}
.isNotValueres {
  color: #fff;
  width: 500px;
  height: 100px;
  font-size: 28px;
  margin: 25% auto;
  text-align: center;
}
.resource-listSelect {
  width: 88%;
  margin-left: 2%;
  height: 22%;
  position: absolute;
  top: 70%;
}
.resource-listSelect2 {
  width: 88%;
  margin-left: 2%;
  height: 21%;
  position: absolute;
  top: 70%;
}
.resource-listSelect1 {
  width: 88%;
  margin-left: 2%;
  height: 19%;
  position: absolute;
  top: 72%;
}
.resource-listSelect-ul {
  width: 100%;
  height: 78%;
  overflow: hidden;
  overflow-y: auto;
  margin-top: -1px;
}
.specialreslisttitall {
  margin: 93px 0 30px 100px;
}
.specialreslisttit {
  font-size: 28px;
  color: #59edff;
}
.specialreslisnum {
  color: #de8d03;
  font-size: 34px;
  margin-left: 19px;
}
.tableCbssBoxsty {
  width: 950px;
  margin-left: 100px;
}
.resource-listSelect-ul2 {
  width: 100%;
  height: 78%;
  overflow: hidden;
  overflow-y: auto;
}
.resource-listSelect-ul1 {
  width: 100%;
  height: 78%;
  overflow: hidden;
  overflow-y: auto;
}
.resource-listSelect p {
  width: 100%;
  height: 47px;
  line-height: 47px;
  border-radius: 4px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialtitlebg.png)
    no-repeat;
  background-size: 100% 100%;
  color: #13e6fc;
  margin: -16px 0 10px 0px;
  font-size: 28px;
  padding-left: 23px;
}
.resource-listSelect2 p {
  width: 100%;
  height: 47px;
  line-height: 44px;
  border-radius: 4px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialtitlebg.png)
    no-repeat;
  background-size: 100% 100%;
  color: #13e6fc;
  margin: -13px 0 10px 0px;
  font-size: 28px;
  padding-left: 23px;
}
.resource-listSelect1 p {
  width: 100%;
  height: 47px;
  line-height: 44px;
  border-radius: 4px;
  background: url(../../../../assets/img/gisUI/gitMapResource/resoursespecialtitlebg.png)
    no-repeat;
  background-size: 100% 100%;
  color: #13e6fc;
  margin: -18px 0 10px 0px;
  font-size: 28px;
  padding-left: 23px;
}
.ztreelibg {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background: url(../../../../assets/img/gisUI/gitMapResource/ztreelibg.png)
    no-repeat;
  background-size: 100% 100%;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}

.ztreelibgactive {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background: url(../../../../assets/img/gisUI/gitMapResource/ztreelicheckedbg.png)
    no-repeat;
  background-size: 100% 100%;
  color: #fff;
  font-size: 24px;
}

.ztreelibgdotted {
  display: inline-block;
  width: 25px;
  height: 25px;
  line-height: 48px;
  background: url(../../../../assets/img/gisUI/gitMapResource/ztreelidotted.png)
    no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
}
.ztreelibgdottedchecked {
  width: 438px;
  height: 62px;
  line-height: 48px;
  background: url(../../../../assets/img/gisUI/gitMapResource/ztreelicheckedbg.png)
    no-repeat;
  background-size: 100% 100%;
}
.closeztreeli {
  display: block;
  width: 14px;
  height: 14px;
  line-height: 48px;
  background: url(../../../../assets/img/gisUI/gitMapResource/ztreeclosebg.png)
    no-repeat;
  background-size: 100% 100%;
  float: right;
  margin-right: 3%;
  margin-top: 3%;
  cursor: pointer;
}

.ResourcetypeCount {
  font-size: 28px;
  display: inline-block;
  color: #01eaf4;
  margin-left: 12%;
}
.closeztreeli:hover {
  background: url(../../../../assets/img/gisUI/gitMapResource/closetreelihover.png)
    no-repeat;
  background-size: 100% 100%;
}
.ztree li span.button.ico_open {
  margin-right: 2px;
  background-position: -182px -24px;
  vertical-align: top;
  vertical-align: middle;
}
.ztree li span.button.ico_docu {
  margin-right: 2px;
  background-position: -180px -48px;
  vertical-align: top;
  *vertical-align: middle;
}
.ztree li span.button.ico_close {
  margin-right: 2px;
  background-position: -183px 0px;
  vertical-align: top;
  vertical-align: middle;
}

/*分页样式修改*/
#p101 .gis-pagination-active {
  background-color: #58e0e5;
  border-color: #52f2fa;
}
#p101 li {
  min-width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
}
#p101 {
  text-align: right;
  padding-right: 13px;
}
#p101 .gis-pagination__number:hover {
  color: #52f2fa;
  border: 1px solid #52f2fa;
}
</style>
