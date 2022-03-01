import BaseLayer from './BaseLayer';

/**
 * WMS图层
 */
export default class WMSLayer extends BaseLayer {
    public load(params: any): void {
        this.layer = this.createLayer(params);
        this.map.addLayer(this.layer);
        this.layer.setVisible(true);
    }
    public createLayer(conf: any) {
        const wmsLayer = new (g2 as any).carto.TileLayer({
            id: conf.id,
            url: conf.url,
            layers: conf.layers,
            projection: 'EPSG:' + this.map.spatialReference,
            format: 'image/png',
            tileType: conf.tileType || (g2 as any).carto.TileType.WMS,
            matrix: 22,
            version: conf.version || '1.1.0',
            tiled: conf.tiled || false,
        });
        return wmsLayer;
    }

    public unload(): void {
        this.map.removeLayer(this.layer);
    }

    public setVisible(visible: boolean): void {
        this.layer.setVisible(visible);
    }
}
