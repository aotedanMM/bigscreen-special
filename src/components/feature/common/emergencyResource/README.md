## 应急资源-风险隐患-基础数据
1. 引入
import EmergencyResource from '@/components/feature/common/emergencyResource/EmergencyResource.vue';
2. 关联
@Component({
  components: {
    LayoutSidebar,
    Panel
  },
})
3. 使用
`    <Panel :title="title" @fatherMethodEmergency="clickParentEmergency">
                      <emergency-resource  ref="mychildEmergency" :dataArr="dataArr" v-if="isShow.testShow3"></emergency-resource>
                  </Panel> `

## 父组件引入涉及属性及事件
## 属性
1. 定义应急资源面板的接收数据的数组
public dataArr: any[] = []; 
2. 定义应急资源面板的Tab页切换的bool值
public isShow = {
        testShow1: false,
        testShow2: false,
        testShow3: false,
    };
3. 定义应急资源面板的Title
  public title = [
            {name: '应急物资', key: 'emergencyResource', ativeClass: true},
            {name: '风险隐患', key: 'riskTrouble', ativeClass: false},
            {name: '基础数据', key: 'baseData', ativeClass: false},
    ]
4. 定义应急资源面板的Tab 空数组
  public tabArr = [];
5. 定义应急资源面板的列表内容
  private dataOne = [
        {codeKey: 'RescueTeam※03',  tabTitle :   '救援队',  tabNumber:  13934, iconName: 'ResourceTrouble-icon-jiuyuandui'},
        {codeKey: 'Expert※01', tabTitle :  '专家', tabNumber: 1046, iconName: 'ResourceTrouble-icon-zhuanjia'},
        {codeKey: 'shelter', tabTitle :  '避难场所', tabNumber: 15757, iconName: 'ResourceTrouble-icon-binan'},
        {codeKey: 'ANJIAN_REPERTORY※01', tabTitle :  '物资储备库', tabNumber: 57, iconName: 'ResourceTrouble-icon-chubeiku'},
        {codeKey: 'JC_WARBASE※01', tabTitle :  '战保基地', tabNumber: 291, iconName: 'ResourceTrouble-icon-jidi'},
    ];
    private dataTwo = [
        {codeKey: 'ANJIAN_DAGCHEMENT※DangerousChemical', tabTitle :  '危化企业', tabNumber: 18580, iconName: 'Trouble-icon-weihua'},
        {codeKey: 'ANJIAN_ENT_WHSMYHBZ※01', tabTitle :  '工贸企业', tabNumber: 9792, iconName: 'Trouble-icon-gongmao'},
        {codeKey: 'coal', tabTitle :  '煤矿企业', tabNumber: 5503, iconName: 'Trouble-icon-meikuang'},
        {codeKey: 'tailingpond', tabTitle :  '尾矿库', tabNumber: 1193, iconName: 'Trouble-icon-weikuang'},
        {codeKey: 'firework', tabTitle :  '烟花爆竹', tabNumber: 14729, iconName: 'Trouble-icon-yanhua'},
        {codeKey: 'BAS_GEOLOGICHAZARD※01', tabTitle :  '地质灾害隐患点', tabNumber: 83294, iconName: 'Trouble-icon-dizhi'},
        {codeKey: 'majordanger', tabTitle :  '重大危险源', tabNumber: 21142, iconName: 'Trouble-icon-zhongda'},
    ];
    private bataThree = [
        {codeKey: 'bas_school', tabTitle :  '学校', tabNumber: 3531, iconName: 'Database-icon-school'},
        {codeKey: 'hospital', tabTitle :  '医院', tabNumber: 6857, iconName: 'Database-icon-hospital'},
        {codeKey: 'airport', tabTitle :  '机场', tabNumber: 9007, iconName: 'Database-icon-airport'},
        {codeKey: 'railwaystation', tabTitle :  '车站', tabNumber: 1840, iconName: 'Database-icon-station'},
        {codeKey: 'Resrrvoir※01', tabTitle :  '水库大坝', tabNumber: 17373, iconName: 'Database-icon-resrrvoir'},
        {codeKey: 'Nuclearinfo※01', tabTitle :  '核设施', tabNumber: 36, iconName: 'Database-icon-nuclearinfo'},
        {codeKey: 'portwharf', tabTitle :  '码头', tabNumber: 6645, iconName: 'Database-icon-portwharf'},
    ];
## 方法
1. 传给应急资源组件的方法
  private clickParentEmergency(data: any) {
        this.title.forEach((item: any ) => {
            item.ativeClass = false;
            if ( data.name === item.name) { item.ativeClass = true; }
        });
        this.erClickTabTitle(this.title);
    }
2. 初始应急资源组件 (父组件 钩子函数初始化)
    private initResource() {
        this.dataArr = this.dataOne;
        this.isShow.testShow3 = true;
    }
3. 物资
      private erClickTabTitle(data: any) {
          this.tabArr = data;
          data.forEach( (item: any, index: number) => {
              if (item.ativeClass) {
                  const key = item.key ;
                  switch (key) {
                      case 'emergencyResource':
                          this.dataArr = this.dataOne;
                          break;
                      case 'riskTrouble':
                          this.dataArr = this.dataTwo;
                          break;
                      case 'baseData':
                          this.dataArr = this.bataThree;
                          break;
                  }
              }
          });
      }
