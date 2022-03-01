<template>
  <div ignore="2" class="SwitchMap" id="SwitchMapCtrl">
    <div
      class="mode-type current-map"
      @mouseover="currentOver"
      @mouseout="currentOut"
    >
      <div class="mode-img">
        <span class="mode-img_box"><img id="current-map-img" /></span>
        <span class="mode-wrap_text">影像</span>
      </div>
    </div>
    <div class="mode-wrap option-map" @mouseover="fnOver" @mouseout="fnOut">
      <div
        class="mode-type"
        v-for="(item, index) in modeData"
        @click="fnClick(item, index, modeData)"
        :key="item.title"
      >
        <div class="mode-img">
          <span class="mode-img_box"><img :src="item.icon" /></span>
          <span
            class="mode-wrap_text"
            :class="
              item.title === '30米三维' || item.title === '10米三维'
                ? 'change'
                : ''
            "
            >{{ item.title }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import publishObjectPath from '@/util/configRegistry';
import './SwitchMap.less';
import { mapServer } from '../../../../api/installServer';
// const $ = require('jquery');
@Component({
  mixins: [MapCommon],
})
export default class GisSwitchMap extends Vue {
  @Prop() public options: any;
  // 监听地图初始化
  public mapComponent: any;
  public direction: string = 'down';
  //  this.map=this.options.map;
  public modeData: any[] = [];
  public index: any = 0;
  public $aChildren: any = '';
  private clientId: string = '';
  private clientSecret: string = '';
  private curMode: any = {};

  // 不同专题下默认底图监听
  @Watch('$store.state.configModel.config')
  private updateTopicConfig(val: any) {
    const data: any = JSON.parse(JSON.stringify(val));
    const toolList = data.toolConfig.gisToolList;
    let baseLayerConf: any = {};
    toolList.forEach((element: any) => {
      if (element.component === 'GisSwitchMap') {
        baseLayerConf = element.options;
      }
    });
    const layerIndex = baseLayerConf.defaultLayerIndex || 0;
    this.fnClick(this.modeData[layerIndex], layerIndex, this.modeData);
  }
  private created() {
    this.modeData = JSON.parse(JSON.stringify(this.options.baseLayers));
    // todo 保证一直所有地图类型都在下拉列表中，只更换列表中第一个item
    // this.modeData.push(this.options.baseLayers[0]);
    this.modeData.push({
      id: 'emap_img',
      icon: './imgs/gisSwitchMap/yingxiang.png',
      title: '30米三维',
      type: '3D',
      name: 'terrainlayer1',
    });
    this.modeData.push({
      id: 'emap_img',
      icon: './imgs/gisSwitchMap/gaoqing.png',
      title: '10米三维',
      type: '3D',
      name: 'terrainlayer2',
    });
    this.index = 0;
    this.curMode = this.modeData[0];
    console.log(this.modeData, 'pppppppppppppppppppppppppppp');
    // 监听切换地图
    this.messsageBus.on('showGisSwitchMap', (data: any) => {
      this.EventSwitchMap(data);
    });
  }
  private mounted() {
    this.clientId = publishObjectPath.value.egis.clientId;
    this.clientSecret = publishObjectPath.value.egis.clientSecret;
    // 获取地图，地图加载完成后进入回调
    const self: any = this;
    self.resolveMap(this.options.mapId).then((event: any) => {
      this.initMap(event.map);
      const layerIndex = this.options.defaultLayerIndex || 0;
      if (layerIndex !== 0) {
        this.fnClick(this.modeData[layerIndex], layerIndex, this.modeData);
      }
    });
    const $obj = $('.mode-wrap');
    this.$aChildren = $obj.children();
    $('#current-map-img').attr('src', './imgs/gisSwitchMap/yingxiang.png');
    // this.Childrenitem0 = $obj.children()[0].innerHTML;
  }
  private initMap(map?: any) {
    this.mapComponent = () => {
      return map;
    };
  }
  // 监听消息切换地图
  // @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private EventSwitchMap(val: any) {
    this.index = val;
    const item = this.modeData[this.index];
    if (this.curMode.title === item.title) {
      return;
    }
    this.curMode = item;
    if (this.index !== 0) {
      this.$aChildren[this.index].style.border = 'none';
      this.$aChildren[this.index].children[0].children[1].style.background =
        'none';
    }
    const obj: any = {
      item,
      map: this.mapComponent(),
    };
    this.layerChange(obj);
    this.$nextTick(() => {
      const $obj = $('.mode-wrap');
      const $aChildren: any = $obj.children();
      const children = $aChildren[this.index].innerHTML;
      $('.current-map').html(children);
      $aChildren[this.index].style.border = '1px solid #17e7f1';
      $aChildren[this.index].children[0].children[1].style.background =
        '#0281bc';
      $('.current-map').hide();
      $('.option-map').show();
      $('.current-map').show();
      $('.option-map').hide();
    });
  }
  /**
   * 切换底图
   * @method
   * @param options 必填
   * @param options.item {Object} 点击的底图参数
   * @param options.map {Object} map对象
   * */
  // private layerChange(options: any) {

  //     window.G.utils.LayerUtil.switchBaseLayer({
  //         map: options.map,
  //         layerOpts: options.item,
  //     });
  // }
  private layerChange(options: any) {
    const self = this;
    if (options.item.type === '3D') {
      this.$store.commit('controlMoudle/setMapDimensionality', '3d');
      this.$nextTick(() => {
        (this as any).resolveMap('map').then((data: any) => {
          console.log('地图加载完成');
          this.getComponent().syncronizeViewFrom2D();
          this.getComponent().addTerrian(options.item.name);
          const map3d = this.getComponent().getMap();
          this.messsageBus.emit('mapDemension', { type: '3d', map: map3d });
        });
      });
    } else if (options.item.type === 'joinup') {
      self.getbaseMapComponent().createBaseLayer(options.item.id);
    } else {
      this.$store.commit('controlMoudle/setMapDimensionality', '2d');
      this.getComponent().syncronizeViewFrom3D(); // 从三维切二维，自动清地形
      const resthttp = new g2.core.RestHttp({
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });
      const originLayers = options.item.layers;
      if (Array.isArray(originLayers)) {
        originLayers.forEach((item, index) => {
          if (item.tileType === 102 && !item.restHttp) {
            item.restHttp = resthttp;
          }
        });
      } else {
        options.item.restHttp = resthttp;
      }
      mapServer.getConfig('./json/map.json').then((res: any) => {
        for (const i of Object.keys(res.data.baseLayers)) {
          if (options.item.title === res.data.baseLayers[i].title) {
            G.utils.LayerUtil.switchBaseLayer({
              map: options.map,
              layerOpts: res.data.baseLayers[i],
            });
          }
        }
      });
      this.messsageBus.emit('mapDemension', { type: '2d' });
      // G.utils.LayerUtil.switchBaseLayer({
      //     map: options.map,
      //     layerOpts: options.item,
      // });
      // const factory = this.$ioc.resolve('GISFactory-map');
      // if(options.item.title=="地图"||options.item.title=="地形"){
      //     factory.commonFactory.components.gisToolComp.onBaseMapSwitch({style:'light'});
      // }else{
      //     factory.commonFactory.components.gisToolComp.onBaseMapSwitch({style:'dark'});
      // }
    }
  }
  // 鼠标划过
  private fnOver() {
    $('.current-map').hide();
    $('.option-map').show();

    const self = this;
    const $obj = $('.mode-wrap');
    const $aChildren: any = $obj.children();
    for (const iterator of $aChildren) {
      self.fnanimate($(iterator), self.direction);
    }

    // $aChildren.each((index: any, e: any) => {
    //     console.log(this)
    //     console.log($(this))
    //     console.log($(self))
    //     self.fnanimate($(this), self.direction);
    // });
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('map3d');
    return component;
  }
  private getbaseMapComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('baseMap');
    return component;
  }
  private currentOver() {
    $('.option-map').show();
    $('.current-map').hide();
  }
  private currentOut() {
    $('.option-map').hide();
    $('.current-map').show();
  }
  // 鼠标移出
  private fnOut() {
    $('.option-map').hide();
    $('.current-map').show();
    // const $obj = $('.mode-wrap');
    // const $aChildren: any = $obj.children();
    // const self = this;
    // for (const iterator of $aChildren) {
    //    if ($(iterator).index() !== 0) {
    //         self.fnOutAnimate($(iterator), self.direction);
    //     }
    // }
  }
  private fnClick(item: any, index: any, all: any) {
    if (this.index !== 0) {
      this.$aChildren[this.index].style.border = 'none';
      this.$aChildren[this.index].children[0].children[1].style.background =
        'none';
    }
    if (this.curMode.title === item.title) {
      return;
    }
    this.index = index;
    this.curMode = item;
    const obj: any = {
      item,
      map: this.mapComponent(),
    };
    this.layerChange(obj);
    this.$nextTick(() => {
      const $obj = $('.mode-wrap');
      const $aChildren: any = $obj.children();
      const children = $aChildren[index].innerHTML;
      $('.current-map').html(children);
      $aChildren[index].style.border = '1px solid #17e7f1';
      $aChildren[index].children[0].children[1].style.background = '#0281bc';
    });
  }
  private fnOutAnimate(obj: any, type: any) {
    switch (type) {
      case 'up':
        obj.stop().animate({ marginTop: 0, opacity: 0 }, 300);
        break;

      case 'down':
        obj.stop().animate({ marginTop: 0, opacity: 0 }, 300);
        break;

      case 'left':
        obj.stop().animate({ marginLeft: 0, opacity: 0 }, 300);
        break;

      case 'right':
        obj.stop().animate({ marginLeft: 0, opacity: 0 }, 300);
        break;
    }
  }
  private fnanimate(obj: any, type: any) {
    // const t = obj.height() + 10;
    // const l = obj.width() + 10;
    const t = 10;
    const l = obj.width() + 10;
    switch (type) {
      case 'up':
        obj
          .stop()
          .animate({ marginTop: -obj.index() * t + 'px', opacity: 1 }, 300);
        break;

      case 'down':
        // obj.stop().animate({marginTop: obj.index() * t + 'px', opacity: 1}, 300);
        obj.stop().animate({ marginTop: t + 'px', opacity: 1 }, 300);
        break;

      case 'left':
        obj
          .stop()
          .animate({ marginLeft: -obj.index() * l + 'px', opacity: 1 }, 300);
        break;

      case 'right':
        obj
          .stop()
          .animate({ marginLeft: obj.index() * l + 'px', opacity: 1 }, 300);
        break;
    }
  }
}
</script>
