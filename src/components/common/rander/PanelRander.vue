<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class PanelRander extends Vue {
  @Prop() public id?: string;
  @Prop() public title!: string;
  @Prop() public type?: number;
  @Prop() public isShow?: boolean;
  public showTwoPage = false;
  /* @Prop() public randerData: any;
    private id?: string;
    private title!: string ;
    private type?: number ;
    private isShow?: boolean;*/
  // 关闭面板
  public fnClosePanel() {
    this.isShow = false;
  }
  // 打开面板
  public fnOpenPanel() {
    this.isShow = true;
  }

  // 收缩面板
  public fnShrinkPanel() {
    this.isShow = !this.isShow;
  }

  // 给isShow,type来添加默认值。
  public fnInitialize() {
    // 判断type，0为默认值，无关闭无收缩； 1:带关闭按钮的面板； 2：带收缩按钮的面板
    if (
      !this.type ||
      (this.type && !(this.type === 1 || this.type === 2 || this.type === 3))
    ) {
      this.type = 0;
    }
    // isShow的默认是true;
    this.isShow = this.isShow || true;
  }

  public created() {
    this.fnInitialize();
  }

  // 切换第二页面的处理
  private showTwoPageHandler() {
    this.showTwoPage = !this.showTwoPage;
  }

  private render() {
    return (this.$scopedSlots.default as any)({
      id: this.id,
      type: this.type,
      isShow: this.isShow,
      showTwoPage: this.showTwoPage,
      title: this.title,
      fnClosePanel: this.fnClosePanel,
      fnShrinkPanel: this.fnShrinkPanel,
      showTwoPageHandler: this.showTwoPageHandler,
      fnInitialize: this.fnInitialize,
      fnOpenPanel: this.fnOpenPanel,
      handleMap: this.handleMap,
    });
  }
}
</script>