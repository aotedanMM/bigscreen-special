<template>
  <div class="eventInfoPop" :class="config.btnName? 'gotoTopcis': 'warnninginfoBox'">
    <div class="eventInfoPop_title" :class="'a'+data[config.code]+'_'+data[config.icon]">
      <div class="eventInfoPop_title_txt" :title="data.title">{{data[config.title]}}</div>
      <div class="eventInfoPop_title_close" @click="close()"></div>
    </div>
    <div class="eventInfoPop_content">
      <!-- <el-scrollbar
        class="cmp-scrollbar-y"
        wrap-style="max-height:300px;padding-bottom: 30px;margin-bottom: -25px;"
      > -->
        <ul class="eventInfoPop_content_ul" v-if="config.list">
          <li class="eventInfoPop_content_ul_li" v-for="(item,key) in data[config.list]" :key="key">
            <span class="eventInfoPop_content_ul_li_label">{{item.label}}：</span>
            <div class="eventInfoPop_content_ul_li_value">{{item.value}}</div>
          </li>
        </ul>
        <div v-else v-html="`${config.time&&data[config.time]} ${data[config.content]}`"></div>
      <!-- </el-scrollbar> -->
    </div>
    <div class="eventInfoPop_operation" v-if="config.btnName">
      <span @click="clickHandler" :title="config.btnName">{{config.btnName}}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
@Component({
  name: 'EventInfoPop',
})
export default class EventInfoPop extends Vue {
}

</script>
<style lang="less" scoped>
@urlImg: '../../../../assets/img/eventInfo';
@url: '../../../../assets/img/warningInfo/';
.gotoTopcis{
 transform: translate(-50%,-100%);
 margin-top:-40px;
}
.warnninginfoBox{
  margin-top: 158px;
}
.eventInfoPop {
    width: 410px;
    min-height: 210px;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    color: black;
    background: rgba(7, 25, 65, 0.8);
    border-radius: 1px;
    box-shadow: 0 0 15px #071941;
    color: #fff;
    // margin-top: -250px;
    // margin-left: -205px;
    padding-bottom: 10px;
    overflow: -webkit-paged-x;
    cursor: default!important;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  &_title {
    background: url('@{urlImg}/etitle.png') no-repeat center / 100% 100%;
    height: 54px;
    display: flex;
    align-items: center;
    overflow: hidden;
    // &.red::before {
    //   content: '';
    //   width: 54px;
    //   height: 54px;
    //   background: url('../../../../assets/img/gisModule/eventTypeIcon/11B25_01.png')
    //     no-repeat center / 80% 80%;
    //   flex-shrink: 0;
    // }
    // &.orange::before {
    //   content: '';
    //   width: 54px;
    //   height: 54px;
    //   background: url('../../../../assets/img/gisModule/eventTypeIcon/11B25_02.png')
    //     no-repeat center / 80% 80%;
    //   flex-shrink: 0;
    // }
    // &.yellow::before {
    //   content: '';
    //   width: 54px;
    //   height: 54px;
    //   background: url('../../../../assets/img/gisModule/eventTypeIcon/11B25_03.png')
    //     no-repeat center / 80% 80%;
    //   flex-shrink: 0;
    // }
    // &.blue::before {
    //   content: '';
    //   width: 54px;
    //   height: 54px;
    //   background: url('../../../../assets/img/gisModule/eventTypeIcon/11B25_04.png')
    //     no-repeat center / 80% 80%;
    //   flex-shrink: 0;
    // }
    // &.gray::before {
    //   content: '';
    //   width: 54px;
    //   height: 54px;
    //   background: url('../../../../assets/img/gisModule/eventTypeIcon/11B25_05.png')
    //     no-repeat center / 80% 80%;
    //   flex-shrink: 0;
    // }

        // --------------------------
                &.a11B17_01::before {
                  content: '';
                  width: 54px;
                  height: 54px;
                  background: url('@{url}warnimg/11B17_01.png') no-repeat center;
                  background-size: 80% 80%;
                }
                &.a11B17_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B17_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B17_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B17_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                // &.a11B17_04{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                &.a11B03_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B03_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B03_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B03_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B03_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B03_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B03_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B03_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B04_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B04_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B04_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B04_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B04_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B04_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B04_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B04_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B05_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B05_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B05_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B05_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B05_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B05_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B05_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B05_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B06_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B06_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B06_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B06_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B06_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B06_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B06_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B06_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B09_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B09_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B09_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B09_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B09_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B09_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B09_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B09_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B14_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B14_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B14_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B14_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B14_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B14_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B14_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B14_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B15_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B15_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B15_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B15_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B15_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B15_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                // &.a11B15_04{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                // &.a11B16_01{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                &.a11B16_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B16_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B16_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B16_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B16_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B16_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B17_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B17_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B17_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B17_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B17_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B17_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                // &.a11B17_04{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                &.a11B19_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B19_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B19_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B19_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B19_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B19_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                // &.a11B19_04{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                &.a11B20_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B20_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B20_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B20_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B20_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B20_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B21_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B21_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B21_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B21_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B21_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B21_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                // &.a11B21_04{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                &.a11B22_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B22_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B22_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B22_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                // &.a11B22_03{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B22_03.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                // &.a11B22_04{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                &.a11B25_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B25_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B25_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B25_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                // &.a11B25_03{
                //   content: '';
                //   height: 54px;
                //   width: 54px;
                //   
                //   background: url('@{url}warnimg/11B25_03.png') no-repeat center;
                //   
                //   background-size: 80% 80%;
                // }
                &.a11B25_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B25_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B25_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B25_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B37_01::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B37_01.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B37_02::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B37_02.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B37_03::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B37_03.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }
                &.a11B37_04::before {
                    content: '';
                    height: 54px;
                    width: 54px;
                    
                    background: url('@{url}warnimg/11B37_04.png') no-repeat center;
                    
                    background-size: 80% 80%;
                }


    // --------------------------

    &::before {
      content: '';
      width: 54px;
      height: 54px;
      background: url('@{urlImg}/dot.png') no-repeat center / 100% 100%;
      flex-shrink: 0;
    }
    &_close {
      background: url('@{urlImg}/maptooltipclose.png') no-repeat center / 100% 100%;
      width: 15px;
      height: 14px;
      margin-right: 10px;
      cursor: pointer;
      flex-shrink: 0;
      margin-right: 10px;
    }
    &_txt {
      overflow: hidden;
      flex-grow: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
      font-size: 24px;
    }
  }
  &_content {
    margin:0 0px 0 8px;
    height: calc(100% - 100px);
    font-size: 22px;
    &_ul {
      &_li {
        display: flex;
        padding-right: 30px;
        margin-bottom: 10px;
        align-content: center;
        font-size: 24px;
        &_label {
          color: #00e4ff;
          flex-shrink: 0;
        }
        &_value {
          margin-left: 10px;
          flex-grow: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  &_operation {
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      background: #3e97ef;
      color: #fff;
      padding: 6px 15px;
      border-radius: 5px;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
.eventInfoPop_title_txt {
  cursor: default;
  line-height: 24px;
}
.eventInfoPop_content {
  min-height: 94px;
  font-size: 23px;
  line-height: 1.25;
}
.cmp-scrollbar-y {
  height: 100%;
}
.eventInfoPop_content_ul {
  height: 113px;
}
</style>
