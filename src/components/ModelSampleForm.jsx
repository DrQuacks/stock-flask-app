import React from "react"
import InputFormContainer from "./InputFormContainer";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';


function ModelSampleForm({plotData,handleInput,setPrefs}) {

    function valuetext(value) {
        return `${value}%`;
      }
      
    const [value, setValue] = React.useState([0, 80, 100]);
    
    const inputFormBuilder = (formData,handleChangeCallBack,setFormData) => {

        const InputFormElement = 
            <div>
                <div className="SymbolDays">
                    <input
                        type="text"
                        placeholder={formData.trainingBounds[0]}
                        onChange={handleChangeCallBack}
                        name="trainStart"
                        value={formData.trainingBounds[0]}
                    />

                    <input
                        type="text"
                        placeholder={formData.trainingBounds[1]}
                        onChange={handleChangeCallBack}
                        name="trainEnd"
                        value={formData.trainingBounds[1]}
                    />

                    <input
                        type="text"
                        placeholder={formData.trainingBounds[2]}
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
                        onChange={handleChangeCallBack}
                        valueLabelDisplay="off"
                        getAriaValueText={valuetext}
                    />
                </Box>
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