import React, { useReducer, useState, useEffect, useRef } from "react";

import initialPlotState from './static/initialPlotState';
import {initialPrefsState,initialSemiPrefsState} from './static/initialPrefsState'
import calcSelectedDays from './helpers/calcSelectedDays'
import calcTickValues from './helpers/calcTickValues'
import calcMinMax from "./helpers/calcMinMax";
import calcStartEnd from "./helpers/calcStartEnd";

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
                return {...plotState,data,lastChange,stateID:newStateID} //plotState isn't an object though...
            }
            case "remove_stock": {
                let plotStateCopy = [...plotState]
                plotStateCopy.splice(index,1)
                return {...plotState,lastChange,stateID:newStateID}
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

const StockContext = React.createContext(null)

const StockContextProvider = (props) => {

    const [plotState,plotDispatch] = useReducer(plotReducer,initialPlotState)
    const [prefsState,prefsDispatch] = useReducer(prefsReducer,initialPrefsState)

    useEffect(() => {
        if (plotState.lastChange.type){
            const {type} = plotState.lastChange
            if (type === "update_data"){
                const {data}= plotState
                const priceRange = calcMinMax(data)
                prefsDispatch({type:"update_price_range",priceRange})
                if (!prefsState.customDate){
                    const dateRange = calcStartEnd(data)
                    prefsDispatch({type:"update_date_range",dateRange})
                }
            }
            if (type === "remove_stock"){
            }
        }

    },plotState.stateID)

    useEffect(() => {
        if (prefsState.lastChange.type){
            const {type} = prefsState.lastChange
            if ((type === "update_start_date") || (type === "update_end_date") || (type === "update_date_range")){
                const selectedDayValues = calcSelectedDays(prefsState)
                prefsDispatch({type:"update_selected_days",selectedDayValues})
            }
            if (type === "update_selected_days") {
                const tickValues = calcTickValues(prefsState)
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
            plotDispatch,
            prefsDispatch
          }} 
        >
          {props.children}
        </StockContext.Provider>
      )

}

export {StockContext,StockContextProvider}