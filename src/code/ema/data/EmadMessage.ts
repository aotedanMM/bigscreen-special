import EmadHeader from './EmadHeader';
export default class EmadMessage {
    protected sender: string | null = null;
    protected time: Date | null = null;
    protected header: EmadHeader | null = null;
    protected body: any = null;

    public setSender(sender: string) {
        this.sender = sender;
    }

    public setTime(time: Date) {
        this.time = time;
    }

    public setHeader(header: EmadHeader) {
        this.header = header;
    }

    public setBody(body: any) {
        this.body = body;
    }

}
