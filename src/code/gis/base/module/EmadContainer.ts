
export default class EmadContainer {
    private data: any = {};
    public register(name: string, instance: any) {
        this.data[name] = instance;
    }

    public resolve(name: string): any {
        return this.data[name] || null;
    }
}
