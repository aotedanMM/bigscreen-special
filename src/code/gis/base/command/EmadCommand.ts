import EmergencyEvent from '../../../eedm/data/EmergencyEvent';
import ECommand from '../../../emap/command/ECommand';
export default abstract class EmadCommand extends ECommand {

    private event!: EmergencyEvent;
    constructor(id: string) {
        super(id);
    }

    public onEvent(event: EmergencyEvent): void {
        //
    }
}
