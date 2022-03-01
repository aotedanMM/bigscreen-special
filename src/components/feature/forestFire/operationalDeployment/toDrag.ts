
export class Drag {

    public target: any;
    public dragElement: any;
    public containerElement: any;
    public offset: any = [0, 0];
    public position: any = [0, 0];
    public options: any;
    constructor( target: any , drag: any , options: object) {
        this.target = $(`${target}`);
        this.dragElement = $(`${drag}`);
        // 传递配置参数
        this.options = options || {};
        this.containerElement = this.options.container ? $(`${this.options.container}`) : $('body');
        this.options.padding = this.options.padding || (() => {
            const poffset = this.containerElement.offset();
            return [poffset.left, poffset.top];
        });
        this.options.containerBox = (() => {
            const offset = this.containerElement.offset();
            return {
                left: offset.left,
                top: offset.top,
                width: this.containerElement.width(),
                height: this.containerElement.height(),
            };
        });
    }
    public toDrag() {
        const oldMouseMoveHandler: any  = document.onmousemove || null;
        const oldMouseUpHandler: any  = document.onmouseup || null;
        const self = this;
        this.dragElement.mousedown((e: any) => {
            // e.stopPropagation();
            e.preventDefault();
            self.position = [e.clientX, e.clientY];
            document.onmousemove = (e1: any) => {
                e1.stopPropagation();
                e1.preventDefault();
                self.onMouseMove(e1);
            };
            document.onmouseup = (e1: any) => {
                document.onmouseup = oldMouseUpHandler;
                document.onmousemove = oldMouseMoveHandler;
            };
            self.dragElement.mouseup (() => {
                self.dragElement.unbind('mouseup');
            });
        });
    }

    private onMouseMove(e: any) {
        e.stopPropagation();
        e.preventDefault();
        //
        this.offset = [this.target.offset().left, this.target.offset().top];
        // console.debug('offset before ', this.offset);
        const moveX =  e.clientX - this.position[0];
        const moveY = e.clientY - this.position[1];
        // console.debug('movex movey ', moveX, ' ', moveY);
        const padding = this.options.padding();
        const containerBox = this.options.containerBox();
        const left = moveX + this.offset[0] - padding[0];
        const top = moveY + this.offset[1] - padding[1];
        this.position = [e.clientX, e.clientY];
        if (left < 0 || (left > containerBox.width - this.target.width())) {
            return;
        }
        if (top < 0 || (top > containerBox.height - this.target.height())) {
            return;
        }
        if (left >= 0 && top >= 0) {
            this.offset = [left, top];
            console.debug('offset after ',  this.offset);
            this.target.css({
                left: `${left}px`,
                top: `${top}px`,
                position: 'absolute',
           });
        }
    }
}
