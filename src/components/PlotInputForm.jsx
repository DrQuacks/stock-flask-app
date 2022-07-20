import React, { useState } from "react"

import sendToPython from "../helpers/sendToPython"

function PlotInputForm({setInput,setPrefs,setKeys,stockKeys}) {
    const [formData, setFormData] = useState(
        {
            stockSymbol: "", 
            trailingDays: "", 
            semiLog: false, 
            overlayRaw: false, 
            overlayNew: false,
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
            overlayNew: formData.overlayNew
        }
        setPrefs(prefs)
        //don't add a stock that's already been added
        if (!stockKeys.includes(formData.stockSymbol)){
            setKeys(formData.stockSymbol)
            const data = sendToPython(formData)
            const resolvedData = await data
            setInput(resolvedData)
        }
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

                <button>PLOT</button>
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