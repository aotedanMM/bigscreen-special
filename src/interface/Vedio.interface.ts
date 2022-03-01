export interface IVedio {
    url: string;
}

interface IVedioListItem {
    label: string ;
    url: string;
}

export interface IVedioList {
    [index: number]: IVedioListItem;
}
