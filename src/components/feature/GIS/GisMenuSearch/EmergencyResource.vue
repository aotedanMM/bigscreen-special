<!-- 应急资源 -->
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
                :inputSearchFun="inputSearchFun"
                @handleCurrentChange="handleCurrentChange"
                >
    </CommonList>
    <!--<CommonStatic></CommonStatic>-->

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
import PopupsBodyMenu from '@/components/feature/GIS/GisMenuSearch/PopupsBodyMenu.vue';
import {
    resourceanalysisServer,
} from '@/api/feature/normal/installNormalServer';
import {
    districtServer,
} from '@/api/installServer';
import {normalResourceServer} from '@/api/installServer.ts';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';
import CommonList from '@/components/feature/GIS/GisMenuSearch/CommonList.vue';
import CommonStatic from '@/components/feature/GIS/GisMenuSearch/CommonStatic.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';

@Component({
    name: 'EmergencyResource',
    components: {
        PopupsBorder,
        PopupsBodyMenu,
        CommonList,
        CommonStatic,
    },
})
export default class EmergencyResource extends Vue {
    @Prop() private show ?: boolean;
    @Prop() private title ?: string;
    private listData: any = []; // 树结构的数据
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
    private listShowDictConfig = { // 给表格显示字段用的。
        fireCar: {
            tableConfig: [
                {
                    key: 'NAME',
                    width: '',
                    title: '名称',
                },
                {
                    key: 'LON',
                    width: '',
                    title: '经度',
                },
                {
                    key: 'LAT',
                    width: '',
                    title: '纬度',
                },
            ],
        },
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
    private pageSize: number = 5;
    private currentPage: number = 1;
    private keywords: any = '';
    private selectedNodeName: any = '';
    private loading: boolean = false;
    private opts: any = {};
    public getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component: any = factory.commonFactory.getComponent('queryResource');
        return component;
    }

    public created() {
        this.isRadio = (this.$store.state.gisMenuSearch.handResultData.curResultType === 'quanguo') ? true : false;
        this.eventType = this.$store.state.gisMenuSearch.eventType;
        this.getListData(this.eventType);

    }

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

    // 获取所有数据
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
    private handleCurrentChange(curPageSize: any, currentPage: any, subItem: any) {
        this.pageSize = curPageSize;
        this.currentPage = currentPage;
        this.curCheckedItem = subItem;
        if (this.selectedNodeName === '车辆实时位置' && subItem.code === 'fireCar') {
            this.mapFun_addCar(this.curCheckedItem);
        } else {
            this.getData_other(this.curCheckedItem, this.isRadio, this.keywords);
        }
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

    // 获得树结构
    private getListData(type: string) {
        resourceanalysisServer.getEmergeResourceTree(type).then((data: any) => {
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

    // 点击树结构的标题
    private clickTitleItem(item: any) {
        this.currentPage = 1;
        this.selectedNodeName = item.name;
        if (item.name === '车辆实时位置') {
            // item.code = item.name;
            if (item.checked) { // 绘制点
                // makeDetailData
                if (this.isRadio) { // 全国，单选
                    this.curCheckedItemArr = [item];
                } else {
                    this.curCheckedItemArr.push(item);
                }
                this.curCheckedItem = item;
                this.mapFun_addCar(item);
            } else { // 删除点
                // console.log(2);
                if (this.isRadio) { // 全国，单选
                    this.curCheckedItemArr = [];
                } else {
                    const findex = this.curCheckedItemArr.findIndex((fitem: any ) => {
                        return item.code === fitem.code;
                    });
                    this.curCheckedItemArr.splice(findex, 1);
                }
                this.curCheckedItem = {};
                this.makeDetailData();
                this.getComponent().clearByType('clsswz');
            }
        }
    }

    // 点击带有checked框的一行
    private clickCheckedItem(subItem: any) {
        if (subItem.checked) { // 选中，查数据
            this.currentPage = 1;
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
        this.curCheckedItemArr = checkedAllArr;
    }

    //  列表中搜索 dataSource列表中的那个selected被选中的
    private inputSearchFun(keywords: string, dataSource: any) {
        this.curCheckedItem = dataSource;
        this.currentPage = 1;
        this.keywords = keywords.trim();
        // this.curSourceData = dataSource.detailData;
        // if (dataSource.code === 'fireCar') { // 前端分页
        //     if (keywords.trim() === '') {
        //
        //         (this as any).dictConfig[dataSource.code].detailData = dataSource.curSoureData;
        //     } else {
        //         (this as any).dictConfig[dataSource.code].detailData = dataSource.detailData.filter((currentValue: any, index: number) => {
        //             return currentValue.NAME.includes(keywords.trim());
        //         });
        //     }
        //
        //
        //     this.makeDetailData(true);
        //     return ;
        // }
        if (this.selectedNodeName === '车辆实时位置' && this.curCheckedItem.code === 'fireCar') {
            this.mapFun_addCar(this.curCheckedItem);
        } else {
            this.getData_other(dataSource, this.isRadio, keywords.trim());
        }

    }

    // 关闭列表
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
        // 隐藏常态模式事件分布
        this.messsageBus.emit('eventInfoMapShow', false);
        this.loading = true;
        const opts: any = {};
        opts.resourceKeys = [subItem.code];
        opts.pageSize = this.pageSize;
        opts.pageIndex = this.currentPage;
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
            this.makeDetailData(!!keywords || (keywords === ''));
            // if (!keywords) {
            //     this.mapFun_add(subItem, res2);
            // }
            this.paramForList.total = res2.total;
            this.loading = false;
        });
        // const optsMap = JSON.parse(JSON.stringify(opts));
        // optsMap.fields = ['DISTRICT', 'name', 'peoplenum'];
        //     normalResourceServer.getMapDataList(optsMap).then((resmap: any) => {
        //         if (!subItem.checked) {
        //             return;
        //         }
        //         if (!keywords) {
        //             this.mapFun_add(subItem, resmap);
        //         }
        //     });
    }
    // 地图标点
    private mapFun_add(subItem: any, res: any) {
        const options: any = {
            TYPE: 'yingjiziyuan',
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

        this.getComponent().addData(options);
    }

    // 绘制车辆
    private mapFun_addCar(carItem: any) {
        // 隐藏常态模式事件分布
        this.messsageBus.emit('eventInfoMapShow', false);
        let carGeometry: any = ''; // opts.geometry
        const options: any = {
            TYPE: 'yingjiziyuan',
            type: 'clsswz',
            geoFilter: !this.isRadio,
            opts: {
                data: '',
                //     geometry: '',
                //     districtCode: isRadio ? '' : this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr,
            },
        };
        if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'quanguo') {
            carGeometry = '';
            const opts: any = {};
            opts.pageSize = this.pageSize;
            opts.pageIndex = this.currentPage;
            opts.keyWord = this.keywords;
            installSearchReosurce.realTimeCar.getFireEnginesInfo(opts).then((res: any) => {
                options.opts.data = res.data;
                this.paramForList.total = res.total;
                if ((this as any).dictConfig[carItem.code]) {
                    (this as any).dictConfig[carItem.code].detailData = res.data;
                } else {
                    (this as any).dictConfig[carItem.code] = {};
                    (this as any).dictConfig[carItem.code].detailData = res.data;
                }
                this.makeDetailData();
            });
            installSearchReosurce.realTimeCar.getFireEnginesMapData({}).then((res: any) => {
                options.opts.data = res.data;
                this.getComponent().addData(options); // 调地图方法
            });
        } else if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'districtCode') {
            // 右侧面板的行政区划
            // options.opts.districtCodes = this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr;
            districtServer.getDistrictsByCodes({
                code: this.$store.state.gisMenuSearch.handResultData.districtCodeArrStr.split(','),
            }).then((data: any) => {
                const geomArr: any = [];
                data.forEach((dditem: any) => {
                    geomArr.push(dditem.geom);
                });
                const geomObj: any = this.getComponent().unionGeometry(geomArr);
                const polygon = this.getComponent().geojsonToWkt(geomObj);
                const pageSize = this.pageSize;
                const pageIndex = this.currentPage;
                const keyWord = this.keywords;
                const carOpts = {
                    polygon,
                    pageSize,
                    pageIndex,
                    keyWord,
                };
                installSearchReosurce.realTimeCar.getFireEnginesInfo(carOpts).then((res: any) => {
                    options.opts.data = res.data;
                    this.paramForList.total = res.total;
                    if ((this as any).dictConfig[carItem.code]) {
                        (this as any).dictConfig[carItem.code].detailData = res.data;
                    } else {
                        (this as any).dictConfig[carItem.code] = {};
                        (this as any).dictConfig[carItem.code].detailData = res.data;
                    }
                    this.makeDetailData();
                });
                const carOpt = {
                    polygon,
                };
                installSearchReosurce.realTimeCar.getFireEnginesMapData(carOpt).then((res: any) => {
                    options.opts.data = res.data;
                    this.getComponent().addData(options); // 调地图方法
                });
            });
        } else { // 几何图形
            // options.opts.geometry = this.$store.state.gisMenuSearch.handResultData.buffer;
            const polygon = this.getComponent().geojsonToWkt(this.$store.state.gisMenuSearch.handResultData.buffer);
            const pageSize = this.pageSize;
            const pageIndex = this.currentPage;
            const keyWord = this.keywords;
            const carOpts = {
                polygon,
                pageSize,
                pageIndex,
                keyWord,
            };
            installSearchReosurce.realTimeCar.getFireEnginesInfo(carOpts).then((res: any) => {
                options.opts.data = res.data;
                this.paramForList.total = res.total;
                if ((this as any).dictConfig[carItem.code]) {
                    (this as any).dictConfig[carItem.code].detailData = res.data;
                } else {
                    (this as any).dictConfig[carItem.code] = {};
                    (this as any).dictConfig[carItem.code].detailData = res.data;
                }
                this.makeDetailData();
            });
            const carOpt = {
                polygon,
            };
            installSearchReosurce.realTimeCar.getFireEnginesMapData(carOpt).then((res: any) => {
                options.opts.data = res.data;
                this.getComponent().addData(options); // 调地图方法
            });
        }

    }

    // 给列表制作数据
    // isInputFlag 是否是通过input关键字过滤后，在进行的数据回填给列表
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
                /* item.code = item.name; */
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
            isHasSelect, // 是否有下拉
            curCheckedItemArr, // 下拉集合
            curSelectItem, // 下拉选中
            isInputFlag,
            total,
        };
    }

    // private beforeDestroy() {
    //     this.getComponent().unload();
    // }

    private destroyed() {
        this.getComponent().unload();
    }

    private commonListRowClick(data: any , listTitle: string) {
        console.log('rowData', data);
        this.getComponent().locateToCYPoint(data, listTitle);
    }
    // private getComponent1() {
    //     const factory = this.$ioc.resolve('GISFactory-map');
    //     const component = factory.commonFactory.getComponent('afterShock');
    //     return component;
    // }
    // 弹框
    /* ClusterDistribute_popupEvent  ClusterDistribute_popup queryResource*/
    private onShowPopup(event: any) {
        if (event.id === 'popup_FireCarPoints') {
            event.type = 'fireCar';
        }
        const eventLocation = [
            this.$store.state.eventPushStore.eventLocation.EventLon,
            this.$store.state.eventPushStore.eventLocation.EventLat,
        ];
        // console.log('event=>' , event);
        const  self = this;
        const param = {
            that: self,
            eventLocation, // 添加事故点定位经纬度
            popupId: 'ClusterDistribute_popup',  //  监听id，必须
            moduleTypeID: 'queryResource', //  实体类资源模块id，必须
        };
        const popUpTemplate = new renderpopUpTemplate();
        popUpTemplate.getParams(param);
        popUpTemplate.onShowPopup(event);
    }
    private mounted() {
        this.getComponent().off('ClusterDistribute_popupEvent');
        this.getComponent().on('ClusterDistribute_popupEvent', this.onShowPopup, this);
    }
}
</script>


<!--这部分代码需要 优化，里面有很多if等之类的，但是先不要删除，以防接口变化，和需求变化。-->
