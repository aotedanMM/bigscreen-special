
export default abstract class ECommand {
    private isEnabled: boolean = false;
    private id: string = '';

    constructor(id: string) {
        //
        this.id = id;
    }

    public getId() {
        return this.id;
    }

    public onCreate(hook: any): void {
        //
    }

    public abstract onClick(param: any): void;
}
