import React, { useEffect, useRef } from "react";
import LegendEntry from "./LegendEntry";


const LegendContainer = ({stockKeys, removeStock}) => {

    const legendInsides = stockKeys.map((key,index) => {
        return (
            <LegendEntry
                key = {key}
                name = {key}
                index = {index}
                removeStock = {removeStock}
            />
        )
    })

    const legend 
        = <div>
            {legendInsides}
        </div>

    return legend


}

export default LegendContainer