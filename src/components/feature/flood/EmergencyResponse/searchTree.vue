<template>
  <div class="addAttendees clearfix">
    <div class="duty-maillist-bg">
      <div class="duty-maillist">
        <p>通讯录</p>
        <div class="duty-tree">
          <div class="search_tree">
            <div class="search_slide_searchKey">
              <!-- </el-input>
              <input
                @input="changeSearchStatus"
                ref="input"
                v-model.trim="slideValue"
                type="text"
                placeholder="请输入机构名称"
              /> -->
              <el-input placeholder="请输入机构名称" v-model.trim="slideValue">
              </el-input>
            </div>
            <div class="search_slide">
              <el-scrollbar id="mainheight">
                <!-- <div v-if='searchKey' class='search-box'>                 
                    <ul>
                      <li v-foreater='(item,index) in searchResult' :key='index' @click='handleNodeClick (item,index)'  :class="{ active: index=== currentIndex }">{{item.label}}</li>
                    </ul>
                </div> -->
                <div>
                  <el-tree
                    class="address-list"
                    show-checkbox
                    :data="data"
                    accordion
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="[defaultchecked]"
                    :default-checked-keys="[defaultchecked]"
                    @node-click="handleNodeClick"
                    :filter-node-method="filterNode"
                  >
                  </el-tree>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="duty-people">
          <el-scrollbar style="height:100%;">
            <span
              v-for="(item, index) in curreOrgPeoples"
              :key="item.id"
              @click="handleClick(item, index)"
              :class="{ checked: item.checked === true }"
            >
              {{ item.personName }}
            </span>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="toComeMeeting">
      <p>已邀请 <span class="comeBack" @click="tobanck"></span></p>
      <ul class="person-list clearfix">
        <li
          v-for="(item, index) in checkList"
          :key="index"
          @click="cancelName(item, index)"
        >
          {{ item.personName }}
        </li>
      </ul>
      <div class="sure-invite"><span @click="tobanck">邀请参加</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import { emergencyResponseUserServer } from '@/api/feature/emergencyresponse/installServer';

@Component({
  name: 'EmergencyResponse',
  components: { MapCommon },
  mixins: [MapCommon],
})
export default class EmergencyResponse extends Vue {
  private defaultProps = {
    children: 'children',
    label: 'label',
  };

  private currentIndex = 0;
  private searchResult: any = [];
  private searchList = [];

  private searchKey: any = false;
  private slideValue: any = '';
  private data: any = [

  ];
  private allNodes: any = []; // 通讯录数据
  private checkList: any = []; // 通讯录选中数据
  private curreOrgPeoples: any = [];
  private defaultchecked: any = '';
  public created() {
    this.getNewDatas();
  }
  public getNewDatas() {
    emergencyResponseUserServer.getTree().then((res: any) => {
      this.data = res.data[0].children;
      this.defaultchecked = this.data[0].id;
      this.handleNodeClick(this.data[0], 0);
    });
  }
  public handleNodeClick(data: any, index?: any) {
    if (index !== 0) {
      this.defaultchecked = '';
    }
    const opts = {
      orgCode: data.id,
    };
    this.$set(this, 'curreOrgPeoples', []);
    emergencyResponseUserServer.getPeopleList(opts).then((res: any) => {
      this.curreOrgPeoples = res.data;
      if (this.checkList.length < 0) {
        for (let i = 0; i < Array.from(this.curreOrgPeoples).length; i++) {
          this.$set(this.curreOrgPeoples[i], 'checked', false);
        }
      } else {
        for (let i = 0; i < Array.from(this.checkList).length; i++) {
          for (let j = 0; j < Array.from(this.curreOrgPeoples).length; j++) {
            if (
              this.checkList[i].personId === this.curreOrgPeoples[j].personId
            ) {
              this.$set(this.curreOrgPeoples[j], 'checked', true);
            }
          }
        }
      }
    });
  }
  @Watch('slideValue')
  private watchData1(newVal: any, oldVal: any) {
    (this.$refs.tree as any).filter(newVal);
    this.handleNodeClick(this.data[0], 0);
    if (this.slideValue === '') {
      this.getNewDatas();
    }
  }
  private filterNode(value: any, data: any) {
    if (!value) { return true; }
    return data.label.indexOf(value) !== -1;
  }
  private changeSearchStatus() {
    this.searchResult = [];
    this.searchKey = false;
    if (this.slideValue !== '') {
      this.searchKey = true;
      for (let i = 0; i < Array.from(this.data).length; i++) {
        if (this.data[i].label.indexOf(this.slideValue) !== -1) {
          this.searchResult.push(this.data[i]);
        }
        if (this.data[i].children && this.data[i].children.length > 0) {
          for (let j = 0; j < Array.from(this.data[i].children).length; j++) {
            if (
              this.data[i].children[j].label.indexOf(this.slideValue) !== -1
            ) {
              this.searchResult.push(this.data[i].children[j]);
            }
          }
        }
      }
      this.handleNodeClick(this.searchResult[0]);
    }
  }
  /**
   * 邀请工作组成员
   */
  private handleClick(checkedNodes: any, idx: number) {
    this.$set(this.curreOrgPeoples[idx], 'checked', !checkedNodes.checked);
    if (checkedNodes.checked) {
      this.checkList.push(checkedNodes);
    } else {
      for (let i = 0; i < Array.from(this.checkList).length; i++) {
        if (this.checkList[i].checked === checkedNodes.checked) {
          this.checkList.splice(i, 1);
        }
      }
    }
  }

  /**
   * 取消已邀请中的成员
   */
  private cancelName(item: any, idx: number) {
    this.checkList.splice(idx, 1);
    for (let j = 0; j < Array.from(this.curreOrgPeoples).length; j++) {
      if (this.curreOrgPeoples[j].personId === item.personId) {
        this.$set(this.curreOrgPeoples[j], 'checked', false);
      }
    }
  }
  private tobanck() {
    for (let i = 0; i < Array.from(this.checkList).length; i++) {
      this.$set(this.checkList[i], 'state', 2);
    }
    this.$emit('showmeeting', this.checkList);
  }
}
</script>
<style lang="less" scoped>
@urlPath: "../../../../assets/img/emergencyResponseImg";
.addAttendees {
  .duty-maillist-bg {
    width: 681px;
    height: 771px;
    margin-top: -30px;
    margin-left: -30px;
    float: left;
    background: url("@{urlPath}/duty-maillist-img.png") no-repeat 0 0;
    .duty-maillist {
      padding: 2px 0 0 20px;
      clear: both;
      p {
        font-size: 26px;
        letter-spacing: 1px;
        color: #92edf6;
        font-family: "Microsoft Ya Hei";
      }
      .duty-tree {
        width: 380px;
        float: left;
        .duty-search {
          width: 380px;
          height: 45px;
          background: url("@{urlPath}/duty-serach.png") no-repeat 0 0;
          input {
            width: 270px;
            height: 40px;
            background: transparent;
            border: none;
            padding-left: 10px;
            line-height: 35px;
            color: #a2b9bd;
            font-size: 20px;
          }
        }
      }
      .duty-people {
        width: 234px;
        background-color: rgba(0, 0, 0, 0.2);
        border: 1px solid #92edf6;
        padding: 8px 0;
        margin-bottom: 10px;
        float: left;
        margin-top: 9px;
        height: 635px;
        color: #fff;
        span {
          display: inline-block;
          font-family: "Microsoft Ya Hei";
          font-size: 22px;
          width: 114px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin-left: 3px;
          background: url("@{urlPath}/tree-checked.png") no-repeat 0 0;
          background-size: contain;
          cursor: pointer;
        }
      }
    }
  }
  .checked {
    color: #fbee50;
  }
  .toComeMeeting {
    float: left;
    width: 337px;

    p {
      font-size: 26px;
      letter-spacing: 1px;
      color: #92edf6;
      font-family: "Microsoft Ya Hei";
      margin: 0;
      position: relative;
      span {
        position: absolute;
        display: inline-block;
        top: -56px;
        right: -20px;
        width: 57px;
        height: 57px;
        cursor: pointer;
        background: url("@{urlPath}/toback.png") no-repeat 0 0;
      }
      span:hover {
        background: url("@{urlPath}/toback-active.png") no-repeat 0 0;
      }
    }
    .person-list {
      margin: 26px auto;
      padding: 0;
      height: 580px;
      overflow: auto;
      li {
        float: left;
        list-style: none;
        width: 151px;
        height: 62px;
        line-height: 62px;
        text-align: center;
        background: url("@{urlPath}/choosed-person2.png") no-repeat 0 0;
        color: #fff;
        font-size: 24px;
        letter-spacing: 1px;
      }
    }
    .person-list li:first-child {
      margin-top: 0;
    }
    .sure-invite {
      font-size: 26px;
      letter-spacing: 1px;
      color: #92edf6;
      font-family: "Microsoft Ya Hei";
      margin: 0;
      span {
        display: inline-block;
        width: 312px;
        height: 51px;
        line-height: 51px;
        margin-left: 30px;
        text-align: center;
        cursor: pointer;
        background: url("@{urlPath}/come-meeting.png") no-repeat 0 0;
      }
      span:hover {
        background: url("@{urlPath}/hover-meeting.png") no-repeat 0 0;
      }
    }
  }
}
.search_tree {
  position: relative;
  height: 90%;
  box-sizing: border-box;
}

.tabs_list {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-sizing: border-box;
  z-index: 122;
  padding: 0.625rem 4px;
  padding-top: 0;
  margin-top: 0.5rem;
  position: absolute;
  height: 16.5rem;
  width: 100%;

  .filter_list {
    li {
      cursor: pointer;
      color: #000;
      font-size: 16px;
      padding: 0.625rem 1rem;
      line-height: 1rem;
      &:hover {
        background: #66b1ff;
        color: #fff;
      }

      &.active {
        background: #66b1ff;
        color: #fff;
      }
    }
  }
  .filter_list_content {
    display: inline-block;
    line-height: 18px;
  }
}

.search_slide_searchKey {
  width: 376px;
  height: 56px;
  background: url(../../../../assets/img/nav/searchIcons.png) left center
    no-repeat;
  background-size: 100% 100%;
  border-top: 1px;
  margin-left: -8px;
  input {
    width: 310px;
    height: 56px;
    background: transparent;
    border: none;
    padding-left: 18px;
    line-height: 35px;
    font-size: 22px;
    color: #ffffff;
    outline: none;
  }
  // span.serach-icon {
  //   display: inline-block;
  //   height: 41px;
  //   width: 34px;
  //   background: url(../../../../assets/img/nav/searchIcon.png) no-repeat 50% 50%;
  //   cursor: pointer;
  //   vertical-align: middle;
  // }
}

.search_slide {
  position: relative;
  transition: all 0.5s;
  height: 100%;
  z-index: 11;
  width: 360px;
  height: 593px;
  border-radius: 4px;
  padding: 5px 0;
  background: linear-gradient(
    0deg,
    rgba(97, 126, 157, 0.52941176) 0%,
    rgba(93, 116, 150, 0.54117647) 100%
  ) !important;
  border: 1px solid rgba(109, 236, 233, 0.26);

  .controllab {
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
  }
  .search-box {
    height: 693px;
    overflow: auto;

    ul {
      padding: 0;
      list-style: none;
      margin: 0;
      li {
        width: 338px;
        height: 62px;
        line-height: 62px;
        padding-left: 20px;
        line-height: 62px;
        background-color: rgba(118, 242, 251, 0.17);
        font-family: "Microsoft Ya Hei";
        font-size: 26px;
        color: #f8feff;
        border-bottom: 1px solid rgba(109, 236, 233, 0.26);
      }
      li.active {
        background-color: #354042;
        border: 1px solid #fef551;
        color: #f8feff;
      }
    }
  }
}

.popper__arrow {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 6px;
  -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  top: 2.5rem;
  left: 50%;
  margin-right: 3px;
  border-top-width: 0;
  border-bottom-color: #ebeef5;
  z-index: 100;

  &:after {
    content: "";
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #fff;
  }
}

.headertitle {
  background: #f5f5f6;
  padding-left: 30px;
  line-height: 2.1rem;
  font-size: 1rem;
  cursor: pointer;
}
.navtitle {
  background: #fff;
  // border-bottom: 1px solid rgb(228, 231, 237)
}

.tree_icon {
  color: #c0c4cc;
  font-size: 18px;
  padding: 6px;
}
.headerdrops {
  margin-left: 1.6rem;
  margin-bottom: 3px;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c0c4cc;
}
</style>
