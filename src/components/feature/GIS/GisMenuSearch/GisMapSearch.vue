<template>
    <div class="gis-map-search">
        <div class="gis-search">
            <div class="gisAddress" @click="isGisAddressValueFn">
<!--                <p v-show="isFractionalSeconds"><i></i><span>经纬度(度分秒)</span></p>-->
<!--                <p v-show="isLongitude"><i></i><span>经纬度(十进制度)</span></p>-->
                <p><i></i><span>位置</span></p>
            </div>
            <div class="gisAddressValue" v-show="isGisAddressValue">
                <ul>
                    <li v-for="(item,index) in gisAddressValue"
                        @click="gisAddressFn(item)"
                        :key="index" :class="item.checked? item.activeClass: item.class"><i></i>
                        {{item.value}}
                    </li>
                </ul>
            </div>
            <div class="fractionalSecondsBody" v-show="isFractionalSeconds">
                <ul>
                    <li>
                        经度：
                        <input type="text" v-model="formGis.longdu" @input="handleInput" />°
                        <input type="text" v-model="formGis.longfen" @input="handleInput" />'
                        <input type="text" v-model="formGis.longmiao" @input="handleInput" />"
                        <i @click="localtionClickFn"></i>
                    </li>
                    <li>
                        纬度：
                        <input type="text" v-model="formGis.latdu" @input="handleInput" />°
                        <input type="text" v-model="formGis.latfen" @input="handleInput" />'
                        <input type="text" v-model="formGis.latmiao" @input="handleInput" />"
                        <i @click="localtionGisFn"></i>
                    </li>
                </ul>
            </div>
            <div class="gis-localtion" v-show="isLongitude">
                <!--            <i class="gis-localtion-icon" @click="isSwitchLocaltionFn"></i>-->
                <div class="gis-localtion-cont">
                    <span class="gis-localtion-txt1">经度：</span>
                    <input type="text" v-model="localtionX" @input="handleInput" />
                    <span class="gis-localtion-txt2">纬度：</span>
                    <input type="text" v-model="localtionY" @input="handleInput" />
                    <span class="gis-localtion-search" @click="localtionClickFn"></span>
                    <i class="gis-localtion-weizhi"
                       v-show="isLongitude"
                       @click="localtionGisFn"></i>
                </div>
                <!--            <div-->
                <!--                    class="gis-localtion-weizhi"-->
                <!--                    v-show="isLongitude"-->
                <!--                    @click="localtionGisFn"-->
                <!--            >-->
                <!--                <i></i>-->
                <!--            </div>-->
            </div>
<!--            <i class="gis-search-icon" @click="isSwitchSearchFn"></i>-->
            <div class="gis-search-cont" @mouseleave="handleMouseleave">
                <!-- <input
                        type="text"
                        placeholder="请输入地名、地址"
                        v-model="keyWord"
                        @focus="keywordFn"
                /><span class="gis-search-cont-icon" @click="queryClickFn"></span> -->
                 <el-input  class="csmMyInput-noBg"
                    type="text"
                    ref="input_opt"
                    placeholder="请输入地名、地址"
                    v-model.trim="keyWord"
                    @keyup.enter.native="queryClickFn"
                    @input="getSearchRecommendationFn"
                    @focus="keywordFn">
                    <span slot="suffix"  class="gis-search-cont-icon" @click="queryClickFn"></span>
                </el-input>
                <div class="poi-search-match" :class="!nodata? 'poi-search-matchdata': 'poi-search-matchNodata' "  v-if="!isShowHistorical &&isSwitchListPopup" v-loading="loading">
                    <div class="finsh">搜索结果</div>
                    <i class="finsh-icon"></i>
                    <ul class="poi-search-match_cont">
                        <li v-if="valArrNow.length === 0">
                            <span class="poi-search-match-text">{{nodata}}</span>
                        </li>
                        <li
                                v-for="(item, index) in valArrNow.slice((pageNo -1) *pageNum, pageNo*pageNum)"
                                :key="index"
                                @click="listClickGisMap(item)"
                        >
                            <span class="dataIcon" :class="item.icontype"></span>
                            <span class="poi-search-match-text">
                              <b class="poi-search-match-text_name" :title="item.name">{{
                                item.name
                              }}</b>
                              <b class="poi-search-match-text_pname"  
                              :title="item.cityname + item.adname || ''">
                              {{ item.cityname + item.adname || '' }}
                              </b>
                            </span>
                        </li>
                    </ul>
                    <div
                            class="pagenatyionself pagenatyionselfone"
                            id="pagenatyionselfone"
                    >
                        <p>
                            共<span class="pagetotal pagetotal_total">{{ total || 0 }}</span
                        >条
                        </p>
                        <p>
                            第<span class="pagecurren-ziyuan">{{ pageNo }}</span
                        >页
                        </p>
                        <p
                                :class="[
                { pagenationprvetwo: pageNo > 1 },
                'pagedisabledebtn',
              ]"
                                @click="prvePageFn"
                        >
                            上一页
                        </p>
                        <p
                                :class="[
                { pagenationnexttwo: pageNo < totalPageNum },
                'pagedisabledebtn',
              ]"
                                @click="nextPageFn"
                        >
                            下一页
                        </p>
                        <p>
                            共<span class="pagetotal pagetotal_pageSize">{{ totalPageNum || 0 }}</span
                        >页
                        </p>
                    </div>
                </div>
                <!--  搜索推荐词 -->
                <div class="recommendationWords" v-show="isShowRecommendationWords">
                    <ul v-if="recommendationWordsList.length">
                        <li v-for="(item, index) in recommendationWordsList" @click="recommendationListFn(item)" :key='index'>
                            <i></i><span>{{item.name}}</span><span>{{item.address}}</span>
                        </li>
                    </ul>
                </div>
                <div class="historical_record" v-show="isShowHistorical">
                    <ul class="historical_record_cont">
                        <li
                                v-for="(item, index) in historicaleNewArr"
                                :key="index"
                                @click="historicalListFn(item)"
                        >
              <span class="poi-search-match-text">
                <b class="poi-search-match-text_name" :title="item.name">{{
                  item.name
                }}</b
                ><b
                      class="poi-search-match-text_pname"
                      :title="item.cityname + item.adname || ''"
              >{{ item.cityname + item.adname || '' }}</b
              >
              </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { geocodeServer, districtServer, essearchServer} from '@/api/installServer.ts';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import MapCommon from '@/util/MapCommon';
import EventConfigRegistry from '@/util/eventConfigRegistry';
@Component({
    name: 'GisMapSearch',
    mixins: [MapCommon],
    components: {},
})
export default class GisMapSearch extends Vue {
    @Prop() public isIclass?: boolean;
    private isSwitchSearch = false;
    private isSwitchListPopup = false;
    private isSwitchLocaltion = false;
    private isPageClickShow = false;
    private isPageClickShowPrv = false;
    private isShowHistorical = false;
    private keyWord = '';
    private total: any = '';
    private pageNo: any = '';
    private pageNum: any = '';
    private totalPageNum: any = '';
    private valArr: any = []; // 返回的全部数据
    private valArrNow: any = []; // 返回的全部数据
    private historicaleArr: any = []; // 记录历史；
    private historicaleNewArr: any = []; // 历史 回显数据
    private localtionX: any = '';
    private localtionY: any = '';
    private isGisAddressValue: boolean = false;
    private isReductionAddress: boolean = true;
    private isFractionalSeconds: boolean = false; // 度分秒
    private isLongitude: boolean = false; // 十进制
    private isChangeFractionalSeconds = false;
    private nodata = '';
    private formGis: any = {
        longdu: '',
        longfen: '',
        longmiao: '',
        latdu: '',
        latfen: '',
        latmiao: '',
    };
    private recommendationWordsList: any = ''; // 推荐词数据
    private isShowRecommendationWords: boolean = false; // 是否显示推荐词
    private gisAddressValue: any = [
        // {
        //     value: '位置',
        //     class: 'reductionAddress',
        //     activeClass: 'reductionAddressActive',
        //     checked: false,
        // },
        // {
        //     value: '经纬度(度分秒)',
        //     class: 'fractionalSeconds',
        //     activeClass: 'fractionalSecondsActive',
        //     checked: false,
        // },
        {
            value: '经纬度(十进制度)',
            class: 'longitude',
            activeClass: 'longitudeActive',
            checked: false,
        },
    ];
    private loading: boolean = false;
    @Watch('isIclass', {deep: true})
    public onChange(val: any) {
        if (val) {
            $('.gis-map-search').css('left', '400px');
        } else {
            $('.gis-map-search').css('left', '90px');
        }
    }
    // 经纬度转换成度分秒
    private formatDegree(x: any, y: any) {
        x = Math.abs(x);
        y = Math.abs(y);
        this.formGis.longdu = Math.floor(x); // 度
        this.formGis.longfen = Math.floor((x - this.formGis.longdu) * 60); // 分
        this.formGis.longmiao = Math.round((x - this.formGis.longdu) * 3600 % 60); // 秒
        this.formGis.latdu = Math.floor(y); // 度
        this.formGis.latfen = Math.floor((y - this.formGis.latdu) * 60); // 分
        this.formGis.latmiao = Math.round((y - this.formGis.latdu) * 3600 % 60); // 秒
    }

    private handleInput(e: any) {
      // 只能输入正整数和小数
      // 经度 只能是整数
      const longdu: RegExp = /^-?(([1]?[0-7]?[0-9]?)|([0-9]?[0-9]?))$/g;
      if (this.isFractionalSeconds && !longdu.test(this.formGis.longdu)) {
        this.formGis.longdu = '';
        this.$message('请输入正确的 经度：-179～179');
      }
      // 经度分
      const longfen: RegExp = /^[1-5]?[0-9]?$/g;
      if (this.isFractionalSeconds && !longfen.test(this.formGis.longfen)) {
        this.formGis.longfen = '';
        this.$message('请输入正确的 分：0～59');
      }
      const longmiao: RegExp = /^[1-5]?[0-9]?$/g;
      if (this.isFractionalSeconds && !longmiao.test(this.formGis.longmiao)) {
        this.formGis.longmiao = '';
        this.$message('请输入正确的 秒：0～59');
      }
      // 维度
      const latdu: RegExp = /^-?[1-8]?[0-9]?$/g;
      if (this.isFractionalSeconds && !latdu.test(this.formGis.latdu)) {
        this.formGis.latdu = '';
        this.$message('请输入正确的 维度：-89～89');
      }
      // 维度分
      const latfen: RegExp = /^[1-5]?[0-9]?$/g;
      if (this.isFractionalSeconds && !latfen.test(this.formGis.latfen)) {
        this.formGis.latfen = '';
        this.$message('请输入正确的 分：0～59');
      }
      // 维度秒
      const latmiao: RegExp = /^[1-5]?[0-9]?$/g;
      if (this.isFractionalSeconds && !latmiao.test(this.formGis.latmiao)) {
        this.formGis.latmiao = '';
        this.$message('请输入正确的 秒：0～59');
      }
      // 小数的经度坐标
      const localtionX: RegExp = /^-?(([1]?[0-7]?[0-9]?(\.[0-9]*)?)|([0-9]?[0-9]?(\.[0-9]*)?))$/g;
      if (this.isLongitude && !localtionX.test(this.localtionX)) {
        this.localtionX = '';
        this.$message('请输入正确的 经度：-179.9999～179.9999');
      }
      // 小数的维度坐标
      const localtionY: RegExp = /^-?([1-8]?[0-9])?(\.[0-9]*)?$/g;
      if (this.isLongitude && !localtionY.test(this.localtionY)) {
        this.localtionY = '';
        this.$message('请输入正确的纬度！纬度：-89.9999～89.9999');
      }
    }

    private localtionGisFn() {
        this.isChangeFractionalSeconds = true;
        const than = this;
        const type: any = 'point';
        this.getComponent().startPlot(type);
        this.getComponent().setRadius((this.$store.state.configModel.config.quickStudy.defaultRadius || 10) * 1000);
    }
    private gisAddressFn(item: any) {
        const bol = item.checked;
        this.gisAddressValue.map((i: any) => {
            i.checked = false;
        });
        item.checked = true;
        this.isGisAddressValue = false;
        if (item.class === 'fractionalSeconds') {
            this.isFractionalSeconds = true;
            this.isLongitude = false;
            this.isReductionAddress = false;
        } else if (item.class === 'longitude') {
            this.isLongitude = true;
            this.isFractionalSeconds = false;
            this.isReductionAddress = false;
        } else {
            this.isReductionAddress = true;
            this.isLongitude = false;
            this.isFractionalSeconds = false;
            this.$store.state.gisMenuSearch.isGisDetail = false;
        }
        // 清空input
        this.localtionX = '';
        this.localtionY = '';
        for (const key in this.formGis) {
            if (this.formGis.hasOwnProperty(key)) {
                this.formGis[key] = '';
            }
        }
    }
    // 是否显示经纬度
    private isGisAddressValueFn() {
        // this.isGisAddressValue = !this.isGisAddressValue;
        this.isLongitude = !this.isLongitude;
        if (this.isGisAddressValue) {
            this.isFractionalSeconds = false;
            this.isLongitude = false;
        }
    }
    // 经纬度 点击查询事件
    private localtionClickFn() {
        this.isChangeFractionalSeconds = false;
        const opt: any = {};
        if (this.isLongitude) {
            opt.x = this.localtionX + '';
            opt.y = this.localtionY + '';
        } else if (this.isFractionalSeconds) {
            let x = '';
            let y = '';
            // 度分秒转换成经纬度
            x = Math.abs(this.formGis.longdu)  + (Math.abs(this.formGis.longfen) / 60 + Math.abs(this.formGis.longmiao) / 3600) + '';
            y = Math.abs(this.formGis.latdu)  + (Math.abs(this.formGis.latfen) / 60 + Math.abs(this.formGis.latmiao) / 3600) + '';
            if (this.formGis.longdu < 0 && this.formGis.latdu < 0) { // 如果度输入的是负数，x为负
                opt.x = -x + '';
                opt.y = -y + '';
            } else if (this.formGis.longdu < 0 && this.formGis.latdu >= 0) { // 如果经度-度为负，维度-度为正，传值x正，y负
                opt.x = -x + '';
                opt.y = y;
            } else if (this.formGis.longdu >= 0 && this.formGis.latdu < 0) { // 如果经度-度为正数，纬度-度为负数，传值x负，y正
                opt.x = x;
                opt.y = -y + '';
            } else { // 如果经纬度-度都是正数
                opt.x = x;
                opt.y = y;
            }
        }
        this.getComponent().queryPoint(opt).then((res: any) => {
            if (res.type === 'searchpoi') {
                this.$store.state.gisMenuSearch.isGisDetail = true;
            } else {
                this.$store.state.gisMenuSearch.isGisDetail = false;
            }
            if (res.status === 'error') {
                this.$message('请输入正确的经纬度！经度：-179.9999～179.9999 纬度：-89.9999～89.9999');
            }
        });
    }
    private historicalListFn(parame: any) {
        // 点击历史 li 显示在input框里
        this.keyWord = parame.name;
        this.isShowHistorical = false; // 关闭弹窗
        const opt = {
            x: parame.location.split(',')[0],
            y: parame.location.split(',')[1],
            data: parame,
        };
        this.getComponent().queryPoint(opt).then((res: any) => {
            if (res.type === 'searchpoi') {
                this.$store.state.gisMenuSearch.isGisDetail = true;
            } else {
                this.$store.state.gisMenuSearch.isGisDetail = false;
            }
            if (res.status === 'error') {
                this.$message('请输入正确的经纬度！经度：-179.9999～179.9999 纬度：-89.9999～89.9999');
            }
        });
    }
    // 搜索推荐词条
    private getSearchRecommendationFn() {
        if (!this.keyWord || this.keyWord === '' || this.keyWord === null) {
            this.isShowRecommendationWords = false;
        } else {
            const opt = {
                keyWord: this.keyWord,
            };
            geocodeServer.getSearchRecommendation(opt).then((res: any) => {
                if (res.result && res.result.baidu.suggests.length) {
                    this.recommendationWordsList = res.result.baidu.suggests;
                    this.isShowRecommendationWords = true;
                    this.isSwitchListPopup = false;
                    this.isShowHistorical = false;
                } else {
                    this.isShowRecommendationWords = false;
                }
            });
        }
    }
    // 点击推荐词li
    private recommendationListFn(item: any) {
        this.keyWord = item.name;
        this.$nextTick(() => {
            this.queryClickFn();
        });
    }
    // 点击 li列表 查找地图定位，记录历史
    private listClickGisMap(parame: any) {
        // 本地存储 记录历史
        if (parame.layercode) {
            this.historicaleArr.unshift({
                id: parame.id,
                layercode: parame.layercode,
                location: parame.location,
                name: parame.name,
            });
        } else {
            // 高德数据
            this.historicaleArr.unshift({
                cityname: parame.cityname,
                id: parame.id,
                location: parame.location,
                name: parame.name,
                pname: parame.pname,
                adname: parame.adname,
            });
        }
        // localStorage.setItem('historicaled', JSON.stringify(this.historicaleArr));
        // const historicalGitItem: any = localStorage.getItem('historicaled');
        // this.historicaleNewArr = this.historicaleNewArr.concat(JSON.parse(historicalGitItem)) || [];
        localStorage.historicaled = JSON.stringify(this.historicaleArr);
        this.isSwitchListPopup = false;
        this.keyWord = parame.name;
        const opt = {
            y: parame.location.split(',')[1],
            x: parame.location.split(',')[0],
            data: parame,
        };
        this.getComponent().queryPoint(opt).then((res: any) => {
            if (res.type === 'searchpoi') {
                this.$store.state.gisMenuSearch.isGisDetail = true;
            } else {
                this.$store.state.gisMenuSearch.isGisDetail = false;
            }
            if (res.status === 'error') {
                this.$message('请输入正确的经纬度！经度：-179.9999～179.9999 纬度：-89.9999～89.9999');
            }
        });
    }
    private keywordFn() {
        if (!this.keyWord) {
            this.isSwitchListPopup = false;
            this.isGisAddressValue = false;
            // 历史记录
            const historicalGitItem: any = localStorage.getItem('historicaled');
            this.historicaleNewArr = JSON.parse(historicalGitItem) || [];
            // 数据去重
            const res = new Map();
            this.historicaleNewArr = this.historicaleNewArr.slice(0, 10).filter((arr: any) => !res.has(arr.name) && res.set(arr.name, 1));
            if (this.historicaleNewArr && this.historicaleNewArr.length > 0) {
                this.isShowHistorical = true;
                this.isFractionalSeconds = false;
                this.isLongitude = false;
            } else {
                this.isShowHistorical = false;
            }
        } else {
            this.getSearchRecommendationFn();
        }
    }
    private isSwitchSearchFn() {
        this.localtionX = '';
        this.localtionY = '';
        this.$store.state.gisMenuSearch.isGisDetail = false;
        this.isSwitchSearch = !this.isSwitchSearch;
        this.isSwitchLocaltion = !this.isSwitchSearch;
    }
    private isSwitchLocaltionFn() {
        this.localtionX = '';
        this.localtionY = '';
        this.$store.state.gisMenuSearch.isGisDetail = false;
        this.isSwitchLocaltion = !this.isSwitchLocaltion;
        this.isSwitchSearch = !this.isSwitchLocaltion;
    }

    // 前端本地分页
    private pagingLocality() {
      this.total = this.valArrNow.length;
      this.pageNum = 10;
      this.totalPageNum = Math.ceil(this.total / 10);
      // this.pageNum = Math.ceil(this.total / 10);
    }

    // 点击搜索的搜索图标
    private queryClickFn() {
        this.nodata = '';
        this.isShowHistorical = false; // 关闭历史纪录弹窗
        this.isGisAddressValue = false;
        this.isShowRecommendationWords = false;
        this.pageNo = 1;
        this.total = 0;
        this.pageNum = '';
        this.loading = true;
        this.isSwitchListPopup = true;
        this.valArrNow = [];
        if (!this.keyWord) {
            return;
        }
        const than = this;
        const opt3 = {
            keyWord: this.keyWord,
        };
        geocodeServer.getAddressByKeyword(opt3).then((res: any) => {
            than.isFractionalSeconds = false;
            than.isLongitude = false;
            than.loading = false;
            this.isShowRecommendationWords = false;
            if (res && res.length > 0) {
                 this.nodata = '';
                // than.isSwitchListPopup = true;
                 than.valArr = res;
                 than.valArrNow.unshift(...res);
                 than.total = res.length;
                 than.pageNum = Math.ceil(parseInt(than.total + '', 10) / 10);
                 if (than.pageNum === 1) {
                    this.isPageClickShowPrv = false;
                    this.isPageClickShow = false;
                 }
                 if (than.pageNum > than.pageNo) {
                    than.isPageClickShow = true;
                }
                 if (than.pageNo === 1) {
                     this.isPageClickShowPrv = false;
                 }
                 if (than.pageNo > 1) {
                    than.isPageClickShowPrv = true;
                }
            }
            this.pagingLocality(); // 前端本地分页
        });
        essearchServer.getResourceDataByKeyword({
            keyword: this.keyWord,
            pageSize: 50,
            pageNow: 0,
        }).then((res: any) => {
            this.nodata = '';
            res.list.forEach((element: any) => {
              element.location = element.y + ',' + element.x;
            });
            this.valArrNow.push(...res.list);
            this.pagingLocality();  // 前端本地分页
        });
    }
    private prvePageFn() {
        if (this.pageNo > 1) {
            this.isPageClickShowPrv = true;
            this.isPageClickShow = true;
            this.pageNo--;
            // this.valArrNow = this.valArr.slice(
            //     10 * (this.pageNo - 1),
            //     10 * this.pageNo + 1,
            // );
            if (this.pageNo === 1) {
                this.isPageClickShowPrv = false;
            }
        } else {
            this.isPageClickShowPrv = false;
            return;
        }
    }
    private nextPageFn() {
        if (this.pageNo < this.pageNum) {
            this.isPageClickShow = true;
            this.isPageClickShowPrv = true;
            this.pageNo++;
            // this.valArrNow = this.valArr.slice(
            //     10 * (this.pageNo - 1),
            //     10 * this.pageNo + 1,
            // );
            if (this.pageNo === this.pageNum) {
                this.isPageClickShow = false;
            }
        } else {
            this.isPageClickShow = false;
            return;
        }
    }
    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component: any = factory.commonFactory.getComponent('search');
        return component;
    }

    // 行政区划
    private getDistrict(data: any) {
        const self = this;
        const optsTest = {
            location: [data.coords.x, data.coords.y],
            level: '3', // 县级
        };
        districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
            if (dataDis.data && dataDis) {
                data.districtObj = dataDis.data[0];
                data.name = this.keyWord;
                data._id = '';
                this.$store.state.gisMenuSearch.isGisDetail = true; // 显示右侧的那个面板
                this.$store.commit('gisMenuSearch/changeNameData', data);
            } else {
                this.$store.state.gisMenuSearch.isGisDetail = false;
                this.$message('暂无数据');
            }

        });
    }

    // 处理鼠标移出事件
    private  handleMouseleave() {
        this.isShowHistorical = false;
        this.isSwitchListPopup = false;
        this.isShowRecommendationWords = false;
        (this.$refs as any).input_opt.blur();
    }
    private init() {
        const component = this.getComponent();
        // component.off('Search_popupEvent');
        component.on('Search_popupEvent', (event: any) => {
            if (event.type !== 'searchpoi') {
                this.$store.state.gisMenuSearch.isGisDetail = false;
            }
            const param = {
                that: this,
                popupId: 'Search_popupEvent', // 监听id，必须
                moduleTypeID: 'search', // 模块id，必须
            };
            event.data.EntryDisposalIsShow = this.$store.state.eventPushStore.eventLocation.EventType; // 增加事件处置参数
            event.data.EventIcon = this.$store.state.eventPushStore.eventLocation.EventIcon; // 增加一个全局的事件处置id
            const popUpTemplate = new renderpopUpTemplate();
            popUpTemplate.getParams(param);
            popUpTemplate.onShowPopup(event);
        });
    }
      // 监听 当前正在研判的类型，是全国还是河流、行政区划、缓冲区、搜索缓冲区
    @Watch('$store.state.dataFilterControl.zhypGeoType')
    private handleZhypGeoTypeUpdated(val: any, oldVal: any) {
        val = val || {};
        oldVal = oldVal || {};
        if (val.key === oldVal.key) { // 虽然引用地址变了，但是真实的值没有改变
        return ;
        }
        // 现在目前只用处理旧的为searchYp,但是新的为其他研判，要清除地图上的缓冲区
        if ( (oldVal.key === 'searchYp') &&  (val.key !== 'searchYp')) {
            // alert('我要清除地图缓冲区啦啦啦啦');
            this.getComponent().clearAll();
        }
    }
    // 处理地图绘制（点、缓冲区）完成
    private handleDrawOver(cbData: any) {
        this.$store.commit('mapTools/changeNearbyQueryVisible', false);
        this.messsageBus.emit('CitySelectShow', false);
        this.messsageBus.emit('zhypClosedHlyp'); // 通知图层进行关闭河流
        const geoStrObj = {
            filter: {
                districtCode: '', // "370686"
                geometry: JSON.stringify(cbData.geometry),
            },
            zhypGeoType: {
                key: 'searchYp',
            },
            targetPoint: {
                EventLat: cbData.point.lat,
                EventLon: cbData.point.log,
            },
        };
        // this.$nextTick(() => {
        this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
        this.$store.commit('eventPushStore/updateRoutePoint', geoStrObj);
        // });
    }
    // 直接点击地图上的缓冲区进行关闭
    private handleClearSearchGeometry() {
      // this.isLongitude = false;
      this.localtionX = '';
      this.localtionY = '';
      const geoStrObj = {
            filter: {
                districtCode: '', // "370686"
                geometry: '',
            },
            zhypGeoType: {
                key: '',
            },
        };
        // this.$nextTick(() => {
      this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
      this.$store.commit('eventPushStore/updateRoutePoint', geoStrObj);
    }
    // 初始化地图的点击、绘制完成等回调事件
    private initListener() {
        // 地图绘制缓冲区完成
        this.getComponent().off('searchDrawOver', this.handleDrawOver);
        this.getComponent().on('searchDrawOver', this.handleDrawOver);
        // 地图点击关闭
        this.getComponent().off('clearSearchGeometry', this.handleClearSearchGeometry);
        this.getComponent().on('clearSearchGeometry', this.handleClearSearchGeometry);
        // 从外面关闭地图上的搜索缓冲区
        this.messsageBus.off('closedSearchGeometry', this.handleClearSearchGeometry);
        this.messsageBus.on('closedSearchGeometry', this.handleClearSearchGeometry);
    }
    private mounted() {
        const that = this;
        (this as any).resolveMap('map').then(() => {
            this.init();
            this.initListener();
            // 地图选点结束或者点击搜索的结果
            // this.getComponent().off('searchPointAddress');
            this.getComponent().on('searchPointAddress', function(data: any) {
                if (data) {
                    that.$store.state.gisMenuSearch.isGisDetail = true;
                    // 选点回填
                    if (that.isLongitude) {
                        that.localtionX = data.coords.x.toFixed(6);
                        that.localtionY = data.coords.y.toFixed(6);
                    } else if (that.isFractionalSeconds && that.isChangeFractionalSeconds) {
                        that.formatDegree(data.coords.x, data.coords.y);
                    }
                    // 查询选点的行政区划
                    that.getDistrict(data);

                }
            });
        });
    }
    private created() {
        // 定位操作面板隐藏
        // this.messsageBus.off('positioningOperation');
        this.messsageBus.on('positioningOperation', (data: any) => {
            if (this.isLongitude || this.isFractionalSeconds) {
                this.isLongitude = data;
                this.isFractionalSeconds = data;
                this.isReductionAddress = !data;
                this.gisAddressValue.map((i: any) => {
                    i.checked = false;
                });
            }
        });
        if (localStorage.historicaled) {
            this.historicaleArr = JSON.parse(localStorage.historicaled);
        }

    }

    private destroyed(): void {
      // this.messsageBus.off('positioningOperation');
      // this.getComponent().off('searchPointAddress');
      // this.getComponent().off('Search_popupEvent');
    }
}
</script>
<style scoped lang="less">
    * {
        margin: 0;
        padding: 0;
    }
    .gis-map-search {
        height: 80px;
        display: flex;
        align-items: center;
        position: absolute;
        left: 90px;
        .gis-search {
            display: flex;
            align-items: center;
            i {
                width: 40px;
                height: 40px;
                background: url(../../../../assets/img/nav/searchIcon.png) 0 4px no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
            }
            .gis-search-cont {
                width: 320px;
                height: 54px;
                z-index: 6;
                line-height: 45px;
                text-align: left;
                margin-top: 11px;
                background: url(../../../../assets/img/nav/searchIcons.png) left
                center no-repeat;
                background-size: 100% 114%;
                float: left;
                position: absolute;
                left: 106px;
                top: 2px;
                padding-top: 6px;
                box-sizing: border-box;
                // input[type='text'] {
                //     width: calc(100% - 68px);
                //     height: 35px;
                //     line-height: 35px;
                //     margin-left: 10px;
                //     border: none;
                //     font-size: 18px;
                //     background: transparent;
                //     padding-left: 5px;
                //     outline: none;
                //     color: #fff;
                //     position: relative;
                //     top: 4%;
                // }
                ::-webkit-input-placeholder {
                    /* Chrome/Opera/Safari */
                    color: #fff;
                }

                ::-moz-placeholder {
                    /* Firefox 19+ */
                    color: #fff;
                }

                :-ms-input-placeholder {
                    /* IE 10+ */
                    color: #fff;
                }

                :-moz-placeholder {
                    /* Firefox 18- */
                    color: #fff;
                }
                .gis-search-cont-icon {
                    display: inline-block;
                    height: 41px;
                    width: 34px;
                    // background: url(../../../../assets/img/nav/searchIcon.png) no-repeat;
                    // background-size: 100% 100%;
                    // position: absolute;
                    // right: 3.5%;
                    // top: 25%;
                     background: url(../../../../assets/img/nav/searchIcon.png) no-repeat 50% 50%;
                    cursor: pointer;
                }
                .poi-search-matchNodata{
                    height: 150px;
                    .pagenatyionselfone{
                        bottom: 27px !important;
                    }
                }
                .poi-search-matchdata{
                    height: 376px;
                }
                .poi-search-match {
                    position: absolute;
                    z-index: 10;
                    // font-size: 14px;
                    width: 400px;
                    top: 49px;
                    left: 3px;
                    background: url(../../../../assets/img/nav/bggg_03.png) no-repeat;
                    background-size: 100% 100%;
                    padding-bottom: 18px;
                    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
                    .finsh {
                        // font-size: 16px;
                        color: #fff;
                        padding-left: 37px;
                        padding-top: 10px;
                    }
                    .finsh-icon {
                        display: inline-block;
                        width: 310px;
                        height: 33px;
                        background: url(../../../../assets/img/nav/barbar_03.png) no-repeat;
                        position: absolute;
                        top: 25px;
                        left: 20px;
                    }
                    .poi-search-match_cont {
                        max-height: 280px;
                        overflow: hidden;
                        background: transparent;
                        li {
                            height: 28px;
                            line-height: 28px;
                            padding-left: 15px;
                            display: block;
                            color: #000;
                            width: 98%;
                            margin-left: 5px;
                            cursor: pointer;
                            .poi-search-match-text {
                                display: inline-block;
                                width: 340px;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                color: #fff;
                                // font-size: 16px;
                                vertical-align: text-bottom;
                                b {
                                    font-weight: normal;
                                    font-style: normal;
                                }
                                .poi-search-match-text_name {
                                    color: #ffffff;
                                }
                                .poi-search-match-text_pname {
                                    margin-left: 8px;
                                    color: #b3b3b3;
                                }
                            }
                            .dataIcon{
                                display: inline-block;
                                width: 20px;
                                height: 20px;
                                vertical-align: initial;
                                margin-right: 5px;
                            }
                            .egis {
                                background: url("../../../../assets/img/navGis/egisicon.png") no-repeat;
                                background-size: 100% 100%;
                            }
                            .gaode{
                                background: url("../../../../assets/img/navGis/gaodeicon.png") no-repeat;
                                background-size: 100% 100%;
                            }
                            .database{
                                background: url(../../../../assets/img/navGis/badeziyuanicon.png) no-repeat;
                                background-size: 100% 100%;
                            }
                            .baidu{
                                background: url(../../../../assets/img/navGis/baidu.png) no-repeat;
                                background-size: 100% 100%;
                            }
                            .tianditu{
                                background: url(../../../../assets/img/navGis/tianditu.png) no-repeat;
                                background-size: 100% 100%;
                            }
                        }
                        li:hover {
                            .database{
                                background: url("../../../../assets/img/navGis/baseziyuaniconhover.png") no-repeat;
                                background-size: 100% 100%;
                            }
                            .gaode{
                                background: url("../../../../assets/img/navGis/gaodeiconhover.png") no-repeat;
                                background-size: 100% 100%;
                            }
                            .egis {
                                background: url("../../../../assets/img/navGis/egisiconhover.png") no-repeat;
                                background-size: 100% 100%;
                            }
                            .baidu {
                                background: url("../../../../assets/img/navGis/baidu_h.png") no-repeat;
                                background-size: 100% 100%;
                            }
                            .tianditu {
                                background: url("../../../../assets/img/navGis/tianditu_h.png") no-repeat;
                                background-size: 100% 100%;
                            }
                            background-color: #0587b8;
                        }
                    }
                    .pagenatyionself {
                        width: 100%;
                        height: 10%;
                        color: #fff;
                        // font-size: 16px;
                        display: flex;
                        padding: 0 10px;
                        position: absolute;
                        bottom: 17px;
                        p {
                            flex: 1;
                            color: #fff;
                            // font-size: 16px;
                        }
                        .pagetotal {
                            color: #3ef7fe;
                        }
                        .pagedisabledebtn {
                            pointer-events: none;
                            color: #b3b3b3;
                        }
                        .pagenationnexttwo,
                        .pagenationprvetwo {
                            color: #fff !important;
                            cursor: pointer !important;
                            pointer-events: auto;
                        }
                    }
                }
                .historical_record {
                    width: 305px;
                    position: absolute;
                    z-index: 10;
                    // font-size: 14px;
                    top: 59px;
                    left: 7px;
                    background: url('../../../../assets/img/navGis/historical_record_center.png')
                    no-repeat;
                    background-size: 100% 100%;
                    .historical_record_cont {
                        overflow: hidden;
                        background: transparent;
                        // padding: 0 10px;
                        li {
                            line-height: 28px;
                            padding:5px 10px;
                            display: flex;
                            // width: 95%;
                            // margin-left: 5px;
                            cursor: pointer;
                            align-items: center;
                            box-sizing:border-box;
                            // white-space: nowrap;
                            border:1px solid transparent
                        }
                        li:hover {
                            // background: url('../../../../assets/img/navGis/historical_record_active.png')
                            // no-repeat;
                            // background-size: 100% 100%;
                            // box-shadow: 0 0 15px #0274b5;
                            box-shadow: inset 0 0 20px 5px rgba(227,255,95,.32), 0px 0px 1px 0px #ffd870;
                            border:1px solid #ffd870;   
                            color:#f0bc54!important;
                        }
                    }
                    .poi-search-match-text {
                        width: 315px;
                        position: relative;
                        padding-left: 20px;
                        /*b {*/
                        /*  overflow: hidden;*/
                        /*  text-overflow: ellipsis;*/
                        /*  white-space: nowrap;*/
                        /*}*/
                    }
                    .poi-search-match-text:before {
                        content: '';
                        display: inline-block;
                        width: 16px;
                        height: 17px;
                        background: url(../../../../assets/img/navGis/historical_record.png)
                        no-repeat;
                        background-size: 100% 100%;
                        position: absolute;
                        top: 7px;
                        left: 0px;
                    }
                    .poi-search-match-text_pname {
                        margin-left: 20px;
                        color: #b3b3b3;
                    }
                    .poi-search-match-text_name:last-child {
                        color: #b3b3b3;
                    }
                }
                .historical_record:before {
                    content: '';
                    display: inline-block;
                    left:0;
                    right:0;
                    height: 9px;
                    background: url('../../../../assets/img/navGis/historical_record_top.png')
                    no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    top: -9px;
                }
                .historical_record:after {
                    content: '';
                    display: inline-block;
                    left:0;
                    right:0;
                    height: 10px;
                    background: url('../../../../assets/img/navGis/historical_record_bot.png')
                    no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    bottom: -10px;
                }
                .recommendationWords{
                    width: 400px;
                    position: absolute;
                    z-index: 10;
                    // font-size: 14px;
                    top: 49px;
                    left: 7px;
                    background: url('../../../../assets/img/nav/bggg_03.png')
                    no-repeat;
                    background-size: 100% 100%;
                    padding: 10px 3px 20px 10px;
                    min-height: 300px;
                    ul{
                        height: 376px;
                        overflow: auto;
                        li{
                            cursor: pointer;
                        }
                        li:hover {
                            box-shadow: inset 0 0 20px 5px rgba(227,255,95,.32), 0px 0px 1px 0px #ffd870;
                            border:1px solid #ffd870;
                            color:#f0bc54!important;
                        }
                        span:nth-of-type(1) {
                            margin-right: 20px;
                        }
                        span:nth-of-type(2){
                            color: #b3b3b3;
                        }
                    }
                    .nodata{
                        background: url("../../../../assets/img/darkgreen/panel/noData.png") no-repeat;
                        background-size: 100% 100%;
                        width: 200px;
                        height: 200px;
                        margin: auto;
                        margin-top: 35px;
                    }
                }
                .recommendationWords ul::-webkit-scrollbar{
                    width:6px;
                    height:6px;
                    margin-right: 5px;
                    /**/
                }
                .recommendationWords ul::-webkit-scrollbar-thumb{
                    background-image: linear-gradient(0deg,
                    #0a7ccc 0%,
                    #06b4d1 52%,
                    #02ebd5 100%);
                    border-radius:5px;
                    margin-right: 5px;
                }
                .recommendationWords ul::-webkit-scrollbar-thumb:hover{
                    background-image: linear-gradient(0deg,
                    #0a7ccc 0%,
                    #06b4d1 52%,
                    #02ebd5 100%);
                    margin-right: 5px;
                }
            }
        }
        .gis-localtion {
            display: flex;
            align-items: center;
            position: absolute;
            top: 66px;
            left: -4px;
            /*margin-top: 14px;*/
            i {
                width: 40px;
                height: 40px;
                background: url(../../../../assets/img/nav/echo_lat_and_long.png) 0 0
                no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
            }
            .gis-localtion-cont {
                width: 436px;
                height: 55px;
                background: url(../../../../assets/img/nav/shijinzhibg.png) left
                center no-repeat;
                background-size: 100% 114%;
                display: flex;
                align-items: center;
                padding-left: 10px;
                span {
                    margin-left: 8px;
                    color: #ffffff;
                }
                input[type='text'] {
                    width: 94px;
                    height: 25px;
                    outline: none;
                    border: 1px solid transparent;
                    border-radius: 5px;
                    background: url(../../../../assets/img/nav/inputLatLon.png) no-repeat;
                    background-size: 100% 100%;
                    color: #fff;
                    text-indent: 0.3rem;
                }
                .gis-localtion-search {
                    width: 34px;
                    height: 34px;
                    padding-left: 3px;
                    background: url(../../../../assets/img/nav/searchIcon.png) 0 0
                    no-repeat;
                    background-size: 100% 100%;
                    cursor: pointer;
                    margin-top: 7px;
                }
            }
            .gis-localtion-weizhi {
                width: 40px;
                height: 40px;
                background: url(../../../../assets/img/nav/echo_lat_and_long.png) 0 0 no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
            }
        }
        .gisAddress{
            margin-top: 19px;
            cursor: pointer;
            p{
                margin-top: -20px;
                // font-size: 20px;
                color: #ffffff;
            }
            /*p:nth-of-type(1){*/
            /*    width: 215px;*/
            /*    height: 62px;*/
            /*    line-height: 62px;*/
            /*    background: url("../../../../assets/img/nav/chooseBg.png") no-repeat;*/
            /*    background-size: 100% 100%;*/
            /*    i{*/
            /*        display: inline-block;*/
            /*        width: 32px;*/
            /*        height: 25px;*/
            /*        background: url(../../../../assets/img/nav/dmsIcon.png) no-repeat;*/
            /*        background-size: 100% 100%;*/
            /*        vertical-align: middle;*/
            /*        margin-left: 20px;*/
            /*    }*/
            /*}*/
            /*p:nth-of-type(2){*/
            /*    width: 245px;*/
            /*    height: 62px;*/
            /*    line-height: 62px;*/
            /*    background: url("../../../../assets/img/nav/chooseBg.png") no-repeat;*/
            /*    background-size: 100% 100%;*/
            /*    i{*/
            /*        display: inline-block;*/
            /*        width: 32px;*/
            /*        height: 25px;*/
            /*        background: url(../../../../assets/img/nav/shijinzhiIcon.png) no-repeat;*/
            /*        background-size: 100% 100%;*/
            /*        vertical-align: middle;*/
            /*        margin-left: 20px;*/
            /*    }*/
            /*}*/
            p:nth-of-type(1){
                width: 121px;
                height: 62px;
                line-height: 62px;
                background: url("../../../../assets/img/nav/chooseBg.png") no-repeat;
                background-size: 100% 100%;
                i{
                    display: inline-block;
                    width: 26px;
                    height: 28px;
                    background: url(../../../../assets/img/nav/addressIcon.png) no-repeat;
                    background-size: 100% 100%;
                    vertical-align: sub;
                    margin-left: 20px;
                    margin-right: 6px;
                }
            }
        }
        .gisAddressValue{
            width: 284px;
            position: absolute;
            background: url("../../../../assets/img/nav/selectbgbottom_center.png") no-repeat;
            background-size: 100% 100%;
            top: 64px;
            left: 3px;
            padding-bottom: 10px;
            z-index: 10;
            ul{
                line-height: 43px;
                width: 250px;
                margin: 12px 0 0 14px;
                li{
                    /*padding: 0 20px;*/
                    cursor: pointer;
                    width: 100%;
                    padding-left: 7px;
                }
                .reductionAddress{
                    i{
                        display: inline-block;
                        width: 26px;
                        height: 28px;
                        background: url("../../../../assets/img/nav/addressbgbo.png") no-repeat;
                        background-size: 100% 100%;
                        vertical-align: sub;
                    }
                }
                .reductionAddressActive{
                    i{
                        display: inline-block;
                        width: 26px;
                        height: 28px;
                        background: url("../../../../assets/img/nav/addressActivebgbot.png") no-repeat;
                        background-size: 100% 100%;
                        vertical-align: sub;
                    }
                }
                .fractionalSeconds{
                    i{
                        display: inline-block;
                        width: 33px;
                        height: 26px;
                        background: url("../../../../assets/img/nav/jingwei.png") no-repeat;
                        background-size: 100% 100%;
                        vertical-align: middle;
                    }
                }
                .fractionalSecondsActive{
                    background: url("../../../../assets/img/nav/selectbgbottom_centerActive.png") no-repeat;
                    background-size: 100% 100%;
                    i{
                        display: inline-block;
                        width: 33px;
                        height: 26px;
                        background: url("../../../../assets/img/nav/jingwei_active.png") no-repeat;
                        background-size: 100% 100%;
                        vertical-align: middle;
                    }
                }
                .longitude{
                    i{
                        display: inline-block;
                        width: 33px;
                        height: 26px;
                        background: url("../../../../assets/img/nav/longlatbg.png") no-repeat;
                        background-size: 100% 100%;
                        vertical-align: middle;
                    }
                }
                .longitudeActive{
                    /*background: #0274b5;*/
                    background: url("../../../../assets/img/nav/selectbgbottom_centerActive.png") no-repeat;
                    background-size: 100% 100%;
                    i{
                        display: inline-block;
                        width: 33px;
                        height: 26px;
                        background: url("../../../../assets/img/nav/longlatActivebg.png") no-repeat;
                        background-size: 100% 100%;
                        vertical-align: middle;
                    }
                }
            }

        }
        .fractionalSecondsBody{
            width: 406px;
            height: 130px;
            background: url("../../../../assets/img/nav/dufenmiaobg.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 66px;
            left: -5px;
            ul{
                line-height: 50px;
                padding: 15px 20px;
                li{
                    color: #fff;
                    input[type='text'] {
                        width: 70px;
                        height: 25px;
                        outline: none;
                        border: 1px solid transparent;
                        border-radius: 5px;
                        background: url(../../../../assets/img/nav/inputLatLon.png) no-repeat;
                        background-size: 100% 100%;
                        color: #fff;
                        text-indent: 0.3rem;
                    }
                }
                li:nth-of-type(1) {
                    i {
                        display: inline-block;
                        height: 34px;
                        width: 34px;
                        background: url(../../../../assets/img/nav/searchIcon.png) no-repeat;
                        background-size: 100% 100%;
                        cursor: pointer;
                        vertical-align: bottom;
                    }
                }
                li:nth-of-type(2){
                    i{
                        display: inline-block;
                        width: 32px;
                        height: 32px;
                        padding-left: 3px;
                        background: url(../../../../assets/img/nav/echo_lat_and_long.png) 0 0
                        no-repeat;
                        background-size: 100% 100%;
                        cursor: pointer;
                        vertical-align: middle;
                    }
                }
            }
        }
        /deep/.el-loading-mask{
            background-color: rgba(7,16,34,.8);
        }
    }
</style>

