import * as d3 from "d3";

const initialPlotState = [{
    name:"",
    data:[],
    trailingDays:"",
    avgType:"",
    sampleType:"",
    //start:(new Date()).toISOString().split('T')[0],
    //end:(new Date()).toISOString().split('T')[0],
    start:new Date(),
    end: new Date(),
    min:0,
    max:0,
    minDeriv:0,
    maxDeriv:0,
    minDeriv2:0,
    maxDeriv2:0,
    datePriceScale: new d3.scaleLinear(),
    daysList:[],
    localMins:[],
    localMaxs:[],
    modelAnalysis:[]
  }]

  export default initialPlotState