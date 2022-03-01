<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';

/*
 非渲染组件列表处理
*/

@Component
export default class ListCommon extends Vue {
  @Prop({ default: 5 }) public pageContent!: any; // 定义 每页显示多少条数据
  @Prop() public keyWord!: any; // 定义 当前查询的关键字
  @Prop() public data!: any; // 定义 当前数据
  @Prop({ default: null }) public listType: any; // 定义 右侧面板传过来的参数
  private all: any = 8; // 当前数据一共可以 有多少页
  private cur: any = 1; // 当前页是多少 初始为1

  get pages() {
    const pages: any = [];
    const data = this.COMdata;
    data.forEach((item: any, index: any) => {
      const page = Math.floor(index / this.pageContent);
      if (!pages[page]) {
        pages[page] = [];
      }
      pages[page].push(item);
    });
    return pages;
  }
  get COMindexs(): void {
    let left: any = 1;
    let right: any = this.all;
    const ar: any = [];
    if (this.all >= 5) {
      // 这里最大范围从3到6，如果到达7，那么下边加2变成9，已经超过最大的范围值
      if (this.cur > 3 && this.cur < this.all - 1) {
        // 以4为参考基准，左面加2右边加2
        left = this.cur - 2;
        right = this.cur + 2;
      } else {
        if (this.cur <= 3) {
          left = 1;
          right = 5;
        } else {
          right = this.all;
          left = this.all - 4;
        }
      }
    }
    while (left <= right) {
      ar.push(left);
      left++;
    }
    return ar;
  }
  get COMdata(): any {
    if (this.keyWord === '') {
      return this.data;
    } else {
      this.cur = 1;
      return this.FnQuery();
    }
  }
  // 定义 模糊查询的方法
  public FnQuery(): any {
    const arrRever: any = [];
    for (const iterator of this.data) {
      if (iterator.name.includes(this.keyWord)) {
        arrRever.push(iterator);
      }
    }
    return arrRever;
  }

  @Watch('listType')
  public FnClickLeft(): void {
    console.log('左侧面板传过来的数据：');
    console.log(this.listType);
  }

  @Watch('COMdata')
  public FnPageInit(): void {
    this.all = Math.ceil(this.COMdata.length / this.pageContent);
  }

  // 点击中间页
  private FnBtnClick(data: any): void {
    if (data !== this.cur) {
      this.cur = data;
    }
  }

  // 上一页
  private FnLast() {
    this.cur--;
  }

  // 下一页
  private FnNext() {
    this.cur++;
  }

  private created() {
    this.FnPageInit();
  }

  private render() {
    return (this.$scopedSlots.default as any)({
      listComKeyWord: this.keyWord,
      listComPages: this.pages,
      listComCur: this.cur,
      listComFnBtnClick: this.FnBtnClick,
      listComAll: this.all,
      listComCOMindexs: this.COMindexs,
      listComFnLast: this.FnLast,
      listComFnNext: this.FnNext,
    });
  }
}
</script>
