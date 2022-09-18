import React, { useState } from "react"
import * as d3 from "d3";
import sendToPython from "../helpers/sendToPython"
import dateToDate from "../helpers/dateToDate";

function InputFormContainer({plotData,handleInput,setPrefs,inputFormBuilder,route,modelSample}) {
    const [formData, setFormData] = useState(
        {
            stockSymbol: "", 
            trailingDays: "",
            stepSize:"",
            max:"",
            //trainStart:"",
            //trainEnd:"",
            //testEnd:"",
            trainingBounds:['0','80','100'],
            overlayNew: false,
            customDate: false,
            avgType: "Constant",
            sampleType: modelSample || "Close"
        }
    )

    function handleChange(event) {
        const {name, value, type, checked} = event.target
        //console.log('[name, value, type, checked]: ',[name, value, type, checked])
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    function generateScale(dataArray) {
        const domain = dataArray.map((row) => {
            if (row.type){
                return dateToDate(row.date,row.type)
            }
            return dateToDate(row.date)
        })
        const range = dataArray.map((row) => [row.price,row.rawPrice])

        console.log('[domain,range] is: ',[domain,range])
        return (
            d3.scaleOrdinal()
                .domain(domain)
                .range(range)
        )
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const prefs = {
            overlayNew: formData.overlayNew,
            customDate: formData.customDate,
            doubleDates: formData.sampleType === "Open/Close" ? true : false
        }
        setPrefs(prefs)
        
        //I need to handle blank inputs
        //what's in here is working from the outside, but it's logging errors in python
        const data = sendToPython(formData,route)
        const resolvedDataDict = await data
        console.log('resolvedDataDict is: ',resolvedDataDict)
        const plotKeys = Object.keys(resolvedDataDict.plotData)
        let newPlotDataList = []
        plotKeys.forEach((resolvedDataKey,index) => {
            const days = formData.trailingDays || (parseInt(formData.stepSize)*(index+1))
            console.log("days is: ",days)
            const resolvedData = resolvedDataDict.plotData[resolvedDataKey]
            console.log('resolvedDataKey and resolvedData are: ',[resolvedDataKey,resolvedData])
            const formattedDays = (resolvedData.stockFeatures.days_list)
                .map(day => dateToDate(day))
            //console.log('[formattedDays] is: ',[formattedDays])
            const newPlotData = {
                name:formData.stockSymbol,
                data:resolvedData.stockArray,
                trailingDays:days,
                avgType:formData.avgType,
                sampleType:formData.sampleType,
                start:dateToDate(resolvedData.stockFeatures.start_date),
                end:dateToDate(resolvedData.stockFeatures.end_date),
                min:resolvedData.stockFeatures.min_price,
                max:resolvedData.stockFeatures.max_price,
                minDeriv:resolvedData.stockFeatures.min_deriv,
                maxDeriv:resolvedData.stockFeatures.max_deriv,
                minDeriv2:resolvedData.stockFeatures.min_deriv2,
                maxDeriv2:resolvedData.stockFeatures.max_deriv2,
                datePriceScale:generateScale(resolvedData.stockArray),
                daysList:formattedDays,
                localMins:resolvedData.localMinsandMaxs[0],
                localMaxs:resolvedData.localMinsandMaxs[1],
                modelAnalysis:resolvedDataDict.modelAnalysis
            }
            newPlotDataList = [...newPlotDataList,newPlotData]
        })
        handleInput(newPlotDataList)
 
        console.log("event is: ",event)
        setFormData((priorForm) => {
            const clearedForm = {...priorForm,
                stockSymbol: "", 
                trailingDays: "",
                stepSize: "",
                max: ""
            }
            return clearedForm
        })
    }

    const InputForm = inputFormBuilder(formData,handleChange)
    //console.log('InputForm is: ',InputForm)

    return (
        <form
            className="PlotInputForm"
            onSubmit={handleSubmit}
        >
           {InputForm}
        </form>
    )

}

export default InputFormContainer