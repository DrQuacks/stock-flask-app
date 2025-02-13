import React , { ChangeEvent } from "react"
import {InputFormContainer,InputFormData} from "./InputFormContainer";
import DateRangeElement from "./DateRangeElement";


function InvestInputForm() {
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
                    <div className="InvestDateRangeContainer">
                        <DateRangeElement 
                            type = "Start Date"
                            date = {formData.startInvest}
                        />
                        <DateRangeElement 
                            type = "End Date"
                            date = {formData.endInvest}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Start Amount"
                        onChange={handleChangeCallBack}
                        name="startAmount"
                        value={formData.startAmount}
                    />

                    <input
                        type="text"
                        placeholder="Available Cash"
                        onChange={handleChangeCallBack}
                        name="availableCash"
                        value={formData.availableCash}
                    />

                    <input
                        type="text"
                        placeholder="Buy/Sell"
                        onChange={handleChangeCallBack}
                        name="buySell"
                        value={formData.buySell}
                    />
                    <button className = "PlotButton">Invest</button>
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

export default InvestInputForm