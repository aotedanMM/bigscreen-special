import EISVectorTile from './EGISVectorTile';
/**
 * 库湖水面图层
 */
export default class ReservoirLakeLayer extends EISVectorTile {
    private nodeNames = ['湖泊', '水库'];
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
            styleFunc: (layer: any) => {
                if (layer) {
                    if (layer.paint) {
                        // 标注字体颜色
                        if (layer.paint['text-color']) {
                            layer.paint['text-color'] = '#03565b';
                        }
                        // 标注字体光晕宽度
                        if (layer.paint['text-halo-width']) {
                            layer.paint['text-halo-width'] = 2;
                        }
                        // 线颜色
                        if (layer.paint['line-color']) {
                            layer.paint['line-color'] = '#0088ff';
                            layer.paint['line-width'] =  3;
                            layer.paint['line-opacity'] =  0.65;
                        }
                        // 面填充色
                        if (layer.paint['fill-color']) {
                            layer.paint['fill-color'] = '#0088ff';
                            layer.paint['fill-opacity'] = 0.55;
                        }
                        // 面边界色
                        if (layer.paint['fill-outline-color']) {
                            layer.paint['fill-outline-color'] = 'rgba(0,238,255,0.65)';
                        }
                    }
                    if (layer.layout) {
                        // 标注字体大小
                        if (layer.layout['text-size']) {
                            layer.layout['text-size'] = 22;
                            // 字体加粗
                            if (layer.layout['text-font']) {
                                layer.layout['text-font'].push('bold');
                            } else {
                                layer.layout['text-font'] = ['bold'];
                            }
                        }
                    }
                }
            },
        });
    }
}
