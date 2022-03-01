<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import { leftMenuServer } from '@/api/installServer';
import { IboardData, INavList, IMenu } from '@/interface/feature/common/leftNav/LeftNav.interface';

@Component
export default class LeftNavRendless extends Vue {
  @Prop() public defaultNav!: string;
  @Prop() public boardData!: { boardList: IboardData[] };

  private curNav: string = this.defaultNav || '0';
  private defaultList0: IboardData[] = [];
  private defaultList1: IboardData[] = [];
  private navList: INavList[] = [];
  // private menus: IMenu[] = [];

  // 动态获取菜单数据： 使用统一的获取数据API，从JSON文件或者服务器上获取菜单数据
  public async getMenuData() {
    await leftMenuServer.getData().then((v: any) => {
      this.navList = v.navList;
      this.defaultList0 = v.defaultList0;
      this.defaultList1 = v.defaultList1;
      // this.menus = v.menus;
    });
  }
  public created() {
    this.getMenuData();
  }
  public selectMenu(key: string, keyPath: string) {
    this.curNav = String(key );
    this.$router.push(this.navList[Number(key)].path);
  }

  private render() {
    return (this.$scopedSlots.default as any)({
      curNav: this.curNav,
      defaultList0: this.defaultList0,
      defaultList1: this.defaultList1,
      navList: this.navList,
      // menus: this.menus,
      getMenuData: this.getMenuData,
      selectMenu: this.selectMenu,
    });
  }
}
</script>
