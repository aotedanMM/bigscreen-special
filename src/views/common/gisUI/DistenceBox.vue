<!--地图上的距离量测图例-->
<template>
    <div class="celiangchild">
        <ul class="messure-ul">
            <li @click="clickItem('measureline')" class="messure-ul_li"><b class="toolbar-icon-size eMapicon-tool-rangeMeasurement"></b>
                <p class="messure-ul_li_p">距离量测</p> <span class="toolbar-split"></span>
            </li>
            <li @click="clickItem('measureArea')" class="messure-ul_li"><b class="toolbar-icon-size eMapicon-tool-planimetering"></b>
                <p class="messure-ul_li_p">面积量测</p> 
                <!-- <span class="toolbar-split"></span> -->
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import { messsageBus } from '@/util/message';
@Component({
    name: 'DistenceBox',
    mixins: [MapCommon],
})
export default class DistenceBox extends Vue {
     private isShowDiatence = false;
     public clickItem(type: string) {
       if (type === 'measureline') {
         this.getComponent().measureLength();
       } else if (type === 'measureArea') {
         this.getComponent().measureArea();
       }
      }
      private getComponent() {
        let component = null;
        const factory = this.$ioc.resolve('GISFactory-map');
        if (factory) {
            component = factory.commonFactory.getComponent('gisToolComp');
        }
        return component;
      }

}
</script>
<style lang="less">
.ol-overlay-container .popup-content{
     color: #fff;
     height: 0px;
    .hover-title {
        position: absolute;
        width: max-content;
        // top: -110px;
        height: 1px;
      div{
        position: relative;
        top:0;
        left: -48%;
        padding: 0;
        margin: 0;
        // height: 41px;
        padding-bottom:15px;
        // outline:1px solid greenyellow;
            transform: translateY(-130%);
        .hover-title_txt{
            padding:12px 15px 15px 25px;
            box-sizing:border-box;
            line-height: 1.25;
            // border-radius: 4px;
            // background-color:rgba(33, 72, 172, 0.7);
            //   min-width: 220px;
            max-height: 88px;
            display: inline-block;
            width: max-content;
            max-width: 700px;
            background:url('../../../assets/img/gisModule/distenceBox/distenceBox_bg.png') no-repeat 50% 0 ;
            background-size:100% 100%;
            i{
                font-size: 22px;
                color: #fff;
                font-style:normal;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
        }
        &::after{
          content: '';
          position: absolute;
          // transform: translate(-60%,-114px);
          bottom: 3px;
          left:50%;
          margin-top: 72px;
          margin-left:-20px;
          width:27px;
          height:17px;
          background:url('../../../assets/img/gisModule/distenceBox/distenceBox_bg_arrow.png') no-repeat 50% 0 ;
          // margin-left:-10px;
          // border-top:10px solid rgba(33, 72, 172, 0.7);
          // border-left:10px solid transparent;
          // border-right:10px solid transparent;
        }
      }

    }
}
.popup-content-dark{
    color: #ffffff !important;
}
.popup-content-light{
    color: #404040 !important;
}
</style>
<style lang="less" scoped>
@url: '../../../assets/img/gisUI/gitMapResource/';

  .popup-content{
      color: #fff;
  }
  .celiangchild {
    display: block;
    position: absolute;
    top: 305px;
    right: 635px;
    z-index: 3;
    color: white;
    cursor: pointer;
    .messure-ul {
        position: absolute;
        top: 75px;
        left: 86px;
        list-style: none;
        width: 80px;
      //  background: url('@{url}toobarpng.png') no-repeat;
      background-color:rgba(30,116,207,1);
        background-size: 100% 100%;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .3);
        padding-left: 0;
        margin-top: 0;
        text-align: center;
        box-shadow:inset 0 0 5px rgba(14, 172, 232, 0.9), 0 0 10px rgba(0, 0, 0, 0.7);
        border:1px solid #10a6e5;
        padding-bottom:2px;
    }
    .toolbar-icon-size {
        font-size: 20px;
        line-height: 1;
    }
    .messure-ul_li_p{
        margin: 0;
        font-size: 12px;
        display: inline-block;
        vertical-align: middle;
        line-height: 20px;
    }
    .toolbar-split {
        display: block;
        margin: 3px auto 0;
        width: 80px;
        height: 1px;
        background-color: #5ab7f6;
    }
}
</style>
