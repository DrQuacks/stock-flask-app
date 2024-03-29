import * as d3 from "d3";

const calcStartEnd = (stockArray) => {
    const xDomain = d3.extent(stockArray.reduce((acc,element) => {
      const thisExtent = [element.start,element.end]
      return [...acc,...thisExtent]
    },[]))
    console.log('debug State',{xDomain,stockArray})
    return xDomain
}

export default calcStartEnd