<template>
  <!-- <div> -->
    <div>
        <li
            v-for="(ele, idx) in localJson"
            :key="ele.name"
            @click="hotIconClick(ele, idx)"
            :class="{ iconLiActive: idx == commonIconIndex }"
        >
            <img :src="ele.icons" alt />
            <b class="el-icon-close" @click.stop="delLocalPic(ele)"></b>
            <span :title="ele.name" class="local-pic-name">{{ ele.name }}</span>
        </li>
        <li>
            <div class="toolbox-onlyAdd" style>
            <a class="toolbox-add-btn">
                <b class="el-icon-plus"></b>
            </a>
            <span class="toolbox-add-txt">添加本地标绘</span>
            <input
                type="file"
                accept="image/jpeg, image/png, image/jpg, image/svg+xml"
                class="file-self"
                @change="LocalPic($event)"
            />
            </div>
        </li>
    </div>
  <!-- </div> -->
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import { plotServer, plotNoSqlService } from '@/api/installServer';
// import './gisEmapPanelEdit.less';
@Component({})
export default class GisPlotPanelLocalPic extends Vue {
  @Prop() public leftTabValue?: any;
  @Prop() public hotIconIndex?: any;
  // @Prop() public commonIconIndex?: any;
  @Prop() public options?: any;
  @Prop() public mapComponent?: any;
  @Prop() public mapOpts?: any;
  @Prop() public eventType?: any;
  @Prop() public plotIcons?: any;
  private commonIconIndex = -1;
  private commonTabDatas = [];
  private localJson: any = [];
  private created() {
    //
  }
    /**
   * plotIcons 有值时 再进行加载
   */
  @Watch('plotIcons')
  private updateplotIcons(val: any) {
    if (val) {
    //   this.getChinaTabNames(this.eventType);
      // 获取本地上传缓存图标
      this.getLocalPic();
    }
  }
  private mounted() {
    this.refreshLocalPic();
  }
  private refreshLocalPic() {
    this.updateplotIcons(this.plotIcons);
  }
   // 图标点击事件;
  private hotIconClick(item: any, index: any) {
    this.commonIconIndex = index;
    this.mapComponent.draw(item, this.mapOpts.businessId);
    // this.getEMapPanelEdit(item);
  }
   // 本地标绘
  private LocalPic(ele: any) {
    if (JSON.stringify(this.localJson).length / 1024 / 1024 > 3) {
      return this.$message('缓存超过3M，请清理本地标绘！');
    }
    if (ele.target.files && ele.target.files.length > 0) {
      const name = ele.target.files[0].name;
      const type = ele.target.files[0].type;
      if (type.indexOf('image/') > -1) {
        const reader: any = new FileReader();
        // TODO onload走不进去
        reader.onload = (e: any) => {
          const img: any = new Image();
          img.src = e.target.result;
          img.onload = (element: any) => {
            const src: any = {};
            src.id = this.newGuid();
            src.name = name;
            src.type = 'Point';
            // 处理本地标绘宽高超过100px
            src.width = element.target.width;
            src.height = element.target.height;
            const threshold: any = 500;
            if ((src.width > threshold || src.height > threshold)) {
              if (src.width >= src.height) {
                src.height = src.height / (src.width / threshold);
                src.width = threshold;
              } else {
                src.width = src.width / (src.height / threshold);
                src.height = threshold;
              }
              const imgNew = this.deal(img, src.width, src.height);
              src.src = imgNew;
              src.icons = imgNew;
            } else {
              src.src = element.target.src;
              src.icons = element.target.src;
            }
            this.localJson.push(src);
            return new Promise((resolve, reject) => {
              plotServer.saveLocalPic(this.localJson);
              resolve();
            });
          };
        };
        reader.readAsDataURL(ele.target.files[0]);
      } else {
        return this.$message('请选择图片类型文件！');
      }
    }
  }
  private newGuid() {
    const g = () => {
      // tslint:disable-next-line
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (g() + g() + '-' + g() + '-' + g() + '-' + g() + '-' + g() + g() + g());
  }
  private deal(img: any, width: any, height: any) {
    // 定义默认图片压缩后的质量（0~1）
    const quality = 0.5;
    // 开始进行转换到canvas再压缩操作
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx: any = canvas.getContext('2d');
    // 画出宽度和高度决定了你复刻了多少像素
    ctx.drawImage(img, 0, 0, width, height);
    // canvas转成新的base64数据，第二个参数为保存质量
    return canvas.toDataURL('image/png', quality);
  }
  private getLocalPic() {
    return new Promise((resolve, reject) => {
      plotServer.getLocalPic().then((res: any) => {
        this.localJson = res;
      });
      resolve();
    });
  }
  private delLocalPic(ele: any) {
    const ar = [];
    for (const arr of this.localJson) {
      if (arr.id !== ele.id ) {
        ar.push(arr);
      }
    }
    this.localJson = ar;
    return new Promise((resolve, reject) => {
      plotServer.saveLocalPic(this.localJson);
      resolve();
    });
  }
}
</script>
