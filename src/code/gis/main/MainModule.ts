import EmadCompositeModule from '../../gis/base/module/EmadCompositeModule';
import EmadContainer from '../../gis/base/module/EmadContainer';
import EMap from '../../emap/api/EMap';
import DisasterResearchModule from '../disasterresearch/DisasterResearchModule';
import ECommandSet from '../../emap/command/ECommandSet';
export default class MainModule extends EmadCompositeModule {

    private static container: EmadContainer = new EmadContainer();

    private commmandSet: ECommandSet  = new ECommandSet();

    constructor() {
        super(MainModule.container);
        //
        MainModule.container.register('commandSet', this.commmandSet);
    }

    public getCommandSet(): ECommandSet {
        return this.commmandSet;
    }

    /**
     */
    public startUp(map: EMap): void {
        const disasterResearchModule = new DisasterResearchModule(MainModule.container, map);
        this.addModule(disasterResearchModule);
        //
        const commandSet = MainModule.container.resolve('commandSet');
        this.configure();
        commandSet.onCreate(MainModule.container);
    }
}
