import EmadMapModule from '../../gis/base/module/EmadMapModule';
import EmadContainer from '../../gis/base/module/EmadContainer';
import EMap from '../../emap/api/EMap';
export default class DisasterResearchModule extends EmadMapModule {
    constructor(container: EmadContainer, map: EMap) {
        super(container, map);
    }

    /**
     * 初始化图层
     */
    public configureLayer(): void {
        //
    }

    /**
     * 初始化服务
     */
    public configureService(): void {
        //
    }

    /**
     * 初始化组件
     */
    public configureComponent(): void {
        //
    }

    /**
     * 初始化命令
     */
    public configureCommand(): void {
        const commandSet = this.resolve('commandSet');
    }

}
