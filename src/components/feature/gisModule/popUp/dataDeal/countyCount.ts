const countyCount: any = {
  // 乡村
  name: '区市详情',
  HasEcharts: true,
  // 单位
  unitObj: {
    LetpeopleNum: '万人',
    getpeopleDensity: '人 / km²',
    Letarea: 'km²',
    Distance: 'km',
    forestArea: '万亩',
    ecologicalForestArea: '万亩',
    forestCoverage: '%',
    proportion: '%',
  },
  dataFilter: ['Letname', 'LetpeopleNum', 'getpeopleDensity', 'Letarea', 'Letxiangnumber'],
  extendFilter: ['forestArea', 'ecologicalForestArea', 'forestCoverage', 'keyTown', 'forestFarm', 'naturalReserve', 'firepReventArea', 'proportion'],
  // 标题
  labelObj: {
    Letname: '名称',
    LetpeopleNum: '人口数量',
    getpeopleDensity: '人口密度',
    Letarea: '面积',
    Letxiangnumber: '辖区乡镇',
  },
  popHeight: 435,
  // 回调函数
  cb(self: any) {
    const that = self;
    that.name = '区市详情';
    const element = that.data;
    let Letname = '--';
    let LetpeopleNum: any = '--';
    let getpeopleDensity: any = '--';
    let Letarea: any = '--';
    let Letxiangnumber: any = '--';
    Letname = element.tag.name;
    if (element.tag.arear !== null) {
      Letarea = (element.tag.arear / 1000000).toFixed(2);
    }
    // 人口没数据
    if (element.tag.pouplationNum !== null) {
      LetpeopleNum = (element.tag.pouplationNum / 10000).toFixed(2);
    }
    if (element.tag.arear === 0) {
      getpeopleDensity = 0;
    } else if (LetpeopleNum !== '- -') { // 人口有值，面积有值
      getpeopleDensity = (element.tag.pouplationNum / element.tag.arear * 1000000).toFixed(2);
    }
    if (element.tag.xiangnumber === 0) {
      Letxiangnumber = element.tag.xiangnumber;
    } else if (element.tag.xiangnumber) {
      Letxiangnumber = element.tag.xiangnumber;
    }
    const obj = {
      Letname,
      LetpeopleNum,
      getpeopleDensity,
      Letarea,
      Letxiangnumber,
    };
    that.getpopData(obj);
  },
};

export { countyCount };
