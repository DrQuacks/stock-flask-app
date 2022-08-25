import React, { useState , useEffect } from "react";
import DateRangeElement from "./DateRangeElement";

const DateRangeContainer = ({xDomain,dayValues,updateStartDate,updateEndDate,setPrefs}) => {

    //console.log('DateRangeContainer dates are: ',xDomain)
    const startDate = xDomain[0]
    //console.log('startDate is: ',startDate)
    const endDate = xDomain[1]
    //console.log('endDate is: ',endDate)

    const [formData, setFormData] = useState({"start":startDate,"end":endDate})

    useEffect(() => {
        console.log('In DateRange, xDomain changed: ',[startDate,endDate])
        setFormData({"start":startDate,"end":endDate})
    },[startDate,endDate])

    const updateHandler = () => { 
        setPrefs({"xDomain":xDomain})
        console.log('DateRange formData update is: ',formData)
    }

    const resetHandler = () => {
        updateStartDate(dayValues[0])
        updateEndDate(dayValues[dayValues.length - 1])
        setPrefs({"xDomain":xDomain})
        //console.log('DateRange formData reset is: ',formData)
    }

    const StartAndEnd
        = <div className="DateRangeContainer">
            <DateRangeElement 
                type = "Start Date"
                date = {formData.start}
                updateDate = {updateStartDate}
            />
            <DateRangeElement 
                type = "End Date"
                date = {formData.end}
                updateDate = {updateEndDate}
            />
            <div className="DateButtons">
                <button onClick = {updateHandler} className = "UpdateDateButton">UPDATE</button>
                <button onClick = {resetHandler} className = "ResetDateButton">RESET</button>
            </div>
        </div>
    
    return StartAndEnd

}

export default DateRangeContainer