import React, { useState } from "react";

const GraphOptions = ({setPrefs}) => {

    const [plotPrefsState,setPlotPrefsState] = useState({
        "semilog":false,
        "firstDeriv":false,
        "secondDeriv":false,
        "localMins":false,
        "localMaxs":false
    })
    
    const handleChange = (event) => {
        const {name, checked} = event.target

        const newPlotPrefs = {...plotPrefsState,[name]: checked}
        setPlotPrefsState(newPlotPrefs)
        setPrefs(newPlotPrefs)

    }
    
    return (

        <div className="GraphOptionsContainer">
                <input 
                    type="checkbox" 
                    id="semiLog" 
                    checked={plotPrefsState.semiLog}
                    onChange={handleChange}
                    name="semiLog"
                    className="OptionsInput"
                />
                <label className="OptionsLabel" htmlFor="semiLog">Semi-Log</label>

            <input 
                    type="checkbox" 
                    id="firstDeriv" 
                    checked={plotPrefsState.firstDeriv}
                    onChange={handleChange}
                    name="firstDeriv"
                    className="OptionsInput"
                />
                <label className="OptionsLabel" htmlFor="firstDeriv">First Derivative</label>

            <input 
                type="checkbox" 
                id="secondDeriv" 
                checked={plotPrefsState.secondDeriv}
                onChange={handleChange}
                name="secondDeriv"
                className="OptionsInput"
            />
            <label className="OptionsLabel" htmlFor="secondDeriv">Second Derivative</label>

            <input 
                type="checkbox" 
                id="localMins" 
                checked={plotPrefsState.localMins}
                onChange={handleChange}
                name="localMins"
                className="OptionsInput2"
                style={{"grid-row":"1"}}
            />
            <label className="OptionsLabel2" style={{"grid-row":"1"}} htmlFor="localMins">Local Mins</label>
            
            <input 
                type="checkbox" 
                id="localMaxs" 
                checked={plotPrefsState.localMaxs}
                onChange={handleChange}
                name="localMaxs"
                className="OptionsInput2"
                style={{"grid-row":"2"}}
            />
            <label className="OptionsLabel2" style={{"grid-row":"2"}} htmlFor="localMaxs">Local Maxs</label>
        </div>
    )
}

export default GraphOptions