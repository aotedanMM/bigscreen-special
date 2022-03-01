<!-- 承灾体 -->
<template>
    <div class="body">
        <PopupsBorder :title="title" :show="show" >
            <PopupsBodyMenu :isRadio="isRadio" ref="yjzyRef" v-if="show"
                            :listData="listData"
                            :clickTitleItem="clickTitleItem"
                            :clickCheckedItem="clickCheckedItem"

            />
        </PopupsBorder>

        <CommonList v-if="paramForList.curCheckedItemArr.length"
                    :paramForList="paramForList"
                    :loading="loading"
                    :commonListRowClick="commonListRowClick"
                    :closedThisPanel="closedThisList"
                    @handleCurrentChange="handleCurrentChange"
                    :inputSearchFun="inputSearchFun"></CommonList>
        <!--<CommonStatic></CommonStatic>-->

    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PopupsBorder from '@/components/feature/GIS/GisMenuSearch/PopupsBorder.vue';
import PopupsBodyMenu from '@/components/feature/GIS/GisMenuSearch/PopupsBodyMenu.vue';
import { resourceanalysisServer } from '@/api/feature/normal/installNormalServer';
import CommonList from '@/components/feature/GIS/GisMenuSearch/CommonList.vue';
import {
    districtServer,
} from '@/api/installServer';
import {normalResourceServer} from '@/api/installServer.ts';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';

@Component({
  name: 'HazardAffectedBody',
  components: {
    PopupsBorder,
    PopupsBodyMenu,
      CommonList,
  },
})
export default class HazardAffectedBody extends Vue {
  @Prop() public show?: boolean;
  @Prop() public title?: string;
  private listData: any = [];
  // private eventType: any = '';
    private isRadio = true; // 是否全国。如果是全国那种，则要单选
    // 当前页面上选中的checked,这里存放树结构叶子节点上的基础数据，和通过接口查回来的详情数据，给列表用的。尤其是select框
    private curCheckedItemArr: any = [];
    // 这里存放通过接口查回来的详情数据，给curCheckedItemArr、列表用的。尤其是select框
    private listShowDictConfigDefault = { // 给表格显示字段用的如果在字典表李找不到，则用这个。
        tableConfig: [{
            key: 'name',
            width: '',
            title: '名称',
        },
            {
                key: 'address',
                width: '',
                title: '地址',
            },
        ],
    };
    private pageSize: number = 5;
    private currentPage: number = 1;
    private keywords: any = '';
    private listShowDictConfig = { // 给表格显示字段用的。
        // emergencypart: {
        //     tableConfig: [
        //         {
        //             key: 'unitname',
        //             width: '',
        //             title: '名称',
        //         },
        //         {
        //             key: 'unitaddress',
        //             width: '',
        //             title: '地址',
        //         },
        //     ],
        // },
        // 'RescueTeam':{ // 队伍包含这个字符串
        //     tableConfig : [
        //         { key: 'NAME', width: '', title: '名称' },
        //         { key: 'ADDRESS', width: '', title: '地址' },
        //         // { key: 'ADDRESS', width: '', title: '预估时间' }, 没这个字段
        //         // { key: 'ADDRESS', width: '', title: '距离(km)' },
        //     ]
        // },
        // 'equipment':{ // 装备包含这个字符串
        //     tableConfig : [
        //         { key: 'NAME', width: '', title: '名称' },
        //         { key: 'ADDRESS', width: '', title: '地址' },
        //     ]
        // },
        // 'WARBASE':{ // 战保基地
        //     tableConfig : [
        //         { key: 'NAME', width: '', title: '名称' },
        //         { key: 'ADDRESS', width: '', title: '地址' },
        //     ]
        // },
        // 'ANJIAN_REPERTORY':{ // 储备库
        //     tableConfig : [
        //         { key: 'NAME', width: '', title: '名称' },
        //         { key: 'ADDRESS', width: '', title: '地址' },
        //     ]
        // },
        // 'Shelter':{ // 避难场所
        //     tableConfig : [
        //         { key: 'NAME', width: '', title: '名称' },
        //         { key: 'ADDRESS', width: '', title: '地址' },
        //     ]
        // },
        // 'DisasterPer':{ // 灾情信息员
        //     tableConfig : [
        //         { key: 'NAME', width: '', title: '名称' },
        //         { key: 'ADDRESS', width: '', title: '地址' },
        //     ]
        // },
        // 'Expert':{ // 专家
        //     tableConfig : [
        //         { key: 'NAME', width: '', title: '名称' },
        //         { key: 'ADDRESS', width: '', title: '地址' },
        //     ]
        // },
    };
    private dictConfig = { // 这里是动态的
        // 'mineteam': {
        //     detailData ：，// 当前节点拿到的数据，缓存下
        // }

    };
    // 存放最新的点击且为checked的数据，给select中的当前展示数据用的。
    private curCheckedItem: any = {};

    private  codeList: any[] = []; // 存放，当前树结构上，所有的待查的code数组

    // 给列表组件的参数
    private paramForList: any = {
        isHasSelect: false,
        curCheckedItemArr: [],
        curSelectItem: {},
        total: '',
    };
    private loading: boolean = false;
    private opts: any = {};
    public getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component: any = factory.commonFactory.getComponent('queryResource');
        return component;
    }

    private handleCurrentChange(curPageSize: any, currentPage: any, subItem: any) {
        this.pageSize = curPageSize;
        this.currentPage = currentPage;
        this.curCheckedItem = subItem;
        this.getData_other(this.curCheckedItem, this.isRadio, this.keywords);
    }

    // private async getListNuber(resourceKeys: any) {
    //     // 分组统计
    //     const geojsonStr =
    //         '{"type":"Polygon","coordinates":[[[116.35,40.31915764205975],[116.37890505584808,40.31861303713406],[116.40773908816048,40.316980560677585],[116.4364312582776,40.31426422416549],[116.46491109670495,40.310470701777824],[116.4931086862314,40.305609313020824],[116.52095484329834,40.29969199847434],[116.54838129705094,40.29273328874234],[116.57532086551342,40.28475026670554],[116.60170762834568,40.27576252319495],[116.62747709565473,40.26579210622638],[116.65256637235419,40.25486346395481],[116.67691431758689,40.24300338152674],[116.70046169874864,40.23024091202603],[116.72315133967795,40.216607301726285],[116.74492826260284,40.20213590987796],[116.76573982346491,40.186862123274025],[116.78553584027124,40.170823265850906],[116.80426871415472,40.154058503594534],[116.82189354285606,40.136608745032476],[116.83836822637181,40.118516537602986],[116.85365356454662,40.09982596020115],[116.86771334641897,40.08058251220953],[116.8805144311627,40.06083299932729],[116.89202682049917,40.04062541651691],[116.90222372248503,40.02000882839197],[116.91108160661257,39.99903324737136],[116.91858025018826,39.97774950992826],[116.92470277598505,39.95620915126169],[116.92943568119043,39.934464278718586],[116.93276885769926,39.91256744429293],[116.93469560382547,39.89057151652556],[116.93521262752891,39.86852955212565],[116.93432004127763,39.8464946676301],[116.93202134868412,39.824519911412786],[116.92832342307457,39.8026581363493],[116.92323647816642,39.780961873437164],[116.91677403104526,39.75948320666422],[116.90895285764684,39.738273649410694],[116.89979294096136,39.7173840226622],[116.88931741218988,39.69686433530325],[116.87755248509028,39.67676366675125],[116.86452738376052,39.65713005218285],[116.85027426411231,39.63801037059442],[116.83482812929547,39.61945023592943],[116.81822673933598,39.60149389149549],[116.8005105152568,39.584184107884035],[116.78172243795078,39.56756208459557],[116.76190794207814,39.55166735556347],[116.7411148052617,39.53653769875875],[116.71939303285308,39.52220905004887],[116.69679473854292,39.50871542147228],[116.67337402108751,39.49608882408144],[116.64918683742319,39.48435919549604],[116.62429087243748,39.47355433229821],[116.59874540566558,39.46369982739185],[116.57261117517741,39.45481901243744],[116.5459502389196,39.446932905464436],[116.51882583377386,39.44006016375292],[116.4913022325917,39.434217042066535],[116.46344459946329,39.42941735630903],[116.43531884347611,39.42567245266664],[116.40699147121836,39.422991182289266],[116.37852943827954,39.42137988155336],[116.35,39.420842357940245],[116.32147056172045,39.42137988155336],[116.29300852878163,39.422991182289266],[116.26468115652388,39.42567245266664],[116.2365554005367,39.42941735630903],[116.20869776740827,39.434217042066535],[116.18117416622613,39.44006016375292],[116.15404976108039,39.446932905464436],[116.12738882482256,39.45481901243744],[116.1012545943344,39.46369982739185],[116.07570912756249,39.47355433229821],[116.0508131625768,39.48435919549604],[116.02662597891248,39.49608882408144],[116.00320526145705,39.50871542147228],[115.9806069671469,39.52220905004887],[115.95888519473827,39.53653769875875],[115.93809205792185,39.55166735556347],[115.9182775620492,39.56756208459557],[115.89948948474319,39.584184107884035],[115.88177326066399,39.60149389149549],[115.8651718707045,39.61945023592943],[115.84972573588766,39.63801037059442],[115.83547261623947,39.65713005218284],[115.82244751490968,39.67676366675125],[115.81068258781009,39.69686433530325],[115.80020705903863,39.7173840226622],[115.79104714235314,39.738273649410694],[115.78322596895471,39.75948320666422],[115.77676352183356,39.78096187343715],[115.7716765769254,39.8026581363493],[115.76797865131587,39.824519911412786],[115.76567995872236,39.8464946676301],[115.76478737247106,39.86852955212565],[115.76530439617451,39.89057151652556],[115.7672311423007,39.91256744429293],[115.77056431880955,39.934464278718586],[115.77529722401492,39.95620915126169],[115.7814197498117,39.97774950992826],[115.7889183933874,39.99903324737136],[115.79777627751493,40.02000882839197],[115.8079731795008,40.04062541651691],[115.81948556883728,40.06083299932729],[115.83228665358102,40.08058251220953],[115.84634643545333,40.09982596020115],[115.86163177362818,40.118516537602986],[115.87810645714393,40.136608745032476],[115.89573128584526,40.154058503594534],[115.91446415972874,40.170823265850906],[115.93426017653508,40.186862123274025],[115.95507173739715,40.20213590987796],[115.97684866032202,40.216607301726285],[115.99953830125135,40.23024091202603],[116.02308568241308,40.24300338152674],[116.04743362764579,40.25486346395481],[116.07252290434526,40.26579210622638],[116.09829237165431,40.27576252319495],[116.12467913448656,40.28475026670554],[116.15161870294904,40.29273328874234],[116.17904515670165,40.29969199847434],[116.20689131376858,40.305609313020824],[116.23508890329502,40.310470701777824],[116.26356874172238,40.31426422416549],[116.2922609118395,40.316980560677585],[116.3210949441519,40.31861303713406],[116.35,40.31915764205975]]]}';
    //     const opts = { resourceKeys, geometry: JSON.parse(geojsonStr) };
    //     return await resourceanalysisServer.getGroupCounts(opts);
    // }



    @Watch('$store.state.gisMenuSearch.handResultData.curResultType')
    private changeIsRadio(val: any) {
        this.isRadio = (val === 'quanguo') ? true : false;
    }

    @Watch('$store.state.gisMenuSearch.handResultData.isRefeshData')
    private changeIsRefeshData(val: any) {
        if (val === true) {
            this.getComponent().unload();
            this.getListNuber(this.codeList);
            (this.$refs as any).yjzyRef.updateAllChecked();
            this.paramForList.curCheckedItemArr = [];
        }
    }

    @Watch('$store.state.gisMenuSearch.eventType')
    private changeEventType(type: string) {
        this.eventType = type;
        this.getListData(type);
    }
    private getMapDataListFn(subItem: any, keywords: any) {
        const optsMap = JSON.parse(JSON.stringify(this.opts));
        optsMap.fields = ['DISTRICT', 'name', 'peoplenum'];
        normalResourceServer.getMapDataList(optsMap).then((resmap: any) => {
            if (!subItem.checked) {
                return;
            }
            if (!keywords) {
                this.mapFun_add(subItem, resmap);
            }
        });
    }
    // 点击树结构的标题
    private clickTitleItem(item: any) {
        // 隐藏常态模式事件分布
        this.messsageBus.emit('eventInfoMapShow', false);
        this.currentPage = 1;
        if (item.name === '人口分布') {
            item.code = item.name;
            if (item.checked) { // 绘制点

                // makeDetailData
                if (this.isRadio) { // 全国，单选
                    this.curCheckedItemArr = [];
                }
                // this.curCheckedItem = {};
                this.mapFun_addPopHeat(item);
            } else { // 删除点
                // console.log(2);
                if (this.isRadio) { // 全国，单选
                    this.curCheckedItemArr = [];
                }
                // this.curCheckedItem = {};
                this.makeDetailData();
                this.getComponent().clearByType('人口热力');
            }


        }
    }

    // 绘制人口热力
    private mapFun_addPopHeat(item: any) {
        // let carGeometry: any = ''; // opts.geometry
        const options: any = {
            TYPE: 'chengzaiti',
            type: '人口热力',
            geoFilter: false,
            opts: {
                // data: '',
                //     geometry: '',
                //     districtCode: isRadio ? '' : this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr,
            },
        };

        if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'districtCode') {
            options.opts.districtCode = this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr;
        } else {
            options.opts.geometry = this.$store.state.gisMenuSearch.handResultData.buffer;
        }

        this.getComponent().addData(options);
    }

    // 绘制房屋结构
    private mapFun_addHouseStruc(item: any) {

        // let carGeometry: any = ''; // opts.geometry
        const options: any = {
            TYPE: 'chengzaiti',
            type: '房屋结构',
            geoFilter: false,
            opts: {
                // data: '',
                //     geometry: '',
                //     districtCode: isRadio ? '' : this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr,
            },
        };


        options.opts.districtCode = this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr;


        this.getComponent().addData(options);
    }

    // 点击带有checked框的一行
    private clickCheckedItem(subItem: any) {
        this.currentPage = 1;
        // 隐藏常态模式事件分布
        this.messsageBus.emit('eventInfoMapShow', false);
        if (subItem.name === '房屋结构') {

                // item.code = item.name;
                if (subItem.checked) { // 绘制点

                    // makeDetailData
                    if (this.isRadio) { // 全国，单选
                        this.getComponent().unload();
                        this.curCheckedItemArr = [];
                    }
                    // this.curCheckedItem = {};
                    this.mapFun_addHouseStruc(subItem);
                } else { // 删除点
                    // console.log(2);
                    if (this.isRadio) { // 全国，单选
                        this.curCheckedItemArr = [];
                    }
                    // this.curCheckedItem = {};
                    this.makeDetailData();
                    this.getComponent().clearByType('房屋结构');
                }


        }


        if (subItem.checked) { // 选中，查数据
            this.curCheckedItem = subItem;
            if (this.isRadio) { // 全国单选
                this.getComponent().unload();
            }
            this.getData_other(subItem, this.isRadio);
            this.getMapDataListFn(subItem, this.keywords);
        } else { // 反选清除地图
            this.paramForList.curCheckedItemArr = [];
            this.getComponent().clearByType(subItem.code);
        }

        // 获得所有选中的数组
        const checkedAllArr = (this.$refs as any).yjzyRef.getAllCheckedArr();
        // 将原来有现在无的去除，新增的加上，但是依然存在的详情数据依然要缓存
        // 去除人口热力
        // checkedAllArr.findIndex
        this.curCheckedItemArr = checkedAllArr;

    }

    private closedThisList() {
        this.paramForList.curCheckedItemArr = [];
        (this.$refs as any).yjzyRef.updateAllChecked();
        this.getComponent().unload();
    }

    // 节点点击-资源查询
    // 状态改变的那一行 subItem(checked的那一行)
    // isRadio 是否是默认全国
    // keywords在列表那里有一个关键字查询
    private getData_other(subItem: any, isRadio: boolean, keywords?: string) {
        this.loading = true;
        // let
        const opts: any = {};
        opts.pageSize = this.pageSize;
        opts.pageIndex = this.currentPage;
        opts.resourceKeys = [subItem.code];
        this.opts = opts;
        // 默认全国
        if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'quanguo') {
            opts.districtCodes = '';
        } else if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'districtCode') { // 右侧面板的行政区划
            opts.districtCodes = this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr;
        } else {
            opts.buffer = this.$store.state.gisMenuSearch.handResultData.buffer;
        }
        if (keywords) { // 在关键字查询的时候，地图不重新绘制点
            opts.keyword = keywords;
        }
        resourceanalysisServer.getNearbyList(opts).then((res2: any) => {
            if (!subItem.checked) {
                return;
            }
            // 把从接口返回的数据做缓存
            if ((this as any).dictConfig[subItem.code]) {
                (this as any).dictConfig[subItem.code].detailData = res2.list[0].data;
            } else {
                (this as any).dictConfig[subItem.code] = {};
                (this as any).dictConfig[subItem.code].detailData = res2.list[0].data;
            }

            // 给select制作数据

            // this.mapFun_add(subItem, res2);
            // 给select制作数据
            this.makeDetailData(!!keywords || (keywords === ''));
            // if (!keywords) {
            //     this.mapFun_add(subItem, res2);
            // }
            this.paramForList.total = res2.total;
            this.loading = false;
        });

    }

    // 地图标点
    private mapFun_add(subItem: any, res: any) {
        const options: any = {
            TYPE: 'chengzaiti',
            type: subItem.code,
            geoFilter: !this.isRadio,
            opts: {
                data: res,
                //     geometry: '',
                //     districtCode: isRadio ? '' : this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr,
            },
        };
        if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'quanguo') {
            options.opts.districtCode = '';
        } else if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'districtCode') { // 右侧面板的行政区划
            options.opts.districtCode = this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr;
        } else {
            options.opts.geometry = this.$store.state.gisMenuSearch.handResultData.buffer;
        }
        // this.makeDetailData();
        this.getComponent().addData(options);
    }

    // 给列表制作数据
    private makeDetailData(isInputFlag?: boolean) {
        let isHasSelect = false;
        if (this.isRadio) { // 全国默认是没有select的
            isHasSelect = false; // 是否有select框
            // const  this.curCheckedItemArr;
        } else {
            isHasSelect = true; // 是否有select框
        }

        let curSelectItem: any = {};
        const total: any = this.paramForList.total;
        const curCheckedItemArr = this.curCheckedItemArr.map((item: any) => {
            if (item.name === '车辆实时位置') {
                item.code = item.name;
            }
            item.detailData = (this as any).dictConfig[item.code].detailData;
            // 以下是为了配置表格的表头等
            const code = item.code;
            const listShowDictConfigKeys: any[] = Object.keys(this.listShowDictConfig);
            const targetListShowDictConfigKey = listShowDictConfigKeys.find((litem: any) => {
                return code.includes(litem);
            });
            if (targetListShowDictConfigKey) { //
                item.tableConfig = (this as any).listShowDictConfig[targetListShowDictConfigKey].tableConfig;
            } else {
                item.tableConfig = this.listShowDictConfigDefault.tableConfig;
            }

            if (this.curCheckedItem.code === item.code) {
                curSelectItem = item;
            }
            return item;
        });
        if (!curSelectItem.code) {
            this.curCheckedItem = this.curCheckedItemArr[0];
        }

        this.paramForList = {
            isHasSelect,
            curCheckedItemArr,
            curSelectItem,
            isInputFlag,
            total,
        };
    }

//  列表中搜索 dataSource列表中的那个selected被选中的
    private inputSearchFun(keywords: string, dataSource: any) {
        this.curCheckedItem = dataSource;
        this.keywords = keywords.trim();
        this.currentPage = 1;
        this.getData_other(dataSource, this.isRadio, keywords.trim());

    }

  // 获得树结构
    private getListData(type: string) {
        resourceanalysisServer.getDisasterEntitiesTree(type).then((data: any) => {
            // 构建树结构
            data.forEach((v: any) => {
                if (v.pId === 0) {
                    this.listData.push(v);
                } else {
                    this.listData.forEach((k: any, j: number) => {
                        if (!this.listData[j].subList) {
                            this.listData[j].subList = [];
                        }
                        if (k.id === v.pId) {
                            this.listData[j].subList.push(v);
                        }
                    });
                }
            });
            // 设置下拉箭头状态
            this.listData.forEach((v: any, i: number) => {
                if (v.subList.length) {
                    if (v.open) {
                        this.listData[i].arrow = true;
                    } else {
                        this.listData[i].arrow = false;
                    }
                } else {
                    this.listData[i].arrow = false;
                }
            });
            // 获取子节点code
            const codeList: any = [];
            this.listData.forEach((v: any, i: number) => {
                v.subList.forEach((k: any, j: number) => {
                    codeList.push(k.code);
                });
            });
            this.codeList = codeList;
            // 获取子节点数据的数量
            this.getListNuber(codeList);
        });
    }


    // 获得树节点上的数据
    private async getListNuber(resourceKeys: any) {
        this.$store.commit('gisMenuSearch/changeIsRefeshData', false);
        // this.$store.state.gisMenuSearch.changeHandResult.isRefeshData = ;
        const opts: any = {};
        opts.resourceKeys = resourceKeys;
        // 默认全国
        if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'quanguo') {
            opts.districtCodes = '';
        } else if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'districtCode') { // 右侧面板的行政区划
            opts.districtCodes = this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr;
        } else {
            opts.geometry = this.$store.state.gisMenuSearch.handResultData.buffer;
        }
        resourceanalysisServer.getGroupCounts(opts).then((res: any) => {
            const listData = JSON.parse(JSON.stringify(this.listData));
            const result = res[0];
            listData.forEach((v: any, i: number) => {
                v.subList.forEach((k: any, j: number) => {
                    listData[i].subList[j].num = 0;
                    for (const item in result) {
                        if (item === k.code) {
                            // this.$set();
                            listData[i].subList[j].num = result[item].count;
                            return '';
                        }
                    }
                });
            });
            this.listData = listData;
        });
    }

    private commonListRowClick(data: any , listTitle: string) {
        console.log('rowData', data);
        this.getComponent().locateToCYPoint(data, listTitle);
    }

    private onShowPopup(event: any) {
        console.log('event=>' , event);

        const  self = this;
        const param = {
            that: self,
            popupId: 'ClusterDistribute_popup',  //  监听id，必须
            moduleTypeID: 'queryResource', //  实体类资源模块id，必须
        };
        const popUpTemplate = new renderpopUpTemplate();
        popUpTemplate.getParams(param);
        popUpTemplate.onShowPopup(event);
    }

    private destroyed() {
        this.getComponent().unload();
        // this.getComponent().off('ClusterDistribute_popupEvent');
    }

    private created() {
        this.isRadio = (this.$store.state.gisMenuSearch.handResultData.curResultType === 'quanguo') ? true : false;
        this.eventType = this.$store.state.gisMenuSearch.eventType;
        this.getListData(this.eventType);
        // resourceanalysisServer.getDisasterEntitiesTree().then((data: any) => {
        //   data.forEach((v: any) => {
        //     if (v.pId === 0) {
        //       this.listData.push(v);
        //     } else {
        //       this.listData.forEach((k: any, j: number) => {
        //         if (!this.listData[j].subList) {
        //           this.listData[j].subList = [];
        //         }
        //         if (k.id === v.pId) {
        //           this.listData[j].subList.push(v);
        //         }
        //       });
        //     }
        //   });
        //   // 设置下拉箭头状态
        //   this.listData.forEach((v: any, i: number) => {
        //     if (v.subList.length) {
        //       if (v.open) {
        //         this.listData[i].arrow = true;
        //       } else {
        //         this.listData[i].arrow = false;
        //       }
        //     } else {
        //       this.listData[i].arrow = false;
        //     }
        //   });
        //   // 获取子节点code
        //   const codeList: any = [];
        //   this.listData.forEach((v: any, i: number) => {
        //     v.subList.forEach((k: any, j: number) => {
        //       codeList.push(k.code);
        //     });
        //   });
        //   // 获取子节点数据的数量
        //   this.getListNuber(codeList).then((res: any) => {
        //     const result = res[0];
        //     this.listData.forEach((v: any, i: number) => {
        //       v.subList.forEach((k: any, j: number) => {
        //         stop: for (const item in result) {
        //           if (item === k.code) {
        //             k.num = result[item].count;
        //             return stop;
        //           }
        //         }
        //       });
        //     });
        //   });
        // });
    }

    private mounted() {
        this.getComponent().off('ClusterDistribute_popupEvent');
        this.getComponent().on('ClusterDistribute_popupEvent', this.onShowPopup, this);
    }

}
</script>
