import React , { useContext , Fragment } from "react";
import { StockContext } from "../StockContext";
import StatsTable from "./StatsTable";



const StatsContainer = () => {

    const {plotState} = useContext(StockContext)!
    const {plotData} = plotState

    const Stats = plotData[0].modelAnalysis.length === 0 ? <Fragment></Fragment> : 
    <div className='StatsSection'>
        <StatsTable
            key = {"targets"}
            type = {"targets"}
        />
        <StatsTable
            key = {"predictions"}
            type = {"predictions"}
        />
    </div>


    return Stats


}

export default StatsContainer