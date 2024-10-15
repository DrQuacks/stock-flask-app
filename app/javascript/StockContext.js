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
exports.StockContextProvider = exports.StockContext = void 0;
const react_1 = __importStar(require("react"));
const initialPlotState_1 = require("./static/initialPlotState");
const initialPrefsState_1 = require("./static/initialPrefsState");
const initialInputState_1 = require("./static/initialInputState");
const calcSelectedDays_1 = __importDefault(require("./helpers/calcSelectedDays"));
const calcTickValues_1 = __importDefault(require("./helpers/calcTickValues"));
const calcMinMax_1 = __importDefault(require("./helpers/calcMinMax"));
const calcStartEnd_1 = __importDefault(require("./helpers/calcStartEnd"));
const calcDayValues_1 = __importDefault(require("./helpers/calcDayValues"));
const plotReducer = (plotState, action) => {
    const { type, data, index } = action;
    if (type) {
        let lastChange = { type };
        const newStateID = plotState.stateID + 1;
        switch (type) {
            case "update_data": {
                const newPlotStateData = [...plotState['plotData'], ...data];
                return { plotData: newPlotStateData, lastChange, stateID: newStateID };
            }
            case "replace_data": {
                return { plotData: data, lastChange, stateID: newStateID };
            }
            case "remove_stock": {
                let plotStateDataCopy = [...plotState['plotData']];
                plotStateDataCopy.splice(index, 1);
                return { plotData: plotStateDataCopy, lastChange, stateID: newStateID };
            }
            case "reset": {
                return { ...initialPlotState_1.initialPlotState, lastChange };
            }
            default: {
                return { ...plotState, lastChange, stateID: newStateID };
            }
        }
    }
    return plotState;
};
const prefsReducer = (prefsState, action) => {
    const { type, prefs, plotPrefs, xDomain, dayValues, price, date, selectedDayValues, selectedDayStrings, tickValues, priceRange, selectedPriceRange, nextChange, showModelLines, modelLineDays, modelLineStrings } = action;
    if (type) {
        let lastChange = { type };
        const newStateID = prefsState.stateID + 1;
        switch (type) {
            case "update_prefs": {
                return { ...prefsState, ...prefs, lastChange, stateID: newStateID };
            }
            case "update_plot_prefs": {
                return { ...prefsState, ...plotPrefs, lastChange, stateID: newStateID };
            }
            case "update_min_price": {
                const { selectedPriceRange } = prefsState;
                const newSelectedPriceRange = [price, selectedPriceRange[1]];
                return { ...prefsState, selectedPriceRange: newSelectedPriceRange, lastChange, stateID: newStateID };
            }
            case "update_max_price": {
                const { selectedPriceRange } = prefsState;
                const newSelectedPriceRange = [selectedPriceRange[0], price];
                return { ...prefsState, selectedPriceRange: newSelectedPriceRange, lastChange, stateID: newStateID };
            }
            case "update_start_date": {
                const { xDomain } = prefsState;
                const newXDomain = [date, xDomain[1]];
                return { ...prefsState, xDomain: newXDomain, lastChange, stateID: newStateID };
            }
            case "update_end_date": {
                const { xDomain } = prefsState;
                const newXDomain = [xDomain[0], date];
                return { ...prefsState, xDomain: newXDomain, lastChange, stateID: newStateID };
            }
            case "update_date_range": {
                return { ...prefsState, xDomain, dayValues, lastChange, nextChange: "none", stateID: newStateID };
            }
            case "update_selected_days": {
                return { ...prefsState, selectedDayValues, selectedDayStrings, lastChange, stateID: newStateID };
            }
            case "update_tick_values": {
                return { ...prefsState, dateTickValues: tickValues, lastChange, stateID: newStateID };
            }
            case "update_price_range": {
                return { ...prefsState, priceRange, lastChange, nextChange, stateID: newStateID };
            }
            case "update_selected_price_range": {
                return { ...prefsState, selectedPriceRange, lastChange, stateID: newStateID };
            }
            case "update_model_lines": {
                return { ...prefsState, showModelLines, modelLineDays, modelLineStrings, lastChange, stateID: newStateID };
            }
            default: {
                return { ...prefsState, lastChange };
            }
        }
    }
    return prefsState;
};
const inputReducer = (inputState, action) => {
    const { type, prefs } = action;
    if (type) {
        let lastChange = { type };
        const newStateID = inputState.stateID + 1;
        switch (type) {
            case "update_input_prefs": {
                return { ...inputState, ...prefs, lastChange, stateID: newStateID };
            }
            default: {
                return { ...inputState, lastChange, stateID: newStateID };
            }
        }
    }
    return inputState;
};
const StockContext = react_1.default.createContext(null);
exports.StockContext = StockContext;
const StockContextProvider = (props) => {
    const [plotState, plotDispatch] = (0, react_1.useReducer)(plotReducer, initialPlotState_1.initialPlotState);
    const [prefsState, prefsDispatch] = (0, react_1.useReducer)(prefsReducer, initialPrefsState_1.initialPrefsState);
    const [inputState, inputDispatch] = (0, react_1.useReducer)(inputReducer, initialInputState_1.initialInputState);
    (0, react_1.useEffect)(() => {
        console.log('Plot State Update', { plotState, prefsState, inputState });
        if (plotState.lastChange.type) {
            const { type } = plotState.lastChange;
            if ((type === "update_data") || (type === "replace_data")) {
                const { plotData } = plotState;
                const priceRange = (0, calcMinMax_1.default)(plotData);
                prefsDispatch({ type: "update_price_range", priceRange, nextChange: "update_date_range" }); //I think this is the core of the problem, there's also a call to prefsDispatch before this plotsDIspatch call was made
            }
            if (type === "remove_stock") {
                const newMinMax = (0, calcMinMax_1.default)(plotState.plotData);
                prefsDispatch({ type: "update_price_range", priceRange: newMinMax, nextChange: "update_date_range" });
            }
            if (type === "reset") {
                prefsDispatch({ type: "update_prefs", prefs: initialPrefsState_1.initialPrefsState });
            }
            // if (type === "remove_stock"){
            //     if (plotState.plotData.length === 0){
            //         plotDispatch({type:"replace_data",data:initialPlotState.plotData})
            //         prefsDispatch({type:"update_prefs",prefs:initialPrefsState})
            //     } else {
            //         const newMinMax = calcMinMax(plotState.plotData)
            //         prefsDispatch({type:"update_price_range",priceRange:newMinMax})
            //     }
            // }
        }
    }, [plotState.stateID]);
    (0, react_1.useEffect)(() => {
        console.log('Prefs State Update', { plotState, prefsState, inputState });
        if (prefsState.lastChange.type) {
            const { type } = prefsState.lastChange;
            if ((type === "update_start_date") || (type === "update_end_date") || (type === "update_date_range")) { //I'm not sure these need to be independent
                const selectedDayValues = (0, calcSelectedDays_1.default)(prefsState);
                const selectedDayStrings = selectedDayValues.map(date => date.toString());
                prefsDispatch({ type: "update_selected_days", selectedDayValues, selectedDayStrings });
            }
            if (type === "update_selected_days") {
                const tickValues = (0, calcTickValues_1.default)(prefsState, inputState);
                prefsDispatch({ type: "update_tick_values", tickValues });
            }
            if (type === "update_price_range") {
                prefsDispatch({ type: "update_selected_price_range", selectedPriceRange: prefsState.priceRange });
            }
            if ((type === "update_min_price") || (type === "update_max_price")) {
                prefsDispatch({ type: "update_selected_price_range", selectedPriceRange: prefsState.priceRange, nextChange: "none" });
            }
            if ((type === "update_selected_price_range") && (prefsState.nextChange === "update_date_range")) { //this is incredibly hacky and I hate it
                if (!inputState.customDate) {
                    const newXDomain = (0, calcStartEnd_1.default)(plotState.plotData);
                    const newDayValues = (0, calcDayValues_1.default)(plotState.plotData);
                    console.log('debug Prefs State Context', { prefsState, newXDomain, newDayValues, plotState, type });
                    prefsDispatch({ type: "update_date_range", xDomain: newXDomain, dayValues: newDayValues });
                }
            }
        }
    }, [prefsState.stateID]);
    return (react_1.default.createElement(StockContext.Provider, { value: {
            plotState,
            prefsState,
            inputState,
            plotDispatch,
            prefsDispatch,
            inputDispatch
        } }, props.children));
};
exports.StockContextProvider = StockContextProvider;
