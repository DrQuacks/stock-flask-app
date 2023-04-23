import * as d3 from "d3";
import dateToTickString from './dateToTickString';


const calcTickValues = (prefsState,inputState) => {
    const maxTicks = 15
    const days = prefsState.selectedDayValues
    const totalTime = days[days.length-1].getTime() - days[0].getTime()
    const totalDays = Math.floor(totalTime/86400000)
    const totalMonths = Math.floor(totalDays/30.5)
    const totalYears = Math.floor(totalDays/365.25)

    const displayType = totalMonths < 6 ? "day" : totalYears < 6 ? "month" : "year"
    const totalType = totalMonths < 6 ? totalDays : totalYears < 6 ? totalMonths : totalYears
    console.log("totalDays,totalMonths,totalYears,displayType is: ",[totalDays,totalMonths,totalYears,displayType])

    let numberTicks = maxTicks
    let remainder = 0
    let startOffset = 0
    let endOffset = 0
    let dateInterval = 1
    //const multiplier = (displayType === "year") ? 252 : (displayType === "month") ? 21 : 1
    const multiplier = (displayType === "year") ? 261 : (displayType === "month") ? 23 : 1
    //let stepSize = plotData[0]["sampleType"] === "Open/Close" ? multiplier*2 : multiplier
    let stepSize = inputState.doubleDates ? multiplier*2 : multiplier
    console.log("inputState.doubleDates,stepSize,multplier is : ",[inputState.doubleDates,stepSize,multiplier])
    if (totalType > maxTicks){
      dateInterval = Math.ceil(totalType / maxTicks)
      //stepSize = Math.floor(totalDays / maxTicks)
      stepSize = Math.floor(totalDays / (totalType+2)) * dateInterval //adding 2 for the beginning and ending months, which don't have ticks but take up space
      console.log('debugDateInterval',{dateInterval,totalType,maxTicks,stepSize,totalMonths,totalDays})
      remainder = totalDays % maxTicks
      startOffset = Math.floor(remainder/2)
      endOffset = remainder - startOffset
    } else {
      numberTicks = (displayType === "day") ? days.length : totalType
    }

    console.log("[displayType,numberTicks,maxTicks,stepSize,multiplier,dateInterval] is: ",{displayType,numberTicks,maxTicks,stepSize,multiplier,dateInterval})
    console.log("[displayType,totalType,remainder,startOffset,endOffset] is: ",{displayType,totalType,remainder,startOffset,endOffset})
    
    //need to calc 1st of the month once, and then step into new months from there
    let newTickValues = []
    if (displayType === "day"){
      newTickValues = days.filter((days,index) => ((startOffset+index)%stepSize === 0))
    } else {
      newTickValues = days.reduce((acc,day,index) => {
        const timeGetter = (displayType === "month") ? ((testDate) => testDate.getMonth()) : ((testDate) => testDate.getYear())
        //if ((startOffset+index)%stepSize === 0){
        if ((index-startOffset)%stepSize === 0){  
          console.log('day is: ',day)
          //const thisMonth = day.getMonth()
          const thisMonth = timeGetter(day)
          let testDay = day
          let testIndex = index
          console.log('timeGetter(testDay) is: ',timeGetter(testDay))
          let testMonth = timeGetter(testDay)
          console.log('debug',{displayType,testDay,testIndex,testMonth,thisMonth})
          while (testMonth === thisMonth && testIndex > 0){
            testIndex = testIndex - 1
            testDay = days[testIndex]
            console.log('testDay is: ',testDay)
            testMonth = timeGetter(testDay)
            console.log('debug ',{testIndex,testDay,testMonth})
          }
          const firstDay = days[testIndex+1]
          startOffset = testIndex+1
          console.log('debug',{firstDay,startOffset,testIndex})
          if (testIndex > 0) {
            return [...acc,firstDay]
          }
          console.log('debug',{firstDay,startOffset,testIndex})
        }
        return acc
      },[])
    }
    const newerTickValues = newTickValues.map(tick => dateToTickString(tick,displayType))
    console.log('[displayType,newTickValues,newerTickValues]',{displayType,newTickValues,newerTickValues})
    const tickScale = d3.scaleOrdinal()
      .domain(newTickValues)
      .range(newerTickValues) 

    const tickObject = {"date":newTickValues,"scale":tickScale}
    return tickObject
  }

export default calcTickValues