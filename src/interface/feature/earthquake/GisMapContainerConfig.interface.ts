
interface CmpName {
  left?: string;
  right?: string;
}

export interface GisTool {
  title: string;
  class: string;
  key: string;
  component: CmpName;
  bind?: any;
  options?: GisTool[];
}
