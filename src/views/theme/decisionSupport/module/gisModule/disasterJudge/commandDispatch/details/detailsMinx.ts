import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class MyMixin extends Vue {
  public loadTrack() {
    const icons: any = this.$ioc.resolve('symbolConfig-map').icons;
    const data: any =
      this.currentChildObj.data && this.currentChildObj.data.trackhistory;
    if (this.currentChildObj.data && data.length > 0) {
      this.getComponent().on('finish', this.onPlayFinished, this);
      // todo 传类型
      const symbol: any = {
        source: icons[`communicationEquiphcLayer0${this.currentChildObj.type}_img`],
        width: 80,
        height: 80,
        offsetX: 40,
        offsetY: 40,
        opacity: 1,
        size: 1,
      };
      this.getComponent().load(data, symbol);
    }
  }
  public getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('historyTrack');
    return component;
  }

  // 播放完成
  public onPlayFinished() {
    this.palyFlag = true;
  }
  //
  public historyPlay() {
    const data: any = this.currentChildObj.data.trackhistory;
    this.getComponent().play(data).then(() => { this.palyFlag = false; }).catch((err: any) => {
      this.$message(err);
    });

  }
  public historyPause() {
    this.getComponent().pause();
    this.palyFlag = true;
  }
  public historyStop() {
    this.getComponent().finish();
    this.palyFlag = true;
  }
  public returnBack() {
    const tempkey = 'small_' + this.currentChildObj.emitType;
    this.messsageBus.emit(tempkey, true);
    this.messsageBus.emit('Close_Router', null);
    // 地图清空方法
    // this.getComponent().clearHighlight() ;
  }
}
