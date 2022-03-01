import EmadModule from './EmadModule';
import EmadContainer from './EmadContainer';
import EMap from '../../../emap/api/EMap';
export default abstract class EmadMapModule extends EmadModule {
    private map!: EMap;
    constructor(container: EmadContainer, map: EMap) {
        super(container);
        this.map = map;
    }

    public configure() {
        this.configureLayer();
        super.configure();
        this.configureCommand();
    }

    public abstract configureLayer(): void ;

    public abstract configureService(): void;

    public abstract configureComponent(): void;

    public abstract configureCommand(): void;
}
