declare interface DummyInterface {
    
}

declare type PlotDatum = {
    name: string,
    data: undefined[],
    trailingDays: string,
    avgType: string,
    sampleType: string,
    start: Date,
    end: Date,
    min: number,
    max: number,
    minDeriv: number,
    maxDeriv: number,
    minDeriv2: number,
    maxDeriv2:number,
    datePriceScale: d3.ScaleLinear<number, number, never>,
    daysList:any[],
    localMins:any[],
    localMaxs:any[],
    modelAnalysis:any[],
    splits: {};
}
declare type PlotData = PlotDatum[]

declare type PlotState = {
    plotData:PlotData,
    stateID: number,
    lastChange: string
}