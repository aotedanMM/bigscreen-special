<template>
    <div class="TQYB_Container">
        <div class="TQYB_Wrap" v-if="isHaveDatas">
            <div>{{weatherObj.dealDay}}</div>
            <div class="weekClass">{{weatherObj.week}}</div>
            <div class="icon">
                <img  :src="iconSrc">
            </div> 
            <div >{{weatherObj.dayImg}}</div>
            <div class="wdClass">
                <div><span></span>{{weatherObj.maxTemp}}</div>
                <div><span></span>{{weatherObj.minTemp}}</div>
            </div>
            <div >{{weatherObj.direct+weatherObj.power}}</div>
        </div>
        <div class="nodataClass" v-else>暂无数据</div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import {
        IweatherTqyb } from '@/interface/feature/common/weather/Weather.interface.ts';
    @Component({
        name: 'WeatherTQYB',
    })
    export default class WeatherTQYB extends Vue {
      @Prop() public weatherObj?: IweatherTqyb;
      private iconSrc: string = '';
      private isHaveDatas: boolean = false;
      private getDatas() {
          if (this.weatherObj) {
              this.isHaveDatas = true;
              this.iconSrc = require(`../../../../../assets/img/weather/${this.weatherObj.icon}.png`);

          } else {
              this.isHaveDatas = false;
          }

         }
      private  created() {
         this.getDatas();
        }

    }


</script>

<style scoped lang="less">
    .TQYB_Container{
        width: 100%;
        height:100%;
        font-size: 18px;
    }
    .TQYB_Wrap{
        width: 100%;
        height:100%;
        display: flex;
        justify-content:flex-start;
        align-items:center;
        padding: 0 10px;

        &>div{
            margin-right:30px;
        }
        .weekClass{
            color:#00ecfc;
        }
        .icon{
            width:167px;
            height:140px;
            img{
                width:100%;
                height:100%;
            }
        }
        .wdClass{
            margin-left:20px;
            display: flex;
            flex-direction: column;
            justify-content:center;
            align-items:center;  
            &>div:first-of-type{
                margin-bottom:10px;
                
            }
            span{
                   color:#00ecfc;  
                }
        }
      
    }
    .nodataClass{
        width:100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

    }
</style>