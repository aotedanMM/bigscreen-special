import EmadModule from './EmadModule';
import EmadContainer from './EmadContainer';
export default abstract class EmadCompositeModule extends EmadModule {
    private items: EmadModule[] = new Array();

    constructor(container: EmadContainer) {
        super(container);
    }

    public configure(): void {
        for (const module of this.items) {
            module.configure();
        }
    }

    public configureService(): void {
        for (const module of this.items) {
            module.configureService();
        }
    }

    public configureComponent(): void {
        for (const module of this.items) {
            module.configureComponent();
        }
    }

    public addModule(module: EmadModule) {
        this.items.push(module);
    }

}
