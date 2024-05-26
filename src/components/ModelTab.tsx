import React from "react";
import ModelInputForm from "./ModelInputForm";
import ModelSampleForm from "./ModelSampleForm";

const ModelTab = ():React.JSX.Element => {

    const ModelTabComponent
        = <div className='TopBar'>
            <ModelInputForm/>
            <ModelSampleForm/>
        </div>
    
    return ModelTabComponent

}

export default ModelTab