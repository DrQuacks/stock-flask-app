import * as d3 from "d3";

const initialSemiPrefsState = {
    xDomain:[(new Date()),(new Date())],
    dayValues:[(new Date())],
    selectedDayValues:[(new Date())],
    dateTickValues: {"date":[(new Date())],"scale":d3.scaleOrdinal()},
    priceRange:[0,0],
    selectedPriceRange:[0,0],
    stateID:0
}

const initialPrefsState = {
    ...initialSemiPrefsState,
    semiLog:false,
    overlayNew:false,
    customDate:false,
    doubleDates:false
}

export {initialPrefsState,initialSemiPrefsState}