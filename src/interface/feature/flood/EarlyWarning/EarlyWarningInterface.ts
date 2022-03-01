export interface EarlyWarningInterface {
    class: string;
    name: string;
    value: number;
    // estimates?: number | undefined;
}

export interface EarlyWarningDataField {
    riverStation?: number;
    limitOfReservoir?: number;
    superRainMeasuringStation?: number;
    heavyRainMeasuringStation?: number;
    rainMeasuringStation?: number;
    arrow1?: number;
    arrow2?: number;
    arrow3?: number;
    arrow4?: number;
    arrow5?: number;
}
