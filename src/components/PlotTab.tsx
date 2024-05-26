import React from "react";
import PlotInputForm from "./PlotInputForm";
import GraphOptions from "./GraphOptions";
import DateRangeContainer from "./DateRangeContainer";
import PriceRangeContainer from "./PriceRangeContainer";

const PlotTab = ():React.JSX.Element => {

    const PlotTabComponent
        = <div className='TopBar'>
            <PlotInputForm/>
            <GraphOptions/>
            <DateRangeContainer/>
            <PriceRangeContainer/>
        </div>
    
    return PlotTabComponent

}

export default PlotTab