import * as d3 from "d3";
import { PlotData } from "src/static/initialPlotState";

const calcMinMax = (stockArray:PlotData) => {
  const extentList = stockArray.reduce<number[]>((acc,element) => {
    const thisExtent = [element.min,element.max]
    return [...acc,...thisExtent]
  },[])
  const yRange:[number,number] = <[number,number]>d3.extent(extentList)
  // const yRange:[number,number] = d3.extent(stockArray.reduce<number[]>((acc,element) => {
  //   const thisExtent = [element.min,element.max]
  //   return [...acc,...thisExtent]
  // },[]))
  return yRange
}

export default calcMinMax