import React , { useContext , ChangeEvent } from "react"
import { InputFormContainer , InputFormData } from "./InputFormContainer";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { StockContext } from "../StockContext";



function ModelSampleForm() {

    const {prefsDispatch,prefsState} = useContext(StockContext)!

    function handleMouseUp(event) {
        console.log('debugHandleChange')
        prefsDispatch({type:"update_model_lines",showModelLines:false})
    }

    function valuetext(value) {
        return `${value}%`;
    }
          
    const inputFormBuilder = (
        {
            formData,
            handleChangeCallBack,
            handleChangeCheckboxCallBack,
            handleChangeSliderCallBack
        }:
        {
            formData:InputFormData,
            handleChangeCallBack:(event: (ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>)) => void,
            handleChangeCheckboxCallBack:(event: ChangeEvent<HTMLInputElement>) => void,
            handleChangeSliderCallBack: (event: Event, value: number[]|number) => void
            //handleChangeSliderCallBack: (event: Event, value: [number, number, number]) => void
        }
    ) => {

        const InputFormElement = 
            <div>
                <div className="SymbolDays">
                    <input
                        type="text"
                        placeholder={formData.trainingBounds[0] < prefsState.modelStart ? prefsState.modelStart.toString() : formData.trainingBounds[0].toString()}
                        onChange={handleChangeCallBack}
                        name="trainStart"
                        value={formData.trainingBounds[0] < prefsState.modelStart ? prefsState.modelStart : formData.trainingBounds[0]}
                    />

                    <input
                        type="text"
                        placeholder={formData.trainingBounds[1].toString()}
                        onChange={handleChangeCallBack}
                        name="trainEnd"
                        value={formData.trainingBounds[1]}
                    />

                    <input
                        type="text"
                        placeholder={formData.trainingBounds[2].toString()}
                        onChange={handleChangeCallBack}
                        name="testEnd"
                        value={formData.trainingBounds[2]}
                    />

                    <button className = "PlotButton">Model <br/> Data</button>
                </div>
                <Box sx={{ width: 630 }}>
                    <Slider
                        value={formData.trainingBounds}
                        name="trainingBounds"
                        onChange={handleChangeSliderCallBack}
                        onChangeCommitted={handleMouseUp}
                        valueLabelDisplay="off"
                        getAriaValueText={valuetext}
                        min={prefsState.modelStart}
                    />
                </Box>
            </div>
        return InputFormElement
    }

    return (
        <InputFormContainer
            inputFormBuilder={inputFormBuilder}
            route={'/api/setTrainTest'}
            modelSample={'Open/Close'}
            isModelInput={true}
        />
    )

}

export default ModelSampleForm