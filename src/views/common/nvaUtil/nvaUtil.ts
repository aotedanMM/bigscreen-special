import publishObjectPath from '@/util/configRegistry';
const dataApiServer = publishObjectPath.value && publishObjectPath.value.tianyanServer;
const yuqingServer = publishObjectPath.value && publishObjectPath.value.yuqingServer;
//  清除周边查询
export const clearPeripheral = function(slef: any) {
    const factory = slef.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('nearQuery');
    component.unload();
};
//  清除前突队伍历史轨迹
export const clearTrack = function(slef: any) {
    const factory = slef.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('historyTrack');
    component.unload();
};
// 清除路径规划
export const clearPathPlanning = function(slef: any) {
    slef.messsageBus.emit('Close_Router');
};
// 关闭视频弹框
export const closeRightVideo = function(self: any) {
    self.messsageBus.emit('openVideoMonitor');
};
/**
 * self : this
 * item.isOPen : 是否打开
 * 通用
 * */
export const mapUtilFun = {
    // 影像对比
    imageContrast(self: any, item: any) {
        // 影像对比
        self.messsageBus.emit(
            'dayEyeShowEmit',
            item.isOpen ?
                {
                    isOpen: true,
                    url: dataApiServer + '&lon=' + self.$store.state.eventPushStore.eventLocation.EventLon + '&lat=' + self.$store.state.eventPushStore.eventLocation.EventLat + '&disaster=other&isSplit=1',
                } : {
                    isOpen: false,
                    url: '',
                },
        );
    },
    // 通用工具条开始
    // 地图清屏
    qingpin(self: any) {
        self.$confirm('确认清屏?', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            const factory = self.$ioc.resolve('GISFactory-map');
            const component = factory.commonFactory.getComponent('gisToolComp');
            component.clearAll();
            // self.$message({
            //   type: 'success',
            //   message: '清除成功!',
            // });
        }).catch(() => {
            // console.log('取消');
        });
    },
    // 测量
    // 面积测量
    measureArea(self: any, opt: any) {
        const mapDimensionality = self.$store.state.controlMoudle.mapDimensionality;
        const factory = self.$ioc.resolve('GISFactory-map');
        if (mapDimensionality === '2d') {
            const component = factory.commonFactory.getComponent('gisToolComp');
            // 面积面积
            component.measureArea();
        } else {
            const componentAreaLength = factory.commonFactory.getComponent('areaLengthMeasure');
            const component3D = factory.commonFactory.getComponent('map3d');
            const param = {
                globe: component3D.getMap(),
            };
            componentAreaLength.load(param);
            componentAreaLength.measureArea();
        }
    },
    // 距离测量
    measureline(self: any, opt: any) {
        const mapDimensionality = self.$store.state.controlMoudle.mapDimensionality;
        const factory = self.$ioc.resolve('GISFactory-map');
        if (mapDimensionality === '2d') {
            const component = factory.commonFactory.getComponent('gisToolComp');
            // 距离测量
            component.measureLength();
        } else {
            const componentAreaLength = factory.commonFactory.getComponent('areaLengthMeasure');
            const component3D = factory.commonFactory.getComponent('map3d');
            const param = {
                globe: component3D.getMap(),
            };
            componentAreaLength.load(param);
            componentAreaLength.measureLength();
        }
    },
    // 测量高度
    measureHeight(self: any, opt: any) {
        const factory = self.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('verticalMeasure');
        const component3D = factory.commonFactory.getComponent('map3d');
        const param = {
            globe: component3D.getMap(),
        };
        component.load(param);
        component.initVerticalMeasure();
    },
    // 测量坡度
    measureSlope(self: any, opt: any) {
        const factory = self.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('slopeMeasure');
        const component3D = factory.commonFactory.getComponent('map3d');
        const param = {
            globe: component3D.getMap(),
        };
        component.load(param);
        component.initMeasureSlope();
    },
    measuringTools(self: any, opt: any) {
        return false;
    },
    // 实时标绘
    realTimePlotting(self: any, item: any) {
        if (item.isOpen) {
            self.messsageBus.emit('openPlot', true);
        } else {
            self.messsageBus.emit('closePlot', true);
            self.messsageBus.emit('GisPlotControlBtn', 'realTimePlotting' , true);
        }
    },
    onlinePawn(self: any, item: any) {
        if (item.isOpen) {
            self.messsageBus.emit('openPawn', true);
        } else {
            self.messsageBus.emit('closePawn', true);
        }
    },
    OnlineTerminal(self: any, item: any) {
        if (item.isOpen) {
            self.messsageBus.emit('openTerminal', true);
        } else {
            self.messsageBus.emit('closeTerminal', true);
        }
    },
    // 一键截屏
    printscreen(self: any, item: any) {
        const factory = self.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('gisToolComp');
        component.screenShot('aidDecisionMakingLayoutMain');
    },
    // 地图打印
    mapPrint(slef: any, item: any) {
        if (item.isOpen) {
            slef.messsageBus.emit('mapPrintEmit', { isShow: true });
        } else {
            slef.messsageBus.emit('mapPrintEmit', { isShow: false });
        }
    },
    // 通用工具条结束
    // 百度街景
    BaiduStreetView(self: any, item: any) {
        const factory = self.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('gisToolComp');
        if (item.isOpen) {
            component.addbdLayerCtol();
        } else {
            component.removebduLayerCtro();
        }
    },
    // 腾讯街景
    tencentStreetView(self: any, item: any) {
        const factory = self.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('gisToolComp');
        if (item.isOpen) {
            component.addtencentLayerCtol();
        } else {
            component.removetencentLayerCtro();
        }
    },
    // 周边天气
    surroundingWeather(self: any, item: any) {
        // const factory = self.$ioc.resolve('GISFactory-map');
        // const component = factory.commonFactory.getComponent('Weather');
        self.messsageBus.emit('surroundingWeather', item);
        // component.load();
    },
    // 最新影像
    latestImages(slef: any, item: any) {
        const factory = slef.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('latestImage');
        if (item.isOpen) {
            component.load();
        } else {
            component.unload();
        }
    },
    // 余震
    aftershock(slef: any, item: any) {
        if (item.isOpen) {
            slef.messsageBus.emit('aftershockShowEmit', true);
        } else {
            slef.messsageBus.emit('aftershockShowEmit', false);
        }
    },
    // 回传图像
    /**
     * self : this
     * cb　： 请求
     * isOPen : 是否打开
     */
    returnImage(self: any, item: any, cb: any) {
        if (item.isOpen) {
            cb().then((res: any) => {
                self.messsageBus.emit('internetEvent', { isShow: true, data: res });
            });
        } else {
            self.messsageBus.emit('internetEvent', { isShow: false });
        }
    },
    // 最新影像
    atestImages(slef: any, item: any) {
        if (item.isOpen) {
            slef.getLatestImages().load();
        } else {
            slef.getLatestImages().unload();
        }
    },
    // 实时路况
    realTimeTraffic(self: any, item: any) {
        const factory = self.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('gisToolComp');
        if (item.isOpen) {
            component.addTafficLayer();
        } else {
            component.removeTrfficLayer();
        }
    },
    // 天眼监测系统
    tianyan(self: any, item: any) {
        self.messsageBus.emit('dayEyeShowEmit', { isOpen: item.isOpen, url: dataApiServer });
    },
    // 舆情监控
    publicOpinionMonitor(slef: any, item: any) {
        slef.messsageBus.emit(
            'dayEyeShowEmit',
            item.isOpen ?
                {
                    isOpen: true,
                    url: yuqingServer,
                    styleObj: { padding: '30px 0 0 40px' },
                } : {
                    isOpen: false,
                    url: '',
                    styleObj: null,
                },
        );
    },
    // 经验圈设置
    updateExperienceCircle(self: any, item: any) {
        if (item.isOpen) {
            self.messsageBus.emit('updateExperienceCircle', { isShow: true });
        } else {
            self.messsageBus.emit('updateExperienceCircle', { isShow: false });
        }
    },
    // 周边查询
    PeripheralQuery(self: any, item: any) {
        if (item.isOpen) {
            self.messsageBus.emit('PeripheralQuery', { isShow: true });
        } else {
            self.messsageBus.emit('PeripheralQuery', { isShow: false });
            self.messsageBus.emit('GisPlotAroundBtn', 'PeripheralQuery' , true);
        }
    },
    // 周边查询，测试城市选择，等待联调
    CitySelectShow(self: any, item: any) {
        if (item.isOpen) {
            self.messsageBus.emit('CitySelectShow', true);
        } else {
            self.messsageBus.emit('CitySelectShow', false);
        }
    },
};

