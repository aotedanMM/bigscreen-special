// const activeMap: any = {}; // 清理
const GISTool: any = {
  /**
   * 点击工具的时候通过来进行定向处理
   * 所有的点击事件都必须通过这个方法来进行定位走那个GIS处理
   *  */
  directionalHandler(option: any, paramsCon: any, callBack?: any) {
    // console.log(option.key);
    const key = option.key || option; // option可以是一个对象或者就是标识符
    /*for (const i in activeMap) {
      if (i !== key && activeMap[i] ) {
        console.log(paramsCon);
        GISTool[i](paramsCon);
      }
    }*/
    switch (key) {
      /*case 'search': // 假设用户点击的搜索的按钮，我们这边就进行相对于的事件处理
        GISTool.search();
        break;
      case '_district': // 行政区划
        GISTool.district();
        break;
      case 'sousuo':
        // 搜索
        break;*/
      /*case 'tianyan':
        GISTool.tianyan(paramsCon);
        break;*/
      /*case 'imageContrast':
        // 影像对比
        GISTool.imageContrast(paramsCon);
        break;
      case '_disasterstyle':
        GISTool._disasterstyle(paramsCon);
        break;
      case 'publicOpinionMonitor':
        GISTool.publicOpinionMonitor(paramsCon);
        break;*/
      case 'qingpin':
        GISTool.qingpin(paramsCon);
        break;
      /*case 'measureArea':
        GISTool.measuringTools(paramsCon , option);
        break;
      case 'measureline':
        GISTool.measuringTools(paramsCon , option);
        break;
      case 'realTimePlotting':
        GISTool.realTimePlotting(paramsCon);
        break;
      case 'BaiduStreetView':
        GISTool.BaiduStreetView(paramsCon);
        break;
      case 'realTimeTraffic':
        GISTool.realTimeTraffic(paramsCon);
        break;
      case 'internetIntelligence':
        GISTool.internetIntelligence(paramsCon);
        break;
      case 'surroundingWeather':
        GISTool.surroundingWeather(paramsCon);
        break;
      case 'aftershock':
        GISTool.aftershock(paramsCon);
        break;
      case 'returnImage':
        GISTool.returnImage(paramsCon);
        break;
      case 'latestImages':
        GISTool.latestImages(paramsCon);
        break;
      case 'mapPrint':
        GISTool.mapPrint(paramsCon);
        break;*/
    }
    if (callBack) {
      callBack();
    }
  },
  /*search() {
    // console.log('这里是处理搜索的事件');
  },
  district() {
    // console.log('行政区划处理');
  },*//*
  tianyan(paramsCon: any) {
    // 天眼监测系统
    paramsCon.messsageBus.emit('dayEyeShowEmit', {url: 'http://218.247.138.120:3009'});
  },*/
  /*imageContrast(paramsCon: any) {
    // 影像对比
    paramsCon.messsageBus.emit(
      'dayEyeShowEmit',
      {url : 'http://218.247.138.120:3009?lon=104.567187&lat=31.534886&height=2000&disaster=other&isSplit=1'},
    );
  },
  _disasterstyle(paramsCon: any) {
    // 地形地貌
    // messsageBus.emit('dayEyeShowEmit', '');
  },
  publicOpinionMonitor(paramsCon: any) {
    // 舆情监控
    paramsCon.messsageBus.emit(
      'dayEyeShowEmit',
      {url: 'http://bjtopcom.xicp.cn:8030/yuqing/tempDialog?11%C2%B724%E6%BC%94%E4%B9%A0',
      styleObj: { padding : '30px 0 0 40px'},
      },
    );
  },*/
  qingpin(paramsCon: any) {
    // 地图清屏 暂时还有问题
    paramsCon.component().clearAll();
  },
  /*measuringTools(paramsCon: any , opt: any ) {
    // 距离量测
    activeMap.measuringTools = !activeMap.measuringTools;
    if (opt.key === 'measureArea') {
      // paramsCon.messsageBus.emit('showDistenceBox', true);
      // 面积面积
      paramsCon.component().measureArea();
    } else {
      // 距离测量
      paramsCon.component().measureLength();
      // paramsCon.messsageBus.emit('showDistenceBox', false);
    }
  },
  realTimePlotting(paramsCon: any) {
    // 实时标绘
    activeMap.realTimePlotting = !activeMap.realTimePlotting;
    if (activeMap.realTimePlotting) {
      paramsCon.plotOpen();
    } else {
      paramsCon.plotClose();
    }
  },
 BaiduStreetView(paramsCon: any) {
    // 百度街景
    activeMap.BaiduStreetView = !activeMap.BaiduStreetView;
    if (activeMap.BaiduStreetView) {
      paramsCon.component().addbdLayerCtol();
    } else {
      paramsCon.component().removebduLayerCtro();
    }
  },
  realTimeTraffic(paramsCon: any) {
    // 实时路况
    activeMap.realTimeTraffic = !activeMap.realTimeTraffic;
    if (activeMap.realTimeTraffic) {
      paramsCon.component().addTafficLayer();
    } else {
      paramsCon.component().removeTrfficLayer();
    }
  },
  internetIntelligence(paramsCon: any) {
    // 互联网情报
    activeMap.internetIntelligence = !activeMap.internetIntelligence;
    if (activeMap.internetIntelligence) {
      paramsCon.internetIntelligenceImg().then( (res: any) => {
        paramsCon.messsageBus.emit('internetEvent', {isShow: true, data: res});
      });
    } else {
      paramsCon.messsageBus.emit('internetEvent', {isShow: false});
    }
  },
  surroundingWeather(paramsCon: any) {
    // 周边天气
    activeMap.surroundingWeather = !activeMap.surroundingWeather;
    if (activeMap.surroundingWeather) {
      paramsCon.getComponentWeather().load();
    } else {
      paramsCon.getComponentWeather().unload();
    }
  },
  aftershock(paramsCon: any) {
    // 余震
    activeMap.aftershock = !activeMap.aftershock;
    if (activeMap.aftershock) {
      paramsCon.messsageBus.emit('aftershockShowEmit', true);
    } else {
      paramsCon.messsageBus.emit('aftershockShowEmit', false);
    }
  },
  returnImage(paramsCon: any) {
    // 回传图像
    activeMap.returnImage = !activeMap.returnImage;
    if (activeMap.returnImage) {
      paramsCon.getReturnImg().then( (res: any) => {
        paramsCon.messsageBus.emit('internetEvent', {isShow: true, data: res});
      });
    } else {
      paramsCon.messsageBus.emit('internetEvent', {isShow: false});
    }
  },
  latestImages(paramsCon: any) {
    // 最新影像
    activeMap.latestImages = !activeMap.latestImages;
    if (activeMap.latestImages) {
      paramsCon.getLatestImages().load();
    } else {
      paramsCon.getLatestImages().unload();
    }
  },
  mapPrint(paramsCon: any) {
    // 地图打印
    activeMap.mapPrint = !activeMap.mapPrint;
    if (activeMap.mapPrint) {
      paramsCon.messsageBus.emit('mapPrintEmit', {isShow: true});
    } else {
      paramsCon.messsageBus.emit('mapPrintEmit', {isShow: false});
    }
  },*/
};

export default GISTool;
