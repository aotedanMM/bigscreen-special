import EISVectorTile from './EGISVectorTile';
/**
 * 库湖水面图层
 */
export default class RoadRailwayLayer extends EISVectorTile {
    private nodeNames = ['公路'];
    /**
     * 添加
     * @param params
     * @param params.serviceConfig
     */
    public load(params: any): void {
        return super.load.call(this, {
            serviceConfig: params.serviceConfig,
            nodeNames: params.type,
            zIndex: 8,
            layerId: 'RoadLayer',
        });
    }
}
