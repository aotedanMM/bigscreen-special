<!--物资保障的首页-->
<template>
<div class="rescueTeamsHome">
    <div class="rescueTeamsHome_hd title-panel">
        <p>{{curTitle}}</p>
        <span v-if="($store.state.eventPushStore.eventLocation.EventType === '10') && ($store.state.TyphoonModule.viewConfig.tabChooseValue !== '2')" class="closeAndback" @click="closeAndbackFn"></span>
    </div>

    <template v-if="!loadingState">
        <!-- 5,10,20,50  -->
      <div class="DiscussTab"
            v-if="(!this.$store.state.configModel.config.quickStudy.notShowTabFlag 
                    && 
                    !this.$store.state.eventPushStore.eventLocation.geometry)
                    ||
                    (this.$store.state.eventPushStore.eventId
                    && 
                    !this.$store.state.eventPushStore.eventLocation.geometry)">
        <span class="DiscussTab_span" 
            v-for='(item, index) of tabList' 
            :class="{dengjihoverbglan:item.checked}" 
            @click.stop="handleTabClick(item, index)"
            :key='item.txt'> 
            <font class="f-tit-h2"> {{item.txt}}</font></span>
      </div>
      <div class="rescueTeamsHome_cnt">
              <div class="rescueTeamItem" v-for="(slItem, slIndex) of statisticsList" :key="slItem.key">
                  <div class="tempRight-title  f-tit-h2">
                      <!--只有当前选中且数据大于0的时候才会高亮-->
                      <span :title="slItem.title" @click.stop="handleClickStatisticsTitle(slItem,slIndex,statisticsList)" :class="((curActiveStatistics.key === slItem.key) && (slItem.count))? 'itemName-active' : ''">
                          {{slItem.title}}
                      </span>
                      <span class="tempRight-total"> <span class="f-number">{{slItem.count}}</span></span>
                      <span class="tempRight-unit">{{slItem.unit}}</span>
                      <i :class="slItem.showSub? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'" @click.stop="expandSublist(slItem, slIndex, statisticsList)"></i>
                  </div>
                  <template v-if="slItem.showSub">
                      <div class="tempRight-cont">
                          <el-scrollbar :wrap-style="'max-height:'+676/(statisticsList.length)+'px;'">
                          <div class="team-ul">
                              <div  class="tempRight-itemTitle" 
                                :class="{'gray':!slsItem.count}"
                                v-for="(slsItem,slsIndex) of slItem.subList" 
                                :key="slsItem.codeType">
                                <div class="tempRight-icon_bg" :class="slsItem.icon_bg">
                                    <i class="teamIcon" :class="'teamIcon-'+slsItem.icon"></i>
                                </div>
                                <div :class="slsItem.active? 'itemName-active' : ''" class="tempRight-itemName" :title="slsItem.name"  
                                    @click.stop="handleClickSubitemTitle(slsItem,slsIndex,slItem.subList,slItem,slIndex,statisticsList)">
                                    <span class="f-txt-com">{{slsItem.name}}</span>
                                </div>
                                <div class="tempRight-itemNum  f-txt-com" @click.stop="handleClickSubitemNum(slsItem,slsIndex,slItem.subList,slItem,slIndex,statisticsList)">
                                    <em class="text-number f-number">{{slsItem.count}}</em>
                                    <i class="text-unit">{{slsItem.unit}}</i>
                                </div>
                              </div>
                          </div>
                          </el-scrollbar>
                      </div>
                  </template>
              </div>
      </div>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
</div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import {
    Component,
    Vue,
    Prop,
    Watch,
} from 'vue-property-decorator';
import serverApi from '@/api/feature/disasterJudge/installDisasterJudgeServer';
@Component({
    name: 'MaterialHome',
    components: {},
})
export default class MaterialHome extends Vue {
    @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法

    private curCacheResData: any = {}; // 调用地图方法拿到的当前数据的汇总cache

    private curMapType: number = 0; // 当前类型：经验圈还是烈度圈 1是烈度圈，0是经验圈
    private curTitle: string = ''; // 本组件面板的title
    private loadingState: boolean = false;
    /** 5,10,20,50 */
    private tabList: any = []; // [5km,10km,20km,50km]
    private geometryArr: any = []; // 经验圈或者烈度圈的geometryArr

    /** statisticsList 统计面板 */
    private statisticsList: any = [];
    private curActiveStatistics: any = { // 当前选中的统计，例如队伍分布
        key: 'vue-created', // 专门给初始化用的key，用来和取消选中后，切换tab区分开
    };
    private statisticsListCache: any = []; // 用来缓存当前二级标题被点击的状态，用来做经验圈、烈度圈数据还原用的。

    /**
     * 更新当前选中（上图）的情况，针对一级标题
     */
    private handleClickStatisticsTitle(slItem: any, slIndex: number, statisticsList: any) {
        if (!slItem.count) { // 没有数据，不执行点击
            return;
        }

        this.statisticsListCache = []; // 清空二级标题选中的缓存
        this.getComponent().clear();

        // 相等反选，否则为true
        slItem.active = (this.curActiveStatistics.key === slItem.key) ? false : true;
        // this.statisticsList[slIndex] = slItem;
        // 利用引用地址
        this.statisticsList.forEach((slfItem: any, slfIndex: number) => {
            slfItem.active = (slfIndex === slIndex) ? slItem.active : false;
            slfItem.subList.forEach((slfsubItem: any, slfsubIndex: number) => {
                slfsubItem.active = false;
            });
        });

        if (slItem.active) { // 当前选中
            this.curActiveStatistics = JSON.parse(JSON.stringify(slItem));
            const codeTypeArr = this.getTypeArr(this.curActiveStatistics);
            const levelArr = this.getActiveTablistArr();
            this.getComponent().showResource(codeTypeArr, levelArr);
        } else {
            this.curActiveStatistics = {};
        }
    }

/**
 * 获得当前选中的tablist的level的字符串数组 ['20']或者 ['9','8']
*/
    private getActiveTablistArr() {
        const arr: any = [];
        this.tabList.forEach((item: any, index: number) => {
            if (item.checked) {
                arr.push(item.level);
            }
        });
        return arr;
    }

    /**
     * 更新当前选中（上图）的情况，针对二级标题
     * 这里把父级的数据也拿到了，为了以后扩展用
     */
    private handleClickSubitemTitle(slsItem: any, slsIndex: number, subList: any, slItem: any, slIndex: number, statisticsList: any) {
        if (!slsItem.count) { // 没有数据，不执行点击
            return;
        }
        const levelArr = this.getActiveTablistArr();
        // 由于一级标题互斥，且二级标题选中的时候，相应的一级标题要反选，所以这里要处理下
        if (this.curActiveStatistics.key) { // 有一级标题选中
            this.curActiveStatistics = {};
            this.getComponent().clear();
            // this.statisticsList.forEach((slfItem: any, slfIndex: number)=>{ // 所有二级标题高亮取消，但是理论上，有一级选中的时候，也不会有二级标题选中
            //     slfItem.active =  false;
            //     slfItem.subList.forEach((slfsubItem: any, slfsubIndex: number)=>{
            //         slfsubItem.active = false;
            //     })
            // })
        } else if (this.statisticsList.length > 1) { // 例如，当前点击的是第一个二级标题，但是，前突队伍的二级标题已经有高亮的了，要取消掉的
            // this.getComponent().clear();
            this.statisticsList.forEach((slfItem: any, slfIndex: number) => { // 所有二级标题高亮取消，但是理论上，有一级选中的时候，也不会有二级标题选中
                if (slfIndex !== slIndex) {
                    slfItem.subList.forEach((slfsubItem: any, slfsubIndex: number) => {
                        if ( slfsubItem.active) {
                            this.getComponent().hideResource([slfsubItem.codeType], levelArr);
                        }
                        slfsubItem.active = false;
                    });
                }
            });
        }

        slsItem.active = !slsItem.active;
        if (slsItem.active) { // 由未选中到选中，点位上图
            this.getComponent().showResource([slsItem.codeType], levelArr);
        } else { // 清除该点位
            this.getComponent().hideResource([slsItem.codeType], levelArr);
        }

        this.statisticsListCache = JSON.parse(JSON.stringify(this.statisticsList));
    }

    /**
     * 点击二级标题的数字
     * 这里把父级的数据也拿到了，为了以后扩展用
     */
    private handleClickSubitemNum(slsItem: any, slsIndex: number, subList: any, slItem: any, slIndex: number, statisticsList: any) {
        if (!slsItem.count) {
            return ;
        }
        // const tabIndex = this.tabList.findIndex((tfItem: any, tfIndex: number) => {
        //     return tfItem.txt === this.curActiveTab.txt;
        // });

        const paramObj = {
            curNumItem: slsItem, // 当前选中的数字那一个对象
            curActiveTab: this.tabList, // 当前的队伍首页上边的那个tablist数组
            curMapParam: 'disasterJudgeNewRepertory', // 地图的参数
            unit: '个', // 单位
            // curActiveTabIndex: tabIndex, // tab的数组下标
            curStatisticsItem: slItem, // 当前选中的队伍分布或者前突队伍的那个大的对象
            curActiveStatistics: this.curActiveStatistics, // 当前高亮的一级标题
            curStatisticsListCache: this.statisticsListCache, // 缓存二级标题的高亮
        };
        if (this.parentHandleClickNumFn) {
            this.parentHandleClickNumFn(JSON.parse(JSON.stringify(paramObj)));
        }
    }

    /**
     * 监听烈度圈：1 ; 经验圈：0
     * 当图例改变时，这个面板要改变
     */
    @Watch('$store.state.controlMoudle.mapCircleQueryType')
    private async getDataToCache(val?: any) {
        this.loadingState = true;
        const tmpCacheResData: any = {};
        const vuexStatisticsList = JSON.parse(JSON.stringify(this.$store.state.configModel.config.MaterialContainer.statisticsList));
        for (const vslItem of vuexStatisticsList) { // 不用forearch的原因是，foreach和async在一起用，是并发。使得前突队伍和队伍分布的顺序会串掉
            const typeCodeArr = this.getTypeArr(vslItem);
            var result: any = {};
            result = await this.getDataByTeamTypeArr(typeCodeArr);
            tmpCacheResData[vslItem.key] = result;
            tmpCacheResData.forTab = result;
        }
        this.loadingState = false;
        this.curCacheResData = this.getTablistCache(tmpCacheResData);

        if (this.$store.state.controlMoudle.mapCircleQueryType === 0) { // 经验圈
            this.tabList = this.setRadiusTablist();
            const curActiveTabIndex = this.setRadiusDefault();
            this.handleTabClick(this.tabList[curActiveTabIndex], curActiveTabIndex);
        } else if ( this.$store.state.controlMoudle.mapCircleQueryType === 1 ) { // 烈度圈
            this.tabList = this.setLieduTablist();
            const curActiveTabIndex = this.setLieduDefault();
            this.handleTabClick(this.tabList[curActiveTabIndex], curActiveTabIndex);
        }
    }


/**
 * 获得tablist
*/
    private getTablistCache(cacheResData: any) {
        var tablist: any = [];
        if (this.$store.state.controlMoudle.mapCircleQueryType === 0) { // 经验圈
            tablist = this.getRadiusTabList(cacheResData.forTab[0].data);
        } else if ( this.$store.state.controlMoudle.mapCircleQueryType === 1 ) { // 烈度圈
            tablist = this.getLieduTabList(cacheResData.forTab[0].data);
        }
        return  this.setTabStatisticsList(cacheResData, tablist);
    }
/**
 * 获得经验圈的tablist
*/
    private getRadiusTabList(resDataArr: any) {
        const tabList = resDataArr.map((item: any, index: number) => {
            const obj: any = {};
            obj.txt = item.level + 'km';
            obj.level = item.level;
            return obj;
        });
        return tabList;
    }

/**
 * 获得烈度圈的tablist
*/
    private getLieduTabList(resDataArr: any) {
        const tabList = resDataArr.map((item: any, index: number) => {
            const dictObj: any = {
                5: 'Ⅴ',
                6: 'Ⅵ',
                7: 'Ⅶ',
                8: 'Ⅷ',
                9: 'Ⅸ',
            };
            const obj: any = {};
            obj.txt = dictObj[item.level];
            obj.level = item.level;
            return obj;
        });
        return tabList;
    }

/**
 * 制作缓存数据，存放的是tablis和相应下所有的数据
 * tablist[{txt:'5km',level:'5'}]
*/
    private setTabStatisticsList(cacheResData: any, tablist: any) {
        const cacheData: any = {};
        cacheData.tabList = JSON.parse(JSON.stringify(tablist));
        const vuexStatisticsList = JSON.parse(JSON.stringify(this.$store.state.configModel.config.MaterialContainer.statisticsList));
        tablist.forEach((tfItem: any, tfIndex: number) => {
            const circleObj: any = {};
            circleObj.statisticsList = [];
            vuexStatisticsList.forEach((vsfItem: any, vsfIndex: number) => {
                const newItem = JSON.parse(JSON.stringify(vsfItem));
                const targetSourceItem = cacheResData[vsfItem.key][0].data[tfIndex];
                newItem.count = targetSourceItem.count;
                newItem.subList.forEach((mitem: any, mindex: number) => { // 利用forEach中的引用地址级联，这样newItem就发生了更改了
                    mitem.count = targetSourceItem.data[mitem.codeType] ? targetSourceItem.data[mitem.codeType].count : 0;
                });
                circleObj.statisticsList.push(newItem);
            });
            cacheData[tfItem.txt] = circleObj;
        });
        return cacheData;
    }

/**
 * 通过地图方法获得所有的数据
*/
    private async getDataByTeamTypeArr(typeCodeArr: any) {
        const result: any = await this.getComponent().load(typeCodeArr);
        return result;
    }

/**
 * 制作经验圈的tablist缓存
*/
    private setRadiusTablist() {
        const self = this;
        const tmpTabList = this.curCacheResData.tabList.map((mitem: any, mindex: number) => {
            const obj: any = {};
            obj.level = mitem.level;
            obj.txt = mitem.txt;
            // 因为经验圈的数组可变，所以这里的逻辑要进行改变
            // 在原来的数组tabList中找到txt相等，且选中的的数组item
            const targetItem = self.tabList.find((fitem: any, findex: number) => {
                return (fitem.txt === mitem.txt) && (fitem.checked);
            });
            // obj.checked = ((!!self.tabList[mindex]) && (mitem.txt === self.tabList[mindex].txt) && (self.tabList[mindex].checked));
            obj.checked = !!(targetItem && targetItem.checked);
            return obj;
        });
        return tmpTabList;
    }
/**
 * 制作烈度圈的tablist缓存
*/
     private setLieduTablist() {
        const self = this;
        const tmpTabList = this.curCacheResData.tabList.map((mitem: any, mindex: number) => {
            const obj: any = {};
            obj.level = mitem.level;
            obj.txt = mitem.txt;
            // const targetItem = self.tabList.find((fitem: any, findex: number) => {
            //     return (fitem.txt === mitem.txt) && (fitem.checked);
            // });
            // obj.checked = ((!!self.tabList[mindex]) && (mitem.txt === self.tabList[mindex].txt) && (self.tabList[mindex].checked));
            // obj.checked = !!(targetItem && targetItem.checked);
            // 这是为了把前三个高亮，这样默认点击第四个就好了
            obj.checked = (mindex !== (this.curCacheResData.tabList.length - 1) );
            return obj;
        });
        return tmpTabList;
    }

    /**
     * 制作经验圈的选中,数组下标，并返回
     */
    private setRadiusDefault() {
        var defautIndex = -1;
        // const tmpTablist = this.curCacheResData.tabList;
        // 这是为了防止curActiveTab在经验圈和烈度圈之间的来回切换
        // const targetIndex = this.tabList.findIndex((item: any, index: number) => {
        //     return (!!item.checked && (item.txt === tmpTablist[index].txt));
        // });
        defautIndex = (this.tabList.length - 1);

        // const vuexIndex = this.$store.state.configModel.config.defaultExperienceCircle;
        // if (targetIndex !== -1) { // 取得原来的高亮下标
        //     defautIndex = targetIndex;
        // } else { // 取得数组的最大值
        //     defautIndex = (this.tabList.length - 1);
        // }
        //  else if ( vuexIndex < this.tabList.length) { // 从配置文件中取得默认高亮
        //     defautIndex = vuexIndex;
        // }
        return defautIndex;
    }

    /**
     * 制作烈度圈的选中,数组下标，并返回
     */
    private setLieduDefault() {
        var defautIndex = -1;
        // const tmpTablist = this.curCacheResData.tabList;
        // // 这是为了防止curActiveTab在经验圈和烈度圈之间的来回切换
        // const targetIndex = this.tabList.findIndex((item: any, index: number) => {
        //     return (!!item.checked && (item.txt === tmpTablist[index].txt));
        // });

        // 这种情况是，一进来的那种情况，要从默认的配置文件vuex中拿到默认的
        // defautIndex = (targetIndex === -1) ? 0 : targetIndex;
        defautIndex = this.curCacheResData.tabList.length - 1;
        return defautIndex;
    }

    /**
     * 处理tab的点击事件
     */
    private async handleTabClick(tabItem: any, index: number) {
        if (this.$store.state.controlMoudle.mapCircleQueryType === 0) { // 经验圈
            this.handleTabClickByRadius(tabItem, index);
        } else if ( this.$store.state.controlMoudle.mapCircleQueryType === 1 ) { // 烈度圈
            this.handleTabClickByLiedu(tabItem, index);
        }
        this.setDefaultClickStatisticsTitle();
    }

/**
 * 经验圈的tab点击，这个是单选
*/
    private handleTabClickByRadius(tabItem: any, index: number) {
        if (this.tabList[index].checked) { // 当前经验圈已经选中
            return;
        }

        this.tabList.forEach((fitem: any, findex: number) => {
            if (findex === index) {
                fitem.checked = true;
                this.statisticsList = this.updateStatisticsListByRadius(index);
            } else {
                fitem.checked = false;
            }
        });
    }

/**
 * 烈度圈的tab点击，这个是多选
*/
    private handleTabClickByLiedu(tabItem: any, index: number) {
        // 如果烈度圈都不选中是不可以的，即烈度圈当前只有一个选中，且选中的恰好为当前点击的
        var checkedLastIndex = -1;
        var checkedCount = 0;
        this.tabList.forEach((fitem: any, findex: number) => {
            if (fitem.checked) {
                checkedCount ++;
                checkedLastIndex = findex;
            }
        });

        if ((checkedCount === 1) && (checkedLastIndex === index)) {
            return ;
        }


        const checkedArr: any = [];
        this.tabList.forEach((fitem: any, findex: number) => {
            if (findex === index) {
                fitem.checked = !fitem.checked;
            }
            if (fitem.checked) {
                checkedArr.push(findex);
            }
        });
        // 这里要根据tabList的checked的选中状态去进行数据更新
        this.statisticsList = this.updateStatisticsListByLiedu(checkedArr);
    }

    /**
     * 制作默认的上图高亮数据
     */
    private setDefaultClickStatisticsTitle() {
        // 清除地图点位
        this.getComponent().clear();
        // 暂存当前选中
        const curActiveStatistics = JSON.parse(JSON.stringify(this.curActiveStatistics));
        // 判断当前选中的在统计列表中的状态，例如是否有数据,有数据触发点击，没有则不触发点击
        // 初始加载的时候，当前选中是空数组
        const targetIndex = this.statisticsList.findIndex((fitem: any, findex: number) => {
            return (fitem.count && (curActiveStatistics.key === fitem.key));
        });

        // 表明之前就没有选中，但是新的tab（经验圈或者烈度圈）标签下有数据
        if ((curActiveStatistics.key === 'vue-created') && this.statisticsList[0].count) {
            // 清空当前选中
            this.curActiveStatistics = {};
            this.handleClickStatisticsTitle(this.statisticsList[0], 0, this.statisticsList);
        } else if (curActiveStatistics.key && (targetIndex === -1)) { // 表明之前就有选中，但是新的tab（经验圈或者烈度圈）标签下没有数据,取消点位和高亮就可以啦
            this.curActiveStatistics.count = 0;
        } else if (curActiveStatistics.key && (targetIndex !== -1)) { // 之前就有选中，且有数值
            this.curActiveStatistics = {};
            this.handleClickStatisticsTitle(this.statisticsList[targetIndex], targetIndex, this.statisticsList);
        } else if (this.statisticsListCache.length) { // 有二级标题的缓存
            // 还有一张情况就是 之前没选中任何一级标题
            // 此时判断是否有二级标题的选中
            this.statisticsListCache.forEach((slcfItem: any, slcfIndex: number) => {
                slcfItem.subList.forEach((slcsfItem: any, slcsfIndex: number) => {
                    if (slcsfItem.active) { // 缓存中这个是要选中的
                        this.statisticsList[slcfIndex].subList[slcsfIndex].active = false;
                        this.handleClickSubitemTitle(this.statisticsList[slcfIndex].subList[slcsfIndex], slcsfIndex, this.statisticsList[slcfIndex].subList, this.statisticsList[slcfIndex], slcfIndex, this.statisticsList);
                    }
                });
            });
        }
    }

    /**
     * 更新经验圈下统计面板的数据
     * curCheckedIndex这里存放的是tabList当前选中的下标
     */
    private updateStatisticsListByRadius(curCheckedIndex: number) {
        const statisticsList = this.curCacheResData[this.tabList[curCheckedIndex].txt].statisticsList;
        return statisticsList;
    }


     /**
     * 更新烈度圈下统计面板的数据
     * checkedArr这里存放的是tabList当前选中的下标的数组
     */
    private updateStatisticsListByLiedu(checkedArr: any) {
        const statisticsList: any = [];
        const vuexStatisticsList = JSON.parse(JSON.stringify(this.$store.state.configModel.config.MaterialContainer.statisticsList));
        vuexStatisticsList.forEach((vslItem: any, vslIndex: number) => {
            const newItem = JSON.parse(JSON.stringify(vslItem));
            checkedArr.forEach((cfItem: any, cfIndex: number) => {
                const tmpStatisticsList = JSON.parse(JSON.stringify(this.curCacheResData[this.tabList[cfItem].txt].statisticsList));
                newItem.count += tmpStatisticsList[vslIndex].count;
                newItem.subList.forEach((mitem: any, mindex: number) => { // 利用forEach中的引用地址级联，这样newItem就发生了更改了
                    mitem.count += tmpStatisticsList[vslIndex].subList[mindex].count;
                });
            });
            statisticsList.push(newItem);
        });
        return statisticsList;
    }

    /**
     * 制作参数,即将从$store.state.configModel.config.MaterialContainer.statisticsList的队伍分布读到的配置转成队伍数组
     */
    private getTypeArr(oriStatisticsListItem: any) {
        const codeTypeArr = oriStatisticsListItem.subList.map((item: any) => {
            return item.codeType;
        });
        return codeTypeArr;
    }

    /**
     * 展开或者收起当前的子数组面板
     */
    private expandSublist(slItem: any, slIndex: number, statisticsList: any) {
        this.statisticsList[slIndex].showSub = !slItem.showSub;
    }

    /**
     * 初始化本组件初渲染的时候，进行的默认数值与方法等的初始化
     */
    private initCreated() {
        this.curTitle = this.$store.state.configModel.config.MaterialContainer.title;
        this.getDataToCache();
    }

    /**
     * 初始化所有的监听事件
     */
    private initEventListener() {
        // 经验圈到经验圈的变化（重新设置经验圈）
        // 烈度圈到烈度圈的变化（上传烈度圈）
        // 地图先反映，会emit一个事件，之后前端在响应
        // 这里返回没有区分经验圈和烈度圈，所有如果在烈度圈下，进行了经验圈设置也会触发执行页面数据刷新
        // this.messsageBus.off('ranges-refresh');
        this.messsageBus.on('ranges-refresh', (event: any) => {
            this.getDataToCache();
        });
    }

    /**
     * 地图方法初始化
     */
    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.disasterJudgeFactory.getComponent('disasterJudgeNewRepertory');
        return component;
    }

    private closeAndbackFn() {
        this.messsageBus.emit('closeAndBack', true);
    }

    private created() {
        this.messsageBus.off('ranges-refresh');
    }

    private mounted() {
        this.initCreated();
        this.initEventListener();
    }

    private destroyed() {
        this.messsageBus.off('ranges-refresh');
        this.getComponent().clear();
        this.getComponent().unload();
    }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../assets/css/decisionSupport/Statistic.half.less';

</style>
