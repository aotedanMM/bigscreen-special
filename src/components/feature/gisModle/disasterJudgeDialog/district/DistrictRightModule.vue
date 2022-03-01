<template>
  <div class="DistrictRightModule popupPanelRight_bg ">
    <h1 class="list_title">住宅区</h1>
    <p class="list_search">
      <input type="text" v-model="searchValue"><button @click="search">搜索</button>
    </p>
    <ol class="list_head"> 
      <li style="width:35%">名称</li> 
      <li style="width:25%">地址</li> 
      <li style="width:15%">联系人</li> 
      <li style="width:25%">电话</li> 
    </ol>
    <div class="list_body">
      <ul id="item.id" v-for="(item, index) in addressData" :key="index">
        <li title="item.name" style="width: 35%;">{{item.name}}</li>
        <li title="item.address" style="width: 25%;">{{item.address}}</li>
        <li title="item.contact" style="width: 20%;">{{item.contact}}</li>
        <li title="item.telephone" style="width: 20%;">{{item.telephone}}</li>
      </ul>
    </div>  
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
// import $ from 'jquery'
@Component({
  name: 'DistrictRightModule',
})
export default class DistrictRightModule extends Vue {
  @Prop() private  addressData!: object;
  private searchValue: string = '';
  private search() {
    this.$emit('updateAddrData', this.searchValue);
  }
}

</script>
<style lang="less" scoped>
    @path: '../../../../../assets/img/gisModule/districtDialog'; // 定义路径
    .DistrictRightModule{
      height: 100%;
      width: 100%;
      // background: url('@{path}/team_bg.png') no-repeat;
      background-size: 100% 100%;
      padding: 40px 45px;
      .list_title {
        font-size: 30px;
        padding-left: 10px;
        cursor: move;
        height: 64px;
        line-height: 80px;
        color: #fda100;
      }
      .list_search {
        display: flex;
        margin-bottom: 10px;
        input {
          -webkit-appearance: none;
          background: rgba(1,11,24,0.26);
          background-image: none;
          border-radius: 4px;
          box-sizing: border-box;
          color: #fff;
          display: inline-block;
          font-size: inherit;
          height: 39px;
          line-height: 39px;
          outline: none;
          padding: 0 2px;
          width: 50%;
          margin-right: 20px;
          border: 1px solid #2bf6fd;
        }
        button {
          height: 39px;
          line-height: 43px;
          width: 100px;
          border: none;
          background: rgba(0,227,255,0.6);
          color: #fff;
          border-radius: 3px;
          font-size: 22px;
        }
      }
      .list_head {
        background: url('@{path}/team_th.png') no-repeat;
        background-size: 100% 100%;
        font-weight: 600;
        width: calc(100% - 8px);
        padding: 4px 20px;
        font-size: 26px;
        text-align: center;
        display: flex;
        justify-content: space-between;
        li {
          list-style: none;
        }
      }
      .list_body {
        overflow: auto;
        height: 78%;
        ul {
          display: flex;
          padding: 0px 20px;
          font-size: 26px;
          cursor: pointer;
          line-height: 45px;
          &:first-child {
            margin-top: 10px;
          }
          li {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            text-align: left;
            text-align: center;
          }
        }
      }
    }
</style>
