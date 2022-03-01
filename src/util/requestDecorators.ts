
import $ from 'jquery';
import { createDecorator } from 'vue-class-component';
import axios from 'axios';
import Vue from 'vue';


/**
 * 样式style的注释器
*/
export function Style(refKey: string) {
    return createDecorator((options, key) => {
        options.computed = options.computed || {};
        options.computed[key] = {
            cache : false,
            get(this: Vue) {
                return (this.$refs[refKey || key] as any).style;
            },
        };
    });
}

/**
 * 实现class 动态赋值 ，目前是借于localStorage，感觉不理想。后续可讨论进行修改
*/
export function ClassTheme(classes: any) {
    return (componentOptions: any, key: any, descriptor: PropertyDescriptor) => {
        const getTheme: any = localStorage.getItem('defaultTheme');
        componentOptions[key] = classes[getTheme]  ;
    };
}






export function request1(path: string , methods: string = 'get') {
    /**
     * 目前只实现了同步的，先暂停，理下思路
    */
    return (componentOptions: any, key: any, descriptor: PropertyDescriptor) => {

        // const temp: any = descriptor.value ;

        // descriptor.value = (...rest: any) => {
        //     const ret = temp.apply(componentOptions, ...rest);
        //     ret.then(function() {
        //     });
        // };
        // const that = this;
        // axios.get(path).then((data) => {
        //     temp.call(data);
        // });
        // componentOptions.serverData = {
        //     a : 1,
        // };
        // const vm = componentOptions;
        // console.log(axios);
        // console.log(axios.get);
        // axios({
        //     url : path,
        // })

        //  Object.defineProperty(componentOptions, 'serverData', {
        //      get() {
        //          console.log(this.value);
        //          return this.value;
        //         // return  {
        //         //      a : 1,
        //         //  };
        //      },
        //      set(data: any) {
        //          this.value = data ;
        //          console.log(this.value);
        //      },
        //  });
        //  axios.get(path).then((data) => {
        //     componentOptions.serverData  = data;
        // });
        // axios.get(path).then((data) => {
        //     componentOptions.computed.serverData = {
        //         set() {
        //             this.value = data;
        //         },
        //      };
        // });
        // $.ajax({
        //     url : path,
        //     method : methods,
        //     success : (data) => {
        //         vm.serverData  = {
        //             a : 1,
        //         };
        //     },
        // });

        // $.ajax({
        //     url : path,
        //     method : methods,
        //     // async : false,
        //     success : (data) => {
        //         // tempData.temp = data;
        //         componentOptions.$set(data, serverData, data);
        //     },
        // });



        // Object.defineProperty(tempData, 'temp', {
        //     set(val: any) {
        //         componentOptions.serverData = val;
        //         console.log(componentOptions);
        //     },
        // });
    };
    //    return new Promise((resolve) => {
    //         $.ajax({
    //             url : path,
    //             method : methods,
    //             success : (data) => {

    //             },
    //         });
    //         resolve((data: any) => {
    //             componentOptions.serverData = data;
    //         });
    //     });
    // return new Promise((resolve) => {
    //     return (componentOptions: any, key: any) => {
    //         $.ajax({
    //             url : path,
    //             method : methods,
    //             success : (data) => {
    //                 componentOptions.serverData = data;
    //             },
    //         });
    //         // resolve();
    //  };
    // });

    // (componentOptions: any, key: any) => {
    //     $.ajax({
    //         url : path,
    //         method : methods,
    //         success : (data) => {
    //             componentOptions.serverData = data;
    //         },
    //     });
         // if (typeof componentOptions.inject === 'undefined') {
        //     componentOptions.inject = {};
        // }
        // if (!Array.isArray(componentOptions.inject)) {
        //     componentOptions.inject[key] = options || key;
        // }
    // };
    // return  (target: any , method: any, descriptor: PropertyDescriptor) => {
        //  descriptor.value = path;
        // $.ajax({
        //     url : path,
        //     method : methods,
        //     success : (data) => {
        //         descriptor.value =
        //     },
        // });
    // };

    // }
}



// class Test {
//     public data: any;
//     @request1('./json/weather.json')
//     public get(data: any) {
//         this.data = data;
//     }

// }

// const t1 = new Test();
// t1.get();
