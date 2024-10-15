"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialPlotState = void 0;
const d3 = __importStar(require("d3"));
const initialPlotState = {
    plotData: [{
            name: "",
            data: [],
            trailingDays: "",
            avgType: "",
            sampleType: "",
            //start:(new Date()).toISOString().split('T')[0],
            //end:(new Date()).toISOString().split('T')[0],
            start: new Date(),
            end: new Date(),
            min: 0,
            max: 0,
            minDeriv: 0,
            maxDeriv: 0,
            minDeriv2: 0,
            maxDeriv2: 0,
            // datePriceScale: new d3.scaleLinear(),
            // datePriceScale: d3.scaleLinear(),
            datePriceScale: d3.scaleOrdinal(),
            daysList: [],
            localMins: [],
            localMaxs: [],
            //modelAnalysis:[], //should these be getting set if they're optional anyways? inputFormContainer make PlotDatum without these
            //splits:{}
        }],
    stateID: 0,
    lastChange: { type: "init" }
};
exports.initialPlotState = initialPlotState;
// export default initialPlotState
