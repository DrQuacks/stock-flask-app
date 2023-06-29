import React, { useReducer, useEffect } from "react";
import initialPlotState from './static/initialPlotState';
import initialPrefsState from './static/initialPrefsState'
import initialInputState from "./static/initialInputState";
import calcSelectedDays from './helpers/calcSelectedDays'
import calcTickValues from './helpers/calcTickValues'
import calcMinMax from "./helpers/calcMinMax";
import calcStartEnd from "./helpers/calcStartEnd";
import calcDayValues from "./helpers/calcDayValues";

const plotReducer = (plotState,action) => {
    const {
        type,
        data,
        index
    } = action
    if (type) {
        let lastChange = {type}
        const newStateID = plotState.stateID + 1
        switch(type) {
            case "update_data": {
                const newPlotStateData = [...plotState['plotData'],...data]
                return {plotData:newPlotStateData,lastChange,stateID:newStateID}
            }
            case "replace_data": {
                return {plotData:data,lastChange,stateID:newStateID}
            }
            case "remove_stock": {
                let plotStateDataCopy = [...plotState['plotData']]
                plotStateDataCopy.splice(index,1)
                return {plotData:plotStateDataCopy,lastChange,stateID:newStateID}
            }
            case "reset": {
                return {...initialPlotState,lastChange}
            }
            default: {
                return {...plotState,lastChange,stateID:newStateID}
            }
        }
    }
    return plotState
}

const prefsReducer = (prefsState,action) => {
    const {
        type,
        prefs,
        xDomain,
        dayValues,
        price,
        date,
        selectedDayValues,
        tickValues,
        priceRange,
        selectedPriceRange,
        nextChange
    } = action
    if (type) {
        let lastChange = {type}
        const newStateID = prefsState.stateID + 1
        switch(type) {
            case "update_prefs": {
                return {...prefsState,...prefs,lastChange,stateID:newStateID}
            }
            case "update_min_price": {
                const {selectedPriceRange} = prefsState
                const newSelectedPriceRange = [price,selectedPriceRange[1]]
                return {...prefsState,selectedPriceRange:newSelectedPriceRange,lastChange,stateID:newStateID}
            }
            case "update_max_price": {
                const {selectedPriceRange} = prefsState
                const newSelectedPriceRange = [selectedPriceRange[0],price]
                return {...prefsState,selectedPriceRange:newSelectedPriceRange,lastChange,stateID:newStateID}
            }
            case "update_start_date": {
                const {xDomain} = prefsState
                const newXDomain = [date,xDomain[1]]
                return {...prefsState,xDomain:newXDomain,lastChange,stateID:newStateID}
            }
            case "update_end_date": {
                const {xDomain} = prefsState
                const newXDomain = [xDomain[0],date]
                return {...prefsState,xDomain:newXDomain,lastChange,stateID:newStateID}
            }
            case "update_date_range":{
                return {...prefsState,xDomain,dayValues,lastChange,nextChange:"none",stateID:newStateID}
            }
            case "update_selected_days":{
                return {...prefsState,selectedDayValues,lastChange,stateID:newStateID}
            }
            case "update_tick_values":{
                return {...prefsState,dateTickValues:tickValues,lastChange,stateID:newStateID}
            }
            case "update_price_range":{
                return{...prefsState,priceRange,lastChange,nextChange,stateID:newStateID}
            }
            case "update_selected_price_range":{
                return{...prefsState,selectedPriceRange,lastChange,stateID:newStateID}
            }
            default: {
                return {...prefsState,lastChange}
            }
        }
    }
    return prefsState
}

const inputReducer = (inputState,action) => {
    const {
        type,
        prefs
    } = action
    if (type) {
        let lastChange = {type}
        const newStateID = inputState.stateID + 1
        switch(type) {
            case "update_input_prefs": {
                return {...inputState,...prefs,lastChange,stateID:newStateID}
            }
            default: {
                return {...inputState,lastChange,stateID:newStateID}
            }
        }
    }
    return inputState
}

const StockContext = React.createContext(null)

const StockContextProvider = (props) => {

    const [plotState,plotDispatch] = useReducer(plotReducer,initialPlotState)
    const [prefsState,prefsDispatch] = useReducer(prefsReducer,initialPrefsState)
    const [inputState,inputDispatch] = useReducer(inputReducer,initialInputState)

    useEffect(() => {
        console.log('Plot State Update',{plotState,prefsState,inputState})
        if (plotState.lastChange.type){
            const {type} = plotState.lastChange
            if ((type === "update_data") || (type === "replace_data")){
                const {plotData}= plotState
                const priceRange = calcMinMax(plotData)
                prefsDispatch({type:"update_price_range",priceRange,nextChange:"update_date_range"}) //I think this is the core of the problem, there's also a call to prefsDispatch before this plotsDIspatch call was made
            }
            if (type === "remove_stock"){
                const newMinMax = calcMinMax(plotState.plotData)
                prefsDispatch({type:"update_price_range",priceRange:newMinMax,nextChange:"update_date_range"})
            }
            if (type === "reset"){
                prefsDispatch({type:"update_prefs",prefs:initialPrefsState})
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

    },[plotState.stateID])

    useEffect(() => {
        console.log('Prefs State Update',{plotState,prefsState,inputState})
        if (prefsState.lastChange.type){
            const {type} = prefsState.lastChange
            if ((type === "update_start_date") || (type === "update_end_date") || (type === "update_date_range")){ //I'm not sure these need to be independent
                const selectedDayValues = calcSelectedDays(prefsState)
                prefsDispatch({type:"update_selected_days",selectedDayValues})
            } 
            if (type === "update_selected_days") {
                const tickValues = calcTickValues(prefsState,inputState)
                prefsDispatch({type:"update_tick_values",tickValues})
            }
            if (type === "update_price_range") {
                prefsDispatch({type:"update_selected_price_range",selectedPriceRange:prefsState.priceRange})
            }
            if ((type === "update_min_price") || (type === "update_max_price")) {
                prefsDispatch({type:"update_selected_price_range",selectedPriceRange:prefsState.priceRange,nextChange:"none"})
            }
            if ((type === "update_selected_price_range") && (prefsState.nextChange === "update_date_range")){ //this is incredibly hacky and I hate it
                if (!inputState.customDate){
                    const newXDomain = calcStartEnd(plotState.plotData)
                    const newDayValues = calcDayValues(plotState.plotData)
                    console.log('debug Prefs State Context',{prefsState,newXDomain,newDayValues,plotState,type})
                    prefsDispatch({type:"update_date_range",xDomain:newXDomain,dayValues:newDayValues})
                }
            }
        }
    },[prefsState.stateID])

    return (
        <StockContext.Provider
          value={{
            plotState,
            prefsState,
            inputState,
            plotDispatch,
            prefsDispatch,
            inputDispatch
          }} 
        >
          {props.children}
        </StockContext.Provider>
      )

}

export {StockContext,StockContextProvider}