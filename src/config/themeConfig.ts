
/**
 *  主题的变量
*/
export const  allLayout: any = {
    // foshan  : 'LayoutHome',
    fuzhujuece : 'DecisionSupprotHome',
    // darkGreen : 'DarkGreenHome',
};
/**
 *  应急辅助切换左右的布局情况--墨绿版
*/
export const darkGreen = {
      theme : 'darkGreen',
      normal : {
        left : 'layoutSidebar',
        right : 'layoutAssist',
      },
      unNormal : {
        left :  '', // LeftUnNormal
        right : '', // RightUnNormal
      },
      changeTheme : [
          {
            right : 'studyAndJudgmentOfaPicture', // 灾情研判，切换的右则的块
          },
          {
            right : 'rightCensus', // 灾情统计，切换的右则的块
          },
          {
            right : 'rightHelp', // 救援救助 ,切换的右则的块
          },
          {
              right : 'rightEvolve', // 救援进展 ,切换的右则的块
          },
      ],
};

export const fuzhujuece = {
  theme : 'fuzhujuece',
  normal : {
    left : 'layoutSidebar',
    right : 'layoutAssist',
  },
  unNormal : {
    left :  '', // LeftUnNormal
    right : '', // RightUnNormal
  },
  changeTheme : [
      {
        right : 'studyAndJudgmentOfaPicture', // 灾情研判，切换的右则的块
      },
      {
        right : 'rightCensus', // 灾情统计，切换的右则的块
      },
      {
        right : 'rightHelp', // 救援救助 ,切换的右则的块
      },
      {
          right : 'rightEvolve', // 救援进展 ,切换的右则的块
      },
  ],
};
export const  defaultChange = localStorage.getItem('defaultTheme') || 'fuzhujuece';
