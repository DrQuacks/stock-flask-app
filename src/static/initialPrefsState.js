import * as d3 from "d3";

const initialPrefsState = {
    xDomain:[(new Date()),(new Date())],
    dayValues:[(new Date())],
    selectedDayValues:[(new Date())],
    dateTickValues: {"date":[(new Date())],"scale":d3.scaleOrdinal()},
    priceRange:[0,0],
    selectedPriceRange:[0,0],
    stateID:0,
    lastChange:'init',
    nextChange:'none',
    semiLog:false,
    showModelLines:false,
    modelLineDays:[(new Date()),(new Date()),(new Date())]
}

export default initialPrefsState