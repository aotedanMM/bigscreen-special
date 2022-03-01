<template>
  <div class="FullListFeaturebox">
    <!--      :getDetailDataFn="getDetailDataFn"-->
    <FullListFeature
      :fullListFeatrueIsShow="isShow"
      :inputConfig="inputConfig"
      :tableConfig="tableConfig"
      :listTitle="listTitle"
      :placeholder="placeholder"
      :parentData="leftItemData"
      :btnlist="btnlist"
      :exportType="exportType"
      @handleClickClosedPanel="handleClickClosedPanel"
      :selectContainerClass="selectContainerClass"
      :isselectContainer="isselectContainer"
      :isselectvideo="isselectvideo"
    ></FullListFeature>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import FullListFeature from '@/components/feature/common/list/FullList.feature.vue';
import { messsageBus } from '@/util/message';
import {
  baseDataServer,
  detailInfoServer,
  emerSourceServer,
  riskSourceServer,
} from '@/api/installServer';
@Component({
  name: 'EmergencyResourcesList',
  components: {
    FullListFeature,
  },
})
export default class EmergencyResourcesList extends Vue {
  @Prop() public emerencyResourcesNum?: any;
  @Prop({
    default: false,
  })
  public isShow!: boolean;
  public leftItemData: any = {}; // 左侧面板的行数据
  public leftPanelType: any = ''; // 左侧面板的
  // public getDetailDataFn: any = ''; // 传给详情框用的。查询数据的接口
  public inputConfig: any = [
    {
      key: 'name',
    },
  ];
  public tableConfig: any = [
    {
      key: 'name',
      title: '名称',
    },
    {
      key: 'address',
      title: '地址',
    },
  ];
  public listTitle: string = ''; // 定义title
  private experts: any = [
    {
      'title': '专家',
      'tabTitle': '专家',
      'specialType': 'codeArr',
      'codeKey': ['Expert※01', 'Expert※12'],
      'tabNumber': 0,
      'unit': '人',
      'icon': 'ResourceTrouble-icon-zhuanjia',
      'select': 'zj',
      'checked': false,
      'numChecked': false,
      '//fatherId': 'fatherId为1的时候代码有下级父级元素点击不高亮',
      'fatherId': 1,
      'list': [
        {
          'title': '应急专家分组',
          'tabTitle': '应急专家分组',
          'codeKey': 'Expert※01',
          'tabNumber': 0,
          'specialType': 'codeStr',
          '//key': ' // 用于区分当前数据的用途',
          'key': 'tabBtn',
          'unit': '',
          'icon': '',
          'numChecked': false,
          'checked': false,
        },
        {
          title: '专家擅长领域',
          specialType: 'codeStr',
          tabTitle: '专家擅长领域',
          codeKey: 'Expert※12',
          key: 'tabBtn',
          tabNumber: 0,
          unit: '',
          icon: '',
          numChecked: false,
          checked: false,
        },
        {
          title: '非煤矿山',
          tabTitle: '非煤矿山',
          codeKey: 'nonmineexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          numChecked: false,
          icon: 'Specialist-icon-fmks',
          checked: false,
        },
        {
          title: '危险化学品',
          tabTitle: '危险化学品',
          codeKey: 'chemicalexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          numChecked: false,
          icon: 'Specialist-icon-wxhxp',
          checked: false,
        },
        {
          title: '工商贸',
          tabTitle: '工商贸',
          codeKey: 'tradexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-gsm',
          numChecked: false,
          checked: false,
        },
        {
          title: '应急救援',
          tabTitle: '应急救援',
          codeKey: 'emergenceexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-yjjy',
          numChecked: false,
          checked: false,
        },
        {
          title: '火灾防治',
          tabTitle: '火灾防治',
          codeKey: 'fireexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-hzfz',
          numChecked: false,
          checked: false,
        },
        {
          title: '防汛抗旱',
          tabTitle: '防汛抗旱',
          codeKey: 'floodexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-fxkh',
          numChecked: false,
          checked: false,
        },
        {
          title: '地震地质灾害',
          tabTitle: '地震地质灾害',
          codeKey: 'earthquakeexpert',
          specialType: 'codeStr',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-dzdzzh',
          numChecked: false,
          checked: false,
        },
        {
          title: '烟花爆竹',
          tabTitle: '烟花爆竹',
          codeKey: 'fireworkexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-yhbz',
          numChecked: false,
          checked: false,
        },
        {
          title: '政策法规',
          tabTitle: '政策法规',
          codeKey: 'lawexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-zcfg',
          numChecked: false,
          checked: false,
        },
        {
          title: '宣教与信息化',
          tabTitle: '宣教与信息化',
          codeKey: 'infomationexpert',
          specialType: 'codeStr',
          key: 'yjzjfz',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-xjyxxh',
          numChecked: false,
          checked: false,
        },
        {
          title: '气象专业',
          tabTitle: '气象专业',
          codeKey: 'Expert※13',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-qxzy',
          numChecked: false,
          checked: false,
        },
        {
          title: '应急救援',
          tabTitle: '应急救援',
          codeKey: 'Expert※14',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-yjjy',
          numChecked: false,
          checked: false,
        },
        {
          title: '自然灾害',
          tabTitle: '自然灾害',
          codeKey: 'Expert※15',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-zrzh',
          numChecked: false,
          checked: false,
        },
        {
          title: '电力抢险',
          tabTitle: '电力抢险',
          codeKey: 'Expert※16',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-dlqx',
          numChecked: false,
          checked: false,
        },
        {
          title: '医疗救助',
          tabTitle: '医疗救助',
          codeKey: 'Expert※17',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-yljz',
          numChecked: false,
          checked: false,
        },
        {
          title: '危险化学品',
          tabTitle: '危险化学品',
          codeKey: 'Expert※18',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-wxhxp',
          numChecked: false,
          checked: false,
        },
        {
          title: '防汛抗旱',
          tabTitle: '防汛抗旱',
          codeKey: 'Expert※19',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-fxkh',
          numChecked: false,
          checked: false,
        },
        {
          title: '工商贸',
          tabTitle: '工商贸',
          codeKey: 'Expert※20',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-gsm',
          numChecked: false,
          checked: false,
        },
        {
          title: '通信抢险',
          tabTitle: '通信抢险',
          codeKey: 'Expert※21',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-txqx',
          numChecked: false,
          checked: false,
        },
        {
          title: '工程抢险',
          tabTitle: '工程抢险',
          codeKey: 'Expert※22',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-gcqx',
          numChecked: false,
          checked: false,
        },
        {
          title: '非煤矿山',
          tabTitle: '非煤矿山',
          codeKey: 'Expert※23',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-fmks',
          numChecked: false,
          checked: false,
        },
        {
          title: '地震地质',
          tabTitle: '地震地质',
          codeKey: 'Expert※24',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-dzdz',
          numChecked: false,
          checked: false,
        },
        {
          title: '森火救援',
          tabTitle: '森火救援',
          codeKey: 'Expert※25',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-shjy',
          numChecked: false,
          checked: false,
        },
        {
          title: '煤矿',
          tabTitle: '煤矿',
          codeKey: 'Expert※26',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-mk',
          numChecked: false,
          checked: false,
        },
        {
          title: '地质勘测',
          tabTitle: '地质勘测',
          codeKey: 'Expert※27',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-dzkc',
          numChecked: false,
          checked: false,
        },
        {
          title: '心理咨询',
          tabTitle: '心理咨询',
          codeKey: 'Expert※28',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-xlzx',
          numChecked: false,
          checked: false,
        },
        {
          title: '政策法规',
          tabTitle: '政策法规',
          codeKey: 'Expert※29',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-zcfg',
          numChecked: false,
          checked: false,
        },
        {
          title: '交通运输',
          tabTitle: '交通运输',
          codeKey: 'Expert※30',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-jtys',
          numChecked: false,
          checked: false,
        },
        {
          title: '消防救援',
          tabTitle: '消防救援',
          codeKey: 'Expert※31',
          specialType: 'codeStr',
          key: 'zjscly',
          tabNumber: 0,
          unit: '人',
          icon: 'Specialist-icon-xfjy',
          numChecked: false,
          checked: false,
        },
      ],
    },
  ];

  private isselectContainer: boolean = false;
  private isselectvideo: boolean = false;
  private exportType: boolean = false;
  private placeholder: string = '';
  private btnlist = [
    {
      label: '全部',
      value: '',
    },
    {
      label: '企业视频',
      value: '0',
    },
    {
      label: '实时监测',
      value: '1',
    },
  ];
  private selectContainerClass = {
    // 物资储备库
    'ANJIAN_REPERTORY※01': {
      list: [
        {
          label: '中央',
          value: '1',
        },
        {
          label: '地方',
          value: '2',
        },
        {
          label: '社会',
          value: '3',
        },
        {
          label: '消防局',
          value: '4',
        },
        {
          label: '森林消防局',
          value: '5',
        },
      ],
      // 筛选框查询的字段
      filterName: 'REPERTORYTYPECODE',
    },
  };
  @Watch('emerencyResourcesNum')
  public changeEmerencyResourcesNum(val: any) {
    if (val) {
      this.initData();
    }
  }
  public initData() {
    if (!this.emerencyResourcesNum) {
      return;
    }
    this.leftPanelType = this.emerencyResourcesNum.panelType;
    this.leftItemData = this.emerencyResourcesNum.item;
    this.listTitle = this.leftItemData.tabTitle || this.leftItemData.name;
    this.isselectContainer = this.listTitle === '物资储备库' ? true : false;
    this.isselectvideo = this.leftPanelType === 'riskTrouble' ? true : false;
    console.log(this.leftItemData.tabTitle);
    // (应急资源--救援装备列表弹窗字段配置 毕东方  2021.11.23 )
    switch (this.leftItemData.tabTitle) {
      case '防火瞭望塔':
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          {
            key: 'contacts',
            title: '联系人',
          },
          {
            key: 'contacts_cell',
            title: '联系电话',
          },
        ];
        break;
      case '防火检查站':
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          {
            key: 'contacts',
            title: '负责人',
          },
          {
            key: 'contacts_cell',
            title: '联系电话',
          },
        ];
        break;
      case '防火自然保护地':
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          {
            key: 'firechief',
            title: '联系人',
          },
          {
            key: 'firechiefphone',
            title: '联系电话',
          },
        ];
        break;
      case '防火重点部位':
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          // 刘云梦2022/02/21 修改防火重点部位弹窗字段名取错的bug
          {
            key: 'firechief',
            title: '联系人',
          },
        ];
        break;
      case '防火装备':
        this.tableConfig = [
          {
            key: 'equipmentname',
            title: '名称',
          },
          {
            key: 'principal',
            title: '联系人',
          },
          {
            key: 'phone',
            title: '联系电话',
          },
        ];
        break;
      case '防火阻隔带信息':
        this.tableConfig = [
          {
            key: 'type',
            title: '阻隔带类型',
          },
          {
            key: 'district',
            title: '区域',
          },
        ];
        this.inputConfig = [];
        break;
      case '防火气象监测站':
        this.tableConfig = [
          {
            key: 'monitoringstationname',
            title: '监测站名称',
          },
          {
            key: 'principalandphone',
            title: '联系人及电话',
          },
          {
            key: 'district',
            title: '行政区划',
          },
        ];
        break;
      case '党政机关':
        this.tableConfig = [
          {
            key: 'partygovtname',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '专家':
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          {
            key: 'DESC',
            title: '职称',
          },
        ];
        break;
      case '崩塌':
      case '滑坡':
      case '泥石流':
      case '采空塌陷':
      case '地面塌陷':
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          {
            key: 'disasterscale',
            title: '规模等级',
            width: 260,
          },
        ];
        break;
      case '应急电力保障设备':
        this.tableConfig = [
          {
            key: 'device_name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '应急救援吊装设备':
        this.tableConfig = [
          {
            key: 'equipment_name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '防火设备':
        this.tableConfig = [
          {
            key: 'device_name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '应急救援监测设备':
        this.tableConfig = [
          {
            key: 'equipment_name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '应急救援破拆设备':
        this.tableConfig = [
          {
            key: 'equipment_name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '应急救援人身防护设备':
        this.tableConfig = [
          {
            key: 'equipment_name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '应急救援喷水设备':
        this.tableConfig = [
          {
            key: 'equipment_name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '排水设备':
        this.tableConfig = [
          {
            key: 'equipment_name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      case '应急局救援装备':
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          {
            key: 'classes',
            title: '类别',
          },
        ];
        break;
      case '传感器类型代码表':
        this.tableConfig = [
          {
            key: 'detector_type_name',
            title: '传感器名称',
          },
          {
            key: 'id',
            title: '传感器代码',
          },
        ];
        break;
      case '传感器':
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          {
            key: 'code',
            title: '编码',
          },
        ];
        break;
      case '网关设备':
        this.tableConfig = [
          {
            key: 'facility_name',
            title: '名称',
          },
          {
            key: 'facility_number',
            title: '编号',
          },
        ];
        break;
         case '减灾委成员':
        this.tableConfig = [
          {
            key: 'name',
            title: '姓名',
          },
          {
            key: 'duty',
            title: '职务',
          },
        ];
        break;
         case '地震地质救援指挥部成员':
        this.tableConfig = [
          {
            key: 'member_name',
            title: '姓名',
          },
          {
            key: 'title_name',
            title: '职务',
          },
        ];
        break;
         case '尾矿库基本信息及包保信息':
        this.tableConfig = [
          {
            key: 'tailings_pond_name',
            title: '尾矿库名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
         case '尾矿库企业':
        this.tableConfig = [
          {
            key: 'noncoalentname',
            title: '尾矿库名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        break;
      default:
        this.tableConfig = [
          {
            key: 'name',
            title: '名称',
          },
          {
            key: 'address',
            title: '地址',
          },
        ];
        this.placeholder = '请输入名称查询';
        break;
    }
    this.deepQuery(this.experts, this.leftItemData.codeKey);
    if (this.leftItemData.codeKey.slice(0, 9) === 'equipment') {
      this.tableConfig = [
        {
          key: 'name',
          title: '名称',
          width: 220,
        },
        {
          key: 'equipnum',
          title: '数量',
          width: 126,
        },
        {
          key: 'address',
          title: '地址',
        },
      ];
      this.placeholder = '请输入名称查询';
    }
    if (this.leftItemData.expert) {
      this.placeholder = '请输入姓名查询';
      this.tableConfig = [
        {
          key: 'name',
          title: '专家姓名',
        },
        {
          key: 'protitle',
          title: '职称',
        },
        {
          key: 'tel',
          title: '联系电话',
        },
      ];
    }
    if (this.leftItemData.tabTitle === '应急专业人员') {
      const self = this;
      self.exportType = true;
    }
  }
  private deepQuery(tree: any, key: any) {
    // 递归匹配数据
    for (const item of tree) {
      if (item.codeKey === key) {
        this.placeholder = '请输入姓名查询';
        this.tableConfig = [
          {
            key: 'name',
            title: '专家姓名',
          },
          {
            key: 'protitle',
            title: '职称',
          },
          {
            key: 'tel',
            title: '联系电话',
          },
        ];
      }
      if (item.list && item.list.length > 0) {
        this.deepQuery(item.list, key);
      }
    }
  }
  private handleClickClosedPanel(closeState: any) {
    this.messsageBus.emit(
      'clickEmerencyResourcesNumPanelClosed',
      this.leftItemData,
      closeState,
    );
    this.messsageBus.emit(
      'clickEmerencyResourcesNum',
      this.leftItemData,
      closeState,
    );
  }
  // 关闭弹窗
  private created() {
    this.changeEmerencyResourcesNum(this.emerencyResourcesNum);
  }
}
</script>

<style lang="less" scoped>
.FullListFeaturebox{
  position:fixed;
  left:45%;
  transform: translateX(-50%);
  bottom:5%;
  width:1000px;
  z-index: 1000;
}
</style>
