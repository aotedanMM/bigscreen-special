<!--防御准备下人口转移情况容器组件-->
<template>
    <div>
                  <div class="tempRight-title  f-tit-h2">
                      <span >
                          {{curCompParam.title}}
                      </span>
                  </div>
                  
                  <div class="DiscussList">
                    <div class="influenceList_innr">
                        <div class="influenceList_innr_before curContainer">
                            <div v-for="(item,index) of curList"
                                :key="item.key"
                                class="curContainer_item"
                                @click.stop="clickItem(item,index)">
                                    <div class="curContainer_item_content textClass">
                                        <span>{{curDataCache[item.key] | formatData(item) | getValue}}</span>
                                        {{curDataCache[item.key] | formatData(item) | gettUnit}}
                                    </div>
                                    <div class="curContainer_item_tip f-txt-com">
                                        {{item.text}}
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
    </div>              
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import { pushDataRequestServe } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
import {
    getFormatData,
    formadResultValue,
    formadResultUnit,
} from '@/util/filter/CommonFilter';
@Component({
    name: 'Person',
    components: {},
    filters: {
        formatData: getFormatData, // null
        getValue: formadResultValue,
        gettUnit: formadResultUnit,
    },
})
export default class Person extends Vue {
    @Prop() private compParam: any; // 父组件带过来的子组件需要的参数
    @Prop() private handleClick: any; // 父组件处理子组件点击的方法
    @Prop() private getCacheData: any; // 父组件可以获得子组件的数据的方法
    private curCompParam: any = {}; // compParam的转换
    private curDataCache: any = {};
    private curList: any = [
        {
            key: 'estimatedNum',
            text: '预计转移',
            unit: '人',
            nextCompName: 'PersonnelTransferContainer',
            filterType: 'isMareThanValue',
            filterRule: [
                {
                    range: 10000,
                    unit: '万人',
                    pointNum: 100,
                },
            ],
        },
        {
            key: 'practicalNum',
            text: '实际转移',
            unit: '人',
            nextCompName: 'PersonnelTransferContainer',
            filterType: 'isMareThanValue',
            filterRule: [
                {
                    range: 10000,
                    unit: '万人',
                    pointNum: 100,
                },
            ],
        },
    ];

    private clickItem(item: any, index: number) {
        const param: any = {
            ...item,
            nextCompParam:  JSON.parse(JSON.stringify(this.curDataCache)),
        };
        this.handleClick(item.nextCompName, param);
    }

    // 通过接口拿到数据
    private async getDataByServ() {
        const resData = await pushDataRequestServe.getPushDataByIds(this.$store.state.eventPushStore.eventId || publishObjectPath.value.defensiveEventId, 'personnel_transfer');
        const result = this.handleResData(resData);
        this.getCacheData('PersonnelTransfer', result);
        return result;
    }

    // 处理从接口拿回的数据，将两个不同的接口返回的不同的数据格式做个处理，处理成页面上原来需要的那种数据格式，类似于一个中间的转换处理
    private handleResData(resData: any) {
        let newResData: any = {};
        if ( resData.data.content ) {
            const targetJsonStr = JSON.parse(resData.data.content)[0].data;
            const targetDataObj = JSON.parse(targetJsonStr);
            newResData = targetDataObj.data;
        }
        return newResData;
    }

    // 将接口拿到的数据进行处理，并且赋值给本页面需要的数据
    // 人员转移有新的数据推送
    // 这个变成了对象，所以不用在监听eventId
    @Watch('$store.state.eventPushStore.personnel_transfer')
    private async handleResultData() {
        this.curDataCache = await this.getDataByServ();
    }

    // @Watch('compParam')
    private updateCurCompParam() {
        this.curCompParam = JSON.parse(JSON.stringify(this.compParam));
    }

    private async created() {
        this.updateCurCompParam();
        await this.handleResultData();
    }
}
</script>

<style lang="less" scoped>
@import '../../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../../assets/css/decisionSupport/Statistic.half.less';

*{
  margin:0;
  padding:0;
}

.DiscussList{
  width: 100%;
  .influenceList{
    width: 100%;
    &_innr{
      &_before{  
        //   background:url('../../../../../assets/img/discuss/bg.png') no-repeat 50% 0px;
        background:url('../../../../../assets/img/defensivePreparation/title-bg.png') no-repeat 50% 0px;
        padding: 11px 16px;
        height:110px;
        box-sizing: border-box;
        background-size: 100% 100%;
        // margin:0px -5px 0 5px;
        &:hover{
        background-image:url('../../../../../assets/img/defensivePreparation/title-bg-h.png');
        background-size: 100% 102%;
        }
      }
    //   &_after{
    //     background:url('../../../../../assets/img/discuss/hover2.png') no-repeat 50% 0px; 
    //     padding: 15px 16px;
    //     box-sizing: border-box;
    //     background-size: 100% 100%;
    //     margin:0px -5px 0 5px;
    //     &:hover{
    //     background-image:url('../../../../../assets/img/discuss/hover2_h.png') ;  
    //     }
    //     .influenceList_innr_item:last-child{
    //       //width:100%;
    //       margin-bottom:0px;
    //     }

    //   }
    }
  }
}

.curContainer{
    display: flex;
    &_item{
        width: 50%;
        cursor: pointer;
        padding-left: 15px;
        // background: url('../../../../../assets/img/defensivePreparation/title-item-bg.png');
        // background-size: 100% 100%;
        // &_content{

        // }
        &_tip{
            color: #fff;
        }
        .textClass{
            font-size: 24px;
            color: #d2e1ec;
        }
        &:nth-child(1) {
            span {
                font-size: 32px;
                color: #6ae7fc;
                font-family: 'Impact' !important;
            }
        }
        &:nth-child(2) {
            span {
                font-size: 32px;
                color: #fbee50;
                font-family: 'Impact' !important;
            }
        }
        .curContainer_item_tip {
            margin-top: 5px;
        }
    }
    &_item:hover{
        .textClass{
            color: #fbee50;
        }
    }
}

</style>