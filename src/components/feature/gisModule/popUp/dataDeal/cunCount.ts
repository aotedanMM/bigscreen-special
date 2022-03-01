const cunCount: any = {
  // 乡村
  name: '村庄详情',
  // 单位
  unitObj: {
  },
  // 渲染属性的字段名以及顺序
  dataFilter: ['Letname', 'Letxianname'],
  // 标题
  labelObj: {
    Letname: '名称',
    Letxianname: '所属区市',
  },
  popHeight: 333,
  // 回调函数
  cb(self: any) {
    const that = self;
    that.name = '村庄详情';
    const element = that.data;
    let Letname = '--';
    let Letxianname: any = '--';
    Letname = element.tag.name;
    if ( element.tag.xianName ) {
      Letxianname = element.tag.xianName;
    }
    const obj = {
      Letname,
      Letxianname,
    };
    that.getpopData(obj);
  },
};

export { cunCount };
