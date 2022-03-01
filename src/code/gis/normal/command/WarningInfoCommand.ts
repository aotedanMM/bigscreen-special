import ECommand from '../../../emap/command/ECommand';
import DistritComponent from '../component/district/DistritComponent';
/**
 * 预警信息命令
 */
export default class WarningInfoCommand extends ECommand {

    private component: DistritComponent;
    constructor(id: string, component: DistritComponent) {
        super(id);
        this.component = component;
    }

    /**
     * 命令触发
     * @param param {Object}
     * @param param.type {String} 预警信息类型
     */
    public onClick(param: any): void {
        // todo
        this.component.load(param);
    }

}
