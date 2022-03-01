const townCount: any = {
  // 乡村
  name: '乡镇详情',
  // 单位
  unitObj: {
    LetpeopleNum: '万人',
    getpeopleDensity: '人 / km²',
    Letarea: 'km²',
  },
  // 渲染属性的字段名以及顺序
  dataFilter: ['Letname', 'LetpeopleNum', 'getpeopleDensity', 'Letarea', 'Letxianname'],
  // 标题
  labelObj: {
    Letname: '名称',
    LetpeopleNum: '人口数量',
    getpeopleDensity: '人口密度',
    Letarea: '面积',
    Letxianname: '所属区市',
  },
  popHeight: 500,
  // 回调函数
  cb(self: any) {
    const that = self;
    that.name = '乡镇详情';
    const element = that.data;
    let Letname = '--';
    let LetpeopleNum: any = '--';
    let getpeopleDensity: any = '--';
    let Letarea: any = '--';
    let Letxianname: any = '--';
    Letname = element.tag.name;
    if (element.tag.arear !== null) {
      Letarea = (element.tag.arear / 1000000).toFixed(2);
    }
    // 人口没数据
    if (element.tag.pouplationNum !== null) {
      LetpeopleNum = (element.tag.pouplationNum / 10000).toFixed(2);
    }
    if ( element.tag.xianName ) {
      Letxianname = element.tag.xianName;
    }
    if (element.tag.arear === 0) {
      getpeopleDensity = 0;
    } else if (LetpeopleNum !== '--') { // 人口有值，面积有值
      getpeopleDensity = (element.tag.pouplationNum / element.tag.arear * 1000000).toFixed(2);
    }
    const obj = {
      Letname,
      LetpeopleNum,
      getpeopleDensity,
      Letarea,
      Letxianname,
    };
    that.getpopData(obj);
  },
};

export { townCount };
