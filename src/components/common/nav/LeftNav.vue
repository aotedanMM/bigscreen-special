<template>
  <div class="left-nav">
    <left-nav-rendless defaultNav="0">
      <div slot-scope="{curNav, defaultList0, defaultList1, navList, selectMenu}">
        <el-menu
          :default-active="curNav"
          :unique-opened="true"
          class="left-height-parent"
          @select="selectMenu"
        >
          <el-menu-item
            v-for="(item, index) in navList"
            :index="index + ''"
            :key="item.id"
            :id="item.id"
          >
            <i :class="item.class">
              <div class="animate-cover" />
            </i>
            <div class="menuWrap" :class="item.childClass">
              <template  v-if="curNav===index">
                 <div
                  class="menu"
                  v-for="(menu, mindex) in item.children"
                  :key="mindex"
                  :class="{disabled: menu.isDisabled, active: curPath === menu.path}"
                  @click="showPage(menu)"
                >{{menu.name}}</div>
              </template>           
          </div>
          </el-menu-item>
        </el-menu>
        
      </div>
    </left-nav-rendless>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
// import LeftNavRendless from '@/components/common/rander/LeftNavRendless.vue';
import LeftNavRendless from '@/components/common/rander/LeftNavRendless.vue';
import { IMenu } from '@/interface/feature/common/leftNav/LeftNav.interface.ts';

@Component({
  name: 'LeftNav',
  components: {
    LeftNavRendless,
  },
})
export default class LeftNav extends Vue {
  private curPath: string = '/typhoon';
  private timer: any;
  public showPage(curMenu: IMenu) {
    if (curMenu.isDisabled) {
      return;
    }
    this.curPath = curMenu.path;
    this.$router.push({ path: curMenu.path, query: curMenu.query });
  }
}
</script>
<style lang="less" scoped>
@menuItemWidth: 300px;
@menuItemHeight: 300px;
@imgUrl: '../../../assets/img/leftNav';
.el-menu {
  margin: 0 auto;
  border: 0;
  background: transparent;
  &:before {
    content: '';
    width: 200%;
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
  }
  .el-menu-item {
    height: 168px;
    width:240px;
    margin-bottom: 32px;
    padding: 0 10px;
    position: relative;
    [class^='icon-'] {
      background-repeat: no-repeat;
      background-position: center center;
      width: @menuItemWidth;
      height: @menuItemHeight;
      display: block;
      position: relative;
      transform: translate(-75px, -85px);
      pointer-events: none;
      .animate-cover {
        position: absolute;
        left: 0;
        top: 0;
        width: 300px;
        height: 300px;
        background: url('../../../assets/img/leftNav/light_cover.png') no-repeat
          center center;
        background-size: 300px auto;
        display: none;
        animation: rotateInfinite 5s linear infinite forwards;
      }
    }
    .icon-citySafeRun {
      background-image: url('../../../assets/img/leftNav/icon_menu1_n.png');
      transition: background 0.3s;
    }
    .icon-riskAssessment {
      background-image: url('../../../assets/img/leftNav/icon_menu2_n.png');
      transition: background 0.3s;
    }
    .icon-dicisionSupport {
      background-image: url('../../../assets/img/leftNav/icon_menu3_n.png');
      transition: background 0.3s;
    }
    &.is-active {
      background: none;
      animation: myShow ease-in 1s;
      &:nth-child(1) {
        left: -20px;
        top: 165px;
      }
      &:nth-child(2) {
        left: 31px;
        top: 243px;
      }
      &:nth-child(3) {
        left: -10px;
      }
      [class^='icon-'] {
        width: 300px;
        height: 300px;
        transform: translate(-50px, -66px);
        background-size: 320px auto;
        .animate-cover {
          display: block;
        }
      }
      .icon-citySafeRun {
        background-image: url('../../../assets/img/leftNav/icon_menu1_p.png');
        left: 20px;
      }
      .icon-riskAssessment {
        background-image: url('../../../assets/img/leftNav/icon_menu2_p.png');
        /* top: -10px;*/
      }
      .icon-dicisionSupport {
        background-image: url('../../../assets/img/leftNav/icon_menu3_p.png');
       /* top: -25px;*/
        left: 20px;
      }
    }
    &:hover {
      background: none;
    }
    &:focus {
      background: none;
    }
    &:nth-child(1) {
      top: 200px;
      left: -19px;
    }
    &:nth-child(2) {
      left: 50px;
      top: 272px;
    }
    &:nth-child(3) {
      left: -19px;
      top: 339px;
    }
  }
}
@keyframes myShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes rotateMenu {
  0% {
    left: 1px;
    top: -60px;
  }
  100% {
    left: 155px;
    top: 20px;
  }
}
@keyframes rotateInfinite {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.left-nav {
  width: 100%;
  height: 100%;
  position: relative;
  &:before{
    content:' ';
    display: inline-block;
    width:500px;
    height: 100%;
    position:absolute;
    top:0;
    left:0;
    width:500px;
    background: url('../../../assets/img/leftNav/bg_leftMenu.png') no-repeat left center;
    z-index:0;
    user-select: none;    
  }
}
.menuWrap {
  position: absolute;
  width: 100px;
  height: 170px;
  .menu {
    height: 33px;
    line-height: 33px;
    font-size: 18px;
    cursor: pointer;
    position: relative;
    left: 5px;
    &:nth-child(2) {
      left: -12px;
    }
    &:nth-child(3) {
      left: -32px;
    }
    &:nth-child(4) {
      left: -55px;
    }
    &:before {
      content: '';
      width: 10px;
      height: 10px;
      border: 1px solid #016c91;
      border-radius: 20px;
      display: inline-block;
      margin-right: 10px;
    }
    &.disable {
      color: #ccc;
      cursor: default;
    }
    &.active {
      &:before {
        background-color: #016c91;
      }
    }
  }
}

.menuWrap.menuWrap_0{
  bottom: -180px;
  left:175px;
  .menu{
    &:nth-child(1) {
      left: 8px;
    }
    &:nth-child(2) {
      left: 14px;
    }
    &:nth-child(3) {
      left: 18px;
    }
    &:nth-child(4) {
      left: 21px;
    }
  }
}

.menuWrap.menuWrap_1{
  bottom: -180px;
  left:135px;
  .menu{
    &:nth-child(1) {
      left: 8px;
    }
    &:nth-child(2) {
      left: 5px;
    }
    &:nth-child(3) {
      left: 1px;
    }
    &:nth-child(4) {
      left: -8px;
    }
  }
}

.menuWrap.menuWrap_2{
  bottom: -160px;
  left:130px;
}
</style>
