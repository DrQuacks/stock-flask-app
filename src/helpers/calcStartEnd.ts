import * as d3 from "d3";
import { PlotData } from "src/static/initialPlotState";

const calcStartEnd = (stockArray:PlotData) => {
    // const xDomain = <[string,string]>d3.extent(stockArray.reduce((acc,element) => {
    //   const thisExtent = [element.start,element.end]
    //   return [...acc,...thisExtent]
    // },[]))
    const extents = stockArray.reduce<Date[]>((acc,element) => {
      const thisExtent = [element.start,element.end]
      return [...acc,...thisExtent]
    },[])
    const xDomain = <[Date,Date]>d3.extent(extents)
    console.log('debug State',{xDomain,stockArray})
    return xDomain
}

export default calcStartEnd