import ECommand from './ECommand';
/**
 *
 */
export default abstract class ETool extends ECommand {
    private isChecked!: boolean;

    public abstract onMouseDown(event: object): void;

    public abstract onMouseUp(event: object): void;

    public abstract onMouseMove(event: object): void;

    public abstract onDeactive(event: object): void;
}
