/**
 * 获取时间
 * @option 是一个对象里面
 *  value 是option里面的字段可以是字符串也可以是时间戳或者没有
 *  last 是一个字符传 参数值 week | month | year。用来获取多少之前的时间
 *        week => 上周
 *        month => 上个月
 *        year => 去年
 */

interface IOption {
  value?: string | number | undefined | null;
  last?: string;
}

const getDateFormat = (option?: IOption): string => {
  const now = new Date((option && option.value) || +new Date());

  // 获取时间数据
  const getDateData = (date: Date) => {
    return {
      YYYY: date.getFullYear(), // 年
      MM:
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1, // 月
      DD: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(), // 日
      hh: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(), // 时
      mm: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(), // 分
      ss: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(), // 秒
    };
  };

  // 当前的时间数据
  let dateInfo = getDateData(now);
  if (option) {
    switch (option.last) {
      case 'oneDay': // 1天前
        const oneDay = 24 * 60 * 60 * 1000;
        dateInfo = getDateData(new Date(+now - oneDay));
        break;
      case 'day3': // 3天前
        const day = 3 * 24 * 60 * 60 * 1000;
        dateInfo = getDateData(new Date(+now - day));
        break;
      case 'week': // 上周时间
        const week = 7 * 24 * 60 * 60 * 1000;
        dateInfo = getDateData(new Date(+now - week));
        break;
      case 'month': // 上个月
        const month = 30 * 24 * 60 * 60 * 1000; // 目前月的时间是按照30天进行计算的（具体怎么计算到时候由需求来定）
        dateInfo = getDateData(new Date(+now - month));
        break;
      case 'quarter': // 上个季度
        const quarter = 3 * 30 * 24 * 60 * 60 * 1000; // 目前季度的时间是按照每个月30天共三个月进行计算的（具体怎么计算到时候由需求来定）
        dateInfo = getDateData(new Date(+now - quarter));
        break;
      case 'year': // 去年
        const year = 365 * 24 * 60 * 60 * 1000; // 目前年的时间是按照365天进行计算的（具体怎么计算到时候由需求来定）
        dateInfo = getDateData(new Date(+now - year));
        break;
    }
  }
  return `${dateInfo.YYYY}-${dateInfo.MM}-${dateInfo.DD} ${dateInfo.hh}:${dateInfo.mm}:${dateInfo.ss}`;
};

/**
 * 导出下载文件
 * @param fileName:文件名
 * @param data:文件流
 */
const downloadFile = (fileName: string, data: any) => {
  const a = document.createElement('a');
  const blob = new Blob([data]);
  const dom = document.createElement('a');
  dom.download = fileName;
  dom.href = URL.createObjectURL(blob);
  dom.style.display = 'none';
  document.body.appendChild(dom);
  dom.click();
  document.body.removeChild(dom);
};

export { getDateFormat, downloadFile };
