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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputFormContainer = InputFormContainer;
const react_1 = __importStar(require("react"));
const d3 = __importStar(require("d3"));
const sendToPython_1 = __importDefault(require("../helpers/sendToPython"));
const dateToDate_1 = __importDefault(require("../helpers/dateToDate"));
const StockContext_1 = require("../StockContext");
function InputFormContainer({ inputFormBuilder, route, modelSample, isModelInput = false }) {
    const { plotState, prefsState, plotDispatch, prefsDispatch, inputDispatch } = (0, react_1.useContext)(StockContext_1.StockContext);
    const [formData, setFormData] = (0, react_1.useState)(//this is a terrible way to initialize this
    {
        stockSymbol: "",
        trailingDays: "",
        stepSize: "",
        max: "",
        //trainStart:"",
        //trainEnd:"",
        //testEnd:"",
        // trainingBounds:['0','80','100'],
        trainingBounds: [0, 80, 100],
        overlayNew: false,
        customDate: false,
        avgType: "Constant",
        sampleType: modelSample || "Close"
    });
    function handleChange(event) {
        // const {name, value, type, checked} = event.target
        const { name, value, type } = event.target;
        console.log('debugHandleChange', { name, value, type, event, formData, prefsState, plotState });
        // if ((name === "trainingBounds") && !prefsState.showModelLines){
        if ((name === "trainingBounds")) {
            const { dayValues } = prefsState;
            const dayArray = formData.trainingBounds.map((bound) => {
                // const index = Math.floor(((parseInt(bound)/100) * dayValues.length) - 1)
                const index = Math.floor(((bound / 100) * dayValues.length) - 1);
                return dayValues[index];
            });
            const modelLineStrings = dayArray.map(day => day.toString());
            prefsDispatch({ type: "update_model_lines", showModelLines: true, modelLineDays: dayArray, modelLineStrings });
        }
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: name === "trainingBounds" ? parseInt(value) : value
            };
        });
    }
    function handleChangeCheckbox(event) {
        const { name, checked } = event.target;
        // console.log('debugHandleChange',{name, value, type, checked,event,formData,prefsState,plotState})
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: checked
            };
        });
    }
    function handleChangeSlider(event, value) {
        // console.log('debugHandleChange',{name, value, type, checked,event,formData,prefsState,plotState})
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                "trainingBounds": value
            };
        });
    }
    function generateScale(dataArray) {
        const domain = dataArray.map((row) => {
            // if (row.type){
            //     return dateToDate(row.date,row.type)
            // }
            return (0, dateToDate_1.default)(row.date);
        });
        const range = dataArray.map((row) => [row.price, row.rawPrice]);
        console.log('[domain,range] is: ', [domain, range]);
        return (d3.scaleOrdinal()
            .domain(domain) //bad typing
            .range(range));
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const prefs = {
            overlayNew: formData.overlayNew,
            customDate: formData.customDate,
            doubleDates: formData.sampleType === "Open/Close" ? true : false
        };
        //setPrefs(prefs)
        inputDispatch({ type: 'update_input_prefs', prefs });
        //I need to handle blank inputs
        //what's in here is working from the outside, but it's logging errors in python
        const data = (0, sendToPython_1.default)(formData, route);
        const resolvedDataDict = await data;
        console.log('resolvedDataDict is: ', resolvedDataDict);
        let newPlotDataList = []; //yeah, uhh, this should be done with reduce...
        if (isModelInput) {
            const { plotData } = plotState;
            plotData.forEach((plot) => {
                newPlotDataList = [
                    ...newPlotDataList,
                    { ...plot, modelAnalysis: resolvedDataDict.modelAnalysis, splits: resolvedDataDict.splits }
                ];
            });
        }
        else {
            const plotKeys = Object.keys(resolvedDataDict.plotData);
            plotKeys.forEach((resolvedDataKey, index) => {
                const days = formData.trailingDays || (parseInt(formData.stepSize) * (index + 1)).toString();
                console.log("days is: ", days);
                const resolvedData = resolvedDataDict.plotData[resolvedDataKey];
                console.log('resolvedDataKey and resolvedData are: ', [resolvedDataKey, resolvedData]);
                const resolvedDaysList = resolvedData.stockFeatures.days_list;
                const formattedDays = resolvedDaysList.map((day) => (0, dateToDate_1.default)(day));
                //console.log('[formattedDays] is: ',[formattedDays])
                const newPlotData = {
                    name: formData.stockSymbol,
                    data: resolvedData.stockArray,
                    trailingDays: days,
                    avgType: formData.avgType,
                    sampleType: formData.sampleType,
                    start: (0, dateToDate_1.default)(resolvedData.stockFeatures.start_date),
                    end: (0, dateToDate_1.default)(resolvedData.stockFeatures.end_date),
                    min: resolvedData.stockFeatures.min_price,
                    max: resolvedData.stockFeatures.max_price,
                    minDeriv: resolvedData.stockFeatures.min_deriv,
                    maxDeriv: resolvedData.stockFeatures.max_deriv,
                    minDeriv2: resolvedData.stockFeatures.min_deriv2,
                    maxDeriv2: resolvedData.stockFeatures.max_deriv2,
                    datePriceScale: generateScale(resolvedData.stockArray),
                    daysList: formattedDays,
                    localMins: resolvedData.localMinsandMaxs[0],
                    localMaxs: resolvedData.localMinsandMaxs[1],
                    //modelAnalysis:resolvedDataDict.modelAnalysis,
                    //splits:resolvedDataDict.splits
                };
                newPlotDataList = [...newPlotDataList, newPlotData];
            });
        }
        console.log('debugFormData', { formData, newPlotDataList });
        //handleInput(newPlotDataList)
        if (prefs.overlayNew) {
            plotDispatch({ type: 'update_data', data: newPlotDataList });
        }
        else {
            plotDispatch({ type: 'replace_data', data: newPlotDataList });
        }
        console.log("event is: ", event);
        setFormData((priorForm) => {
            const clearedForm = { ...priorForm,
                stockSymbol: "",
                trailingDays: "",
                stepSize: "",
                max: ""
            };
            return clearedForm;
        });
    }
    const InputForm = inputFormBuilder({
        formData,
        handleChangeCallBack: handleChange,
        handleChangeCheckboxCallBack: handleChangeCheckbox,
        handleChangeSliderCallBack: handleChangeSlider
    });
    //console.log('InputForm is: ',InputForm)
    return (react_1.default.createElement("form", { className: "PlotInputForm", onSubmit: handleSubmit }, InputForm));
}
