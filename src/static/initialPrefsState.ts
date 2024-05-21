import * as d3 from "d3";

type PrefsState = {
    xDomain: [Date,Date],
    dayValues: Date[],
    selectedDayValues: Date[],
    dateTickValues: {
        date: Date[],
        scale: d3.ScaleOrdinal<string, unknown, never>
    },
    priceRange: [number,number],
    selectedPriceRange: [number,number],
    stateID:number,
    lastChange:{type:string},
    nextChange:string,
    semiLog:boolean,
    showModelLines:boolean,
    modelLineDays: Date[];
}

const initialPrefsState:PrefsState = {
    xDomain:[(new Date()),(new Date())],
    dayValues:[(new Date())],
    selectedDayValues:[(new Date())],
    dateTickValues: {"date":[(new Date())],"scale":d3.scaleOrdinal()},
    priceRange:[0,0],
    selectedPriceRange:[0,0],
    stateID:0,
    lastChange:{type:'init'},
    nextChange:'none',
    semiLog:false,
    showModelLines:false,
    modelLineDays:[(new Date()),(new Date()),(new Date())]
}

export {initialPrefsState,PrefsState}