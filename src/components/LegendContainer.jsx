import React from "react";
import LegendEntry from "./LegendEntry";


const LegendContainer = ({plotData, removeStock}) => {

    const legendInsides = plotData.map((element,index) => {
        return (
            <LegendEntry
                key = {element.name}
                name = {element.name}
                trailingDays = {element.trailingDays}
                avgType = {element.avgType}
                sampleType = {element.sampleType}
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