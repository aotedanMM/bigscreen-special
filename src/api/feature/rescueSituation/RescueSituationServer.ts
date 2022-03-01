import { RequestServerClass } from '../../../util/request';

export class RescueSituationServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    axiosFilterFn.call(this, this.rSerivce.serverObj);
  }
  // 统计兵力调度态势
  public getTeamStatics() {
    const TeamStaticData = [
      {
        typename: '计划队伍',
        typecode: 'Plannum',
        teamnum: 300,
        teamtypesnum: 20,
        peoplenum: 21500,
      },
      {
  typename: '集结队伍',
        typecode: 'Awaitnum',
        teamnum: 11,
        teamtypesnum: 10,
        peoplenum: 2000,
      },
      {
  typename: '赶赴队伍',
        typecode: 'Hurrynum',
        teamnum: 11,
        teamtypesnum: 10,
        peoplenum: 2000,
      },
      {
  typename: '现场队伍',
        typecode: 'Scenenum',
        teamnum: 11,
        teamtypesnum: 10,
        peoplenum: 2000,
      },
    ];
    return TeamStaticData;
    // const url = './json/gisUtil/disasterDecide.json';
    // return this.rSerivce.serverObj.get(url);
  }
  // 得到队伍数据
  public getTeamInfoList(typecode: any) {
    // const url = './json/gisUtil/disasterDecide.json';
    // return this.rSerivce.serverObj.get(url);
    // todo 根据不同的typecode查询不同类型的数据
    const AwaitData = [{
      name: '国家地震灾害紧急救援队（中国国际救援队）',
      typeCode: 'T005',
      typeName: '地震',
      num: 480,
      teamleader: '庄乾江',
     leadermtel: '15331009958',
      address: '北京市昌平区阳坊镇',
      x: 116.145055,
      y: 40.14065,
      id: 'RESDZSJ0001',
      distance: 34829.9236002479,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '待命救援队',
      tox: 116.35,
      toy: 39.87,
    }, {
      name: '国家地震灾害紧急救援队（中国国际救援队）',
      typeCode: 'T005',
      typeName: '地震',
      num: 480,
      teamleader: '庄乾江',
     leadermtel: '15331009958',
      address: '北京市昌平区阳坊镇',
      x: 116.155055,
      y: 40.15065,
      id: 'RESDZSJ0002',
      distance: 34829.9236002479,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '待命救援队',
      tox: 116.35,
      toy: 39.87,
    }];
    return AwaitData;
    //
    // const HurryData = [{
    //   name: '国家矿山应急救援大地特勘队',
    //   typeCode: 'T003',
    //   typeName: '消防',
    //   num: 85,
    //   teamleader: '黄勇',
    //   leadermtel: '15311096106',
    //   address: '北京市石景山区',
    //   x: 116.196607,
    //   y: 39.921735,
    //   id: 'RESZGS0032',
    //   distance: 14310.608854754626,
    //   carnum: '',
    //   teamtask: '',
    //   sendpeoplenum: 0,
    //   sendplace: '',
    //   teamjc: '赶赴救援队',
    //   tox: 116.35,
    //   toy: 39.87,
    // },
    // {
    //   name: '国家矿山应急救援大地特勘队',
    //   typeCode: 'T003',
    //   typeName: '消防',
    //   num: 85,
    //   teamleader: '黄勇',
    //   leadermtel: '15311096106',
    //   address: '北京市石景山区',
    //   x: 116.296607,
    //   y: 39.951735,
    //   id: 'RESZGS0033',
    //   distance: 14310.608854754626,
    //   carnum: '',
    //   teamtask: '',
    //   sendpeoplenum: 0,
    //   sendplace: '',
    //   teamjc: '赶赴救援队',
    //   tox: 116.35,
    //   toy: 39.87,
    // },
    // ];
    // const url = '/api/event/accident/express/page/list/v1';
    // return this.rSerivce.serverObj.post(url, data);
  }
  // 得到队伍详情
  public getTeamDetail(id: any) {
    const url = './json/gisUtil/disasterDecide.json';
    return this.rSerivce.serverObj.get(url);
    // const url = '/api/event/accident/express/page/list/v1';
    // return this.rSerivce.serverObj.post(url, data);
  }
}
