import React from "react";
import InvestInputForm from "./InvestInputForm";
import DateRangeContainer from "./DateRangeContainer";

const InvestTab = ():React.JSX.Element => {

    const ModelTabComponent
        = <div className='TopBar'>
            <InvestInputForm/>
        </div>
    
    return ModelTabComponent

}

export default InvestTab