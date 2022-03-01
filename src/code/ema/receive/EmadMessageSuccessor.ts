import EmadMessage from '../data/EmadMessage';
export default class EmadMessageSuccessor {
    private successor: EmadMessageSuccessor;

    constructor() {
        this.successor = new EmadMessageSuccessor();
    }

    public setSuccessor(successor: EmadMessageSuccessor) {
        this.successor = successor;
    }

    public doIt(msg: EmadMessage): void {
        if (this.successor) {
            this.successor.doIt(msg);
        }
    }
}
