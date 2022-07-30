import React, { useEffect, useState } from "react";
import DatePicker from 'react-date-picker';

const DateRangeElement = ({type,date,updateDate}) => {

    //console.log('DateRangeElement date is: ',date)
    const [value, setValue] = useState(date);

    useEffect(() => {
        setValue(date)
    },[date])

    function handleChange() {
        //console.log('new date value is: ',value)
        updateDate(value)
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
            <DatePicker 
                id = "DatePicker"
                onChange={setValue}
                onBlur = {handleChange}
                value={value} 
                style={stylePicker}
                clearIcon={null}
            />
        </div>
    );
}

export default DateRangeElement