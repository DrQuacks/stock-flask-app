import React, { useState } from "react";
import DateRangeElement from "./DateRangeElement";

const DateRangeContainer = (setStartDate,setEndDate) => {

    const StartAndEnd
        = <div className="DateRangeContainer">
            <DateRangeElement 
                type = "Start Date"
                setDate = {setStartDate}
            />
            <DateRangeElement 
                type = "End Date"
                setDate = {setEndDate}
            />

        </div>
    
    return StartAndEnd

}

export default DateRangeContainer