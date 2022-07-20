import React, { useState , useEffect, useRef } from "react";


const LegendEntry = ({name,index,removeStock}) => {
    
    const [isChecked,setIsChecked] = useState(true)

    const colors = ["#619ED6", "#6BA547", "#F7D027", "#E48F1B", "#B77EA3", "#E64345", "#60CEED", "#9CF168", "#F7EA4A", "#FBC543", "#FFC9ED", "#E6696E"]

    function handleChange() {
        setIsChecked(prevFormData => {
            setIsChecked(!prevFormData)    
        })
        removeStock(index)
    }
    console.log('key is: ',name)

    const legend 
        = <div className="LegendEntryDiv">
            <label
                 htmlFor="legendBox"
                 style={{"color":colors[index]}}
            >
                {name}
            </label>
            <input 
                type="checkbox" 
                id="legendBox" 
                checked={!!isChecked}
                onChange={handleChange}
            />
        </div>

    return legend

}

export default LegendEntry