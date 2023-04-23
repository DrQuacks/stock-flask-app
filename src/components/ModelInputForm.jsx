import React from "react"
import InputFormContainer from "./InputFormContainer";


function ModelInputForm() {
    const inputFormBuilder = (formData,handleChangeCallBack) => {
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
                        placeholder="Step Size"
                        onChange={handleChangeCallBack}
                        name="stepSize"
                        value={formData.stepSize}
                    />

                    <input
                        type="text"
                        placeholder="Max"
                        onChange={handleChangeCallBack}
                        name="max"
                        value={formData.max}
                    />

                    <button className = "PlotButton">Prep <br/> Data</button>
                </div>
            </div>
        return InputFormElement
    }

    return (
        <InputFormContainer
            inputFormBuilder={inputFormBuilder}
            route={'/api/setModel'}
            modelSample={'Open/Close'}
        />
    )

}

export default ModelInputForm