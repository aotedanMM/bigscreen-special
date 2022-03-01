<template>
  <div class="AccordionPop"> 
     <span
      class="showModule"
      v-show="!moduleIsShow"
      @click="changeModuleIsShow"
    ></span>
    <div class="Accordion"  v-show="moduleIsShow">
      <div class="Accordion_title">
        <span>{{title}}</span>
         <span class="closeModule" @click="changeModuleIsShow"></span>
      </div>
      <div class="Accordion_list">
        <el-scrollbar wrap-style="max-height:500px;" ref="myScrollbar">
          <ul class="Accordion_list_ul">
            <li class="Accordion_list_ul_li" v-for="(item,key) in listData" :key="key">
              <div class="Accordion_list_ul_li_title" @click="blackKeysClick(item, key)">
                <div class="Accordion_list_ul_li_title_label" :title="item.title">{{item.title}}</div>
                <div
                  class="Accordion_list_ul_li_title_txt"
                  :class="'flex' + ((Object.keys(item).includes('team') ? 1 : 0) + (Object.keys(item).includes('persoanls') ? 1 : 0))"
                >
                  <span v-if="item.team !== undefined">{{item.team}}支</span>
                  <span v-if="item.persoanls !== undefined">{{item.persoanls}}人</span>
                  <i @click.stop="isOpenFn(item, key)" :class="item.checked? 'open': 'hide'"></i>
                </div>
              </div>
              <ul class="Accordion_list_ul_li_list" v-if="activeBlackKeysIndex === key && item.checked">
                <li
                  class="Accordion_list_ul_li_list_li"
                  :class="(activeBlackKeysIndex === key && children.isActive) ? 'active' : ''"
                  v-for="(children, c) in item.children"
                  :key="c"
                  @click="whiteKeysClick(item, children, c)"
                >
                  <div
                    class="Accordion_list_ul_li_list_li_label"
                    :title="children.title"
                  >{{children.title}}</div>
                  <div
                    class="Accordion_list_ul_li_list_li_txt"
                    :class="'flex' + ((Object.keys(item).includes('team') ? 1 : 0) + (Object.keys(item).includes('persoanls') ? 1 : 0))"
                  >
                    <span v-if="children.team !== undefined">{{children.team}}支</span>
                    <!-- <span v-if="children.ff">{{children.ff}}支  </span> -->
                    <span v-if="children.persoanls !== undefined">{{children.persoanls}}人</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component({
  name: 'AccordionPop',
})
export default class AccordionPop extends Vue {
  // 标题传入
  @Prop() public title: any;
  // 对应的数据
  @Prop() public listData!: any;
  // 发送黑键(主列表)的点击事件
  @Prop() private groupClick: any;
  // 发送白键(展开的列表)的点击事件
  @Prop() private itemClick: any;

  private activeBlackKeysIndex = 0; // 活跃的黑键的index
  private moduleIsShow: boolean = true;

  // 黑键(主列表)的点击事件
  public blackKeysClick(item: any, key: any) {
    if (this.activeBlackKeysIndex === key) {
      // 如果点击的key和黑键的index相同，就啥也不做
      return false;
    }
    item.children.map((value: any, m: any) => {
      // 每次点击黑键时还原白键的状态
      value.isActive = true;
    });
    this.activeBlackKeysIndex = key; // 把点击的黑键的key赋值给活跃的index
    this.groupClick(item, key); // 把黑键的item, key传到父组件
  }
  // 白键(展开的列表)的点击事件
  public whiteKeysClick(item: any, children: any, key: any) {
    children.isActive = !children.isActive; // 白键活跃状态反选
    this.itemClick(item, children, key); // 把白键的item, children, key传到父组件
  }
  public isOpenFn(item: any, key: any) {
    const bol = item.checked;
    this.listData.map((i: any) => {
      i.checked = false;
    });
    item.checked = !bol;
    this.blackKeysClick(item, key);
  }
  // 重新推送数据后回到顶部
  public toTop() {
    (this.$refs as any).myScrollbar.wrap.scrollTop = 0;
  }
  private changeModuleIsShow() {
    this.moduleIsShow = !this.moduleIsShow;
  }

  @Watch('listData')
  private listDataWatch() {
    this.init();
  }
  private init() {
    if (this.listData.length === 0) {
      // 如果开始数据为空就啥也不做
      return;
    }
    this.activeBlackKeysIndex = 0; // 初始化黑键的活跃数据
    this.groupClick(this.listData[0], 0); // 进入模块时默认发送第一个黑键的数据
    this.toTop(); // 滚动条回到顶部
  }
  private created() {
    this.init();
  }
}
</script>

<style lang="less" scoped>
@path: '../../../../assets/img/gisModule/districtDialog'; // 定义路径
.AccordionPop {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9999;
  .showModule {
  position: absolute;
  // top: 25px;
  // left: 15px;
  background: url('@{path}/zhankaibutton.png') center top no-repeat;
  width: 44px;
  height: 54px;
  display: inline-block;
  position: absolute;
  cursor: pointer;
}
.closeModule {
  background: url('@{path}/iconClose.png') center top no-repeat;
  width: 37px;
  height: 33px;
  display: inline-block;
  position: absolute;
  cursor: pointer;
  right:17px;
  top: -12px;
}
  .Accordion {
    width: 405px;
    &_title {
      width: 100%;
      height: 100px;
      z-index: 4;
      cursor: pointer;
      color: #91f5ff;
      text-align: center;
      font-size: 36px;
      font-weight: bold;
      position: relative;
      width: 344px; 
      height: 75px;
      line-height: 75px;
      margin:25px auto 15px;
        &::before{
          content: '';
          position: absolute;
          top:-12px;
          right:-25px;
          bottom:-10px;
          left:-25px;
          background: url('@{path}/tankuangtitlebg.png') center top no-repeat;
          background-size: 100% 100%;
          z-index: -1;
          pointer-events: none;
        }
    }
    &_list {
      width: 450px;
      &_ul {
        padding:0;
        &_li {
          min-height: 100px;
          &_title {
            display: flex;
            height: 100px;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 15px;
            overflow: hidden;
            cursor: pointer;
            &_label {
              height: 100%;
              // width: 100px;
              flex: 1;
              background: rgba(8, 27, 67, 1);
              font-size: 34px;
              color: rgba(255, 255, 0, 1);
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 100px;
            }
            &_txt {
              flex-grow: 1;
              font-size: 30px;
              font-weight: bold;
              color: #fff;
              text-align: center;
              display: flex;
              padding-right:10px;
              span {
                flex: 1;
              }
              &.flex1 {
                flex: 1;
              }
              &.flex2 {
                flex: 2;
              }
              .hide{
                display: inline-block;
                width: 20px;
                height: 12px;
                background: url('@{path}/bottombgiconbg.png')no-repeat;
                background-size: 100% 100%;
                margin: 13px 10px 0 10px;
                cursor: pointer;
              }
              .open{
                display: inline-block;
                width: 20px;
                height: 12px;
                background: url('@{path}/topbgiconbg.png')no-repeat;
                background-size: 100% 100%;
                margin: 13px 10px 0 10px;
                cursor: pointer;
              }
            }
          }
          &_list {
            padding:0;
            &_li {
              height: 100px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 10px;
              background: rgba(0, 0, 0, 0.5);
              border-radius: 15px;
              overflow: hidden;
              cursor: pointer;
              &.active {
                box-shadow: 0 0 50px #f0ea11 inset;
              }
              &_label {
                // width: 100px;
                flex: 1;
                background: transparent;
                font-size: 30px;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;    padding: 0 10px;
              }
              &_txt {
                flex-grow: 1;
                font-size: 30px;
                font-weight: bold;
                color: #fff;
                text-align: center;
                display: flex;
                span {
                  flex: 1;
                }
                &.flex1 {
                  flex: 1;
                }
                &.flex2 {
                  flex: 2;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
