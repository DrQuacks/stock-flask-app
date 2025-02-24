import React , {ChangeEvent} from "react"
import {InputFormContainer,InputFormData} from "./InputFormContainer";

function PlotInputForm(): React.JSX.Element {

    const inputFormBuilder = (
        {
            formData,
            handleChangeCallBack,
            handleChangeCheckboxCallBack
        }:
        {
            formData:InputFormData,
            handleChangeCallBack:(event: (ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>)) => void,
            handleChangeCheckboxCallBack:(event: ChangeEvent<HTMLInputElement>) => void
        }
    ) => {
        const InputFormElement = 
            <div>
                <div className="SymbolDays">
                    <input
                        type="text"
                        placeholder="Stock Symbol"
                        onChange={handleChangeCallBack}
                        name="stockSymbol"
                        value={formData.stockSymbol}
                    />

                    <input
                        type="text"
                        placeholder="Trailing Days"
                        onChange={handleChangeCallBack}
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
                            onChange={handleChangeCheckboxCallBack}
                            name="overlayNew"
                        />
                        <label htmlFor="overlayNew">Overlay New</label>

                        <input 
                            type="checkbox" 
                            id="customDate" 
                            checked={formData.customDate}
                            onChange={handleChangeCheckboxCallBack}
                            name="customDate"
                        />
                        <label htmlFor="customDate">Persist Date</label>

                    </div>
                    
                    
                    
                    <div className="StockDropDowns">
                    <label htmlFor="avgType">Avg Type</label>
                        <select 
                            id="avgType" 
                            value={formData.avgType}
                            onChange={handleChangeCallBack}
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
                            onChange={handleChangeCallBack}
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

            </div>
        return InputFormElement
    }

    return (
        <InputFormContainer
            inputFormBuilder={inputFormBuilder}
            route={'/api/setPlot'}
        />
    )

}

export default PlotInputForm