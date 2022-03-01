<template>
    <!-- 测预警信息组件 -->
    <div class="earlyWarning">
        <el-scrollbar class="cmp-scrollbar-y" style="height:100%">
            <ul class="knownDisaster_ul">
                <li class="knownDisaster_ul_li f-txt-com" v-for="(item,key) in getList" :key="key"  @click="clickItemFlood(item,key)">
                    <!--<div class="knownDisaster_ul_li_details">-->
                        <span class="knownDisaster_ul_li_details_name" :class="item.checked?'itemHover':''">{{item.name}}</span>
                        <i class="icon-arrow" :class="[item.arrow > 0?'icon-arrow-up':'', item.arrow < 0?'icon-arrow-down':'']"
                        ></i>
                        <span class="knownDisaster_ul_li_details_value" :class="item.arrow !== 0 && 'scale_value'">{{item.value}}</span>
                    <!--</div>-->
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { EarlyWarningInterface } from '@/interface/feature/flood/EarlyWarning/EarlyWarningInterface';
import { earlyWarningServer } from '@/api/installServer';
/**
 *测预警信息组件
 */
@Component({
    name: 'EarlyWarning',
})
export default class  EarlyWarning extends Vue {
    @Prop({ default: () => [] }) public list!: EarlyWarningInterface[];

    get getList() {
        return this.list;
    }

    private clickItemFlood(item: any, key: number) {
        // 在地图上显示监测预警信息
        item.checked = !item.checked;
        this.$emit('showWarning', item);
    }
}
</script>

<style lang="less" scoped>
    @url: '../../../../assets/img/other/';
    /*.knownDisaster_ul_li_details > i.icon-arrow-up {
      background-image: url('../../../../assets/img/gisModule/iconArrowFlag.gif');
    }
    .knownDisaster_ul_li_details > i.icon-arrow-down {
      background-image: url('../../../../assets/img/gisModule/iconArrowFlag.gif');
      position: relative;
      transform: rotate(180deg);
    }*/
    .earlyWarning{
        height: 100%;
    }

    .knownDisaster_ul_li > i.icon-arrow{
    // position: absolute;
        width: 24px !important;
        height: 40px !important;
        background-size: 100% 100%;
    // left:108px;

    }

    .knownDisaster_ul_li > i {
        width: 30px !important;
        height:30px !important;
        transition: width 1s;
    }

    .knownDisaster_ul_li {
        white-space: nowrap;
    }

    .knownDisaster_ul_li:nth-child(2n){
        background: rgba(10, 124, 204, 0.2)
    }

    .itemHover{
        color: #fff7cd;
    }

    .knownDisaster {
        height: 100%;
    // padding: 0 15px 0 24px;
        box-sizing: border-box;

    &_ul {
         margin: 0;
         padding: 0;
         list-style: none;

    &_li {
        display: flex;
        justify-content: space-between;
        color: #dafbff;
        margin-bottom: 2px;
        padding-bottom: 8px;
        align-items: center;
        padding-left: 10px;

    &:last-child{
         margin-bottom:0;
     }

    &_details {
         width: 60%;
         display: flex;
         align-items: center;


    &_name {
        width: 50%;
        height: 42px;
        display: flex;
        justify-content: left;
        align-items: center;
        white-space: nowrap;
        padding-top: 3px;
        padding-left: 30px;
        cursor: pointer;
        font-family: Microsoft YaHei, serif;

        background: url("../../../../assets/img/gisModule/earlyWarning.png") no-repeat;
        background-size: 42% 100%;
     }

    &_name:hover{

    }

    &_value {
         font-family: 'Impact';
         color: #fff001;
         font-weight: bold;
     // font-size: 28px;
         margin: 0 10px 0 0px;
     }
    }

    &_estimates {
         width: 40%;
     // font-size: 28px;
         text-align: right;
     // margin-right: 20px;

    > span {
        font-family: 'Impact';
        color: #2cf7ff;
        font-weight: bold;
        display: inline-sblock;
    }
    }
    }
    }
    }

    .cmp-scrollbar-y .el-scrollbar__wrap {
        overflow-x: hidden;
        margin-right: -30px;
    // margin-right: -18px !important;
    }

</style>
