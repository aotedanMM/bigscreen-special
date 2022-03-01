<template>
    <div class="baidudistricfilterBox" style="display: block">
        <h1 class="title-panel">城市列表<span class="close-city" @click="closePopView"></span></h1>
        <div class="city-body" :class="{mainregion:showMain}">
            <!-- 当前位置 -->
            <p class="current-city f-tit-h2">
                <span class="rootRegion" @click="handelRootClick">{{rootRegion.name}}</span>
                <span v-for="(item,index) in naviList" :key="index" @click="handleNaviClick(item)" class="provinxName">>{{item.name}}</span>
            </p>
            <!-- 主面板 -->
            <div style="height: calc(100% - 185px);" v-show="showMain">
                <!-- 直辖市 -->
                <p class="zhixiacity">
                    <span class="f-txt-com" v-for="(item,index) in zhixiaCity" :key="index" @click="handleZhixiaCityClick(item)">{{item.name}}</span>
                </p>
                <p class="city-option">
                    <!-- 省份-城市切换 -->
                    <span class="tab-city f-tit-h2">
                        <em @click="handleProvinceCitySwitch('province')" :class="{ current_tab: provinceCityStatus == 'province' }">按省份</em>
                        <em @click="handleProvinceCitySwitch('city')" :class="{ current_tab: provinceCityStatus == 'city' }">按城市</em>                    
                    </span>
                    <!-- 搜索框 -->
                    <label class="search-city">
                        <input v-model="inputData" @compositionend="handleEnd" type="text" placeholder="输入城市名" id="search_Ciity_keyDown">
                        <em @click="handleSearchButtonClick" class="f-txt-com">搜索</em>                    
                    </label>
                    <!-- 搜索结果 -->
                    <ul class="searchListData scroll clearfix" v-show="showResult">
                        <li v-for="(item,Cindex) in searchResult" :key="Cindex" @click="handleSearchItemClick(item)">{{item.name}}</li>
                    </ul>
                </p>
                <!-- 切换为省份时 -->
                <div style="height:100%;;" v-show="(provinceCityStatus == 'province')"> 
                    <div class="option-letter province-letter clearfix f-txt-com">
                        <span v-for="(value,key) in provinceLetterMap" :key="key" @click="handleLetterClick(key, 'province')">{{key}}</span>
                    </div>  
                    <ul class="regionData  scroll clearfix">
                        <li class="regionData-Li"  v-for="(item,pIndex) in provinceList" :key="pIndex">
                            <div :id = "'province_letter_'+item.initialLetter" class="regionData-LiLetter"><span class="f-tit-h1">{{item.initialLetter}}</span></div>
                            <div class="regionData-LiData">
                                <div class="provinceName f-tit-h2" @click="handleProvinceClick(item)">{{item.provinceName}}</div>
                                <div class="regionDataBranchcity f-txt-com">
                                    <span v-for="(res,cIndex) in item.cityArrdata" :key="cIndex" @click="handleCityClick(res, item)">{{res.name}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 切换为城市时 -->
                <div style="height:calc(100% - 20px);" v-show="(provinceCityStatus == 'city')">
                    <div class="option-letter city-letter clearfix f-txt-com" >
                        <span v-for="(value,key) in cityLetterMap" :key="key" @click="handleLetterClick(key, 'city')">{{key}}</span>
                    </div>            
                    <ul class = "regionData scroll clearfix">
                        <li class="regionData-Li"  v-for="(value,key) in cityLetterMap" :key="key">
                            <div :id = "'city_letter_'+key" class="regionData-LiLetter"><span class="f-tit-h1">{{key}}</span></div>
                            <div class="regionData-LiData">
                                <div class="regionDataBranchcity f-txt-com" style="width: 95%">
                                    <span v-for="(res,cIndex) in value" :key="cIndex" @click="handleCityClick(res)">{{res.name}}</span>
                                </div>
                            </div>
                        </li>                
                    </ul>               
                </div>
            </div>
            <!-- 点击市级后县级列表 -->
            <div v-show="!showMain">
                <ul class = "regionData scroll clearfix">
                    <div class="regionList f-txt-com">
                        <span v-for="(res,cIndex) in regionList" :key="cIndex" @click="handleRegionClick(res)">{{res.name}}</span>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
@Component({
    name: 'RegionSelection',
    components: {MapCommon},
    mixins: [MapCommon],
})
export default class RegionSelection extends Vue {
    /**
     * districtCode
     * service // 服务由外部传入
     */
    @Prop() public option: any;
    // 地区编码
    private districtCode: string = this.option ? (this.option.districtCode || '000000') : '';
    // 地区选择变化事件名称
    private locationChangeEvent = 'change';
    // // 是否显示主面板
    // private showPanel: boolean = true;
    // 是否显示关键字查询结果列表
    private showResult: boolean = false;
    // 是否为主界面
    private showMain: boolean = false;
    // 关键字查询输入
    private inputData: string = '';
    // 全国(地区)基础数据
    private regionData: any = null;
    // 关键字查询结果
    private searchResult: any = null;
    // 字母索引中：省份、城市切换-province, city
    private provinceCityStatus: string = 'province';
    // 首字母对照省级对象
    private provinceLetterMap: any = null;
    // 省级数据列表
    private provinceList: any = [];
    // 市级数据列表
    private cityLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];
    // 首字母对照市级对象
    private cityLetterMap = null;
    // 区域数据列表
    private regionList: any = null;
    // 布局级别
    private layoutLevel: number = 0;
    // 头部导航信息
    private naviList: any = [];
    // 组件最大区域信息-默认全国
    private rootRegion: any = {
        name: '全国',
        gbcode: '000000',
        level: 0,
    };
    // 直辖市信息
    private zhixiaCity = [{
            name: '北京市',
            code: '110000',
        },
        {
            name: '天津市',
            code: '120000',
        },
        {
            name: '上海市',
            code: '310000',
        },
        {
            name: '重庆市',
            code: '500000',
        },
    ];
    /**
     * 关闭面板
     */
    public  closePopView() { // 关闭
        this.getComponent().clear(); // 调用gis的关闭方法
        this.$emit('close');
        // this.showPanel = false;
    }
    // 地图组件
    private getComponent() {
        const modules = this.$ioc.resolve('GISFactory-map');
        const component = modules.commonFactory.getComponent('regionSelection');
        return component;
    }
    private mounted() {
        const self: any = this;
        const centerPoint = {x: 116, y: 40};
        self.resolveMap('map').then((data: any) => {
            this.init();
        });
    }
    private beforeDestroy() {
        this.closePopView();

    }
    // 初始化
    private init() {
        const self = this;
        this.option.service.getRegionData({}).then((data: any) => {
            if (data.success || data.data) {
                this.regionData = data.data;
                this.renderMainPanel();
            }
        });
    }
    /**
     * 渲染面板
     */
    private renderMainPanel() {
        // 区域最大级别
        this.layoutLevel = this.getDistrictLevel(this.districtCode);
        if (this.layoutLevel === 0) {
            // 国-省-市 面板
            this.showMain = true;
            const event = {
                location: '全国',
                districtCode: '000000',
            };
            this.fireLocationChangeEvent(event);
            this.renderNationalLayout();
        } else {
            this.showMain = false;
            // 获取最大区域
            this.rootRegion = this.getDistrictByCode(this.districtCode);
            // 下属区划列表
            this.regionList = this.getSubDistrictByCode(this.districtCode);
        }
    }
    /**
     * 定位变化事件
     */
    private fireLocationChangeEvent(event: any) {
        this.$emit(this.locationChangeEvent, event);
    }
    /**
     * 全国布局
     */
    private renderNationalLayout() {
        // 初始化省列表
        this.initProvinceData();
        // 初始化城市列表
        this.initCityData();
    }
    /**
     * 根据code获取级别
     */
    private getDistrictLevel(districtCode: string) {
        let level = 0;
        if (districtCode === '000000') {
            level = 0;
        } else if (/^\d{2}0000$/.test(districtCode)) {
            level = 1;
        } else if (/^\d{4}00$/.test(districtCode)) {
            level = 2;
        } else if (/^\d{6}$/.test(districtCode)) {
            level = 3;
        }
        return level;
    }
    /**
     * 根据code获取区划
     */
    private getDistrictByCode(districtCode: string) {
        for (const region of this.regionData) {
            if ((region.gbcode || region.gbCode) === districtCode) {
                return region;
            }
        }
    }
    /**
     * 根据code获取下属行政区划
     */
    private getSubDistrictByCode(districtCode: string) {
        const result = [];
        for (const region of this.regionData) {
            if ((region.parentcode || region.parentCode) === districtCode) {
                result.push(region);
            }
        }
        return result;
    }

    // 监听关键字
    @Watch('inputData')
    private getinputDataValue(val: any) {
        const self = this;
        if (self.inputData.trim().length === 0) {
            self.showResult = false;
        }
    }

    /**
     * 关键字输入后处理
     */
    private handleEnd(event: any) {
        const inputVal = event.target.value;
        const self = this;
        if (inputVal && inputVal.trim()) {
            self.showResult = true;
            self.searchResult = [];
            self.regionData.forEach(function(item4: any, index: any) {
                if (item4.name.indexOf(inputVal) !== -1) {
                    self.searchResult.push(item4);
                }
            });
        } else {
            self.showResult = false;
        }
    }
    /**
     * 字母点击定位
    */
    private handleLetterClick(letter: string, type: string) {
        const self: any = this;
        const id = type + '_letter_' + letter;
        const selector = '#' + id;
        self.$el.querySelector(selector).scrollIntoView({
            behavior: 'smooth',  // 平滑过渡
            block:    'nearest',
        });
    }
    /**
     * 搜索结果列表点击事件
     */
    private handleSearchItemClick(item: any) {
        const self = this;
        const res: any = {};
        res.id = item.gbcode || item.gbCode;
        res.level = item.level;
        res.name = item.name;
        self.checkdistrict(res);
        this.inputData = res.name;
        this.showResult = false;
        const realLevel = this.getDistrictLevel(item.gbcode || item.gbCode);
        // 区县级进入区域列表
        if (realLevel + '' === '3') {
            this.naviList = this.getNaviList(item.gbcode || item.gbCode);
            this.showResult = false;
            this.showMain = false;
            this.regionList = this.getSubDistrictByCode((item.parentcode || item.parentCode));
            this.inputData = '';
        }
    }
    /**
     * 点击搜索按钮
     */
    private handleSearchButtonClick() {
        if (this.searchResult && this.searchResult.length > 0) {
            const targetRes = this.searchResult[0];
            this.handleSearchItemClick(targetRes);
        } else {
            this.$message('暂无数据');
        }
    }
    /**
     * 导航根信息点击（默认全国）
     */
    private handelRootClick() {
        const self  = this;
        this.showMain = true;
        const item: any = {};
        item.level = this.layoutLevel;
        item.id = this.districtCode;
        item.name = this.rootRegion.name;
        self.checkdistrict(item);
        if (this.layoutLevel === 0) {
            this.showMain = true;
            this.naviList = [];
        } else {
            this.showMain = false;
            this.regionList = this.getSubDistrictByCode(this.districtCode);
            this.naviList = [];
        }
    }
    /**
     * 按省按市切换
     */
    private handleProvinceCitySwitch(status: any) {
        this.provinceCityStatus = status;
    }
    /**
     * 主面板下市点击
     */
    private handleCityClick(res: any) {
        const self = this;
        const code = res.gbcode || res.gbCode;
        let parentcity = '';
        const text = res.name;
        let onecode = '';
        const item: any = {};
        item.id = code;
        item.name = text;
        self.checkdistrict(item);
        this.naviList = this.getNaviList(code);
        this.showResult = false;
        this.showMain = false;
        const countrycityArr: any = [];
        self.regionData.forEach(function(itemLevel: any, index: any) {
            if (code === (itemLevel.parentcode || itemLevel.parentCode) && itemLevel.level + '' === '3') {
                countrycityArr.push(itemLevel);
            }
            if (code && code.substr(0, 2) + '0000' === (itemLevel.gbcode || itemLevel.gbCode)) {
                parentcity = itemLevel.name;
                onecode = (itemLevel.gbcode || itemLevel.gbCode);
            }
        });
        this.regionList = countrycityArr;
    }
    /**
     * 区域列表数据点击
     */
    private handleRegionClick(res: any) {
        const code = res.gbcode || res.gbCode;
        const item: any = {};
        item.id = code;
        item.name = res.name;
        this.checkdistrict(item);
        this.naviList = this.getNaviList(code);
        const regionlist = this.getSubDistrictByCode(code);
        if (regionlist.length > 0) {
            this.regionList = regionlist;
        }
    }
    /**
     * 导航节点点击
     */
    private handleNaviClick(res: any) {
        const item: any = {};
        item.id = res.gbcode || res.gbCode;
        item.name = res.name;
        item.level = res.level;
        this.checkdistrict(item);
        this.regionList = this.getSubDistrictByCode(res.gbcode || res.gbCode);
        this.naviList = this.getNaviList(res.gbcode || res.gbCode);

        if (this.layoutLevel === 0 && res.level + '' === '1') {
            this.showMain = true;
        }
    }
    /**
     * 省点击事件
     */
    private handleProvinceClick(res: any) {
        const text = res.provinceName;
        const code = res.adcode;
        const aobj = '>' + text;
        const item: any = {};
        item.id = code;
        item.name = text;
        this.checkdistrict(item);
        this.naviList = this.getNaviList(code);
    }
    /**
     * 直辖市信息点击
     */
    private handleZhixiaCityClick(res: any) {
        this.showResult = false;
        this.showMain = false;
        const code = res.code;
        const text = res.name;
        const zhixiashiArr: any = [];
        const item: any = {};
        item.id = code;
        item.name = text;
        this.checkdistrict(item);
        this.naviList = this.getNaviList(code);
        this.regionData.map(function(item1: any, index: any) {
            if (code === (item1.parentcode || item1.parentCode) && item1.level + '' === '2') {
                zhixiashiArr.push(item1);
            }
        });
        this.regionList = zhixiashiArr;
    }
    // 区域点击事件
    private checkdistrict(item: any) {
        const self = this;
        if (item.level + '' === '0') {
            this.getComponent().clear();
            this.getComponent().fullExtent();
        } else {
            this.getComponent().drawRegion(item.id);
        }
        if (item.name === '') {
            return;
        } else {
            const event = {
                location: item.name,
                districtCode: item.id,
            };
            self.fireLocationChangeEvent(event);
        }
    }
    /**
     * 根据code获取其导航信息
     */
    private getNaviList(districtCode: string) {
        const self = this;
        const result = [];
        const currentLevel = this.getDistrictLevel(districtCode);
        for (let level = self.layoutLevel + 1; level <= currentLevel; level++) {
            const code = this.getCodeByLevel(districtCode, level);
            const region = this.getDistrictByCode(code);
            if (region) {
                result.push(region);
            }
        }
        return result;
    }
    /**
     * 根据级别获取指定code在指定级别下的值
     */
    private getCodeByLevel(districtCode: string, level: number) {
        const prefixNum = level * 2;
        const zeroNum = 6 - prefixNum;
        let zeroStr = '';
        for (let index = 0; index < zeroNum; index++) {
            zeroStr += '0';
        }
        const code = districtCode.substring(0, prefixNum) + zeroStr;
        return code;
    }
    /**
     * 初始化省级导航数据
     */
    private initProvinceData() {
        const self = this;
        // 省级数据配置
        const dataobj = this.getProvinceConfig();
        for (const key in dataobj) {
            if (dataobj.hasOwnProperty(key)) {
                const provinceGroup = dataobj[key];
                const Ew = provinceGroup;
                let isFirst = true;
                for (const i1 in Ew.children) {
                    if (Ew.children[i1]) {
                        this.regionData.map(function(itemChina: any, index: any) {
                            if (Ew.children[i1].name === itemChina.name) {
                                Ew.children[i1].provinceName = itemChina.name;
                                Ew.children[i1].adcode = (itemChina.gbcode || itemChina.gbCode);
                                Ew.children[i1].longitude = itemChina.longitude;
                                Ew.children[i1].latitude = itemChina.latitude;
                                Ew.children[i1].level = itemChina.level;
                            }

                            if (Ew.children[i1].code === Number((itemChina.gbcode || itemChina.gbCode).substr(0, 2)) && itemChina.level + '' === '2') {
                                Ew.children[i1].cityArrdata.push(itemChina);
                            }
                        });
                        if (isFirst) {
                            Ew.children[i1].initialLetter = key;
                            isFirst = false;
                        } else {
                            Ew.children[i1].initialLetter = ' ';
                        }
                        self.provinceList.push(Ew.children[i1]);
                    }
                }
            }
        }
        this.provinceLetterMap = dataobj;
    }
    /**
     * 城市列表元素-拼音排序
     */
    private initCityData() {
        const self = this;
        const cityArr: any = [];
        const cityData: any = {};
        this.regionData.map(function(item: any) {
            if (item.level + '' === '2') {
                cityArr.push(item);
            }
        });
        for (const iterator of this.cityLetter) {
            cityData[iterator] = self.chooseFunc(cityArr, iterator);
        }
        this.cityLetterMap = cityData;
    }
    /**
     *城市数据A-Z的数据筛选
    */
    private chooseFunc(data: any, letter: any) {
        const arr = data.filter(function(item: any) {
            return item.pinyin.substr(0, 1) === letter;
        });
        return arr;
    }
    /**
     * 省级配置
     */
    private getProvinceConfig() {
        const dataobj: any = {};
        dataobj.A = {
            children: {
                AHS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '安徽省',
                    code: 34,
                },
            },
        },
        dataobj.F = {
            children: {
                FJS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '福建省',
                    code: 35,
                },
            },

        };
        dataobj.G = {
            children: {
                GS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '甘肃省',
                    code: 62,
                },
                GD: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '广东省',
                    code: 44,
                },
                GX: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '广西壮族自治区',
                    code: 45,
                },
                GZ: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '贵州省',
                    code: 52,
                },
            },
        };
        dataobj.H = {
            children: {
                HEN: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '河南省',
                    code: 41,
                },
                HEB: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '河北省',
                    code: 13,
                },
                HNA: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '海南省',
                    code: 46,
                },
                HLJ: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '黑龙江省',
                    code: 23,
                },
                HUB: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '湖北省',
                    code: 42,
                },
                HUN: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '湖南省',
                    code: 43,
                },
            },
        };
        dataobj.J = {
            children: {
                JAS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '江苏省',
                    code: 32,
                },
                JAX: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '江西省',
                    code: 36,
                },
                JIL: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '吉林省',
                    code: 22,
                },
            },
        };
        dataobj.L = {
            children: {
                LNS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '辽宁省',
                    code: 21,
                },
            },
        };
        dataobj.N = {
            children: {
                NMG: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '内蒙古自治区',
                    code: 15,
                },
                NX: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '宁夏回族自治区',
                    code: 64,
                },
            },
        };
        dataobj.Q = {
            children: {
                QHS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '青海省',
                    code: 63,
                },
            },
        };
        dataobj.S = {
            children: {
                SD: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '山东省',
                    code: 37,
                },
                SX: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '山西省',
                    code: 14,
                },
                SXI: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '陕西省',
                    code: 61,
                },
                SC: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '四川省',
                    code: 51,
                },
            },
        };
        dataobj.T = {
            children: {
                TWS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '台湾省',
                    code: 71,
                },
            },
        };
        dataobj.X = {
            children: {
                XJ: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '新疆维吾尔自治区',
                    code: 65,
                },
                XZ: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '西藏自治区',
                    code: 54,
                },
            },
        };
        dataobj.Y = {
            children: {
                TWS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '云南省',
                    code: 53,
                },
            },
        };
        dataobj.Z = {
            children: {
                ZJS: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '浙江省',
                    code: 33,
                },
            },
        };
        dataobj.港澳 = {
            children: {
                HK: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '香港特别行政区',
                    code: 81,
                },
                MACAO: {
                    provinceName: '',
                    cityArrdata: [],
                    name: '澳门特别行政区',
                    code: 82,
                },
            },
        };
        return dataobj;
    }
}
</script>
<style lang='less' scoped>
    @imgPath: '../../../../assets/img/regionSelection';
    @url: '../../../../assets/img/halfScreen/eventAndTopics';
    .scroll{
        overflow-y: scroll;
        overflow-x: hidden;
    }
    ::-webkit-scrollbar {
        width: 6px;
        border-radius: 5px;
        opacity: 0.64;
    }

    ::-webkit-scrollbar-track {
        width: 6px;
        height: 3px;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb {
        width: 6px;
        height: 3px;
        background: rgba(58, 250, 252, 0.2);
        border-radius: 4px;
    }    
    
    input::-moz-placeholder,
    input::-moz-placeholder,
    input::-webkit-input-placeholder{
        color:#fff;
    }
    .clearfix,.city-select .city-cont dl,.city-select .city-txt{
        *zoom:1
    }.clearfix:after,.city-select .city-cont dl:after,.city-select .city-txt:after {
        content:" ";
        display:table;
        height:0;
        clear:both;
    }
    // .current-city {
    //     color: #d6f3ff;
    //     font-size: 18px;
    //     border-bottom: 1px dashed rgba(103,221,255,0.35);
    //     /* margin-bottom: 10px; */
    //     padding-top: 12px;
    //     padding-bottom: 5px;
    // }

    /*模拟百度行政区划*/
    .baidudistricfilterBox{
        position: absolute;
        top: 80px;
        left: 10px;
        bottom:205px;
        width: 599px;
        cursor: pointer;
        padding:3px 6px 0 6px;
        box-sizing: border-box;
        pointer-events: none;
    }
    .baidudistricfilterBox::before{
        content:'';
        display: block;
        position: absolute;
        top:-5px;
        left:0;
        right:0;
        height:77px;
        // width:466px;
        background:url('@{imgPath}/head.png') no-repeat;
        z-index:0;
    }
    .baidudistricfilterBox::after{
        content:'';
        display: block;
        position: absolute;
        // bottom: -47px;
        left:0;
        height:51px;
        background:url('@{imgPath}/foot.png') no-repeat;
        width:599px;
        background-size: 100% 100%;
    }
    .baidudistricfilterBox h1{
        position: relative;
        margin: 18px 0 0 30px;
    }
    .close-city{
        position: absolute;
        top: -15px;
        right: 5px;
        width: 80px;
        height: 35px;
        background: url('@{url}/eventAndTopics_close.png') no-repeat 0 0;
        z-index: 1;
        cursor: pointer;
        pointer-events: auto;
    }
    .close-city:hover{
        background-image: url('@{url}/eventAndTopics_close_h.png');
    }
    .city-body{
        background:url('@{imgPath}/body.png') repeat-y;
        padding:0px 7%;
        // font-size:18px;
        text-align: left;
        margin-left: -6px;
        pointer-events: auto;
    }
    .mainregion{
        height: calc(100% - 50px);
    }    
    .current-city{
        color:#d6f3ff;
        // font-size:18px;
        border-bottom:1px dashed rgba(103,221,255,0.35);
        /*margin-bottom:10px;*/
        padding-top: 20px;
        padding-bottom:5px;
        margin:0;
    }
    .city-option{
        display: flex;
        justify-content: space-between;
    }
    .tab-city{
        // width:140px;
        // height:28px;
        display: inline-block;
        display: flex;
        margin-bottom:10px;
        // font-size:18px;
    }
    .tab-city em{
        color:#d6f3ff;
        font-style: normal;
        width: 50%;
        text-align: center;
        background:rgba(2,142,168,0.5);
        border:1px solid rgba(2,142,168,0.8);
        line-height:1;
        text-align: center;
        padding:5px 10px;
    }
    .tab-city em:hover{
        cursor: pointer;
    }
    .tab-city em:nth-child(1){
        border-radius:3px 0 0 3px;
    }
    .tab-city em:nth-child(2){
        border-radius:0px 3px 3px 0px;
    }
    .tab-city em.current_tab{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
    }
    .tab-city em:nth-child(1).current_tab{
        border-radius:3px 0 0 3px;
    }
    .tab-city em:nth-child(2).current_tab{
        border-radius:0px 3px 3px 0px;
    }
    .search-city{
        /*display: flex; */
        position: relative;
        margin-right: 61px;
    }
    .search-city input{
        border:1px solid rgba(2,142,168,0.8);
        border-radius:3px 0 0 3px;
        height:36px;
        background:transparent;
        outline: none;
        padding-left:10px;
        // font-size:18px;
        width:180px;
        font-size:26px;
        box-sizing: border-box;
    }
    .search-city em{
        background: url('@{imgPath}/btnbg.png') no-repeat;
        color: #fff;
        height: 28px;
        display: inline-block;
        /* border-radius: 0px 3px 3px 0px;*/
        /* padding: 0 10px; */
        // font-size: 18px;
        width: 88px;
        height: 56px;
        line-height: 56px;
        margin-top: -11px;
        text-align: center;
        /* position: absolute; */
        position: absolute;
        right: -78px;
    }
    .option-letter{
        border-bottom:1px dashed rgba(103,221,255,0.35);
        margin:10px 0 25px;
        padding-bottom:10px;
    }
    .option-letter span{
        float: left;
        color: #d6f3ff;
        margin-right: 4px;
        min-width: 28px;
        display: inline-block;
        text-align: center;
        padding: 0 5px;
        height: 25px;
        line-height: 22px;
        margin-bottom: 5px;
        border:1px solid transparent;
    }
    .option-letter span:hover{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
        border-radius:3px;
        cursor: pointer;
    }
    .option-letter span.letter-active{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
        border-radius:3px;
    }


    .regionData{
        // min-height: 100px;
        // max-height: 300px;
        overflow-y: scroll;
        color: #fff;
        max-height:calc(100% - 90px);
    }
    .regionData-Li{

        display: flex;
        margin-bottom: 15px;
    }
    .regionData-LiLetter{
        width: 15%;
        // font-size: 40px;
        font-weight: 600;
        line-height: 1;
        padding-top:10px;
    }
    .regionData-LiData{
        width:85%;
        display: flex;
        padding: 2px 0;
        margin-bottom: 10px;
        color: #d6f3ff;
    }
    .provinceName{
        width: 30%;
        // white-space: nowrap;
        font-weight: 600;
    }
    .regionDataBranchcity{
        width: 70%;
    }
    .regionDataBranchcity span {
        min-width: 30px;
        display: inline-block;
        border: 1px solid transparent;
        padding: 0px 3px;
    }
    .regionDataBranchcity span:hover{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
        border-radius:3px;
        cursor: pointer;
    }
    .regionDataBranchcity span.child-active{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
        border-radius:3px;
    }
    .search-city input{
        color: #fff;
    }
    .regionList span{
        min-width: 30px;
        display: inline-block;
        border: 1px solid transparent;
        padding: 0px 3px;
    }
    .regionList span:hover{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
        border-radius:3px;
        cursor: pointer;
    }
    .regionList span.child-active{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
        border-radius:3px;
    }
    .search-city em{
        cursor: pointer;
        font-style: normal;
    }
    .regionList span{
        min-width: 30px;
        display: inline-block;
        border: 1px solid transparent;
        padding: 0px 3px;
    }
    .regionList span:hover{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
        border-radius:3px;
        cursor: pointer;
    }
    .regionList span.child-active{
        background:rgba(221,185,17,0.15);
        color:#d4d4a6;
        border:1px solid yellow;
        border-radius:3px;
    }
    .searchListData{
        position: absolute;
        right: 18%;
        width: 180px;
        max-height: 100px;
        overflow: hidden;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.8);
        margin-top: 35px;
    }
    .searchListData li{
        color: #fff;
        // font-size: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding:0 5px;
    }
    .searchListData li:hover{
        background: rgba(0,0,0,.4);
    }
    .zhixiacity{
        width: 100%;
        height: 40px;
        line-height: 43px;
        color: #d6f3ff;
        // font-size: 18px;
        border-bottom: 1px dashed rgba(103,221,255,0.35);
        margin:0 0 10px 0
    }
    .zhixiacity span{
        display: inline-block;
        width: 24%;
        height: 100%;
        text-align: center;
        // bottom: 1px solid transparent;

    }
    .zhixiacity span:hover{
        background: rgba(221,185,17,0.15);
        color: #d4d4a6;
        box-shadow:0 0 0 1px yellow;
        border-radius: 3px;
        line-height: 40px;
    }
    .zhixiacitycur{
        background: rgba(221,185,17,0.15);
        color: #d4d4a6;
        border: 1px solid yellow;
        border-radius: 3px;
        line-height: 40px;
    }
</style>