import { RequestServerClass } from '../../util/request';

export class ChooseScreen {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
      this.rSerivce = new RequestServerClass(opt);
    //   axiosFilterFn.call(this, this.rSerivce.serverObj);
  }

  public getData() {
      const url = 'json/chooseScreen.json';
      return this.rSerivce.serverObj.get(url);
  }
}
