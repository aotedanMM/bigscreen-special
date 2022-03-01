// 处理详情查询的映射
const MultiuleQueryConfig: any = {
  // 危化企业
  hazardous: {
    fileFn: (data: any) => {
      if (data) {
        return 'dagchementid as id,dagchementid as _id,longitude,latitude,dagchementname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,m.hazardlevelcode';
      } else {
        return 'dagchementid as id,dagchementid as _id,longitude,latitude,dagchementname as name,address,m.hazardlevelcode';
      }
    },
    tableName: () => {
      return 'anjian_dagchement m left join code_bas_hazardlevel n on m.hazardlevelcode = n.hazardlevelcode';
    },
    where: (text: any, count: any, checkedoption: any) => {
      const whereobj = MultiuleQueryConfig.whereweihua(text, checkedoption);
      return whereobj.optionwhere + whereobj.textwhere;
    },
    group: () => {
      return 'county';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'hazardlevelcode',
  },
  // 烟花爆竹
  explosive: {
    fileFn: (data: any) => {
      if (data) {
        return 'fireworkentid as id,fireworkentid as _id,longitude,latitude,fireworkentname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,depttypecode as unittype,artificialper as legalperson,tel as phone,workernum as staffnum,qualityinfo';
      } else {
        return 'fireworkentid as id,fireworkentid as _id,longitude,latitude,fireworkentname as name,address';
      }
    },
    tableName: () => {
      return 'anjian_fireworkent';
    },
    where: (text?: any) => {
      if (text) {
        return 'and fireworkentname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
        return 'and 1 = 1';
      }
    },
    group: () => {
      return 'county';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 重大危险源
  majordanger: {
    fileFn: (data: any) => {
      if (data) {
          return 'dangerid as id,longitude,latitude,dangername as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, county as districtcode';
      } else {
          return 'dangerid as id,longitude,latitude,dangername as name,address';
      }
    },
    tableName: () => {
      return 'anjian_danger';
    },
    where: (text?: any) => {
      if (text) {
        return 'and dangername like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
    } else {
        return 'and 1 = 1';
    }
    },
    group: () => {
      return 'county';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 煤矿
  coalmine: {
    fileFn: (data: any) => {
      if (data) {
          return 'coalid as id,coalid as _id,longitude,latitude,coalname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,mine_status_zs as minestatus,design_output as capability,legal_name as legalperson,legal_tel as legalpersonphone,worernum as staffnum,controlcentertel as controlphone,ws_gradename as gaslevel,product_date as productiondate,mine_minetype as miningtype,parentname as superiorenterprise,deptclassname as administrativelevel,standardclassname as standardlevel,coaltypename as coalminetype,ventilatestylename as ventilatetype,hydrogeologicalname as hydrogeololgytype,mine_firename as selfignition,grimeexplosivename as explosive,creditcode';
      } else {
          return 'coalid as id,coalid as _id,longitude,latitude,coalname as name,address';
      }
    },
    tableName: () => {
      return 'anjian_coal s left join code_coal_wsgrade t on t.ws_grade = s.ws_grade left join code_coal_deptclass k on k.deptclass = s.deptclass left join code_coal_standardclass l on l.standardclass = s.standardclass left join code_coal_type m on m.coaltypecode = s.coaltypecode left join code_coal_powerstyle o on o.owerstyle = s.owerstyle left join code_coal_ventilatestyle p on p.ventilatestyle = s.ventilatestyle left join code_coal_hydrogeological q on q.hydrogeological = s.hydrogeological left join code_coal_minefire r on r.mine_fire= s.mine_fire left join code_coal_grimeexplosive a on a.grime_explosive = s.grime_explosive';
    },
    where: (text?: any) => {
      if (text) {
        return 'and coalname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
          return 'and 1 = 1';
      }
    },
    group: () => {
      return 'county';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 尾矿库列表
  mine: {
    fileFn: (data?: any) => {
      if (data) {
          return 'wkkid as id,wkkid as _id,longitude,latitude,wkkmc as name,wkkdzmc as address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,runstatusname as runingstatus,wkkfzr as respper,xzqkr as repovolume,tailingpondtype as ganguetype,wkkdbcode as ganguelevel,area,mqzbc as damlength,mqdjbgd as damheight,mineralspecies_name as mineralspeciesname,stgradename,wkkfzrbgsdh as officephone,aqfzr as safetyperson,aqfzrbgsdh as safetyofficephone,ptgrzrs as normalstaffnum,aqscxkz as safetylicense,aqscxkzfzjg as licenseissueorg,sfazzxjcxt as isonlinemonitor,county as DISTRICTCODE,updatetime,wkksshymc as industry';
      } else {
          return 'wkkid as id,wkkid as _id,longitude,latitude,wkkmc as name,wkkdzmc as address';
      }
    },
    tableName: () => {
      return 'anjian_tailingpond s left join code_tailingpond_runstatus t on t.runstatuscode = s.runstatuscode left join code_metal_standardgrade a on a.standardgrade = s.standardgrade left join code_tailingpond_industry b on b.wkksshycode = s.wkksshycode';
    },
    where: (text?: any) => {
      if (text) {
        return 'and wkkmc like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
          return 'and 1 = 1';
      }
    },
    group: () => {
      return 'county';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 火车
  railwaystation: {
    fileFn: (data: any) => {
        if (data) {
            return 'stationid as id,longitude,latitude,stationname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode,respper as chargeperson,respotel as phone';
        } else {
            return 'stationid as id,longitude,latitude,stationname as name,address';
        }
    },
    tableName: () => {
      return 'bas_railwaystation';
    },
    where: (text?: any) => {
      if (text) {
        return 'and stationname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
    } else {
        return 'and 1 = 1';
    }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 码头
  portwharf: {
    fileFn: (data: any) => {
      if (data) {
          return 'portwharfid as id,longitude,latitude,portwharfname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode,districtname,respper as chargeperson,respotel as phone';
      } else {
          return 'portwharfid as id,longitude,latitude,portwharfname as name,address';
      }
    },
    tableName: () => {
      return 'bas_portwharf';
    },
    where: (text?: any) => {
      if (text) {
        return 'and portwharfname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
        return 'and 1 = 1';
      }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 机场
  airport: {
    fileFn: (data: any) => {
        if (data) {
            return 'airportid as id,longitude,latitude,airportname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode,districtname,respper as chargeperson,respotel as phone';
        } else {
            return 'airportid as id,longitude,latitude,airportname as name,address';
        }
    },
    tableName: () => {
      return 'bas_airport';
    },
    where: (text?: any) => {
      if (text) {
        return 'and airportname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
        return 'and 1 = 1';
      }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 水利设施
  reservoir: {
    fileFn: (data: any) => {
        if (data) {
            return 'stcd as id,name,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,longitude,latitude, address';
        } else {
            return 'stcd as id,name';
        }

    },
    tableName: () => {
      return 'bas_reservoir';
    },
    where: (text?: any) => {
      if (text) {
        return 'and name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
        return 'and 1 = 1';
      }
    },
    group: () => {
      return 'code';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 核电站
  bas_nuclearinfo: {
    fileFn: (data: any) => {
      if (data) {
        return 'nuclearid as id,longitude,latitude,nuclearname as name,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode';
      } else {
          return 'nuclearid as id,longitude,latitude,nuclearname as name, districtcode';
      }
    },
    tableName: () => {
      return 'bas_nuclearinfo';
    },
    where: (text?: any) => {
      if (text) {
        return 'and nuclearname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
          return '';
      }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 加油站
  egis_gas_station: {
    fileFn: (data: any) => {
      if (data) {
          return 'fid as id,shapex as longitude,shapey as latitude,name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, pac as districtcode';
      } else {
          return 'fid as id,shapex as longitude,shapey as latitude,name,address, pac as districtcode';
      }
    },
    tableName: () => {
      return 'egis_gas_station';
    },
    where: (text: any) => {
        if (text) {
            return 'and name like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
        } else {
            return 'and 1=1';
        }
    },
    group: () => {
        return 'pac';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 商超
  bas_market: {
    fileFn: (data: any) => {
      if (data) {
          return 'marketid as id,longitude,latitude,marketname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode';
      } else {
          return 'marketid as id,longitude,latitude,marketname as name,address, districtcode';
      }
    },
    tableName: () => {
      return 'bas_market';
    },
    where: (text: any) => {
      if (text) {
          return 'and marketname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
          return 'and 1=1';
      }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 宾馆饭店
  bas_hotel: {
    fileFn: (data: any) => {
      if (data) {
          return 'hotelid as id,longitude,latitude,hotelname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,districtcode';
      } else {
          return 'hotelid as id,longitude,latitude,hotelname as name,address,districtcode';
      }
    },
    tableName: () => {
      return 'bas_hotel';
    },
    where: (text: any, count: any) => {
      if (count === 1) {
          if (text) {
              return 'and hotelname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
          } else {
              return 'and 1=1';
          }
      } else {
          if (text) {
              return 'and hotelname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
          } else {
              return 'and 1=1';
          }
      }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 文化场所
  bas_theater: {
    fileFn: (data: any) => {
      if (data) {
          return 'theaterid as id,longitude,latitude,theatername as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode';
      } else {
          return 'theaterid as id,longitude,latitude,theatername as name,address, districtcode';
      }
    },
    tableName: () => {
      return 'bas_theater';
    },
    where: (text: any, count: any) => {
      if (count === 1) {
          if (text) {
              return 'and theatername like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
          } else {
              return 'and 1=1';
          }
      } else {
          if (text) {
              return 'and theatername like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
          } else {
              return ' and 1=1';
          }
      }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 滑坡
  landslide: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.0100\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 泥石流
  debrisflow: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.0200\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 崩塌
  mountaincollapse: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.0300\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 塌陷
  bottomcollapse: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.0400\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 地裂缝
  groundfissure: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.0500\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 斜坡
  unstableslopes: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.0800\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 地面沉降
  landsubsidence: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.0600\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 火山喷发
  volcanoeruption: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.0700\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 其他
  otherdisasters: {
    fileFn: (data: any) => {
      if (data) {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, countyname as distrctname';
      } else {
          return 'objectid as id,disscalecode,hazardname as name,address,maxpersonnum,threatwealth,destroyedhome,monitorsuggestion,treatmentsuggestion,alttop,altbotom,longitude,latitude,countyname as distrctname';
      }
    },
    tableName: () => {
      return 'bas_geologichazard';
    },
    where: (text: any, count: any, checkedoption: any) => {
        const whereobj = MultiuleQueryConfig.wheredizai(text, checkedoption);
        return whereobj.optionwhere + 'and geohazardtypecode = \'20104.9900\'' + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'disscalecode',
  },
  // 陆油 01
  anjian_oilgasfieldCRUDE: {
   fileFn: (data: any) => {
      if (data) {
          return 'oilgasfieldid as id,longitude,latitude,sydwmc as name,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, province as districtcode';
      } else {
          return 'oilgasfieldid as id,longitude,latitude,sydwmc as name, province as districtcode';
      }
    },
    tableName: () => {
      return 'anjian_oilgasfield';
    },
    where: (text: any) => {
        if (text) {
            return 'and syfl=\'01\' and sydwmc like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
        } else {
            return 'and syfl=\'01\'';
        }
    },
    group: () => {
      return 'province';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 海油 02
  anjian_oilgasfieldCNOOC: {
    fileFn: (data: any) => {
      if (data) {
        return 'oilgasfieldid as id,longitude,latitude,sydwmc as name,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, county as districtcode';
      } else {
        return 'oilgasfieldid as id,longitude,latitude,sydwmc as name';
      }
    },
    tableName: () => {
        return 'anjian_oilgasfield';
    },
    where: (text: any) => {
        if (text) {
            return 'and syfl=\'02\' and sydwmc like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
        } else {
            return 'and syfl=\'02\'';
        }
    },
    group: () => {
        return 'province';
    },
},


  // 战保(救援队伍的表 rescueclasscode='F008')
  jyxx_tea_rescue_warbase: {
    fileFn: (data: any) => {
        if (data) {
            return 'rescueid as id,longitude,latitude,rescuename as name,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, rescounty as districtcode, address';
        } else {
            return 'rescueid as id,longitude,latitude,rescuename as name,rescounty as districtcode, address';
        }
    },
    tableName: () => {
      return 'jyxx_tea_rescue';
    },
    where: (data?: any) => {
        if (data) {
            return 'and rescueclasscode=\'F008\'';
        } else {
            return 'and rescueclasscode=\'F008\'';
        }
    },
    group: () => {
        return 'rescounty';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // E键通 // 灾情信息员
  sjzlpt_dm_tfsjjb_sjdcrwlb: {
    fileFn: (data: any) => {
        if (data) {
            return 'a.xxyxm as name, a.xxyid,a.jd,a.wd,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance';
        } else {
            return 'a.xxyxm as name, a.xxyid,a.jd,a.wd';
        }
    },
    tableName: () => {
      return 'sjzlpt_dm_tfsjjb_sjdcrwlb a';
    },
    where: (text: any) => {
        if (text) {
            return 'and NOT EXISTS ( SELECT 1 FROM sjzlpt_dm_tfsjjb_sjdcrwlb b WHERE b.xxyid = a.xxyid AND b.rwfksj > a.rwfksj )  and a.rwlx in (\'洪涝\', \'滑坡\', \'泥石流\', \'台风\', \'其他\') and a.xxyxm like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
        } else {
            return 'and NOT EXISTS ( SELECT 1 FROM sjzlpt_dm_tfsjjb_sjdcrwlb b WHERE b.xxyid = a.xxyid AND b.rwfksj > a.rwfksj )  and a.rwlx in (\'洪涝\', \'滑坡\', \'泥石流\', \'台风\', \'其他\')';
        }
    },
    group: () => {
      return '';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 装备
  CommonEquipComp: {
    fileFn: (data: any) => {
        if (data) {
            return 'equipmentid as id,equiptypename as name,equipnum,newparameter as equiptypecode,equiptypename,equtypeparentcode,equtypeparentname,address,longitude,latitude,leader,leadermtel,rescueid,rescuename,spmodel,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance';
        } else {
            return 'equipmentid as id,equiptypename as name,equipnum,newparameter as equiptypecode,equiptypename,equtypeparentcode,equtypeparentname,address,longitude,latitude,leader,leadermtel,rescueid,rescuename,spmodel';
        }
    },
    tableName: () => {
      return 'v_equipment';
    },
    where: (text: any, range: number, option: any, wherecode: string) => {
        if (text) {
            return 'and  newparameter = \'' + wherecode + '\' and rescounty like (\'' + text + '\'||\'%\')ESCAPE\'/\'';
        } else {
            return 'and  newparameter = \'' + wherecode + '\'';
        }
    },
    group: () => {
      return '';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 避难场所
  shelter: {
    fileFn: (data: any) => {
      if (data) {
        return 'shelterid as id,longitude,latitude,sheltername as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode,chargedept as competentunit,opentime,dutytel';
      } else {
          return 'shelterid as id,longitude,latitude,sheltername as name,address, districtcode,chargedept as competentunit,opentime,dutytel';
      }
    },
    tableName: () => {
      return 'bas_shelter';
    },
    where: (text?: any) => {
      if (text) {
        return 'and sheltername like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
        return 'and 1 = 1';
      }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 专家
  expert: {
    fileFn: (data: any) => {
      if (data) {
          return 'expertid as id,longitude,latitude,expertname as name,deptname,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, district as districtcode,specialiskill as expertise,protitle as desc,tel';
      } else {
          return 'expertid as id,longitude,latitude,expertname as name,deptname, district as districtcode,specialiskill as expertise,protitle as desc,tel';
      }
    },
    tableName: () => {
      return 'jc_expert';
    },
    where: (text?: any) => {
      if (text) {
        return 'and expertname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
        return 'and 1 = 1';
      }
    },
    group: () => {
        return 'district';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 应急管理机构
  emergencypart: {
    fileFn: (data: any) => {
      if (data) {
          return 'vdtid as id,longitude,latitude,unitname as name,unitaddress as address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode';
      } else {
          return 'vdtid as id,longitude,latitude,unitname as name,unitaddress as address, districtcode';
      }
    },
    tableName: () => {
      return 'jc_huaw_vdt';
    },
    where: (text?: any) => {
      if (text) {
        return 'and unitname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
        return 'and 1 = 1';
      }
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 物资仓库
  WareHouse: {
    fileFn: (data: any) => {
      if (data) {
          return 'warehouseno as id,lng as longitude,lat as latitude,warehousename as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance,orgname,level,levelname,type,typename,countycode as districtcode,contact,contactphone';
      } else {
          return 'warehouseno as id,lng as longitude,lat as latitude,warehousename as name,address,orgname,level,levelname,type,typename,countycode as districtcode,contact,contactphone';
      }
    },
    tableName: () => {
      return 'sjzlpt_jk_yjwzpt_ckzsjcx';
    },
    where: (text: any, range: number, option: any, wherecode: string) => {
      if (text) {
        return 'and warehousename like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
      } else {
          return 'and ' + wherecode.split('_')[0] + ' = \'' + wherecode.split('_')[1] + '\'';
      }
    },
    group: () => {
        return 'citycode';
    },
    orderBy : () => {
      return 'distance';
    },
  },
  // 医院
  hospital: {
    fileFn: (data: any) => {
      if (data) {
        return 'orgid as id,orgname as name,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode,address,m.orgtypecode,orgtypename as typename,dutytel as phone,districtname,bednum,respper as chargeperson';
      } else {
          return 'orgid as id,orgname as name, districtcode,address,m.orgtypecode,orgtypename as typename,dutytel as phone,districtname,bednum,respper as chargeperson';
      }
    },
    tableName: () => {
      return 'bas_healthorg m left join code_healthorg_type n on m.orgtypecode = n.orgtypecode';
    },
    where: (text: any, count: any, checkedoption: any) => {
      const whereobj = MultiuleQueryConfig.dealwhere(text, 'orgname', 'm.orgtypecode', checkedoption, ['46A00101', '46A00102']);
      return whereobj.optionwhere + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'orgtypecode',
  },
  // 学校
  bas_school: {
    fileFn: (data: any) => {
      if (data) {
        return 'schoolid as id,longitude,latitude,schoolname as name,address,ST_Distance_Spheroid(shape,st_geomfromtext(\'' + data + '\',4326),\'SPHEROID[\"WGS 84\",6378137,298.257223563]\')as distance, districtcode,defobjtypecode as typecode';
      } else {
          return 'schoolid as id,longitude,latitude,schoolname as name,address';
      }
    },
    tableName: () => {
      return 'bas_school';
    },
    where: (text: any, count: any, checkedoption: any) => {
      const whereobj = MultiuleQueryConfig.dealwhere(text, 'schoolname', 'defobjtypecode', checkedoption, ['31B07', '31B06', '31B05', '31B01']);
      return whereobj.optionwhere + whereobj.textwhere;
    },
    group: () => {
      return 'districtcode';
    },
    orderBy : () => {
      return 'distance';
    },
    giscodeConfig: 'typecode',
  },
};
// 地灾下拉框 option的值
MultiuleQueryConfig.optionArr = ['1', '2', '3', '4'];
// 两个数组取出不同的值
MultiuleQueryConfig.getArrDifference = (arr1: any, arr2: any) => {
  return arr1.concat(arr2).filter(function(v: any, i: number, arr: any) {
    return arr.indexOf(v) === arr.lastIndexOf(v);
  });
};

// 地灾查询条件处理
MultiuleQueryConfig.wheredizai = function(text: string, checkedoption: any) {
  // 关键字搜索
  let textwhere: string = '';
  if (text) {
    textwhere = ' and hazardname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
  } else {
    textwhere = '';
  }
  // 下拉框
  const QiTa: boolean = checkedoption.includes('other');
  let optionwhere: string = '';
  if (checkedoption.length === 1) {
    // 选一个
    if (QiTa) {
      const checkStr = '\'1\',\'2\',\'3\',\'4\'';
      optionwhere = 'and (disscalecode not in (' + checkStr + ') or disscalecode is null)';
    } else {
        optionwhere = 'and disscalecode = \'' + checkedoption[0] + '\' ';
    }
  } else if (checkedoption.length === 5) {
    // 全选
    optionwhere = '';
  } else if (checkedoption.length === 0) {
    // 全不选
    optionwhere = '';
  } else {
    // 多选
    const checkStr: string[] = [];
    const checkedNumber: string[] = [];
    for (const item of checkedoption) {
      checkStr.push('\'' + item + '\'');
      if (item !== 'other') {
        // 排除其它的数字
        checkedNumber.push(item);
      }
    }
    if (QiTa) {
      // 获取 跟其它以外匹配的数字
      const difArr = MultiuleQueryConfig.getArrDifference(
        MultiuleQueryConfig.optionArr,
        checkedNumber,
      );
      const handledifArr = []; // 处理获取数组
      for (const iterator of difArr) {
        // 处理获取数组
        handledifArr.push('\'' + iterator + '\'');
      }
      optionwhere = 'and (disscalecode not in (' + handledifArr.join() + ')  or disscalecode is null) ';
    } else {
      optionwhere = 'and disscalecode in (' + checkStr.join() + ') ';
    }
  }
  const obj: any = {
    textwhere,
    optionwhere,
  };
  return obj;
};
// 危化企业查询条件处理
MultiuleQueryConfig.whereweihua = function(text: string, checkedoption: any) {
  // 关键字搜索
  let textwhere: string = '';
  if (text) {
    textwhere = ' and dagchementname like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
  } else {
    textwhere = '';
  }

  // 下拉框
  const QiTa: boolean = checkedoption.includes('other');
  let optionwhere: string = '';
  if (checkedoption.length === 1) {
    // 选一个
    if (QiTa) {
      const checkStr = '\'1\',\'2\',\'3\',\'4\'';
      optionwhere = 'and (m.hazardlevelcode not in (' + checkStr + ') or m.hazardlevelcode is null)';
    } else {
      optionwhere = 'and m.hazardlevelcode = \'' + checkedoption[0] + '\' ';
    }
  } else if (checkedoption.length === 5) {
    // 全选
    optionwhere = '';
  } else if (checkedoption.length === 0) {
    // 全不选
    optionwhere = '';
  } else {
    // 多选
    const checkStr: string[] = [];
    const checkedNumber: string[] = [];
    for (const item of checkedoption) {
      checkStr.push('\'' + item + '\'');
      if (item !== 'other') {
        // 排除其它的数字
        checkedNumber.push(item);
      }
    }
    if (QiTa) {
      // 获取 跟其它以外匹配的数字
      const difArr = MultiuleQueryConfig.getArrDifference(
        MultiuleQueryConfig.optionArr,
        checkedNumber,
      );
      const handledifArr = []; // 处理获取数组
      for (const iterator of difArr) {
        // 处理获取数组
        handledifArr.push('\'' + iterator + '\'');
      }
      optionwhere = 'and (m.hazardlevelcode not in (' + handledifArr.join() + ')  or m.hazardlevelcode is null) ';
    } else {
      optionwhere = 'and m.hazardlevelcode in (' + checkStr.join() + ') ';
    }
  }
  const obj: any = {
    textwhere,
    optionwhere,
  };
  return obj;
};
/**有下拉框的专用（医院、学校、危化、地灾）
 * 查询条件处理
 * text关键字
 * textname 要过滤的关键字的变量名
 * wherename where过滤需要的的变量名
 * optionArr 用于对比有‘其他’选项的checkoption，下拉框专用
 */
MultiuleQueryConfig.dealwhere = function(
  text: string,
  textname: string,
  wherename: string,
  checkedoption: any,
  optionArr: any,
) {
  // 关键字搜索
  let textwhere: string = '';
  if (text) {
    textwhere = ' and ' + textname + ' like (\'%\' ||\'' + text + '\'||\'%\')ESCAPE\'/\'';
  } else {
    textwhere = '';
  }
  // 下拉框
  const QiTa: boolean = checkedoption.includes('other');
  let optionwhere: string = '';
  if (checkedoption.length === 1) {
    // 选一个
    if (QiTa) {
      let checkStr = '';
      for (const item of optionArr) {
        checkStr = checkStr + '\'' + item + '\'' + ',';
      }
      checkStr = checkStr.slice(0, -1);
      optionwhere = 'and (' + wherename + ' not in (' + checkStr + ') or ' + wherename + ' is null)';
    } else {
      optionwhere = 'and ' + wherename + ' = \'' + checkedoption[0] + '\' ';
    }
  } else if (checkedoption.length === optionArr.length + 1) {
    // 全选
    optionwhere = '';
  } else if (checkedoption.length === 0) {
    // 全不选
    optionwhere = '';
  } else {
    // 多选
    const checkStr: string[] = [];
    const checkedNumber: string[] = [];
    for (const item of checkedoption) {
      checkStr.push('\'' + item + '\'');
      if (item !== 'other') {
        // 排除其它的数字
        checkedNumber.push(item);
      }
    }
    if (QiTa) {
      // 获取 跟其它以外匹配的数字
      const difArr = MultiuleQueryConfig.getArrDifference(
        optionArr,
        checkedNumber,
      );
      const handledifArr = []; // 处理获取数组
      for (const iterator of difArr) {
        // 处理获取数组
        handledifArr.push('\'' + iterator + '\'');
      }
      optionwhere = 'and (' + wherename + ' not in (' + handledifArr.join() + ')  or ' + wherename + ' is null) ';
    } else {
      optionwhere = 'and ' + wherename + ' in (' + checkStr.join() + ') ';
    }
  }
  const obj: any = {
    textwhere,
    optionwhere,
  };
  return obj;
};
export default MultiuleQueryConfig;
