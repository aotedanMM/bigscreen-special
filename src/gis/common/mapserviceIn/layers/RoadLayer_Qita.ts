import EISVectorTile from './EGISVectorTile';
/**
 * 库湖水面图层
 */
// tslint:disable-next-line:class-name
export default class RoadLayer_Qita extends EISVectorTile {
    private nodeNames = ['其它公路'];
    /**
     * 添加
     * @param params
     * @param params.serviceConfig
     */
    public load(params: any): void {
        return super.load.call(this, {
            serviceConfig: params.serviceConfig,
            nodeNames: this.nodeNames,
            zIndex: 8,
            layerId: 'RoadLayer_Qita',
        });
    }
}
