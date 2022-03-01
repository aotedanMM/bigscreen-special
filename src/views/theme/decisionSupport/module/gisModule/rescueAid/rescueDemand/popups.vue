<template>
    <eventInfoBluePop>
        <template #pathPlan>
            
        </template>
    </eventInfoBluePop>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import eventInfoBluePop from '@/components/feature/gisModule/popUp/eventInfoBluePop.vue';

@Component({
  name: 'RescuePopup',
  components: {
    eventInfoBluePop,
  },
})
export default class RescuePopup extends Vue {
    @Prop() private title?: string;
    @Prop({default: () => [{name: '', value: ''}]}) private list?: object[];
    @Prop() private btnText?: string;
    @Prop({default: false}) private showPopups?: boolean;
    private closePopups() {
        this.showPopups = false;
    }
}
</script>
