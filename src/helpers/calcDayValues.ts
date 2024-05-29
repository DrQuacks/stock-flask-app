import { PlotData } from "src/static/initialPlotState"

//this function now has a bug due to double length of Open/Close
const calcDayValues = (plots:PlotData) => {
  console.log("In calc day values, plots is: ",plots)
  const indexLongest = plots.reduce((acc,stock,index)=>{
    const thisLength = stock.daysList.length
      if (thisLength > acc["length"]){
        return {"index":index,"length":stock.daysList.length}
      }
      return acc
  },{"index":0,"length":0})
  console.log("In calc day values, idenxLongest is: ",indexLongest)
  const longestDayList = plots[indexLongest["index"]].daysList
  //console.log('[Longest Day List] is: ',[longestDayList])
  return longestDayList
}

export default calcDayValues