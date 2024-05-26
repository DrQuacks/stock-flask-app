import React , { useContext , Fragment } from "react";
import { StockContext } from "../StockContext";



const StatsTable = ({type}) => {

    const {plotState} = useContext(StockContext)!
    const {plotData} = plotState

    const Stats = (plotData[0].modelAnalysis && plotData[0].modelAnalysis.length === 0) ? <Fragment></Fragment> : 
    <div className='StatsSection'>

    </div>


    return Stats


}

export default StatsTable