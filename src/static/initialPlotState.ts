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

type SampleTimeArray = [string,SampleType]

type ModelAnalysisEntry = [SampleTimeArray,ModelAnalysisDatum]
type ModelAnalysis = ModelAnalysisEntry[]

type PlotDatum = {
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
  datePriceScale: d3.ScaleOrdinal<string, unknown, never>,
  daysList:any[],
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
    datePriceScale: d3.scaleOrdinal(),
    daysList:[],
    localMins:[],
    localMaxs:[],
    //modelAnalysis:[], //should these be getting set if they're optional anyways? inputFormContainer make PlotDatum without these
    //splits:{}
  }],
  stateID:0,
  lastChange:{type:"init"}
}

export {initialPlotState,PlotDatum,PlotData,PlotState,ModelAnalysis}
  // export default initialPlotState