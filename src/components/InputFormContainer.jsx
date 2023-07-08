import React, { useState , useContext } from "react"
import * as d3 from "d3";
import sendToPython from "../helpers/sendToPython"
import dateToDate from "../helpers/dateToDate";
import { StockContext } from "../StockContext";


function InputFormContainer({inputFormBuilder,route,modelSample,isModelInput=false}) {

    const { plotState, prefsState, plotDispatch, prefsDispatch, inputDispatch} = useContext(StockContext)

    const [formData, setFormData] = useState( //this is a terrible way to initialize this
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
        console.log('debugHandleChange',{name, value, type, checked,event,formData,prefsState,plotState})
        // if ((name === "trainingBounds") && !prefsState.showModelLines){
        if ((name === "trainingBounds")){
            const {dayValues} = prefsState
            const dayArray = formData.trainingBounds.map((bound) => {
                const index = Math.floor(((bound/100) * dayValues.length) - 1)
                return dayValues[index]
            })
            prefsDispatch({type:"update_model_lines",showModelLines:true,modelLineDays:dayArray})
        }
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
        //setPrefs(prefs)
        inputDispatch({type:'update_input_prefs',prefs})
        
        //I need to handle blank inputs
        //what's in here is working from the outside, but it's logging errors in python
        const data = sendToPython(formData,route)
        const resolvedDataDict = await data
        console.log('resolvedDataDict is: ',resolvedDataDict)
        let newPlotDataList = [] //yeah, uhh, this should be done with reduce...

        if (isModelInput){
            const {plotData} = plotState
            plotData.forEach((plot) =>{
                newPlotDataList = [
                    ...newPlotDataList,
                    {...plot,modelAnalysis:resolvedDataDict.modelAnalysis,splits:resolvedDataDict.splits}
                ]
            })
        } else {
            const plotKeys = Object.keys(resolvedDataDict.plotData)
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
                    //modelAnalysis:resolvedDataDict.modelAnalysis,
                    //splits:resolvedDataDict.splits
                }
                newPlotDataList = [...newPlotDataList,newPlotData]
            })
        }
        console.log('debugFormData',{formData,newPlotDataList})

        //handleInput(newPlotDataList)
        if(prefs.overlayNew){
            plotDispatch({type:'update_data',data:newPlotDataList})
        } else {
            plotDispatch({type:'replace_data',data:newPlotDataList})
        }
 
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