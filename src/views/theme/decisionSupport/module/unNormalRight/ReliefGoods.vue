<!--非常态右侧-救援物资-->
<template>
    <div class="container">
        <el-scrollbar class="cmp-scrollbar-y" style="height:100%" v-loading="panel">
            <ul class="ulContainer">
                <li
                    class="liContainer"
                    @click="changeImgIsShow(item, index + 1)"
                    v-for="(item, index) in list"
                    :key="index"
                    :class="index + 1 === activeLight?'active':''"
                >
                    <span class="liContent" :title="item.name">{{item.name}}</span>
                </li>
            </ul>
        </el-scrollbar>
        <div class="imgBox" v-show="imgIsShow">
            <i class="el-icon-close close" @click="changeImgIsShow"></i>
            <img src="@/assets/img/unNormal/helpPower_img.png" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IDisposalAdvice } from '@/interface/feature/earthquake/DisposalAdvice.interface';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { rescueSuppliesServer } from '@/api/installServer.ts';
@Component({
  name: 'DisposalSuggestion',
})
export default class DisposalSuggestion extends Vue {
  public list: any = [];
  private panel = false;
  private imgIsShow: boolean = false;
  private activeLight = 0;
  private component: any = 0;
  private popUpTemplate: any;
  private changeImgIsShow(item: any, index: number) {
    this.getComponent().clearOneLayer('ANJIAN_REPERTORY※01');
    if (this.activeLight === index) {
      this.activeLight = 0;
    } else {
      this.activeLight = index;
      this.getComponent().addPointsOnMap(item, 'ANJIAN_REPERTORY※01'); // ANJIAN_REPERTORY※01
    }
    // this.getComponent().openPopup('listClick' , item.id);

  }
  private getData() {
    // 救援物资列表
    this.panel = true;
    const opts4 = { point: [116.35, 39.87] };
    rescueSuppliesServer
      .getRescueSuppliesList(opts4)
      .then((data: any) => {
        this.list = data.list[0].data;
        this.panel = false;
      })
      .catch(() => {
        this.panel = false;
      });
  }

  private mounted() {
    this.getData();
    this.getComponent().load();

  // add popUp start ，弹出层引用
    const param = {
      that: this,
      popupId: 'ReposityPopup', // 监听id，必须
      moduleTypeID: 'ANJIAN_REPERTORY※01', // 实体类资源模块id，必须
      // getComponenContext: this.getComponent(),
    };
    this.popUpTemplate = new renderpopUpTemplate();
    this.popUpTemplate.getParams(param);
    this.getComponent().on('ReposityPopup', (event: any) => {
      this.popUpTemplate.onShowPopup(event);
      });
      // add popUp end


  }

// 联动gis方法 开始
  /* private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.disasterJudgeFactory.getComponent('disasterJudgeResource');
    }
    return component;
  } */
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('listClick');
    return component;
  }
  private beforeDestroy() {
    //  清除地图
    (console as any).log('清除弹窗', this.getComponent().unload);
    this.getComponent().unload();
  }
}
</script>
<style lang="less">
.el-loading-mask  {
  background-color: transparent !important;
}
</style>
<style lang="less" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.container {
  height: 100%;
  position: relative;
  padding: 15px;
  padding-right: 0;
  .imgBox {
    width: 1000px;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 99;
    background: #fff;
    .close {
      font-size: 28px;
      font-weight: bold;
      position: absolute;
      top: 40px;
      right: 40px;
      cursor: pointer;
    }
  }
  .command-btn {
    cursor: pointer;
    width: 65px;
    height: 25px;
    border: 1px solid #02fff6;
    border-radius: 10px;
    position: absolute;
    top: -29px;
    right: 25px;
  }

  .btn-on:before,
  .btn-off:before {
    content: '';
    display: inline-block;
    position: absolute;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    background: #02fff6;
  }

  .btn-on {
    &:before {
      left: -1px;
      top: -1px;
    }
  }

  .btn-off {
    &:before {
      right: -1px;
      top: -1px;
    }
  }

  .ulContainer {
    height: 100%;
    .liContainer {
      padding-left: 15px;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: flex-start;
      align-content: center;
      align-items: center;
      cursor: pointer;
      &:nth-child(2n - 1) {
        background-image: url('../../../../../assets/img/gisModule/list_Material_bg.png');
        background-size: 100% 100%;
      }
      &.active {
        background-image: url('../../../../../assets/img/gisModule/yujing_active.png');
        background-size: 100% 100%;
      }
      .circle-dot {
        width: 18px;
        height: 18px;
        // background: url('../../../../../assets/img/disposalAdvice/dot.png') no-repeat;
        margin-right: 10px;
      }

      .liContent {
        height: 60px;
        line-height: 60px;
        font-size: 26px;
        color: #bdebef;
        cursor: pointer;
        max-width: calc(100% - 42px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .ulNoData {
      padding-top: 10%;
      font-size: 26px;
      color: #bdebef;
      text-align: center;
    }
  }
}
.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
  // margin-right: -18px !important;
}
</style>
