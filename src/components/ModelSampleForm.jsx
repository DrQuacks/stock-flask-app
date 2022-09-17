import React from "react"
import InputFormContainer from "./InputFormContainer";


function ModelSampleForm({plotData,handleInput,setPrefs}) {
    const inputFormBuilder = (formData,handleChangeCallBack) => {
        const InputFormElement = 
            <div>
                <div className="SymbolDays">
                    <input
                        type="text"
                        placeholder="Train Start"
                        onChange={handleChangeCallBack}
                        name="trainStart"
                        value={formData.trainStart}
                    />

                    <input
                        type="text"
                        placeholder="Train End"
                        onChange={handleChangeCallBack}
                        name="trainEnd"
                        value={formData.trainEnd}
                    />

                    <input
                        type="text"
                        placeholder="Test End"
                        onChange={handleChangeCallBack}
                        name="testEnd"
                        value={formData.testEnd}
                    />

                    <button className = "PlotButton">Model <br/> Data</button>
                </div>
            </div>
        return InputFormElement
    }

    return (
        <InputFormContainer
            plotData={plotData}
            handleInput={handleInput}
            setPrefs={setPrefs}
            inputFormBuilder={inputFormBuilder}
            route={'/api/setTrainTest'}
            modelSample={'Open/Close'}
        />
    )

}

export default ModelSampleForm