import React , { ChangeEvent } from "react"
import {InputFormContainer,InputFormData} from "./InputFormContainer";


function ModelInputForm() {
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