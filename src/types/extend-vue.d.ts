import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    onMapClick: any;
    $ioc: any;
    $moment: any;
  }
}

declare global {
  interface Window {
    G: any;
    $: any;
    jQuery: any;
    WebControl : any ;
    showCBInfo : any;
    JSEncrypt : any;
  }
}
