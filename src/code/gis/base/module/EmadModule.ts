import EmadContainer from './EmadContainer';
import EComponent from '../../../emap/component/EComponent';
export default abstract class EmadModule {
    private parent!: EmadModule;
    private container!: EmadContainer;
    private components: any = {};

    constructor(container: EmadContainer) {
        this.container = container;
    }

    public  configure(): void {
        this.configureService();
        this.configureComponent();
    }

    public abstract configureService(): void;

    public abstract configureComponent(): void;

    public addComponent(id: string, instance: EComponent<any>) {
        this.components[id] = instance;
    }

    public takeComponent(id: string) {
        return this.components[id] || null;
    }

    public register(name: string, instance: any): void {
        this.container.register(name, instance);
    }

    public resolve(name: string): any {
        return this.container.resolve(name);
    }
}
