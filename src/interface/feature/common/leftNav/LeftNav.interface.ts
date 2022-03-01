export interface IboardData {
    id: string;
    title: string;
}
export interface INavList {
    label: string;
    id: string;
    class: string;
    path: string;
}
export interface IMenu {
    name: string;
    path: string;
    isDisabled: boolean;
    query?: {
      key?: string;
    };
}
export class NavList implements INavList {
    public label = '';
    public id = '';
    public class = '';
    public path = '';
}
