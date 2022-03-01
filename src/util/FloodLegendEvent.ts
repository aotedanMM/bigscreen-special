/**
 * 防汛专题图例上的事件
 */
export default {
    methods: {
        // 创建组件
        getComponent_RiverNetworkJudgement() {
            const temp: any = this;
            const factory = (temp.$ioc as any).resolve('GISFactory-map');
            const component = factory.commonFactory.getComponent('mapserviceIn');
            return component;
        },
        /**
         * 点击图例事件
         * @param checked- 是否选中
         * @param layerName- 图层名
         */
        openLegendEvent(checked: boolean, layerName: string|string[]) {
            const self: any = this;
            if (Array.isArray(layerName)) {
                layerName.forEach((name: any) => {
                    self.loadLayer(checked, name);
                });
            } else {
                self.loadLayer(checked, layerName);
            }

        },
        loadLayer(checked: boolean, layerName: string) {
            if (checked) {
                if (this.getComponent_RiverNetworkJudgement().getLayer(layerName)) {
                    this.getComponent_RiverNetworkJudgement().setVisible(layerName, true);
                } else {
                    this.getComponent_RiverNetworkJudgement().addLayer(layerName);
                    if (layerName === 'WatershedLayer') {
                        this.getComponent_RiverNetworkJudgement().addLayer('WatershedLayer', {
                            clickEventName: 'watershedClick',
                        });
                    }
                    if (layerName === 'RiverLayer') {
                        this.getComponent_RiverNetworkJudgement().addLayer('RiverLayer', {
                            clickEventName: 'riverClick',
                        });
                    }
                }
            } else {
                this.getComponent_RiverNetworkJudgement().setVisible(layerName, false);
            }
        },
    },

};
