export interface KnownDisasterInterface {
  class: string;
  name: string;
  value: number;
  unit: string;
  estimates?: number | undefined;
}

export interface KnownDisasterDataField {
  death?: number;
  hurt?: number;
  damage?: number;
  resuce?: number;
  transfer?: number;
  arrow1?: number;
  arrow2?: number;
  arrow3?: number;
  arrow4?: number;
  arrow5?: number;
}
