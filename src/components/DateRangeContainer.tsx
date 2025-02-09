import React, { useState , useEffect , useContext } from "react";
import DateRangeElement from "./DateRangeElement";
import { StockContext } from "../StockContext";

const DateRangeContainer = () => {

    const { prefsState, prefsDispatch} = useContext(StockContext)!
    const {xDomain,dayValues} = prefsState
    console.log('debug State',prefsState)

    const startDate = xDomain[0]
    const endDate = xDomain[1]

    const [formData, setFormData] = useState({"start":startDate,"end":endDate})

    useEffect(() => {
        console.log('In DateRange, xDomain changed: ',[startDate,endDate])
        setFormData({"start":startDate,"end":endDate})
    },[startDate,endDate])

    const updateHandler = () => { //this seems unnecessary. Do I only want dates to update on the update click?
        prefsDispatch({type:"update_date_range",xDomain,dayValues})
        console.log('DateRange formData update is: ',formData)
    }

    const resetHandler = () => {
        const resetDomain = [dayValues[0],dayValues[dayValues.length - 1]]
        prefsDispatch({type:"update_date_range",xDomain:resetDomain,dayValues})
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