<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { staticDataRequestServer } from '@/api/installServer';
@Component({
  name: 'Render',
})
export default class StatisticShrink extends Vue {
  @Prop()
  private viewData: any;
  @Prop()
  private type: any;
  @Prop()
  private moduleType: any;
  @Prop()
  private cityData: any;
  private totalNum: number = 0;
  private flag: boolean = true;
  private classflag: any = 1;
  private mapCircleQueryType: any = this.$store.state.controlMoudle
    .mapCircleQueryType;
  // 点击list是重新创建的数组（通信给右侧列表）
  private newListData: any = [];
  private paramsChecked: any = [];
  // 控制模块是否显示
  private moduleIsShow: boolean = true;
  private levelArrNew: any = [];
  private leveOff: any = true;
  //  周边查询
  public getAroundComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory &&
      factory.commonFactory &&
      factory.commonFactory.getComponent('nearQuery'); //  newsEventLocate,ResourceComponent
    return component;
  }
  // 点击改变模块显示隐藏
  private changeModuleIsShow() {
    this.moduleIsShow = !this.moduleIsShow;
  }
  // 叠加行政区划
  private addDistrictsNew(title: any) {
    // 行政区划组件
    const factory = this.$ioc.resolve('GISFactory-map');
    const districtComp = factory.disasterJudgeFactory.getComponent('districtComp');
    if (title === '村庄') {
      districtComp.load(true, true, this.levelArrNew, '' , 'village');
    } else if (title === '区县') {
      districtComp.load(true, true, this.levelArrNew, '' , 'county');
    } else {
      districtComp.load(true, true, this.levelArrNew, '' , 'town');
    }
  }

  // 取消行政区划的叠加
  private destroyDistricts() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const districtComp = factory.disasterJudgeFactory.getComponent('districtComp');
    districtComp.unload();
  }
  // 点击行政区划list（单选）
  private addClass(data: any, cityData: any) {
    this.flag = false;
    this.messsageBus.emit('Close_Router', {});
     // 隐藏常态模式事件分布
    this.messsageBus.emit('eventInfoMapShow', false);
    if (data.isChecked) {
      cityData.forEach((item: any) => {
        item.isChecked = false;
        this.getComponent(this.type).toggleLayer(item.type, false, item);
      });
      this.messsageBus.emit('listSearchObj', '');
    } else {
      data.isChecked = true;
      this.getComponent(this.type).toggleLayer(data.type, true, data);
      this.messsageBus.emit('listSearchObj', data);
      cityData.forEach((item: any, index: any, arr: any) => {
        if (item.type !== data.type) {
          item.isChecked = false;
          this.getComponent(this.type).toggleLayer(item.type, false, item);
        }
      });
    }
  }
  // 判断烈度圈的数量
  private AdministrativeDivision(index: any) {
    for (let i = 0; i < this.levelArrNew.length; i++) {
      if (this.levelArrNew[i] === index) {
        this.levelArrNew.splice(i, 1);
      }
    }
    return this.levelArrNew;
  }
  @Watch('viewData', {deep: true})
  private totalnum() {
    this.totalNum = 0;
    /**
     * 判断经验圈 烈度圈 面积圈对应资源数量
     */
    if (this.$store.state.eventPushStore.eventLocation.geometry) {
        this.totalNum  =  this.viewData[0].quantity;
    } else {
        this.viewData.forEach((item: any) => {
        if (item.isChecked) {
           this.totalNum = Number(this.totalNum) + Number(item.quantity);
        }
    });
    }

  }
  // 点击人口热力list
  private clickPopulationFeverList(item: any, data: any, title: any) {
    const types = this.$store.state.controlMoudle.mapCircleQueryType;
    if (types === 0) {
      this.levelArrNew = [];
      this.levelArrNew.push(item.intensity + '');
      this.leveOff = true;
    } else if (types === 1) {
      if (this.leveOff === true) {
        this.levelArrNew = [];
        for (const ele in data) {
          if (data[ele]) {
            this.levelArrNew.push(data[ele].intensity + '');
          }
        }
      }
    }
    this.flag = false;
     // 隐藏常态模式事件分布
    this.messsageBus.emit('eventInfoMapShow', false);
    if (item.isChecked) {
      item.isChecked = false;
      // 将当前选中的对应的子数组传递给列表
      this.messsageBus.emit('listSearchObj', '');
      if (types === 1) {
        this.AdministrativeDivision(item.intensity + '');
        console.log(this.levelArrNew);
        this.leveOff = false;
      }
      this.destroyDistricts();
      // this.addDistrictsNew(title);
    } else {
      if (this.$store.state.controlMoudle.mapCircleQueryType === 0) {
        data.forEach((iteFor: any, indFor: any, arrFor: any) => {
          iteFor.isChecked = false;
        });
      }
      if (types === 1) {
        this.levelArrNew.push(item.intensity + '');
        console.log(this.levelArrNew);
        this.leveOff = false;
      }
      item.isChecked = true;
      this.addDistrictsNew(title);
    }
    let newArr: any = [];
    const checkedObj: any = {};
    data.forEach((iteFor: any, indFor: any, arrFor: any) => {
      if (iteFor.isChecked) {
        newArr = newArr.concat(iteFor.listData);
        checkedObj[iteFor.intensity] = {
          town: iteFor.listData,
          county: iteFor.listCountyData,
        };
      }
    });
    // 将当前选中的对应的子数组传递给列表
    this.messsageBus.emit('listSearchObj', checkedObj);
  }
  // common 点击list事件
  // bol 当前是否选中
  // ind 下标
  // data 所有数据
  // item 当前点击的一条数据
  // moduleType 调用gis方法时传的参数 (school)
  // gisType 调用gis方法时传的参数 (disasterJudgeResource)
  // titleType 烈度或者公里数来区分为多选或者单选
  private clickFeatureList(
    bol: boolean,
    ind: number,
    data: any,
    item: any,
    moduleType: any,
    gisType: any,
  ) {
    this.flag = false;
    this.getAroundComponent().unload();
    // 关闭路径导航
    this.messsageBus.emit('Close_Router', {});
    // 隐藏常态模式事件分布
    this.messsageBus.emit('eventInfoMapShow', false);
    this.mapCircleQueryType = this.$store.state.controlMoudle.mapCircleQueryType;
    if (this.mapCircleQueryType === 0) {
      // 单选
      if (bol) {
        item.isChecked = false;
      } else {
        data.forEach((forItem: any, forIndex: any, forData: any) => {
          forItem.isChecked = false;
        });
        item.isChecked = true;
      }
    } else {
      // 多选
      if (bol) {
        this.viewData[ind].isChecked = false;
      } else {
        this.viewData[ind].isChecked = true;
      }
    }
    this.newListData = [];
    this.paramsChecked = [];
    // 判断哪些被选中创建新数组
    this.viewData.forEach((i: any, index: any, arry: any) => {
      if (i.isChecked === true) {
        this.newListData = this.newListData.concat(i.listData);
        this.paramsChecked = this.paramsChecked.concat(i.level);
      }
    });
    // 正常情况走这个(学校、医院……)
    if (gisType !== 'PopulationFever' && moduleType !== '_RealShip') {
      if (bol) {
        this.getComponent(gisType)._clearLayerByID(moduleType);
      } else {
        if (this.mapCircleQueryType === 0) {
          // 单选
          // 如果是单选，在选中当前的点时需要清空其余的点位
          const levelArr: any = [];
          data.forEach((forItem: any, forIndex: any, forData: any) => {
            levelArr.push(forItem.level);
          });
          this.getComponent(gisType)._clearLayerByID(moduleType);
        }
        this.getComponent(gisType)._showPoint(item.listData, moduleType, '');
      }
    } else if (
      // 船舶特殊处理（传给gis的参数不同 disasterJudgeShip）
      gisType === 'disasterJudgeResource' &&
      moduleType === '_RealShip'
    ) {
      if (bol) {
        this.getComponent('disasterJudgeShip').hideResource(moduleType, [
          String(item.level),
        ]);
      } else {
        this.getComponent(gisType)._showPoint(item.listData, moduleType, '');
      }
    }
    // 将当前选中的对应的子数组传递给列表
    this.messsageBus.emit('listSearchObj', this.newListData);
  }
  // private created() {
  // }
  private setTitle(val: any) {
    if (this.$store.state.controlMoudle.mapCircleQueryType === 0) {
      return val;
    } else if (this.$store.state.controlMoudle.mapCircleQueryType === 1) {
      let unit: any;
      switch (val) {
        case 5:
          unit = 'Ⅴ';
          break;
        case 6:
          unit = 'Ⅵ';
          break;
        case 7:
          unit = 'Ⅶ';
          break;
        case 8:
          unit = 'Ⅷ';
          break;
        case 9:
          unit = 'Ⅸ';
          break;
        case 9:
          unit = 'X';
          break;
      }
      return unit;
    }
  }

  // 面处置时，初步研判中-默认数据及操作处理
  private displaySource(data: any, item: any, moduleType: any, gisType: any, cityState = false) {
      this.getAroundComponent().unload();
      // 关闭路径导航
      this.messsageBus.emit('Close_Router', {});
      // 隐藏常态模式事件分布
      this.messsageBus.emit('eventInfoMapShow', false);

      // 人口热力
      if (moduleType === 'PopulationFever') {
          const checkedObj: any = {};
          data.forEach((iteFor: any, indFor: any, arrFor: any) => {
              checkedObj[iteFor.intensity] = {
                  town: iteFor.listData,
                  county: iteFor.listCountyData,
              };
          });
          // 将当前选中的对应的子数组传递给列表
          this.messsageBus.emit('listSearchObj', checkedObj);
      } else if (gisType !== 'PopulationFever' && moduleType !== '_RealShip' && !cityState) {
          // 正常情况走这个(学校、医院……)
          this.getComponent(gisType).showResource(moduleType, this.paramsChecked);
          this.messsageBus.emit('listSearchObj', item.listData);
      } else if (gisType === 'disasterJudgeResource' && moduleType === '_RealShip') {
          // 船舶特殊处理（传给gis的参数不同 disasterJudgeShip）
          this.getComponent('disasterJudgeShip').showResource(moduleType, this.paramsChecked);
          this.messsageBus.emit('listSearchObj', item.listData);
      }

      // 行政区划分布
      if (cityState && data[1].allData.length) {
          data[1].isChecked = true;
          this.getComponent(this.type).toggleLayer( data[1].type, true,  data[1]);
          this.messsageBus.emit('listSearchObj',  data[1]);
          data.forEach((it: any, index: any, arr: any) => {
              if (it.type !== data[1].type) {
                  it.isChecked = false;
                  this.getComponent(this.type).toggleLayer(it.type, false, it);
              }
          });
      }
  }
  // private mounted() {
  // }
  // 通过render导出
  private render() {
    const geo = this.$store.state.eventPushStore.eventLocation.geometry;
    if (this.cityData) {
      this.cityData.geometry = geo;
    }
    if (this.viewData) {
        this.viewData.geometry = geo;
    }
    if (!!geo && ((this.cityData && this.cityData.length) || this.viewData.length)) {
        const cityState = !!(this.cityData && this.cityData.length);
        const result = cityState ? this.cityData : this.viewData;

        this.$nextTick(() => {
            if (this.flag) {
                this.paramsChecked = [];
                // 判断哪些被选中创建新数组
                result.forEach((i: any, index: any, arry: any) => {
                    this.paramsChecked = this.paramsChecked.concat(i.level);
                });
                this.displaySource(result, result[0], this.moduleType, this.type, cityState);
            }
        });
    }
    return (this.$scopedSlots.default as any)({
      // 关于行政区划 start
      classflag: this.classflag,
      addClass: this.addClass,
      // 关于行政区划 end
      clickFeatureList: this.clickFeatureList,
      viewRenderData: this.viewData,
      // 控制模块显示隐藏
      moduleIsShow: this.moduleIsShow,
      changeModuleIsShow: this.changeModuleIsShow,
      clickPopulationFeverList: this.clickPopulationFeverList,
      setTitle: this.setTitle,
      totalNum: this.totalNum,
      // 是什么圈
      mapCircleQueryType: this.mapCircleQueryType,
    });
  }
  private getComponent(type: any) {
    if (type === 'NewResourceComponent') {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.normalFactory.getComponent(
        'NewResourceComponent_left',
      );
      return component;
    } else {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.disasterJudgeFactory.getComponent(type);
        return component;
    }
  }
}
</script>
