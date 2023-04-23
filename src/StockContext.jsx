import React, { useReducer, useEffect } from "react";

import initialPlotState from './static/initialPlotState';
import {initialPrefsState,initialSemiPrefsState} from './static/initialPrefsState'
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
        selectedPriceRange
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
                console.log('debug State',{xDomain,lastChange,action})
                return {...prefsState,xDomain,dayValues,lastChange,stateID:newStateID}
            }
            case "update_selected_days":{
                return {...prefsState,selectedDayValues,lastChange,stateID:newStateID}
            }
            case "update_tick_values":{
                return {...prefsState,tickValues,lastChange,stateID:newStateID}
            }
            case "update_price_range":{
                return{...prefsState,priceRange,lastChange,stateID:newStateID}
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
        console.log('Plot State Context',plotState)
        if (plotState.lastChange.type){
            const {type} = plotState.lastChange
            if ((type === "update_data") || (type === "replace_data")){
                const {plotData}= plotState
                const priceRange = calcMinMax(plotData)
                prefsDispatch({type:"update_price_range",priceRange}) //I think this is the core of the problem, there's also a call to prefsDispatch before this plotsDIspatch call was made
                if (!inputState.customDate){
                    const dateRange = calcStartEnd(plotData)
                    const dayValues = calcDayValues(plotData)
                    console.log('debug State',{dateRange})
                    prefsDispatch({type:"update_date_range",xDomain:dateRange,dayValues})
                }
            }
            if (type === "remove_stock"){
                if (plotState.plotData.length === 0){
                    plotDispatch({type:"replace_data",data:initialPlotState.plotData})
                    prefsDispatch({type:"update_prefs",prefs:initialPrefsState})
                } else {
                    if (!inputState.customDate){
                        const newXDomain = calcStartEnd(plotState.plotData)
                        const newDayValues = calcDayValues(plotState.plotData)
                        prefsDispatch({type:"update_date_range",xDomain:newXDomain,dayValues:newDayValues})
                        console.log('After removal, plotPrefs is: ',prefsState)
                    }
                    const newMinMax = calcMinMax(plotState.plotData)
                    prefsDispatch({type:"update_price_range",priceRange:newMinMax})
                }
            }
        }

    },[plotState.stateID])

    useEffect(() => {
        console.log('Prefs State Context',prefsState)
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