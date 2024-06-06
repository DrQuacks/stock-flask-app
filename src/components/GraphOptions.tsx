import React, { useState , useContext , ChangeEvent } from "react";
import { StockContext } from "../StockContext";
import {PlotPrefsState} from "../static/initialPrefsState"

const GraphOptions = () => {

    const { prefsDispatch} = useContext(StockContext)

    const [plotPrefsState,setPlotPrefsState] = useState<PlotPrefsState>({
        semiLog:false,
        firstDeriv:false,
        secondDeriv:false,
        localMins:false,
        localMaxs:false
    })
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target

        const newPlotPrefs:PlotPrefsState = {...plotPrefsState,[name]: checked}
        setPlotPrefsState(newPlotPrefs)
        prefsDispatch({type:'update_plot_prefs',plotPrefs:newPlotPrefs})
        //setPrefs(newPlotPrefs)

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
                id="localMaxs" 
                checked={plotPrefsState.localMaxs}
                onChange={handleChange}
                name="localMaxs"
                className="OptionsInput21"
            />
            <label className="OptionsLabel21" htmlFor="localMaxs">Local Maxs</label>
            
            <input 
                type="checkbox" 
                id="localMins" 
                checked={plotPrefsState.localMins}
                onChange={handleChange}
                name="localMins"
                className="OptionsInput22"
            />
            <label className="OptionsLabel22" htmlFor="localMins">Local Mins</label>
            
            
        </div>
    )
}

export default GraphOptions