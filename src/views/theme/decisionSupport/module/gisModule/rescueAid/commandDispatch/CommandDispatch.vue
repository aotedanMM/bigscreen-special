<template>
  <div id="RightPlane">
    <div class="RightPlane_content">
      <div class="RightPlane_content_title">
        <h2 class="RightPlane_content_title_content">
          指挥调度<span class="RightPlane_content_title_subtitle"
            >设备总数：<i>{{ equipment }}</i
            >个</span>
        </h2>
      </div>
      <div class="RightPlane_content_main">
        <div class="RightPlane_content_main_left">
          <div
            class="RightPlane_content_main_left_bottonBox"
            v-for="(item, index) in TestData.buttonData"
            :key="index"
            @click="FnToRight(item.bottonArr, item.bottonTitle)"
          >
            <div class="RightPlane_content_main_left_bottonBox_botton">
              {{ item.buttonName }}{{ item.number }}
            </div>
          </div>
        </div>
        <command-dispatch-right-box
          :data="toRightData"
          :title="toRightTitle"
        ></command-dispatch-right-box>
      </div>
      <div class="RightPlane_content_line"></div>
      <div class="RightPlane_content_mainBottom">
        <div class="RightPlane_content_mainBottom_title">
          <div class="RightPlane_content_mainBottom_title_latest_news_title">
            北斗终端最新短报文
          </div>
          <div class="RightPlane_content_mainBottom_title_latest_news_switch">
            <span
              @click="FnRightLeft(0)"
              class="RightPlane_content_mainBottom_title_latest_news_switch_left leftIcon_bg"
              style="z-indx:999;"
            ></span>
            <span
              class="RightPlane_content_mainBottom_title_latest_news_switch-num"
              ><em id="switch-leftNum">{{ at }}</em
              >/<em id="switch-rightNum">{{ newNum }}</em>
            </span>
            <span
              @click="FnRightLeft(1)"
              class="RightPlane_content_mainBottom_title_latest_news_switch_right rightIcon_bg"
            ></span>
          </div>
        </div>
        <div class="RightPlane_content_box">
          <div class="RightPlane_content_box_latest_news_connent-box">
            <el-scrollbar style="height:100%">
              <ul class="RightPlane_content_box_latest_news_connent-box_ul">
                <div style="font-size:20px;color:#fff;">
                  {{ TestData.new[at - 1].data }}
                </div>
                <div
                  style="line-height:280px;text-align:center;font-size:24px;color:#fff"
                  v-if="newFlag"
                >
                  暂无数据
                </div>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CommandDispatchRightBox from './CommandDispatchRightBox.vue';

@Component({
  name: 'CommandDispatch',
  components: {
    CommandDispatchRightBox,
  },
})
export default class CommandDispatch extends Vue {
  private toRightData: any = [];
  private toRightTitle: any = [];
  private newNum: any = 0;
  private at: any = 1;
  private equipment: any = 0;
  private newFlag: any = true;
  private TestData: any = {
    buttonData: [
      {
        buttonName: '北斗终端',
        bottonTitle: ['卡号', '名称', '事发距离'],
        bottonArr: [
          {
            card: '20239',
            name: '资源调度',
            localtion: '23234.234234',
          },
          {
            card: '20239',
            name: '资源调度',
            localtion: '23234.234234',
          },
        ],
      },
      {
        buttonName: '天通终端',
        bottonTitle: ['卡号', '持有人', '事发地距离', '手机号'],
        bottonArr: [
          {
            card: '20239',
            name: '资源调度',
            localtion: '23234.234234',
            phone: '15585412300',
          },
          {
            card: '20239',
            name: '资源调度',
            localtion: '23234.234234',
            phone: '15585412300',
          },
        ],
      },
      {
        buttonName: '视频回传',
        bottonTitle: ['用户名', '事发地距离', '查看'],
        bottonArr: [
          {
            user: '20239',
            localtion: '23234.234234',
            url: 'http://www.baidu.com',
          },
          {
            card: '20239',
            localtion: '23234.234234',
            url: 'http://www.baidu.com',
          },
        ],
      },
      {
        buttonName: '短波台',
        number: '4',
        bottonTitle: ['用户名', '时间', '事发地距离', '查看'],
        bottonArr: [
          {
            id: '20239',
            time: '2019-05-03 12:00',
            localtion: '23234.234234',
            url: 'http://www.baidu.com',
          },
          {
            id: '20239',
            time: '2019-05-03 12:00',
            localtion: '23234.234234',
            url: 'http://www.baidu.com',
          },
        ],
      },
      {
        buttonName: '消防车辆',
        bottonTitle: ['车牌号', '事发地距离'],
        number: '13',
        bottonArr: [
          {
            licensePlateNumber: '京A20239',
            localtion: '23234.234234',
          },
          {
            licensePlateNumber: '京A20239',
            localtion: '23234.234234',
          },
        ],
      },
      {
        buttonName: '消防移动终端',
        bottonTitle: ['姓名', '事发地距离'],
        number: '17',
        bottonArr: [
          {
            name: '周某某',
            localtion: '23234.234234',
          },
          {
            name: '周某某',
            localtion: '23234.234234',
          },
        ],
      },
    ],
    new: [
      {
        data:
          '由于其工作的特殊性以及背后巨大的流量，就连圈里的许多一线明星都纷纷现身李佳琦直播间，或是宣传作品或是一同带货，高晓松、胡歌、刘涛、奚梦瑶、小S等等，这些圈里有头有脸的明星艺人纷纷出现在李佳琦的直播间，这种明星借着网红的光的现象在以前那都是想都不敢想的，但这些事却偏偏发生在了李佳琦的身上。',
      },
      {
        data:
          '中新经纬客户端12月24日电 12月23日，在全国住房和城乡建设工作会议上，住建部对明年楼市调控再次提出“稳地价、稳房价、稳预期”的目标，并重申“房住不炒”的定位不变。值得注意的是，此次会议新闻通稿中连续提了20次“稳”字，坚定调控决心一目了然。专家称，2020年房地产调控将坚持稳为主题。',
      },
      {
        data:
          '由于其工作的特殊性以及背后巨大的流量，就连圈里的许多一线明星都纷纷现身李佳琦直播间，或是宣传作品或是一同带货，高晓松、胡歌、刘涛、奚梦瑶、小S等等，这些圈里有头有脸的明星艺人纷纷出现在李佳琦的直播间，这种明星借着网红的光的现象在以前那都是想都不敢想的，但这些事却偏偏发生在了李佳琦的身上。',
      },
      {
        data:
          '由于其工作的特殊性asd以及背后巨大的流量，就连圈里的许多一线明星都纷纷现身李佳琦直播间，或是宣传作品或是一同带货，高晓松、胡歌、刘涛、奚梦瑶、小S等等，这些圈里有头有脸的明星艺人纷纷出现在李佳琦的直播间，这种明星借着网红的光的现象在以前那都是想都不敢想的，但这些事却偏偏发生在了李佳琦的身上。',
      },
      {
        data:
          '由于其工作的特殊性以及背后巨asdf大的流量，就连圈里的许多一线明星都纷纷现身李佳琦直播间，或是宣传作品或是一同带货，高晓松、胡歌、刘涛、奚梦瑶、小S等等，这些圈里有头有脸的明星艺人纷纷出现在李佳琦的直播间，这种明星借着网红的光的现象在以前那都是想都不敢想的，但这些事却偏偏发生在了李佳琦的身上。',
      },
      {
        data:
          '由于其工作adsf的特殊性以及背后巨大的流量，就连圈里的许多一线明星都纷纷现身李佳琦直播间，或是宣传作品或是一同带货，高晓松、胡歌、刘涛、奚梦瑶、小S等等，这些圈里有头有脸的明星艺人纷纷出现在李佳琦的直播间，这种明星借着网红的光的现象在以前那都是想都不敢想的，但这些事却偏偏发生在了李佳琦的身上。',
      },
    ],
  };
  @Watch('TestData')
  private FnInit(): void {
    this.newFlag = false;
    // let num = 0;
    // for (const iterator of this.TestData.buttonData) {
    //   if (iterator.number !== undefined) {
    //     num = num + Number(iterator.number);
    //   }
    // }
    // this.equipment = num;
    // console.log('当前一共有多少设备：', this.equipment);
  }
  private FnRightLeft(val: any): void {
    // let num = this.TestData.new.length;
    console.log('是否进方法');
    switch (val) {
      case 0:
        if (this.at > 1 && this.at <= this.newNum) {
          this.at = this.at - 1;
        } else if (this.at <= 1) {
          this.at = this.newNum;
        }
        console.log('当前 at 和 newNum 的值：', this.at, this.newNum);
        break;
      case 1:
        if (this.at >= 1 && this.at < this.newNum) {
          this.at = this.at + 1;
        } else if (this.at === this.newNum) {
          this.at = 1;
        }
        console.log('当前 at 和 newNum 的值：', this.at, this.newNum);
        break;
    }
  }
  private FnToRight(arr: any, tit: any): void {
    this.toRightData = arr;
    this.toRightTitle = tit;
  }

  private created() {
    this.newNum = this.TestData.new.length;
    console.log('当前新闻数组的值：', this.TestData.new.length);

    // 动态数据 对接完删除 替换监听
    let num = 0;
    for (const iterator of this.TestData.buttonData) {
      if (iterator.number !== undefined) {
        num = num + Number(iterator.number);
      }
    }
    this.equipment = num;
    console.log('当前一共有多少设备：', this.equipment);
    // 动态数据 对接完删除 替换监听
  }
}
</script>

<style lang="less" scoped>
@path: '../../../../../../../assets/img/CommandDispatch'; // 定义路径
#RightPlane {
  background: url('@{path}/list_bg.png') no-repeat;
  background-size: 100% 100%;
  right: 10px;
  top: 0px;
  width: 1018px;
  height: 980px;
  z-index: 3;
  position: absolute;
}
.RightPlane_content {
  width: 985px;
  height: 900px;
  margin-top: 30px;
  margin-left: 20px;
  position: relative;
}
.RightPlane_content_title {
  display: flex;
  justify-content: flex-start;
  padding-right: 30px;
}
.RightPlane_content_title_content {
  font-size: 30px;
  color: #fda100;
  font-weight: bold;
}
.RightPlane_content_title_subtitle {
  font-size: 24px;
  color: #afd5d7;
  padding-left: 10px;
  font-weight: normal;
}
.RightPlane_content_main {
  clear: both;
  display: flex;
  justify-content: space-between;
  height: 50%;
  padding-top: 20px;
}
.RightPlane_content_main_left {
  width: 182px;
  height: 100%;
}
.RightPlane_content_main_left_bottonBox {
  width: 182px;
  position: relative;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}
.RightPlane_content_main_left_bottonBox_botton {
  background: url('@{path}/button_01.png') no-repeat;
  background-size: 100% 100%;
  width: 182px;
  height: 60px;
  text-align: center;
  line-height: 52px;
}
.RightPlane_content_main_right {
  width: calc(100% - 210px);
  height: 92%;
  border: 1px solid transparent;
  border-color: rgba(0, 246, 255, 0.26);
}
.RightPlane_content_main_right span {
  color: #fff;
  font-size: 26px;
  display: inline-block;
  line-height: 54px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 54px;
  background-color: #1f3179;
}
.RightPlane_content_main_right ol {
  height: 54px;
  width: 100%;
  list-style: none;
  padding-left: 0;
}
.RightPlane_content_main_right_tab_card_num_01 {
  width: 30%;
}
.RightPlane_content_main_right_tab_holder_01 {
  width: 33%;
}
.RightPlane_content_main_right_tab_disyance_form_01 {
  width: 35%;
}
.RightPlane_content_main_tab_bottom {
  width: 100%;
  overflow-y: auto;
  height: calc(100% - 54px);
  list-style: none;
  padding-left: 0;
}
.RightPlane_content_main_noData {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.RightPlane_content_line {
  height: 5%;
  width: 100%;
  background: url('@{path}/llight_bg.png') no-repeat;
  background-size: 100% 100%;
}
.RightPlane_content_title_subtitle i {
  font-size: 26px;
  color: #fda100;
  font-weight: bold;
  font-style: normal;
  font-family: 'Impact';
}
.RightPlane_content_mainBottom {
  width: 100%;
  height: calc(50% - 170px);
}
.RightPlane_content_mainBottom_title {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  color: #fff;
}
.RightPlane_content_mainBottom_title_latest_news_title {
  width: 30%;
  height: 50px;
  line-height: 50px;
  font-size: 28px;
  text-indent: 1.5rem;
  color: #fff;
}
.RightPlane_content_mainBottom_title_latest_news_switch span {
  display: inline-block;
  text-align: center;
  font-size: 30px;
  color: #b6cfd5;
  line-height: 30px;
  font-weight: 600;
}
.leftIcon_bg {
  width: 60px;
  height: 30px;
  background: url('@{path}/leftIcon.png') no-repeat;
  background-size: 100% 100%;
  // pointer-events: none;
}
.RightPlane_content_mainBottom_title_latest_news_switch-num {
  margin: 0 14px;
}
.rightIcon_bg {
  width: 60px;
  height: 30px;
  background: url('@{path}/rightIcon.png') no-repeat;
  background-size: 100% 100%;
  // pointer-events: none;
}
.RightPlane_content_box {
  width: 99%;
  height: calc(100% - 50px);
  background: url('@{path}/bg.png') center center;
  background-size: 100% 100%;
  padding: 20px 3px;
}
.RightPlane_content_box_latest_news_connent-box {
  width: 100%;
  height: 100%;
  .el-scrollbar__wrap {
    margin-right: -34px;
  }
}
.RightPlane_content_box_latest_news_connent-box_ul {
  width: 100%;
  height: 100%;
  // overflow-y: scroll;
  list-style: none;
}
</style>
