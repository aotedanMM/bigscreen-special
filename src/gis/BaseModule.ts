export default class BaseModule {

    protected components: any = {};
    protected componentClazzes: any = {};
    protected options: any;

    constructor(opts: any) {
        this.options = opts;
        //
        this.createComponents({});
        this.shareComponent(opts.GISComponents);
        this.loadDefault();
    }

    /**
     * 创建组件
     * @param opts {Object}
     * @returns null
     */
    public createComponents(opts: any) {
        //
    }

    /**
     * 获取组件
     * @param id
     */
    public getComponent(id: string) {
        if (!this.components[id]) {
            console.debug('component ' + id + 'not found！');
            const components: any = this.componentClazzes;
            const component: any = components[id];
            const componentInstance: any = new component(this.options);
            this.components[id] = componentInstance;
        }
        return this.components[id];
    }

    // 注册组件到公共
    public shareComponent(components: any) {
        //
    }
    // 默认加载
    public loadDefault() {
        //
    }

    // 遍历
    public forEach(callback: any, context: any) {
        for (const componentId of Object.keys(this.components)) {
            const component = this.components[componentId];
            callback.call(context, componentId, component);
        }
    }

}
