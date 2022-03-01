import ECommand from './ECommand';
export default class ECommandSet {
    private items: ECommand[] = new Array();

    public addCommand(command: ECommand): void {
        this.items.push(command);
    }

    public onCreate(hook: any) {
        for (const command of this.items) {
            command.onCreate(hook);
        }
    }

    /**
     * 激活命令
     * @param id
     * @param param
     */
    public active(id: string, param: any): void {
        const command = this.getCommand(id);
        command.onClick(param);
    }

    public getCommand(id: string): ECommand {
        let result!: ECommand;
        for (const temp of this.items) {
            if (temp && temp.getId() === id) {
                result = temp;
                break;
            }
        }
        return result;
    }
}
