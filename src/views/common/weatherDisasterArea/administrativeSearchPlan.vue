<template>
  <div id="administrativeSearchPlan" style="position:relative;">
    <div class="inputStyle">
      <div class="inputStyle_currentCity">当前位置：<span class="inputStyle_currentCity_city">{{currentCity}}</span></div>
      <div class="inputStyle-ipt">
        <el-input placeholder="请输入内容"
                size="mini"
                prefix-icon="el-icon-search"
                v-model="searchWord"
                  @input="FnCursor('input')"
                  @blur="FnCursor('blur')"
                 @focus="FnCursor('focus')" class="el-input--weather"></el-input></div>
    </div>
    <div v-show="!cursor && searchWord && isShowSearchWordTip" class="searchWordTip">
      <ul>
        <li v-for="item in searchWordTipList" @click="FnClickCode(item)" ><span @click="closeSearchWordTip(item.name)">{{item.name}}</span></li>
      </ul>
    </div>
    <div v-show="cursor" class="inputStyle-cnt" @mouseleave="FnCursor('close')">
      <div @click="FnCursor('close')" class="searchWord">×</div>
      <div v-show="searchWord !== ''" class="searchWord">
        <div
          v-for="(items,index) in tableData"
          :key="index + items"
          @click="FnClickCode(items)"
        >{{items.name}}</div>
      </div>
      <div v-show="searchWord === ''" >
        <div class="hotCityTitle">
          <span
            v-for="(item,index) in SearchIndex"
            :key="index + item"
            class="hotCityTitle_box"
            @click="FnClickHotCity(item)"
          >{{item}}</span>
        </div>
        <div class="hotCityTitle_city">
          <el-scrollbar style="height:100%;">
            <el-button type="text" size="mini"
              v-for="(item,index) in tableData"
              :key="index + item"
              @click="FnClickCode(item)"
            >{{item.name}}</el-button>

          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { weatherServer } from '@/api/installServer.ts';

@Component({
  name: 'administrativeSearchPlan',
  components: {},
})
export default class AdministrativeSearchPlan extends Vue {
  @Prop() private FnClickCode: any;
  @Prop({default: '110000'}) private currentPosition: any;
  private currentCity: any = '北京市';
  private cursor: any = false;
  private administrative: any = [];
  private searchWordTipList: any = [];
  private searchWord: any = '';
  private isShowSearchWordTip: any = true;
  private tableData: any = [];
  // fnCursorNum用来判断搜索框的开关
  private fnCursorNum: number = 0;
  private SearchIndex: any = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'S',
    'Y',
    'Z',
  ];
  private HotCityArr = [
    '北京市',
    '重庆市',
    '长春市',
    '广州市',
    '厦门市',
    '上海市',
    '天津市',
    '珠海市',
  ];

  private FnCursor(type: string): void {
    this.FnWatchSearchWord();
    if (type === 'close') {
      this.cursor = false;
      this.fnCursorNum = 0;
    }
    if (type === 'focus') {
      this.fnCursorNum ++;
      if (this.fnCursorNum % 2 !== 0 && !this.cursor) {
        this.cursor = true;
      }
    }
    if (type === 'blur') {
      if (this.fnCursorNum % 2 === 0 && this.cursor) {
        this.cursor = false;
        this.fnCursorNum = 0;
      }
    }
    if (type === 'input') {
      this.cursor = false;
      this.isShowSearchWordTip = true;
      this.fnCursorNum = 0;
      this.searchFn(this.administrative, this.searchWord);
      if (this.searchWord === '') {
        this.cursor = true;
      }
    }
  }
  private searchFn(list: any, keyWord: any) {
    const arr = [];
    for (const i of list) {
      if (i.name.indexOf(keyWord) >= 0) {
        arr.push(i);
      }
    }
    this.searchWordTipList = arr;
    return this.searchWordTipList;
  }
  private closeSearchWordTip(val: any) {
    this.cursor = false;
    this.isShowSearchWordTip = false;
    // this.searchWord = val
  }
  private FnGetAdministrative(): void {
    weatherServer.getAdministrative().then((data: any) => {
      this.administrative = data.data;
      this.FnHotCityInit();
    });
  }
  private FnClickHotCity(val: any): void {
    this.tableData = [];
    for (const iterator of this.administrative) {
      if (iterator.letter === val) {
        this.tableData.push(iterator);
      }
    }
  }
  @Watch('currentPosition')
  private FnCurrentPosition(): void {
    for (const iterator of this.administrative) {
      if (this.currentPosition.parentId === '100000') {
        this.currentCity =  this.currentPosition.name;
      } else if (iterator.id === this.currentPosition.parentId) {
        this.currentCity = iterator.name;
      }
    }
  }
  @Watch('searchWord')
  private FnWatchSearchWord(): void {
    if (this.searchWord === '') {
      this.FnHotCityInit();
    } else {
      this.FnSearchTableData();
    }
  }
  private FnHotCityInit(): void {
    this.tableData = [];
    for (const iterator of this.HotCityArr) {
      for (const cityClass of this.administrative) {
        if (cityClass.name === iterator) {
          this.tableData.push(cityClass);
        }
      }
    }
  }
  private FnSearchTableData(): void {
    this.tableData = [];
    for (const iterator of this.administrative) {
      if (iterator.name === this.searchWord) {
        this.tableData.push(iterator);
      }
    }
  }
  private created() {
    this.FnGetAdministrative();
    this.FnCurrentPosition();
  }
}
</script>
<style lang="less">
.inputStyle-ipt{
    .el-input--weather .el-input__inner{
    background-color: rgba(12,50,72,.5);
    border-color:#257bb8;
    outline: none;
    font-size:16px;
    &:hover{
      border-color:#73fdff;
      outline:none;
    }
  }
}
</style>
<style lang="less" scoped>
.inputStyle_currentCity{
color:
#fbbd47;
font-size: 18px;
font-weight: 800;
margin: 0;

}
.inputStyle{
  display: flex;
  justify-content: flex-start;
}
.searchWordTip{
  width: 317px;
  background-color: #020f2a;
  padding: 10px;
  right: 0;
  border: 1px solid #257bb8;
  position: absolute;
  left: 200px;
  ul{
    li{
      height: 30px;
      line-height: 30px;
      color: #fff;
      border-bottom: 1px solid #cccccc;
      text-align: center;
      cursor: pointer;
    }
    li:hover{
      background: #ffffff;
      color: #50c6fc;
    }
    li:nth-last-child(1){
      border-bottom: none;
    }
  }
}
.hotCityTitle {
  // display: flex;
  // justify-content: flex-start;
    // text-align: center;
  span{
    display: inline-block;
    padding:3px 5px;
    text-align: center;
    font-size:16px;
    cursor:pointer;
    width:14px;
    &:hover{
      color:#fbbd47;
    }
  }
}
.hotCityTitle_box {
  color: #fff;
}
.searchWord {
  color: #fff;
  font-size: 24px;
  line-height: 1;
  position:absolute;
  top:0px;
  right:0px;
  cursor:pointer;
}
.inputStyle-cnt{
  position: absolute;
 background-color: rgba(2,15,42,1);
 padding:10px;
 right:0;
 border:1px solid #257bb8;
}
.inputStyle_currentCity_city{
  display: inline-block;
  white-space: nowrap;
  min-width: 80px;
}
.hotCityTitle_city{
  text-indent: 10px;
  margin:3px -8px;
    height:150px;
    border-top: 1px solid rgba(255,255,255,.1);
  .el-button{
    font-size:16px;
  }


}
</style>
