import React, { useState } from "react";
import DateRangeElement from "./DateRangeElement";

const DateRangeContainer = ({xDomain,updateStartDate,updateEndDate}) => {

    console.log('DateRangeContainer dates are: ',xDomain)
    const startDate = xDomain[0]
    console.log('startDate is: ',startDate)
    const endDate = xDomain[1]
    console.log('endDate is: ',endDate)

    const StartAndEnd
        = <div className="DateRangeContainer">
            <DateRangeElement 
                type = "Start Date"
                date = {startDate}
                updateDate = {updateStartDate}
            />
            <DateRangeElement 
                type = "End Date"
                date = {endDate}
                updateDate = {updateEndDate}
            />

        </div>
    
    return StartAndEnd

}

export default DateRangeContainer