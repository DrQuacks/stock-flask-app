import React, { useEffect, useState, useContext } from "react";
import DatePicker from 'react-date-picker';
import { StockContext } from "../StockContext";


const DateRangeElement = ({type,date}) => {

    const { prefsDispatch } = useContext(StockContext)!
    //console.log('DateRangeElement date is: ',date)
    const [value, setValue] = useState(date);

    useEffect(() => {
        setValue(date)
    },[date])

    function handleChange() {
        //console.log('new date value is: ',value)
        const dispatchType = type === "Start Date" ? "update_start_date" : "update_end_date"
        prefsDispatch({type:dispatchType,date:value})
        //updateDate(value)
    }

    const rowValue = type === "Start Date" ? 1:2

    const styleElement = {
        "gridRow":rowValue
    }
    
    const styleLabel = {
        "color":"white",
        "gridColumn":"1",
    }

    const stylePicker = {
        "gridColumn":"2",

    }
    
    return (
        <div className = "DateElement" style ={styleElement}>
            <label
                className="DatePickerLabel"
                htmlFor="DatePicker"
                style={styleLabel}
            >
                {type}
            </label>
            <div className="DatePickerWrapper" style={stylePicker}>
                <DatePicker 
                    key = "DatePicker"
                    onChange={setValue}
                    onCalendarClose = {handleChange}
                    value={value} 
                    clearIcon={null}
                />
            </div>
            {/* <DatePicker 
                id = "DatePicker"
                onChange={setValue}
                onBlur = {handleChange}
                value={value} 
                style={stylePicker}
                clearIcon={null}
            /> */}
        </div>
    );
}

export default DateRangeElement