import { RequestServerClass } from '../../../util/request';

export class NomalLeftServer {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    if (axiosFilterFn) {
      axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
  }
  public getIcon() {
    const url = './json/normalLeft/icon.json';
    return this.rSerivce.serverObj.get(url);
  }
  public getInitDataFxyh() {
    const url = './json/normalLeft/fxyhInitData.json';
    return this.rSerivce.serverObj.get(url);
  }
  public getInitDataYjzy() {
    const url = './json/normalLeft/yjzyInitData.json';
    return this.rSerivce.serverObj.get(url);
  }
  public getAllDataFooldRight() {
    const url = './json/normalLeft/allFloodRight.json';
    return this.rSerivce.serverObj.get(url);
  }
  public getInitDataFhmb() {
    const url = './json/normalLeft/fhmbInitData.json';
    return this.rSerivce.serverObj.get(url);
  }
  public getCitySelected() {
    const url = './json/normalLeft/citySelectedListData.json';
    return this.rSerivce.serverObj.get(url);
  }
  public getInitParnData() {
    const url = './json/normalLeft/parn.json';
    return this.rSerivce.serverObj.get(url);
  }
  public getInitDataSenResistant() {
    const url = './json/normalLeft/SenRedistantLayerData.json';
    return this.rSerivce.serverObj.get(url);
  }
}


