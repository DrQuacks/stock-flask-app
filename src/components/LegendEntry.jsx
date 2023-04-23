import React, { Fragment , useContext } from "react";
import { StockContext } from "../StockContext";

const LegendEntry = ({
    name,
    trailingDays,
    avgType,
    sampleType,
    index,
}) => {

    const colors = ["#619ED6", "#6BA547", "#F7D027", "#E48F1B", "#B77EA3", "#E64345", "#60CEED", "#9CF168", "#F7EA4A", "#FBC543", "#FFC9ED", "#E6696E"]
    const {plotDispatch} = useContext(StockContext)

    function handleChange() {
        plotDispatch({type:'remove_stock',index})
        //removeStock(index)
    }

    console.log('key is: ',name)

    const legend 
        = name ? <div className="LegendEntryDiv">
            <label
                 htmlFor="legendBox"
                 style={{"color":colors[index]}}
            >
                <span className = "LegendName">{name}</span> {trailingDays} day average
            </label>
            <button
                className="LegendDelete"  
                id="legendBox"
                onClick={handleChange}
            > [remove] </button>
        </div>
        :<Fragment></Fragment>

    return legend

}

export default LegendEntry