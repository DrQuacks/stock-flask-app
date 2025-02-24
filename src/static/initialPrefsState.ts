import * as d3 from "d3";

interface PlotPrefsState {
    semiLog: boolean;
    firstDeriv: boolean;
    secondDeriv: boolean;
    localMins: boolean;
    localMaxs: boolean;
}

interface PrefsState extends PlotPrefsState {
    xDomain: [Date,Date],
    dayValues: Date[],
    selectedDayValues: Date[],
    selectedDayStrings: string[],
    dateTickValues: {
        date: Date[],
        scale: d3.ScaleOrdinal<Date, string, never>
    },
    priceRange: [number,number],
    selectedPriceRange: [number,number],
    stateID:number,
    lastChange:{type:string},
    nextChange:string,
    showModelLines:boolean,
    modelLineDays: Date[];
    modelLineStrings: string[];
    modelStart:number
}

const initialPrefsState:PrefsState = {
    xDomain:[(new Date()),(new Date())],
    dayValues:[(new Date())],
    selectedDayValues:[(new Date())],
    selectedDayStrings:[""],
    dateTickValues: {date:[],scale:d3.scaleOrdinal<Date,string>()},
    priceRange:[0,0],
    selectedPriceRange:[0,0],
    stateID:0,
    lastChange:{type:'init'},
    nextChange:'none',
    semiLog:false,
    firstDeriv: false,
    secondDeriv: false,
    localMins: false,
    localMaxs: false,
    showModelLines:false,
    modelLineDays:[(new Date()),(new Date()),(new Date())],
    modelLineStrings:[],
    modelStart:0
}

export {initialPrefsState,PrefsState,PlotPrefsState}