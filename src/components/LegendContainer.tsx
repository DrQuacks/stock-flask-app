import React , { useContext } from "react";
import LegendEntry from "./LegendEntry";
import { StockContext } from "../StockContext";



const LegendContainer = () => {

    const {plotState} = useContext(StockContext)
    const {plotData} = plotState

    const legendInsides = plotData.map((element,index) => {
        return (
            <LegendEntry
                key = {`${element.name}${element.trailingDays}`}
                name = {element.name}
                trailingDays = {element.trailingDays}
                index = {index}
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