<!-- 3维 -->
<template>
  <div class="Landform">
    <!-- 两个按钮先隐藏 -->
    <div class="terrainBox" v-show="false">
      <div class="terrain" :key="index" :class="index === clickIndexNum ? 'terrain-article' : ''" v-for="(item,index) in landFormBtnList">
        <span class="terrain_text" @click="changeTerrainc(item, index)">{{item.btnName}}</span>
      </div>
    </div>

    <div class="coordinate-block">
      <div class="coordinate-item">
        空间数据来源：{{dataSource}}
      </div>
      <div class="coordinate-item">
        海拔：{{elevation}}米
      </div>   
      <div class="coordinate-item">
        <div >E {{longitude}}</div>
        <div >N {{latitude}}</div>
      </div>
    </div>
       <div class="zhinanzhen" @click="headnorth()"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'Landform',
  mixins: [MapCommon],
})
export default class Landform extends Vue {
  // 默认选中的按钮下标
  private clickIndexNum: number = 0;
  // E
  private longitude: string = '';
  // N
  private latitude: string = '';
  // Z
  private elevation: string = '';
  private slope: string = '';
  // 空间数据来源
  private dataSource: string = '';
  // 按钮数组,准备提出去用get请求
  private landFormBtnList: any = [
    {
      btnName: '地形1',
      key: 'terrainlayer1',
    },
    {
      btnName: '地形2',
      key: 'terrainlayer2',
    },
  ];
  // 修改坐标属性
  private onMousePosition(event: any) {
    this.longitude = parseFloat(event.x).toFixed(6);
    this.latitude = parseFloat(event.y).toFixed(6);
    this.elevation = parseFloat(event.z).toFixed(2);
    this.slope = event.slope;
  }
  private getrotate(event: any) {
    $('.zhinanzhen').css('transform', 'rotate('.concat(event, 'deg)'));
  }
  private headnorth() {
    this.getComponent().headingNorth();
    // this.getrotate(0);
  }
  // 修改空间数据信息名称
  private changTerrainName(event: any) {
    console.log('接收名字：' +  event.name);
    this.dataSource = event.name;
  }
  // 按钮点击的方法
  private changeTerrainc(val: any, index?: number): void {
    this.clickIndexNum = index || 0;
    this.getComponent().addTerrian(val.key);
  }

  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('map3d');
    return component;
  }

  private mounted(): void {
    console.log('加载Landform');
    (this as any).resolveMap('map').then((data: any) => {
      console.log('地图加载完成');
      this.getComponent().on('mousePosition', this.onMousePosition, this);
      this.getComponent().on('terrainName', this.changTerrainName, this);
      this.getComponent().on('map3dextentchanged', this.getrotate, this);
    });
    // 去掉这里初始化添加地形1
    // this.$nextTick((): void => {
    //   this.changeTerrainc(this.landFormBtnList[0]);
    // });
  }

  private beforeDestroy() {
    console.log('卸载Landform');
    this.getComponent().off('mousePosition', this.onMousePosition, this);
    this.getComponent().off('terrainName', this.changTerrainName, this);
    this.getComponent().on('map3dextentchanged', this.getrotate, this);
  }
}
</script>

<style lang="less" scoped>
  .Landform{
    .terrainBox{
      position: relative;
      float: right;
      .terrain{
        padding: 0;
        position: relative;
        top: 80px;
        right:70px;
        float: left;
        border: 1px solid #338af8;
        background-color: rgba(64, 125, 206, 0.5);
        box-shadow: inset 0 0 10px #338af8;
        font-size: 22px;
        border: 0;
        outline: none;
        width: 91px;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
        margin-left: 10px;
        border-radius: 5px;
        color:#fff;
        overflow: hidden;
      }
      .terrain-article{
        background: #ffc602;
        box-shadow: inset 0 0 10px rgba(255, 240, 0,1);
      }
      .terrain_text{    
        display:block;
        background: rgba(0,0,0,.2);

      }
    }
  }

  .coordinate-block {
    position: absolute;
    bottom: 10px;
    left: 80px;
    pointer-events: initial;
    z-index:2;
    width: max-content;
    .coordinate-item {
      background-color: #2c507d;
      font-size: 26px;
      color: #fff;
      line-height: 30px;
      text-align: center;
      & + .coordinate-item {
        margin-top: 9px;
      }
    }
    .coordinate-item:nth-child(1){
      left: 270px;
      width: 465px;
      position: absolute;
      height: 30px;
      top: 9px;
    }
    .coordinate-item:nth-child(2){
      left: 265px;
      margin-left: 5px;
      position: absolute;
      width: 465px;
      top: 30px;
      height: 30px;
    }
    .coordinate-item:nth-child(3){
      float: left;
      width: 250px;
      div{
        padding-left:40px;
      }
    }
  }
  .zhinanzhen{
    position: absolute;
    bottom: 15px;
    left: 85px;
    z-index:2;
    width: 50px;
    height: 50px;
    cursor: pointer;
    background-image: url(../../../assets/img/gisModule/common/zhinanzhen.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    }
</style>
