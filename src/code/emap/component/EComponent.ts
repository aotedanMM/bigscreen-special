import IComponent from './IComponent';
import DataModel from './DataModel';
import IEComponentView from './IEComponentView';
export default abstract class EComponent<T extends DataModel> implements IComponent {

    private map: any = null;

    private dataModel!: T;

    private dataModelWapper: any = {
        model: null,
    };

    public intialize() {
        //
    }

    public setMap(map: any) {
        this.map = map;
    }

    public setModel(model: T) {
        this.dataModel = model;
        this.dataModelWapper.model = this.dataModel;
    }

    public load(param: any): any {
        //
    }

    public unload(): any {
        //
    }

    public bind(view: IEComponentView<any>) {
        view.accept(this);
    }

    public model(): object {
        return this.dataModelWapper;
    }

    public uninitialize() {
        //
    }

}
