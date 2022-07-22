import React, { useState } from "react"

import sendToPython from "../helpers/sendToPython"
import dateToDate from "../helpers/dateToDate";

function PlotInputForm({setPlotData,plotData,handleInput,setPrefs}) {
    const [formData, setFormData] = useState(
        {
            stockSymbol: "", 
            trailingDays: "", 
            semiLog: false, 
            overlayRaw: false, 
            overlayNew: false,
            customDate: false,
            avgType: "constant",
            sampleType: "close"
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

    async function handleSubmit(event) {
        event.preventDefault()
        const prefs = {
            semiLog: formData.semiLog,
            overlayRaw: formData.overlayRaw,
            overlayNew: formData.overlayNew,
            customDate: formData.customDate
        }
        setPrefs(prefs)
        const stockNames = plotData.map((stock) => {
            return stock.stockSymbol
        })
        //don't add a stock that's already been added
        if (!stockNames.includes(formData.stockSymbol)){
            //I need to handle blank inputs
            //what's in here is working from the outside, but it's logging errors in python
            const data = sendToPython(formData)
            const resolvedData = await data
            console.log('resolvedData is: ',resolvedData)
            const newPlotData = {
                name:formData.stockSymbol,
                data:resolvedData.stockArray,
                trailingDays:formData.trailingDays,
                avgType:formData.avgType,
                sampleType:formData.sampleType,
                start:dateToDate(resolvedData.stockFeatures.start_date),
                end:dateToDate(resolvedData.stockFeatures.end_date),
                min:resolvedData.stockFeatures.min_price,
                max:resolvedData.stockFeatures.max_price
            }
            handleInput(newPlotData)
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
                        id="semiLog" 
                        checked={formData.semiLog}
                        onChange={handleChange}
                        name="semiLog"
                    />
                    <label htmlFor="semiLog">Semi-Log</label>

                    <input 
                        type="checkbox" 
                        id="overlayRaw" 
                        checked={formData.overlayRaw}
                        onChange={handleChange}
                        name="overlayRaw"
                    />
                    <label htmlFor="overlayRaw">Overlay Raw</label>

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
                        <option value="constant">Constant</option>
                        <option value="linear">Linear</option>
                        <option value="quadratic">Quadratic</option>
                        <option value="exponential">Exponential</option>
                    </select>

                    <label htmlFor="sampleType">Sample</label>
                    <select 
                        id="sampleType" 
                        value={formData.sampleType}
                        onChange={handleChange}
                        name="sampleType"
                    >
                        <option value="close">Close</option>
                        <option value="open">Open</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

        </form>
    )

}

export default PlotInputForm