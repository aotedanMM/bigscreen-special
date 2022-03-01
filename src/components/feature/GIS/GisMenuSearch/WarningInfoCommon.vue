<template>
    <div id="waringInfo " class="yy-warning-info body">
        <PopupsBorder :title="title" :show="show">
            <div class="yy-container">
                <div class="block" v-if="Object.keys(datalist).length">
                    <el-carousel trigger="click" :autoplay="false">
                        <el-carousel-item v-for="item in totalItem" :key="item">
                            <div class="yy-list-event">
                                 <div
                                        :class="( flag === index ? 'isChecked yy-cell': 'yy-cell' )"
                                        v-for="(listitem,index) in filtersSwipper(item)"
                                        :key="index"
                                        @click.stop="clickItemEvent(listitem,index)">
                                    <div :class="listitem.iconName"></div>
                                    <div class="yy-list-info">
                                        <div class="yy-list-info-num">{{listitem.num}}</div>
                                        <div class="yy-list-info-event" :title="listitem.listname">{{listitem.listname}}</div>
                                    </div>
                                </div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div v-else class="yy-nodata nothingData--bg"></div>
                <div class="yy-text-title">{{infoTitle}}</div>
                <div class="yy-botton-container">
                    <div v-if=" warnDatalist.length > 0" v-loading="loading" class="yy-container-observatory">
                        <div class="yy-observatory-cell"
                             v-for="(item, index) in warnDatalist"
                             :key="index" @click="handleInfoDetail(item)">
                            <!-- <div :class="item.className"></div> -->
                            <img class="typeClass" :src="getPng(item)" alt="">
                            <div class="yy-observatory-right">
                                <div class="yy-observatory">{{item.sender}}</div>
                                <div class="yy-observatory-time">{{item.time}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="yy-nodata nothingData--bg"></div>
                    <div class="yy-pagination"
                         v-if=" warnDatalist.length > 0">
                        <div class="block">
                            <!-- <span class="demonstration">显示总数</span> -->
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :page-size="5"
                                    :pager-count="5"
                                    layout="total, prev, pager, next"
                                    :total="totalNum"
                                    small>
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </PopupsBorder>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
    Prop,
    Watch,
} from 'vue-property-decorator';
import PopupsBorder from '@/components/feature/GIS/GisMenuSearch/PopupsBorder.vue';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';

import {
    warningInfoServer,
} from '@/api/installServer';
import moment from 'moment';

@Component({
    name: 'WaringInfoCommon',
    components: {
        PopupsBorder,
    },
})
export default class WaringInfoCommon extends Vue {
    @Prop({
        default: true,
    }) public show ?: boolean;
    @Prop() private title ?: string;
    private autoplay: any = false;
    private totalItem: number = 3;
    private totalNum: number = 0;
    private districtCode: string = '';
    private geoFilter: boolean = false; // 点击监测预警类型：false， 行政区划触发为true
    // 当前选中类别的type
    private flag: string = '';
    private infoTitle: string = '';
    // 事件类型展示使用（经过处理）
    private datalist: any = {};
    // 事件类型对应的模板，为了在划行政区划是保模板的完整性
    private datalistModule: any = {
        '11B17': {
            listname: '大雾事件',
            num: 0,
            iconName: 'yy-dawu',
            typePage: 1,
        },
        '11B21': {
            listname: '道路结冰',
            num: 0,
            iconName: 'yy-daolu',
            typePage: 1,
        },
        '11B19': {
            listname: '霾',
            num: 0,
            iconName: 'yy-mai',
            typePage: 1,
        },
        '11B06': {
            listname: '大风事件',
            num: 0,
            iconName: 'yy-dafeng',
            typePage: 1,
        },
        '11B25': {
            listname: '森林火险',
            num: 0,
            iconName: 'yy-senlin',
            typePage: 1,
        },
        '11B05': {
            listname: '寒潮事件',
            num: 0,
            iconName: 'yy-hanchao',
            typePage: 1,
        },
        '11B22': {
            listname: '干旱',
            num: 0,
            iconName: 'yy-ganhan',
            typePage: 2,
        },
        '11B04': {
            listname: '暴雪事件',
            num: 0,
            iconName: 'yy-baoxue',
            typePage: 2,
        },
        '11B01': {
            listname: '台风事件',
            num: 0,
            iconName: 'yy-taifeng',
            typePage: 2,
        },
        '11B03': {
            listname: '暴雨事件',
            num: 0,
            iconName: 'yy-baoyu',
            typePage: 2,
        },
        '11B09': {
            listname: '高温事件',
            num: 0,
            iconName: 'yy-gaowen',
            typePage: 2,
        },
        '11B37': {
            listname: '地质灾害气象风险',
            num: 0,
            iconName: 'yy-dizhi',
            typePage: 2,
        },
        '11B56': {
            listname: '低温',
            num: 0,
            iconName: 'yy-diwen',
            typePage: 3,
        },
        '11B16': {
            listname: '霜冻事件',
            num: 0,
            iconName: 'yy-shuangdong',
            typePage: 3,
        },
        '11A01': {
            listname: '洪水',
            num: 0,
            iconName: 'yy-hongshui',
            typePage: 3,
        },
        '11B14': {
            listname: '雷电事件',
            num: 0,
            iconName: 'yy-leidian',
            typePage: 3,
        },
        '11B15': {
            listname: '冰雹事件',
            num: 0,
            iconName: 'yy-bingbao',
            typePage: 3,
        },
        '11B07': {
            listname: '沙尘暴事件',
            num: 0,
            iconName: 'yy-shachenbao',
            typePage: 3,
        },
        '00000': {
            listname: '其他',
            num: 0,
            iconName: 'yy-qita',
            // typePage: 3,
        },
    };
    private loading: any = true;
    private warnDatalist = [];
    // 页数
    private nowPage: number = 1;
    private eventInfoPop: any = null;

    // 查询数据的天数
    // todo
    // 临时改为180天保证有数据
    // 项目上为3天
    private filterLastDays: number = 180;
    private getPng(item: any) {
        let bg: string = '';
        const url = item.typeCode;
        switch (item.signallevel) {
            case '红色':
                bg = '01';
                break;
            case '橙色':
                bg = '02';
                break;
            case '黄色':
                bg = '03';
                break;
            default:
                bg = '04';
        }
        try {
            return require(`../../../../assets/img/warningInfo/warnimg/${url}_${bg}.png`);
        } catch {
            return require(`../../../../assets/img/warningInfo/warnimg/unknown_${bg}.png`);
        }
    }

    // 过滤出轮播中每页对应的类型
    private filtersSwipper(item: number) {
        const swipperJson: any = {};
        for (const listItem of Object.entries(this.datalist)) {
            const key = listItem[0];
            const val: any = listItem[1];
            if (val.typePage === item) {
                swipperJson[key] = val;
            }
        }
        return swipperJson;
    }
    // 事件信息类型
    private clickItemEvent(item: any, index: any) {
        this.geoFilter = false;
        this.flag = index;
        this.infoTitle = `${item.listname}预警信息`;
        this.getTypeList();
    }
    // 初始化显示选中及title
    private initTypeTit() {
        const key = Object.keys(this.datalist)[0];
        if ( key ) {
            this.flag = key;
            this.infoTitle = `${this.datalist[key].listname}预警信息`;
        }
    }
    // 点击某条事件信息
    private handleInfoDetail(item: any) {
        this.getComponent().locateToYujingPoint(item);
        // console.log('handleInfoDetail', item);
    }
    // 监听行政区划code发生改变
    @Watch('$store.state.gisMenuSearch.handResultData.districtCodeArrStr')
    private districtCodeArrStr() {
        this.geoFilter = true;
        this.districtCode = this.$store.state.gisMenuSearcxh.handResultData.districtCodeArrStr;
        this.getDatalist();
    }
    // gis方法
    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent(
        'queryResource',
        );
        return component;
    }
    private showGis() {
        this.getComponent().unload(); // 清除点
        this.getComponent().addData({
            TYPE: 'yujing',
            type: this.flag,
            opts: {
                opts: {
                    type: this.flag,
                    // startTime: '2019-10-5 15:28:55',
                    // endTime: '2019-12-24 09:28:55',
                    // startTime: this.timeChange(new Date().getTime() - 86400000 * 23),
                    // endTime: this.timeChange(new Date().getTime()),
                    startTime: this.$moment().subtract('days', this.filterLastDays).format('YYYY-MM-DD HH:mm:ss'),  // 三天
                    endTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
                    districtCode: this.districtCode,
                },
            },
            geoFilter: this.geoFilter,
        });
    }
    // pageSize 改变时会触发
    private handleSizeChange(val: any) {
        console.log('pageSize 改变时会触发');
    }

    private handleCurrentChange(val: any) {
        this.nowPage = val;
        this.getTypeList();
    }

    // 获取类型数据列表
    private getTypeList() {
        const opt2 = {
            type: this.flag,
            // startTime: '2019-10-5 15:28:55',
            // endTime: '2019-12-24 09:28:55',
            // startTime: this.timeChange(new Date().getTime() - 86400000 * 23),
            // endTime: this.timeChange(new Date().getTime()),
            startTime: this.$moment().subtract('days', this.filterLastDays).format('YYYY-MM-DD HH:mm:ss'),  // 三天
            endTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
            districtCode: this.districtCode,
            pageSize: 5,
            nowPage: this.nowPage,
        };
        this.loading = true;
        warningInfoServer.getTypeData(opt2).then((res: any) => {
            this.loading = false;
            this.totalNum = res.data.total;
            this.warnDatalist = res.data.list;
        });
        this.showGis();
    }

    // 根据行政code获取类型数据
    private getDatalist() {
        this.flag = ''; // 获取数据前清除默认选中类型
        // 预警信息统计
        const opt1 = {
            // startTime: this.$moment().subtract('months', 1).format('YYYY-MM-DD HH:mm:ss'),  // 最近一个月
          startTime: this.$moment().subtract('months', 3).format('YYYY-MM-DD HH:mm:ss'),  // 测试需要,暂时修改成季度, 之前是三天
          endTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
            districtCode: this.districtCode,
        };
        warningInfoServer.getDataHas(opt1).then((res: any) => {
            console.log('行政区划类型', res.data);
            if (res.data.length) {
                const iconData: any = {};
                let swipperPage = 1;
                let sum = 0;
                const typePage = 'typePage';
                for (const item of res.data) {
                    // 给返回的数据添加typePage，用于判断属于轮播的那个页面
                    if (sum <= 5) {
                        sum++;
                        item.typePage = swipperPage;
                    } else {
                        sum = 1;
                        swipperPage++;
                        item.typePage = swipperPage;
                    }
                    if ( this.datalistModule[item.type] ) {
                        this.datalistModule[item.type].num = item.count;
                        this.datalistModule[item.type].listname = item.name;
                        this.datalistModule[item.type].typePage = item.typePage;
                        iconData[item.type] = this.datalistModule[item.type];
                    }
                }
                this.datalist = iconData;
            }
            this.initTypeTit();
            this.getTypeList();
        });
    }

    // 格式化时间
    private timeChange(dates: any) {
        const date = new Date(dates);
        const year = date.getFullYear();
        let mouth: string | number = date.getMonth() + 1;
        mouth = mouth < 10 ? '0' + mouth : mouth;
        let days: string | number = date.getDate();
        days = days < 10 ? '0' + days : days;
        let hours: string | number = date.getHours();
        hours = hours < 10 ? '0' + hours : hours;
        let sconds: string | number = date.getSeconds();
        sconds = sconds < 10 ? '0' + sconds : sconds;
        let miniuts: string | number = date.getMinutes();
        miniuts = miniuts < 10 ? '0' + miniuts : miniuts;
        const str = year + '-' + mouth + '-' + days + ' ' + hours + ':' + sconds + ':' + miniuts;
        return str;
    }
    private onShowPopup(event: any) {
      const self = this;
      // console.log(event);
      const eventInfo = {
        id: event.data.id,
        title: event.data.sender,
        content: event.data.cont,
        reportTime: '',
        location: '',
        longitude: event.data.longitude,
        latitude: event.data.latitude,
        eventType: (() => {
          switch (event.data.signallevel) {
            case '红色':
              return 'red';
            case '橙色':
              return 'orange';
            case '黄色':
              return 'yellow';
            case '蓝色':
              return 'blue';
            case '灰色':
              return 'gray';
          }
          return '';
        })(),
      };
      this.eventInfoPop = new EventInfoPop({
        el: '#' + event.content.id,
        data() {
          return {
            data: eventInfo,
            config: {
              title: 'title',
              content: 'content',
              time: 'reportTime',
              icon: 'eventType',
            },
          };
        },
        methods: {
          // 这个是关闭操作
          close() {
            self.getComponent().closePopup();
          },
        },
      });
    }
    private mounted() {
        this.$nextTick(() => {
            this.getDatalist();
        });
        this.getComponent().off('ClusterDistribute_popupEvent');
        this.getComponent().on('ClusterDistribute_popupEvent', this.onShowPopup, this);
    }
    private created() {
        this.districtCode = this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr || '';
    }
    private beforeDestroy() {
      this.getComponent().off('ClusterDistribute_popupEvent');
      this.getComponent().unload(); // 清除点
    }
}
</script>

<style lang="less">
    @url: '../../../../assets/img/warningInfo/';

    .yy-warning-info {
        // width: 100%;
        // height: 560px;

        //  position: relative;
        .el-carousel__item h3 {
            color: #475669;
            font-size: 14px;
            opacity: 0.75;
            line-height: 150px;
            margin: 0;
        }

        // .el-carousel__item:nth-child(2n) {
        //   // background-color: #99a9bf;
        // }

        // .el-carousel__item:nth-child(2n+1) {
        //   // background-color: #d3dce6;
        // }
        .el-carousel__button {
            height: 10px !important;
            width: 10px !important;
            border-radius: 50%;
        }

        .yy-text-title {
            width: 100%;
            height: 60px;
           text-align: center;
           // text-indent: 4em;
            line-height: 50px;
            color: #25bad8;
            font-size: 18px;
            font-weight: bold;
            background: url(/img/title_bg.da3392c2.png) no-repeat -4% 11%;
            -moz-background-size: 122% 133%;
            background-size: 122% 133%;
        }

        .yy-list-event {
            width: 100%;
            height: 90%;
            // background-color: red;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            display: flex;
            flex-wrap: wrap;
            .isChecked {
                background: url('@{url}yujing_active.png') no-repeat;
                -moz-background-size: 100% 100%;
                background-size: 100% 100%;
            }

            .yy-cell {
                // width: 180px;
                // width: 50%;
                height: 55px;
                line-height: 55px;
                margin-left: 20px;
                cursor: pointer;
                .yy-list-info {
                    float: left;
                    margin-left: 10px;
                    // width: calc(100% - 42px);
                    height: 100%;

                    .yy-list-info-num {
                        margin: 10px 0 1px 5px;
                        height: 20px;
                        width: 100%;
                        color: #3ef7fe;
                        font-size: 16px;
                        font-family: 'Impact';
                        line-height: 20px;
                        text-align: left;
                    }

                    .yy-list-info-event {
                        font-size: 16px;
                        text-align: left;
                        height: 20px;
                        line-height: 20px;
                        color: #fff;
                        width: 80px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .yy-iconSize {
                    width: 50px;
                    height: 100%;
                    background: #475669;
                }

                .yy-dawu {
                    float: left;
                    width: 50px;
                    // margin-top: 5px;
                    height: 50px;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}dawu_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-daolu {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}daolujiebing_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-mai {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}mai_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-dafeng {
                    float: left;
                    width: 50px;
                    height: 100%;
                    background: url('@{url}dafeng_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-senlin {
                    float: left;
                    width: 50px;
                    height: 100%;
                    background: url('@{url}senlin_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-hanchao {
                    float: left;
                    width: 50px;
                    height: 100%;
                    background: url('@{url}hanchao_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-baoxue {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}baoxue_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-taifeng {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}taifeng_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-baoyu {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}baoyu_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-gaowen {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}gaowen_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-dizhi {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}dizhi_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-diwen {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}diwen_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-shuangdong {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}shuangdong_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-ganhan {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}ganhan_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-hongshui {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}hongshui_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-leidian {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}leidian_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-bingbao {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}bingbao_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }

                .yy-shachenbao {
                    float: left;
                    width: 50px;
                    height: 100%;
                    // background: url('@{url}dawu_01.png') no-repeat 100% 100%;
                    // margin: 0 0 5px 10px;
                    background: url('@{url}shachenbao_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .yy-qita {
                    float: left;
                    width: 50px;
                    height: 100%;
                    background: url('@{url}qita.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
            }
        }

        .yy-botton-container {
            width: 100%;
            .yy-pagination {
                margin-top: 10px;
                width: 100%;
                display: flex;
                justify-content: center;
                flex-direction: row-reverse;
                .btn-next, .btn-prev {
                    background: rgba(0, 0, 0, 0.65);
                    border: 1px solid #00ffff;
                }
            }
            .el-pagination {
                padding: 0;
                .el-dialog,
                .el-pager li {
                    background: rgba(0, 0, 0, 0.65);
                    // color: #808e97;
                    border: 1px solid #00ffff;
                }
            }
            .yy-observatory-cell {
                width: 100%;
                height: 60px;
                margin-bottom: 5px;
                .typeClass {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                }
                .a11B17_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B17_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B17_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B17_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B17_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B17_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                // .a11B17_04{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                .a11B03_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B03_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B03_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B03_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B03_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B03_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B03_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B03_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B04_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B04_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B04_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B04_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B04_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B04_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B04_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B04_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B05_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B05_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B05_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B05_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B05_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B05_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B05_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B05_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B06_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B06_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B06_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B06_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B06_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B06_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B06_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B06_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B07_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B17_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B07_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B17_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B07_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B07_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                // .a11B07_04{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                .a11B09_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B09_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B09_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B09_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B09_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B09_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B09_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B09_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B14_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B14_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B14_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B14_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B14_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B14_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B14_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B14_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B15_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B15_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B15_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B15_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B15_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B15_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                // .a11B15_04{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                // .a11B16_01{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                .a11B16_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B16_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B16_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B16_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B16_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B16_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B17_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B17_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B17_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B17_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B17_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B17_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                // .a11B17_04{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                .a11B19_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B19_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B19_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B19_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B19_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B19_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                // .a11B19_04{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                .a11B20_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B20_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B20_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B20_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B20_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B20_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B21_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B21_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B21_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B21_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B21_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B21_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                // .a11B21_04{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                .a11B22_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B22_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B22_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B22_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                // .a11B22_03{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B22_03.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                // .a11B22_04{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B17_04.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                .a11B25_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B25_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B25_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B25_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                // .a11B25_03{
                //   float: left;
                //   height: 42px;
                //   width: 50px;
                //   margin: 10px 0 0 15px;
                //   background: url('@{url}warnimg/11B25_03.png') no-repeat;
                //   -moz-background-size: 100% 100%;
                //   background-size: 100% 100%;
                // }
                .a11B25_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B25_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B25_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B25_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B37_01 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B37_01.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B37_02 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B37_02.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B37_03 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B37_03.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .a11B37_04 {
                    float: left;
                    height: 42px;
                    width: 50px;
                    margin: 10px 0 0 15px;
                    background: url('@{url}warnimg/11B37_04.png') no-repeat;
                    -moz-background-size: 100% 100%;
                    background-size: 100% 100%;
                }
                .yy-observatory-right {
                    float: left;
                    height: 50px;
                    margin-left: 10px;
                    .yy-observatory {
                        font-size: 16px;
                        color: #ffffff;
                        width: 160px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-bottom: 5px;
                        cursor: pointer;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .yy-observatory-time {
                        font-size: 14px;
                        color: #b9babc;
                    }
                }
            }
        }
    }

    .yy-nodata {
        width: 100%;
        height: 200px!important;
        text-align: center;
        font-size: 22px;
        color: #25bad8;
    }
</style>
