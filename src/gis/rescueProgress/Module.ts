import BaseModule from '../BaseModule';
import commonComponents from './index';

export default class Module extends BaseModule {


    constructor(opts: any) {
        super(opts);
        this.componentClazzes = commonComponents;
    }
    /**
     * 创建组件
     * @param opts {Object}
     */
    public createComponents(opts: any) {
        const components: any = commonComponents;
        // rescueTeamInforComponent.load();
    }
}
