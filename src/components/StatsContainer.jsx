import React , { useContext , Fragment } from "react";
import { StockContext } from "../StockContext";



const StatsContainer = () => {

    const {plotState} = useContext(StockContext)
    const {modelAnalysis} = plotState

    const Stats = modelAnalysis.length === 0 ? <Fragment></Fragment> : <Fragment></Fragment>


    return Stats


}

export default StatsContainer