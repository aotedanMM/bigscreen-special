import Vue from 'vue';
import Router from 'vue-router';
// import Home from '../views/common/Home.vue';
// import LayoutConent from '@/views/theme/classic/LayoutConent.vue';
// import Earthquake from '@/views/theme/popular/Earthquake.vue';
// import Flood from '@/views/theme/primary/Flood.vue';
import DecisionSupprotHome from '@/views/theme/decisionSupport/DecisionSupprotHome.vue';
import DecLayoutHome from '@/views/theme/decisionSupport/LayoutHome.vue';

import Login from '@/components/feature/login/Login.vue' ;
import choose from '@/components/feature/login/choose.vue' ;


// import DarkGreenHome from '@/views/theme/darkGreen/DarkGreenHome.vue';
// import DarkGreenConent from '@/views/theme/darkGreen/LayoutHome.vue';


import { defaultChange } from '@/config/themeConfig';


Vue.use(Router);

const routesFoshan: any = {
  // foshan : [
  //   {
  //     path: '/',
  //     name: 'LayoutConent',
  //     component: LayoutConent,

  //   },
  //   {
  //     path: '/LayoutConent',
  //     name: 'LayoutConent',
  //     component: LayoutConent,
  //   },
  //   {
  //     path: '/erthquake',
  //     name: 'erthquake',
  //     component: Earthquake,
  //   },
  //   {
  //     path: '/flood',
  //     name: 'flood',
  //     component: Flood,
  //   }],
  fuzhujuece : [{
    path: '/',
    name: 'DecisionSupprotHome',
    component: DecisionSupprotHome,
    redirect: '/DecLayoutHome',
  },
  {
    path: '/DecLayoutHome',
    name: 'DecLayoutHome',
    component: DecLayoutHome,
  }],
  // fuzhujuece : [{
  //     path: '/',
  //     name: 'DecisionSupprotHome',
  //     component: DecisionSupprotHome,
  //     redirect: '/DecisionSupprotHome',
  //   },
  //   {
  //     path: '/DecisionSupprotHome',
  //     name: 'DecisionSupprotHome',
  //     component: DecisionSupprotHome,
  //   }, {
  //     path: '/Login',
  //     name: 'Login',
  //     component: Login,
  //   },
  //   {
  //     path: '/choose',
  //     name: 'choose',
  //     component: choose,
  //   },
  //   {
  //     path: '/main',
  //     name: 'main',
  //     component: DecisionSupprotHome,
  //   },

  //  ],
  // darkGreen : [{
  //   path: '/',
  //   name: 'DarkGreenHome',
  //   component: DarkGreenHome,
  //   redirect: '/DarkGreenConent',
  // },
  // {
  //   path: '/DarkGreenConent',
  //   name: 'DarkGreenConent',
  //   component: DarkGreenConent,
  // }],
};

/*const createRouter = () => new Router({
  mode: 'history',
  routes: [],
})

const router = createRouter();

export function restRouter() {
  const newRouter =  createRouter();
  this.router.matcher = newRouter.matcher;

}
export default router*/


const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: routesFoshan[defaultChange],
});
// router.beforeEach((to, from, next) => {
//   const tempWin: any = window;
//   const tempFlag =  window.sessionStorage.getItem('token') ? true : false;
//   if ( !tempFlag && to.name !== 'Login') {
//     router.push('Login');
//   }
//   next();
// });
export default router ;

