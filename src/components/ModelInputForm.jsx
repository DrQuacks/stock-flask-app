import React, { useState } from "react"
import * as d3 from "d3";
import sendToPython from "../helpers/sendToPython"
import dateToDate from "../helpers/dateToDate";

function ModelInputForm({plotData,handleInput,setPrefs}) {
    const [formData, setFormData] = useState(
        {
            stockSymbol: "", 
            stepSize: "",
            max:"",
            semiLog: false, 
            overlayNew: false,
            customDate: false,
            firstDeriv: false,
            secondDeriv: false,
            avgType: "Constant",
            sampleType: "Close"
        }
    )

    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    function generateScale(dataArray) {
        const domain = dataArray.map((row) => dateToDate(row.date))
        const range = dataArray.map((row) => [row.price,row.rawPrice])

        //console.log('[domain,range] is: ',[domain,range])
        return (
            d3.scaleOrdinal()
                .domain(domain)
                .range(range)
        )
    }

    async function handleSubmit(event) {
        event.preventDefault()
        //console.log('In handleSUbmit, button was is: ',event.nativeEvent.submitter.className)
        const buttonType = event.nativeEvent.submitter.className
        const prefs = {
            semiLog: formData.semiLog,
            overlayNew: formData.overlayNew,
            customDate: formData.customDate,
            firstDeriv: formData.firstDeriv,
            secondDeriv: formData.secondDeriv
        }
        setPrefs(prefs)
        
        if (buttonType === "PlotButton"){
            const stockNames = plotData.map((stock) => {
                return stock.stockSymbol
            })
            //don't add a stock that's already been added
            if (!stockNames.includes(formData.stockSymbol)){
                //I need to handle blank inputs
                //what's in here is working from the outside, but it's logging errors in python
                const data = sendToPython(formData,'/api/setModel')
                const resolvedData = await data
                console.log('resolvedData is: ',resolvedData)
                const formattedDays = (resolvedData.stockFeatures.days_list)
                    .map(day => dateToDate(day))
                //console.log('[formattedDays] is: ',[formattedDays])
                const newPlotData = {
                    name:formData.stockSymbol,
                    data:resolvedData.stockArray,
                    trailingDays:formData.trailingDays,
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
                    modelAnalysis:resolvedData.modelAnalysis
                }
                handleInput(newPlotData)
            }
        }
        console.log("event is: ",event)
        setFormData((priorForm) => {
            const clearedForm = {...priorForm,
                stockSymbol: "", 
                trailingDays: ""
            }
            return clearedForm
        })
    }

    return (
        <form
            className="PlotInputForm"
            onSubmit={handleSubmit}
        >
            <div className="SymbolDays">
                <input
                    type="text"
                    placeholder="Stock Symbol"
                    onChange={handleChange}
                    name="stockSymbol"
                    value={formData.stockSymbol}
                />

                <input
                    type="text"
                    placeholder="Step Size"
                    onChange={handleChange}
                    name="stepSize"
                    value={formData.stepSize}
                />

                <input
                    type="text"
                    placeholder="Max"
                    onChange={handleChange}
                    name="max"
                    value={formData.max}
                />

                <button className = "PlotButton">Model</button>
            </div>
        </form>
    )

}

export default ModelInputForm