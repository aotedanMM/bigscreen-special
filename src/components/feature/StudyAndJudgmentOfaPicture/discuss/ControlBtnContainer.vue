<template>
  <div class="ControlBtnContainer">
    <!-- 之所以又嵌套一层div是因为不想直接在根节点下操作，给这个组件的变动留有余地 -->
    <div class="ControlBtnContainer-btnContainer">
      <div v-for="(item) of curCompParam.componentParam.btnList" 
          :key="item.key"
          class="ControlBtnContainer-btnContainer-item">
        <!-- 把三个按钮做成组件，是为了以后扩展用，因为现在不知道具体的需求和以后的可能走向 -->
        <component 
                   :is="item.componetName" 
                   :compParam="item"
                   :handleClick="handleClick">
                   <!--这个地方用插槽是因为，组件内部的样式都是一样的，不想写重复代码
                        这里将是否使用插槽作了配置，以便适应扩展
                     -->
          <template v-if="item.isUseNameSlot" v-slot:nameContainer="slotProps">
            <div class="btnContainer" :class=" slotProps.isChecked ? 'btnContainer-active' : ''">
              <div v-for="(nameLine,nameIndex) of slotProps.nameArr" 
                   :key="nameIndex"
                   class="name-line">
                  {{nameLine.textVal}}
              </div>
            </div>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import HlypBtnContainer from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/HlypBtnContainer.vue'; // 河流研判按钮
import XzqhypBtnContainer from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/XzqhypBtnContainer.vue'; // 行政区划研判按钮
import HcqypBtnContainer from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/HcqypBtnContainer.vue'; // 缓冲区研判按钮
@Component({
    name: 'ControlBtnContainer',
    components: {
      HlypBtnContainer, // 河流研判按钮
      XzqhypBtnContainer, // 行政区划研判按钮
      HcqypBtnContainer, // 缓冲区研判按钮
    },
})
export default class ControlBtnContainer extends Vue  {
  @Prop() private compParam: any;

  private curCompParam: any = {};

  @Watch('compParam')
  private updateCompParam(val: any) {
    this.curCompParam = JSON.parse(JSON.stringify(val));
  }

  // 处理子组件的点击事件，主要是高亮
  private handleClick(childObj: any) {
    const tempArr: any = [];
    switch (childObj.name) {
      case '河流研判':
      case '缓冲区研判':
      this.$store.commit('eventPushStore/changeChecked', 'no_district');
      break;
      default:
        break;
    }
    this.curCompParam.componentParam.btnList.forEach( (item: any, index: number) => {
      const obj = JSON.parse(JSON.stringify(item));
      obj.isChecked = (item.key === childObj.key) ? childObj.isChecked : false;
      tempArr.push(obj);
    });
    this.curCompParam.componentParam.btnList = tempArr;
  }
  private created() {
    this.updateCompParam(this.compParam);
  }
}
</script>
<style lang="less" scoped>
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
.ControlBtnContainer{
  width: 100%;
  height: 100%;

  &-btnContainer{
    width: 100%;
    height: 100%;
    display: flex;
    color: #ffffff;
    // justify-content: space-between;
    flex-wrap: nowrap;

    &-item{
      // width: 114px;
      width: 50%;
      height: 64px;
    }
  }

  .btnContainer{
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: url("../../../../assets/img/discuss/btn.png") no-repeat center;
    background-size: 132px 80px;

    .name-line{
      text-align: center;
      color: #bbd0dc;
      font-size: 24px;
    }

    &:hover,
    &-active{
      background: url("../../../../assets/img/discuss/btn-hover.png") no-repeat center;
      background-size: 128px 76px;
      .name-line{
        color: #fcf280;
      }
    }
  }

  .nameLayout{
    width: 100%;
    height: 100%;
  }
}
</style>
