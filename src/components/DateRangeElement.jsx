import React, { useState } from "react";
import DatePicker from 'react-date-picker';

const DateRangeElement = ({type,setDate}) => {

    const [value, setValue] = useState(new Date());

    function handleChange() {
        setDate(value)
    }

    const rowValue = type == "Start Date" ? 1:2

    const styleLabel = {
        "color":"white",
        "grid-column":"1",
        "grid-row":rowValue
    }

    const stylePicker = {
        "grid-column":"2",
        "grid-row":rowValue
    }
    
    return (
        <div className = "DateElement">
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
            />
        </div>
    );
}

export default DateRangeElement