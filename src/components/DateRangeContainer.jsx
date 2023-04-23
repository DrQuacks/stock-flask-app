import React, { useState , useEffect , useContext } from "react";
import DateRangeElement from "./DateRangeElement";
import { StockContext } from "../StockContext";

const DateRangeContainer = () => {

    const { plotState, prefsState, plotDispatch, prefsDispatch} = useContext(StockContext)
    const {xDomain,dayValues} = prefsState
    console.log('debug State',prefsState)

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

    const updateHandler = () => { //this seems unnecessary. Do I only want dates to update on the update click?
        prefsDispatch({type:"update_date_range",xDomain,dayValues})
        //setPrefs({"xDomain":xDomain})
        console.log('DateRange formData update is: ',formData)
    }

    const resetHandler = () => {
        const resetDomain = [dayValues[0],dayValues[dayValues.length - 1]]
        prefsDispatch({type:"update_date_range",xDomain:resetDomain,dayValues})
        // updateStartDate(dayValues[0])
        // updateEndDate(dayValues[dayValues.length - 1])
        // setPrefs({"xDomain":xDomain})
        //console.log('DateRange formData reset is: ',formData)
    }

    const StartAndEnd
        = <div className="DateRangeContainer">
            <DateRangeElement 
                type = "Start Date"
                date = {formData.start}
            />
            <DateRangeElement 
                type = "End Date"
                date = {formData.end}
            />
            <div className="DateButtons">
                <button onClick = {updateHandler} className = "UpdateDateButton">UPDATE</button>
                <button onClick = {resetHandler} className = "ResetDateButton">RESET</button>
            </div>
        </div>
    
    return StartAndEnd

}

export default DateRangeContainer