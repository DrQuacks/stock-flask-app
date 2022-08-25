import React, { useState } from "react"
import * as d3 from "d3";
import sendToPython from "../helpers/sendToPython"
import dateToDate from "../helpers/dateToDate";

function PlotInputForm({plotData,handleInput,setPrefs}) {
    const [formData, setFormData] = useState(
        {
            stockSymbol: "", 
            trailingDays: "", 
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
                const data = sendToPython(formData,'/api/setPlot')
                const resolvedData = await data
                //console.log('almostResolvedData is: ',almostResolvedData)
                //const resolvedData = almostResolvedData['jsonResponse']
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
                    localMaxs:resolvedData.localMinsandMaxs[1]
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
                    placeholder="Trailing Days"
                    onChange={handleChange}
                    name="trailingDays"
                    value={formData.trailingDays}
                />

                <button className = "PlotButton">PLOT</button>
            </div>

            <div className="OptionsContainer">
                <div className="StockChecks">

                    <input 
                        type="checkbox" 
                        id="overlayNew" 
                        checked={formData.overlayNew}
                        onChange={handleChange}
                        name="overlayNew"
                    />
                    <label htmlFor="overlayNew">Overlay New</label>

                    <input 
                        type="checkbox" 
                        id="customDate" 
                        checked={formData.customDate}
                        onChange={handleChange}
                        name="customDate"
                    />
                    <label htmlFor="customDate">Persist Date</label>

                </div>
                
                
                
                <div className="StockDropDowns">
                <label htmlFor="avgType">Avg Type</label>
                    <select 
                        id="avgType" 
                        value={formData.avgType}
                        onChange={handleChange}
                        name="avgType"
                    >
                        <option value="Constant">Constant</option>
                        <option value="Linear">Linear</option>
                        <option value="Quadratic">Quadratic</option>
                        <option value="Exponential">Exponential</option>
                    </select>

                    <label htmlFor="sampleType">Sample</label>
                    <select 
                        id="sampleType" 
                        value={formData.sampleType}
                        onChange={handleChange}
                        name="sampleType"
                    >
                        <option value="Close">Close</option>
                        <option value="Open">Open</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                        <option value="Open/Close">Open/Close</option>
                    </select>
                </div>
            </div>

        </form>
    )

}

export default PlotInputForm