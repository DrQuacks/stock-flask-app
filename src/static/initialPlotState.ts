import * as d3 from "d3";
import {SampleType} from '../components/InputFormContainer'

type ModelAnalysisDatum = {
  correct:boolean,
  predictionDown:boolean,
  predictionUp:boolean,
  targetDown:boolean,
  targetDown_prectionDown:boolean,
  targetDown_predictionUp:boolean,
  targetUp:boolean,
  targetUp_prectionDown:boolean,
  targetUp_predictionUp:boolean,
}

type PlotType = "price" | "raw" | "firstDeriv" | "secondDeriv" | "localMins" | "localMaxs"

type StockDatum = {
  numIndex:number,
  price:number,
  rawPrice:number,
  date:string,
  derivFirst:number,
  derivSecond:number,
  type:PlotType,
  trailing_min:number,
  trailing_max:number
}

type SampleTimeArray = [string,SampleType]
type ModelAnalysisEntry = [SampleTimeArray,ModelAnalysisDatum]
type ModelAnalysisRaw = ModelAnalysisEntry[]

type SampleTimeArrayDate = [Date,SampleType]
type ModelAnalysisEntryDate = [SampleTimeArrayDate,ModelAnalysisDatum]
type ModelAnalysis = ModelAnalysisEntryDate[]

type PlotDatum = {
  name: string,
  // data: undefined[],
  data: StockDatum[],
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
  datePriceScale: d3.ScaleOrdinal<Date, number, never>,
  dateRawPriceScale: d3.ScaleOrdinal<Date, number, never>,
  daysList:Date[],
  localMins:any[],
  localMaxs:any[],
  modelAnalysis?:ModelAnalysis,
  splits?: {};
}

type PlotData = PlotDatum[]

type PlotState = {
  plotData:PlotData,
  stateID: number,
  lastChange: {type:string}
}


const initialPlotState:PlotState = {
  plotData:[{
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
    // datePriceScale: new d3.scaleLinear(),
    // datePriceScale: d3.scaleLinear(),
    datePriceScale: d3.scaleOrdinal<Date,number>(),
    dateRawPriceScale: d3.scaleOrdinal<Date,number>(),
    daysList:[],
    localMins:[],
    localMaxs:[],
    //modelAnalysis:[], //should these be getting set if they're optional anyways? inputFormContainer make PlotDatum without these
    //splits:{}
  }],
  stateID:0,
  lastChange:{type:"init"}
}

export {initialPlotState,PlotDatum,PlotData,PlotState,ModelAnalysis,ModelAnalysisRaw,StockDatum}
  // export default initialPlotState