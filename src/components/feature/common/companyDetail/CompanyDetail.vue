<template>
  <div class="CompanyDetail">
    <div class="CompanyDetailBox" v-if="!hazardous">
      <div class="download_btn_world" @click="downLoadFun"></div>
      <div class="iconBox">
        <i class="el-icon-close" @click="$parent.companyDetailType = ''"></i>
      </div>
      <h2 class="entName_header">{{ companyDetailData.name }}</h2>
      <el-scrollbar style="height:680px;margin-left:-40px;">
        <div class="table_list">
          <h3 class="basicTitle">基本信息</h3>
          <ul class="table_list_uls">
            <li
              class="new_table_list"
              v-for="(val, key) in enterpriseTitle"
              :key="key"
            >
              <span class="table_list_name">{{ val }}：</span>
              <span class="table_list_contont PROPERTYNAME">
                {{
                  companyDetailData[key] !== 0 && !companyDetailData[key]
                    ? '暂无数据'
                    : companyDetailData[key]
                }}
              </span>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
    <div class="CompanyDetailBox" v-if="hazardous">
      <div class="download_btn_world" @click="downLoadFun"></div>
      <div class="iconBox">
        <i class="el-icon-close" @click="$parent.companyDetailType = ''"></i>
      </div>
      <el-scrollbar  v-loading="loading" style="height:730px;margin-left:-40px;">
        <iframe :src="hazardousiframe" class="hazardousiframe" v-html="iframenocontent"></iframe> 
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { downloadCompanyDetail } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
import { hazardoubaseinfoServer } from '@/api/installServer';
// 数据来源
const dataApiServer = publishObjectPath.value && publishObjectPath.value.urlWeb;

// 下载文件
const downloadWordfile = publishObjectPath.value && publishObjectPath.value.serverPath;
@Component({
  name: 'CompanyDetail',
})
export default class CompanyDetail extends Vue {
  @Prop()
  private companyDetailData: any;
  @Prop()
  private companyDetailType: any;
  private enterpriseTitle: any;
  private hazardous: boolean = true;
  private hazardousiframe: any = '';
  private iframenocontent: string = '';
  private loading: boolean = false;
  private isTrue: boolean = false;


  // 点击downLoad
  public downLoadFun() {
    let newDetail: any = {};
    let urlParam: any = '';
    if (this.companyDetailType === 'ANJIAN_DAGCHEMENT※DangerousChemical' || this.companyDetailType === 'productionindustry' || this.companyDetailType === 'hazardous') {
      // 危化企业
      this.hazardousbaseinfodownload(downloadWordfile + '/api/decisionProgram/v1/exportEnterpriseInfoWord?entId=' + this.companyDetailData._id + '&entType=weihua');
    } else if (this.companyDetailType === 'coalMine' || this.companyDetailType === 'coal') {
      // 煤矿企业
      urlParam = 'api/public/exportwordmkt/v1?param=';
      newDetail = {
        entName_header: this.companyDetailData.name,
        PARENTNAME: this.companyDetailData.superiorenterprise,
        UPDATETIME: this.companyDetailData.updatetime,
        PROVED_OUTPUT: this.companyDetailData.realcapability,
        DESIGN_OUTPUT: this.companyDetailData.capability,
        COALSTATENAME: this.companyDetailData.minestatus,
        COALTYPENAME: this.companyDetailData.coalminetype,
        WS_GRADENAME: this.companyDetailData.gaslevel,
        LEGAL_NAME: this.companyDetailData.legalperson,
        CONTROLCENTERTEL: this.companyDetailData.controlphone,
        DEPTCLASS: this.companyDetailData.administrativelevel,
        STANDARDCLASS: this.companyDetailData.standardlevel,
        APPROVED_MINE_DEPTH: this.companyDetailData.maxdepth,
        PRODUCT_DATE: '投产时间',
        MINESTYLE: this.companyDetailData.miningtype,
        TRANSMITSTYLE: this.companyDetailData.transporttype,
        OWERSTYLE: this.companyDetailData.electrictype,
        VENTILATESTYLENAME: this.companyDetailData.ventilatetype,
        MINE_FIRE: this.companyDetailData.selfignition,
        GRIME_EXPLOSIVE: this.companyDetailData.explosive,
        MINE_WATERBURST: this.companyDetailData.normalwater,
        MINE_WATERBURST_MAX: this.companyDetailData.maxwater,
        ROCKBURST: this.companyDetailData.pressurebump,
        WORERNUM: this.companyDetailData.staffnum,
        ADDRESS: this.companyDetailData.address,
        RF_LITHOLOGY: this.companyDetailData.roofrock,
        // coalminetype: '煤矿类型',
        // maindisaster: '主要灾害类型',
        // hydrogeololgytype: '水文地质类型',
      };
      this.downloadCompanyDetai(newDetail, urlParam);
    } else if (this.companyDetailType === 'mine' || this.companyDetailType === 'tailingpond') {
      // 非煤矿山
      urlParam = 'api/public/exportwordfmt/v1?param=';
      newDetail = {
        entName_header: this.companyDetailData.name,
        WKKMC: this.companyDetailData.name,
        WKKSSHYMC: this.companyDetailData.industry,
        WKKDZMC: this.companyDetailData.address,
        RUNSTATUSNAME: this.companyDetailData.runingstatus,
        WKKFZR: this.companyDetailData.chargeperson,
        WKKFZRBGSDH: this.companyDetailData.officephone,
        WKKFZRYDDH: this.companyDetailData.phone,
        AQFZR: this.companyDetailData.safetyperson,
        AQFZRBGSDH: this.companyDetailData.safetyofficephone,
        AQFZRYDDH: this.companyDetailData.safetycellphone,
        SFZYZJZC: this.companyDetailData.iscentralsupport,
        ZYZJZCJE: this.companyDetailData.centralsupportamount,
        ZTZJXBRQ: this.companyDetailData.centralsupporttime,
        SFYJJGYS: this.companyDetailData.iscompleted,
        KSGCMC: this.companyDetailData.miningname,
        SFSYZDWXY: this.companyDetailData.ismajordanger,
        SFSYKSGC: this.companyDetailData.isbelongtomining,
        PTGRZRS: this.companyDetailData.normalstaffnum,
        TZZYRYSL: this.companyDetailData.specialstaffnum,
        AQSCXKZ: this.companyDetailData.safetylicense,
        AQSCXKZFZJG: this.companyDetailData.licenseissueorg,
        AQSCXKZQSRQ: this.companyDetailData.licensestarttime,
        AQSCXKZJZRQ: this.companyDetailData.licenseendtime,
        STANDARDGRADE: this.companyDetailData.stgradename,
        QZRQ: this.companyDetailData.licensedate,
        SFAZZXJCXT: this.companyDetailData.isonlinemonitor,
        TAILINGPONDTYPEMC: this.companyDetailData.ganguetype,
        WKKDBNAME: this.companyDetailData.ganguelevel,
        KDPD: this.companyDetailData.bottomslope,
        KC: this.companyDetailData.repolength,
        MQDJBGD: this.companyDetailData.damheight,
        MQZBC: this.companyDetailData.damlength,
        XZQKR: this.companyDetailData.repovolume,
        WKKAQDNAME: this.companyDetailData.ganguesafety,
        SFAQSCXKZ: this.companyDetailData.hassafetypermit,
        SFAQSCBZGF: this.companyDetailData.hassafetystandard,
        UPDATETIME: this.companyDetailData.updatetime,
      };
      this.downloadCompanyDetai(newDetail, urlParam);
    } else if (this.companyDetailType === 'explosive' || this.companyDetailType === 'ANJIAN_FIREWORKENT※01') {
      // 烟花爆竹
      urlParam = 'api/public/createfirework/v1?param=';
      newDetail = {
        entName_header: this.companyDetailData.name,
        DEPTTYPENAME: this.companyDetailData.name,
        ORGNO: this.companyDetailData.orgcode,
        FILINGORGAN: this.companyDetailData.filingauthority,
        ARTIFICIALPER: this.companyDetailData.legalperson,
        ARTIFICIALPERCERNO: this.companyDetailData.legalpersonid,
        BUSILICNUM: this.companyDetailData.licensenumber,
        BUSILICVALIDDATE: this.companyDetailData.licenseexpiration,
        REGISTFUNDS: this.companyDetailData.registercapital,
        WORKERNUM: this.companyDetailData.staffnum,
        TEL: this.companyDetailData.phone,
        DEPTSTATECODE: this.companyDetailData.unitstatus,
        INPROVINCE: this.companyDetailData.inprovince,
        UPDATETIME: this.companyDetailData.updatetime,
        ADDRESS: this.companyDetailData.address,
        QUALITYINFO: this.companyDetailData.qualityinfo,
      };
      this.downloadCompanyDetai(newDetail, urlParam);
    } else if (this.companyDetailType === 'ANJIAN_ENT_WHSMYHBZ※01') {
      // 工贸企业
      urlParam = '/api/public/exportwordgmt/v1?param=';
      newDetail = {
        entName_header: this.companyDetailData.name,
        DEPTTYPENAME: this.companyDetailData.name,
        ORGNO: this.companyDetailData.orgcode,
        FILINGORGAN: this.companyDetailData.filingauthority,
        ARTIFICIALPER: this.companyDetailData.legalperson,
        ARTIFICIALPERCERNO: this.companyDetailData.legalpersonid,
        BUSILICNUM: this.companyDetailData.licensenumber,
        BUSILICVALIDDATE: this.companyDetailData.licenseexpiration,
        REGISTFUNDS: this.companyDetailData.registercapital,
        WORKERNUM: this.companyDetailData.staffnum,
        TEL: this.companyDetailData.phone,
        DEPTSTATECODE: this.companyDetailData.unitstatus,
        INPROVINCE: this.companyDetailData.inprovince,
        UPDATETIME: this.companyDetailData.updatetime,
        ADDRESS: this.companyDetailData.address,
        QUALITYINFO: this.companyDetailData.qualityinfo,
      };
      this.downloadCompanyDetai(newDetail, urlParam);
    }
  }

  // 别的word下载
  private downloadCompanyDetai(newDetail: any, urlParam: string) {
    for (const i in newDetail) {
      if (!newDetail[i]) {
        newDetail[i] = '暂无数据';
      }
    }
    const strDetail: any = JSON.stringify(newDetail);
    downloadCompanyDetail.downloadCompanyDetailFun(strDetail, urlParam).then((res: any) => {
      console.log(res);
    }).catch((err: any) => {
      console.log(err);
    });
  }
  // 下载危化企业的word
  private hazardousbaseinfodownload(src: string) {
     const downloadfile: any = {
      iframe: '',
    };
     const iframe: any = document.createElement('iframe');
     downloadfile.iframe = iframe;
     document.body.appendChild(downloadfile.iframe);
     downloadfile.iframe.src = src;
     downloadfile.iframe.style.display = 'none';
  }
  private setDate(val: any) {
    if (val) {
      return this.$moment(val).format(
        'YYYY-MM-DD',
      );
    } else {
      return;
    }
  }
  // 获取危化企业的基本详情
  private hazardousbaseinfo(id: string|number) {
    hazardoubaseinfoServer.getHazardoubaseinfoServer(id).then((res: any) => {
      this.loading = false;
      this.hazardousiframe = downloadWordfile + '/api/decisionProgram/v1/getDangerEntInfoHtml?entId=' + id;
    }).catch((err: any) => {
      this.iframenocontent = '暂无数据';
      });
  }

  // 配置企业详情字段
  private setData() {
    if (this.companyDetailType === 'ANJIAN_DAGCHEMENT※DangerousChemical' || this.companyDetailType === 'productionindustry' || this.companyDetailType === 'hazardous') {
      this.loading = true;
      this.hazardous = true;
      this.hazardousbaseinfo(this.companyDetailData._id);
    } else if (this.companyDetailType === 'coalMine' || this.companyDetailType === 'coal') {
      this.hazardous = false;
      // 煤矿企业
      this.companyDetailData.updatetime = this.setDate(
        this.companyDetailData.updatetime,
      );
      console.log(this.companyDetailData);
      if (this.companyDetailData.maindisaster !== '') {
        if (this.companyDetailData.maindisaster === '-9') {
          this.companyDetailData.maindisaster = '暂无数据';
        }
      }



      this.enterpriseTitle = {
        superiorenterprise: '上级企业',
        updatetime: '更新时间',
        realcapability: '核定生产能力',
        capability: '设计生产能力',
        minestatus: '矿井状态',
        coalminetype: '煤矿类型',
        gaslevel: '瓦斯等级',
        maindisaster: '主要灾害类型',
        legalperson: '法人代表',
        controlphone: '调度室电话',
        administrativelevel: '主管政府部门等级',
        standardlevel: '质量标准化等级',
        maxdepth: '允许最大采深',
        miningtype: '开拓方式',
        transporttype: '运输方式',
        electrictype: '供电方式',
        ventilatetype: '通风方式',
        hydrogeololgytype: '水文地质类型',
        selfignition: '煤矿自燃倾向性',
        explosive: '煤尘爆炸性',
        normalwater: '矿井正常涌水量',
        maxwater: '矿井最大涌水量',
        pressurebump: '冲击地压',
        staffnum: '职工人数',
        address: '详细地址',
        roofrock: '顶岩石岩性',
      };


    } else if (this.companyDetailType === 'mine' || this.companyDetailType === 'tailingpond') {
      this.hazardous = false;
      // 非煤矿山
      this.companyDetailData.updatetime = this.setDate(
        this.companyDetailData.updatetime,
      );
      this.companyDetailData.licensestarttime = this.setDate(
        this.companyDetailData.licensestarttime,
      );
      this.companyDetailData.licenseendtime = this.setDate(
        this.companyDetailData.licenseendtime,
      );
      this.companyDetailData.centralsupporttime = this.setDate(
        this.companyDetailData.centralsupporttime,
      );
      if (this.companyDetailData.isonlinemonitor !== '否' || this.companyDetailData.isonlinemonitor !== '是' || this.companyDetailData.isonlinemonitor !== '未知') {
          if (Number(this.companyDetailData.isonlinemonitor) === 1) {
            this.companyDetailData.isonlinemonitor = '否';
          } else if (Number(this.companyDetailData.isonlinemonitor) === 0) {
            this.companyDetailData.isonlinemonitor = '是';
          } else {
            this.companyDetailData.isonlinemonitor = '未知';
          }
        }


      if (this.companyDetailData.hassafetypermit !== '否' || this.companyDetailData.hassafetypermit !== '是' || this.companyDetailData.hassafetypermit !== '未知') {
          if (Number(this.companyDetailData.hassafetypermit) === 1) {
            this.companyDetailData.hassafetypermit = '否';
          } else if (Number(this.companyDetailData.hassafetypermit) === 0) {
            this.companyDetailData.hassafetypermit = '是';
          } else {
            this.companyDetailData.hassafetypermit = '未知';
          }
        }


      if (this.companyDetailData.hassafetystandard !== '否' || this.companyDetailData.hassafetystandard !== '是') {
          if (Number(this.companyDetailData.hassafetystandard) === 1) {
            this.companyDetailData.hassafetystandard = '否';
          } else if (Number(this.companyDetailData.hassafetystandard) === 0) {
            this.companyDetailData.hassafetystandard = '是';
          }
        }

      if (this.companyDetailData.ismajordanger !== '否' || this.companyDetailData.ismajordanger !== '是' || this.companyDetailData.ismajordanger !== '未知') {
          if (Number(this.companyDetailData.ismajordanger) === 1) {
            this.companyDetailData.ismajordanger = '否';
          } else if (Number(this.companyDetailData.ismajordanger) === 0) {
            this.companyDetailData.ismajordanger = '是';
          } else if (Number(this.companyDetailData.ismajordanger) === 9) {
            this.companyDetailData.ismajordanger = '未知';
          }
        }

      if (this.companyDetailData.isbelongtomining !== '否' || this.companyDetailData.isbelongtomining !== '是') {
            if (Number(this.companyDetailData.isbelongtomining) === 1) {
              this.companyDetailData.isbelongtomining = '否';
            } else if (Number(this.companyDetailData.isbelongtomining) === 0) {
              this.companyDetailData.isbelongtomining = '是';
            }
        }

      if (this.companyDetailData.bottomslope.toString().indexOf('度') === -1) {
          if (this.companyDetailData.bottomslope !== '') {
            this.companyDetailData.bottomslope = this.companyDetailData.bottomslope + '度';
          }
        }

      if (this.companyDetailData.repolength.toString().indexOf('米') === -1) {
          if (this.companyDetailData.repolength !== '') {
            this.companyDetailData.repolength = this.companyDetailData.repolength + '米';
          }
        }

      if (this.companyDetailData.damlength.toString().indexOf('米') === -1) {
          if (this.companyDetailData.damlength !== '') {
            this.companyDetailData.damlength = this.companyDetailData.damlength + '米';
          }
        }

      if (this.companyDetailData.repovolume.toString().indexOf('立方米') === -1) {
          if (this.companyDetailData.repovolume !== '') {
            this.companyDetailData.repovolume = this.companyDetailData.repovolume + '立方米';
          }
        }


      if (this.companyDetailData.licensedate !== '') {
        const dateee = new Date(this.companyDetailData.licensedate).toJSON();
        this.companyDetailData.licensedate = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
      }



      this.enterpriseTitle = {
        name: '尾矿库名称',
        address: '尾矿库所在地址',
        industry: '尾矿库所属行业',
        runingstatus: '尾矿库运行状况',
        chargeperson: '主要负责人',
        officephone: '主要负责人办公室电话',
        phone: '主要负责人移动电话',
        safetyperson: '安全负责人',
        safetyofficephone: '安全负责人办公室电话',
        safetycellphone: '安全负责人移动电话',
        iscentralsupport: '是否属于中央资金支持项目',
        centralsupportamount: '中央资金支持金额',
        centralsupporttime: '中央资金下拨时间',
        iscompleted: '是否已经竣工验收',
        miningname: '矿山工程名称',
        ismajordanger: '是否属于重大危险源',
        isbelongtomining: '是否从属于矿山工程',
        normalstaffnum: '普通工人总人数',
        specialstaffnum: '特种作业人数',
        safetylicense: '安全生产许可证号码',
        licenseissueorg: '安全生产许可证发证机关',
        licensestarttime: '安全生产许可证起始日期',
        licenseendtime: '安全生产许可终止日期',
        stgradename: '标准化等级',
        licensedate: '取证日期',
        isonlinemonitor: '是否安装在线监测系统',
        ganguetype: '尾矿库型势',
        ganguelevel: '矿库等级',
        bottomslope: '库底坡度',
        repolength: '库长',
        damheight: '目前堆积坝高度',
        damlength: '目前主坝长',
        repovolume: '现有全库容',
        ganguesafety: '尾矿库现状安全度',
        hassafetypermit: '是否有安全生产许可证',
        hassafetystandard: '是否制定安全生产标准规范',
        updatetime: '更新时间',
      };

    } else if (this.companyDetailType === 'explosive' || this.companyDetailType === 'ANJIAN_FIREWORKENT※01' || this.companyDetailType === 'firework') {
      this.hazardous = false;
      // 烟花爆竹
      this.companyDetailData.updatetime = this.setDate(
        this.companyDetailData.updatetime,
      );


      if (this.companyDetailData.licenseexpiration !== '') {
        const dateee = new Date(this.companyDetailData.licenseexpiration).toJSON();
        this.companyDetailData.licenseexpiration = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
      }

      this.enterpriseTitle = {
        name: '单位类型',
        filingauthority: '备案机关',
        legalperson: '法定代表人姓名',
        legalpersonid: '法定代表人身份证号',
        licensenumber: '营业执照号码',
        licenseexpiration: '营业执照有效期',
        registercapital: '注册资金',
        staffnum: '作业人数',
        phone: '电话号码',
        unitstatus: '单位状态',
        inprovince: '省内外((0.省内，1.省外))',
        updatetime: '更新时间',
        address: '单位地址',
        qualityinfo: '产品质量信息',
      };
    } else if (this.companyDetailType === 'ANJIAN_ENT_WHSMYHBZ※01') {
      // 工贸企业
      this.hazardous = false;
      this.companyDetailData.updatetime = this.setDate(
        this.companyDetailData.updatetime,
      );
      this.enterpriseTitle = {
        name: '单位类型',
        industry: '企业行业',
        address: '单位地址',
        legalperson: '法定代表人姓名',
        staffnum: '作业人数',
        phone: '电话号码',
        unitstatus: '单位状态',
        inprovince: '省内外((0.省内，1.省外))',
        updatetime: '更新时间',
        qualityinfo: '产品质量信息',
        filingauthority: '备案机关',
        legalpersonid: '法定代表人身份证号',
        licensenumber: '营业执照号码',
        licenseexpiration: '营业执照有效期',
        registercapital: '注册资金',
      };
    } else if (this.companyDetailType === 'metalnonmetal') {
      // 金属非金属矿山
      this.hazardous = false;
      this.companyDetailData.updatetime = this.setDate(
        this.companyDetailData.updatetime,
      );
      this.enterpriseTitle = {
        name: '单位类型',
        KSDZMC: '矿山所在地址',
        KQMJ: '矿区面积',
        SJFWNX: '设计服务年限',
        KSFZR: '主要负责人',
        KSFZRBGSDH: '主要负责人办公电话',
        KSFZRYDDH: '主要负责人移动电话',
        AQFZR: '安全负责人',
        AQFZRBGDH: '安全负责人办公电话',
        AQFZRYDDH: '安全负责人移动电话',
        TZZYRYSL: '特种作业人数',
        PTYGZSL: '普通员工总人数',
        SSHY: '所属行业',
        SCKZ: '开采矿种',
        CKXKZFZJG: '采矿许可证发证机关',
        CKXKZ: '采矿许可证编号',
        CKXKZQSRQ: '采矿许可证启始日期',
        CKXKZJZRQ: '采矿许可证截止日期',
        AQSCXKZ: '安全许可证编号',
        AQSCXKZFZJG: '安全生产许可证发证机关',
        AQSCXKZQSRQ: '安全生产许可证启始日期',
        AQSCXKZJZRQ: '安全生产许可证截止日期',
        STANDARDGRADE: '标准化等级代码',
        BZHDJRQ: '标准化取证日期',
        SJSCKSLL: '设计生产矿石量',
        SJSCJSL: '设计生产金属量',
        FLOOREXITNUM: '直达地面的安全出口数量',
        MAXPERNUM: '井下单班最多作业人数',
        REPORTSTATUS: '数据上报状态',
        REPORTTIME: '数据上报时间',
        REPORTDEPT: '数据上报单位',
        UPDATETIME: '最近更新时间',
        KCFS: '开采方式编码',
        DATATYPEFLAG: '数据类别',
      };
    } else if (this.companyDetailType === 'ANJIAN_OILGASFIELD※01' || this.companyDetailType === 'ANJIAN_OILGASFIELD※02') {
      // 陆油或者海油
      this.hazardous = false;
      this.companyDetailData.updatetime = this.setDate(
        this.companyDetailData.updatetime,
      );
      this.enterpriseTitle = {
        name: '单位类型',
        CYRYSL: '从业人员数量',
        TZZYRYSL: '特种作业人员数量',
        KCJZCODE: '开采介质',
        AQSCXKZBH: '安全许可证编号',
        AQSCXKZFZJG: '安全生产许可证机关',
        AQSCXKZJZRQ: '安全生产许可证截止日期',
        SEAAREACODE: '所属海域',
        ZYFZR: '主要负责人姓名',
        ZYFZRBGDH: '主要负责人办公室电话',
        ZYFZRYDDH: '主要负责人移动电话',
        AQFZR: '安全负责人姓名',
        AQFZRBGDH: '安全负责人办公室电话',
        AQFZRYDDH: '安全负责人移动电话',
        AQGLFZR: '安全管理部门负责人姓名',
        AQGLFZRBGDH: '办公室电话',
        AQGLFZRYDDH: '移动电话',
        UPDATETIME: '更新时间',

      };
    }
  }
  private created() {
    this.setData();
  }
}
</script>
<style lang="less" scoped>
@popdialog: '../../../../assets/img/gisModule/compentsPopups';
* {
  margin: 0;
  padding: 0;
}
.CompanyDetail {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  .CompanyDetailBox {
    position: relative;
    background: url('@{popdialog}/world_bg.png') no-repeat;
    background-size: auto;
    background-size: 100% 100%;
    width: 810px;
    height: 987px;
    padding:0px 62px 30px 22px;
    box-sizing: border-box;
    // outline:1px solid red;
    .hazardousiframe{
      width: 950px;
      height: 103%;
      border: none;
      overflow-x:hidden;
    }
    .download_btn_world {
      z-index: 1;
      width: 99px;
      height: 87px;
      background: url('@{popdialog}/download_active_icon.png') no-repeat;
      background-size: 100% 100%;
      color: #6ecfd8;
      font-size: 20px;
      position: absolute;
      bottom: 42px;
      right: 49px;
      text-align: center;
      line-height: 38px;
      cursor: pointer;
      padding-left: 35px;
      &:hover {
        background: url('@{popdialog}/download_icon.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .iconBox {
      color: black;
      text-align: right;
      margin: 50px auto 0;
      width: 95%;
      font-size: 30px;
      i {
        cursor: pointer;
      }
    }
    .entName_header {
      font-size: 30px;
      text-align: center;
      margin: 0 auto;
      width: 85%;
      margin-top: 40px;
      margin-bottom: 30px;
      font-weight: bolder;
    }
    .table_list {
      width: 60%;
      margin: 0 auto;
      .basicTitle {
        text-align: left;
        margin-bottom: 10px;
        font-weight: bolder;
        font-size: 26px;
        margin-top: 20px;
      }
      ul {
        li {
          line-height: 42px;
          overflow: hidden;
          white-space: normal;
          text-overflow: ellipsis;
          font-size: 26px;
        }
      }
    }
  }
}

/deep/ .el-scrollbar {
  // height: 730px;
  // width: 98%;
  // margin: 0 auto;
  // margin-left: -40px;
  .el-scrollbar__view{
    width: 100%;
    height: 100%;
  }
}
</style>
