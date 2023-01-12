import * as d3 from "d3";

const calcMinMax = (stockArray) => {
  const yRange = d3.extent(stockArray.reduce((acc,element) => {
    const thisExtent = [element.min,element.max]
    return [...acc,...thisExtent]
  },[]))
  return yRange
}

export default calcMinMax