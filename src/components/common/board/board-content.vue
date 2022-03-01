<template>
  <div>
    <board :boardId="boardId">
      <div class="board-container">

      </div>
    </board>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import board from './board.vue';
@Component({
  components: {
    board,
  },
})
export default class BoardContent extends Vue {
  @Prop({ default: '0201000122' }) private boardId!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.board-container {
  width: 100%;
  height: 100%;
  background: pink;
}
</style>
