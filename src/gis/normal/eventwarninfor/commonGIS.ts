/***
 *
 */
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
     // 初始化
     initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);

        const self = this;
        this.map = options.map;
        this.service = options.service;
        this.commonDistrictServer = options.commonDistrictServer;
        // do sth
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.popupManager = options.GISComponents.popupManager;
        this.featureLocate = options.GISComponents.featureLocate;

        this.map.un('click', this.un, this);
        this.map.listen('click', (event: any) => {
            self._mapClick(event);
        });
        this.map.listen('mousemove', (event: any) => {
            self._mapMouseMove(event);
        });
        this.map.listen('extentchanged', (event: any) => {
            self._mapExtendChanged(event);

        });
        this.map.listen('resolutionchanged', (event: any) => {
            self._mapResolutionchanged(event);
        });
    },
    load() {
        componentBase.prototype.load.call(this);
        // do sth
    },
    _mapClick(e: any) {
        console.log(e);

    },
    _mapMouseMove(e: any) {
        console.log(e);

    },
    _mapExtendChanged(e: any) {
        console.log(e);

    },
    _mapResolutionchanged(e: any) {
        console.log(e);

    },


    unload() {
        // todo
        componentBase.prototype.unload.call(this);
    },
});
export default component;
