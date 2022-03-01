import ECommand from '../../../emap/command/ECommand';
import DistritComponent from '../component/district/DistritComponent';
export default class DistrictCommand extends ECommand {

    private component: DistritComponent;
    constructor(id: string, component: DistritComponent) {
        super(id);
        this.component = component;
    }

    /**
     * 命令触发
     * @param param
     */
    public onClick(param: any): void {
        // todo
        this.component.load(param);
    }
}
