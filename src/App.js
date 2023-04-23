import React, { useState , useRef } from 'react';
import * as d3 from "d3";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LineChart from './components/LineChart';
import './App.css';
import PlotInputForm from './components/PlotInputForm';
import ModelInputForm from './components/ModelInputForm';
import ModelSampleForm from './components/ModelSampleForm';
import LegendContainer from './components/LegendContainer';
import DateRangeContainer from './components/DateRangeContainer';
import PriceRangeContainer from './components/PriceRangeContainer';
import GraphOptions from './components/GraphOptions';
import dateToTickString from './helpers/dateToTickString';
import initialPlotState from './static/initialPlotState';
import initialSemiPlotPrefsState from './static/initialSemiPlotPrefsState'
import PlotTab from './components/PlotTab';
import ModelTab from './components/ModelTab';
import { StockContextProvider } from './StockContext';

function App() {

  const [plotData, setPlotData] = useState(initialPlotState)

  const [plotPrefsState, setPlotPrefsState] = useState({
    semiLog:false,
    overlayNew:false,
    customDate:false,
    xDomain:[(new Date()),(new Date())],
    dayValues:[(new Date())],
    selectedDayValues:[(new Date())],
    priceRange:[0,0],
    selectedPriceRange:[0,0]
  })

  const plotPrefs = useRef({
    ...initialSemiPlotPrefsState,
    semiLog:false,
    overlayNew:false,
    customDate:false,
    doubleDates:false
  })


  const handleInput = (inputData) => { //I think copied?
    console.log("handleInput was called, and plotData was: ",plotData)
    if (inputData){
      console.log("inputData is: ",inputData)
      console.log('plotPrefs.current in handleInput is: ',plotPrefs.current)
      //this is where a new plot is added to plotData
      if (plotPrefs.current.overlayNew){
        const newPlotData = [...plotData,...inputData]
        console.log('newPlotData is: ',newPlotData)
        updateData(newPlotData)
      } else {
        updateData(inputData)
      }
    }
  }
  
  const updateData = (data) => { //copied
    updatePricePrefs(data)
    if (!plotPrefs.current.customDate){
      updateDatePrefs(data)
    }
    setPlotData(data)
  }
  
  const updatePricePrefs = (data) => { //copied
    plotPrefs.current.priceRange = calcMinMax(data)
    plotPrefs.current.selectedPriceRange = [...plotPrefs.current.priceRange]
  }

  const updateDatePrefs = (data) => { //copied
    plotPrefs.current.xDomain = calcStartEnd(data)
    plotPrefs.current.dayValues = calcDayValues(data)
    plotPrefs.current.selectedDayValues = calcSelectedDayValues()
    plotPrefs.current.dateTickValues = calcTickValues()
  }

  const setPrefs = (prefs) => { //copied
    console.log("setPrefs was called")
    if (prefs){
      console.log("inputPrefs is: ",prefs)
      setPlotPrefsState(prefs) //this seems needless, but I wasn't getting a re-render without it
      const oldPrefsCopy = plotPrefs.current
      plotPrefs.current = {...oldPrefsCopy,...prefs}
      console.log("new Prefs is: ",plotPrefs.current)
    }
  }

  //I need to check to see if prefs updated for persist date
  const removeStock = (index) => {
    //need to also update xDomain
    const plotDataCopy = [...plotData]
    plotDataCopy.splice(index,1)

    if (plotDataCopy.length === 0){
      plotPrefs.current = {...plotPrefs.current,...initialSemiPlotPrefsState}
      console.log('After removal, plotPrefs is: ',plotPrefs)
      setPlotData(initialPlotState)
    } else {
      if (!plotPrefs.current.customDate){
        const newXDomain = calcStartEnd(plotDataCopy)
        const newDayValues = calcDayValues(plotDataCopy)
        const oldPrefsCopy = {...plotPrefs.current}
        plotPrefs.current = {...oldPrefsCopy,xDomain:newXDomain,dayValues:newDayValues}
        const newSelectedDayValues = calcSelectedDayValues()
        const oldPrefsCopy2 = {...plotPrefs.current}
        plotPrefs.current = {...oldPrefsCopy2,selectedDayValues:newSelectedDayValues}
        console.log('After removal, plotPrefs is: ',plotPrefs)
      }
      const newMinMax = calcMinMax(plotDataCopy)
    
      const oldPrefsCopy = {...plotPrefs.current}
      plotPrefs.current = {...oldPrefsCopy,priceRange:newMinMax,selectedPriceRange:newMinMax}
      console.log('After removal, plotPrefs is: ',plotPrefs)

      setPlotData(plotDataCopy)
    }
  }

  const calcStartEnd = (stockArray) => { //copied
    const xDomain = d3.extent(stockArray.reduce((acc,element) => {
      const thisExtent = [element.start,element.end]
      return [...acc,...thisExtent]
    },[]))
    return xDomain
  }

  const calcMinMax = (stockArray) => { //copied
    const yRange = d3.extent(stockArray.reduce((acc,element) => {
      const thisExtent = [element.min,element.max]
      return [...acc,...thisExtent]
    },[]))
    return yRange
  }

  //this function now has a bug due to double length of Open/Close
  const calcDayValues = (plots) => { //copied
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

  const calcSelectedDayValues = () => { //copied
    const {xDomain,dayValues} = plotPrefs.current
    const xDomainTime = [xDomain[0].getTime(),xDomain[1].getTime()]

    console.log("In the start of calcSelectedDayValues, [xDomainTime,xDomain,dayValues] is: ",[xDomainTime,plotPrefs.current.xDomain,dayValues])
    const startIndex = dayValues.findIndex(day => day.getTime() >= xDomainTime[0])
    const endIndex = dayValues.findLastIndex(day => day.getTime() <= xDomainTime[1])
    console.log("In calcSelectedDayValues, startIndex and endIndex are: ",[startIndex,endIndex])
    const checkedStartIndex = startIndex === -1 ? 0:startIndex
    const checkedEndIndex = endIndex === -1 ? (dayValues.length - 1):endIndex
    console.log("In calcSelectedDayValues, checkedstartIndex and checkedendIndex are: ",[checkedStartIndex,checkedEndIndex])

    const newSelectedDays = dayValues.slice(checkedStartIndex,checkedEndIndex+1)
    console.log("In calcSelectedDayValues, [xDomain,dayValues,newSelectedDays] is: ",[plotPrefs.current.xDomain,dayValues,newSelectedDays])
    return newSelectedDays
  }
  
  const calcTickValues = () => { //copied
    const maxTicks = 15
    const days = plotPrefs.current.selectedDayValues
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
    let stepSize = plotPrefs.current.doubleDates ? multiplier*2 : multiplier
    console.log("plotData,plotPrefs.current.doubleDates,stepSize,multplier is : ",[plotData,plotPrefs.current.doubleDates,stepSize,multiplier])
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

    console.log("[displayType,numberTicks,maxTicks,stepSize,multiplier,dateInterval] is: ",[displayType,numberTicks,maxTicks,stepSize,multiplier,dateInterval])
    console.log("[displayType,totalType,remainder,startOffset,endOffset] is: ",[displayType,totalType,remainder,startOffset,endOffset])
    
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
    console.log('[displayType,newTickValues,newerTickValues]',[displayType,newTickValues,newerTickValues])
    const tickScale = d3.scaleOrdinal()
      .domain(newTickValues)
      .range(newerTickValues) 

    const tickObject = {"date":newTickValues,"scale":tickScale}
    return tickObject
  }


  const updateStartDate = (newDate) => { //copied
    console.log('update start date is being called, for prefs: ',plotPrefs.current)
    plotPrefs.current.xDomain[0] = newDate
    plotPrefs.current.selectedDayValues = calcSelectedDayValues()
    plotPrefs.current.dateTickValues = calcTickValues()
    console.log('update start date was called, for prefs: ',plotPrefs.current)
  }

  const updateEndDate = (newDate) => { //copied
    plotPrefs.current.xDomain[1] = newDate
    plotPrefs.current.selectedDayValues = calcSelectedDayValues()
    plotPrefs.current.dateTickValues = calcTickValues()
  }

  const updateMinPrice = (price) => { //copied
    plotPrefs.current.selectedPriceRange[0] = price
  }

  const updateMaxPrice = (price) => { //copied
    plotPrefs.current.selectedPriceRange[1] = price
  }

  // const PlotTab = {
  //   name:"Plot",
  //   body: <div className='TopBar'>
  //           <PlotInputForm
  //             plotData = {plotData}
  //             handleInput = {handleInput}
  //             setPrefs = {setPrefs}
  //           />
  //           <GraphOptions
  //             setPrefs = {setPrefs}
  //           />
  //           <DateRangeContainer
  //             xDomain = {plotPrefs.current.xDomain}
  //             dayValues = {plotPrefs.current.dayValues}
  //             updateStartDate = {updateStartDate}
  //             updateEndDate = {updateEndDate}
  //             setPrefs = {setPrefs}
  //           />
  //           <PriceRangeContainer
  //             min = {plotPrefs.current.selectedPriceRange[0]}
  //             max = {plotPrefs.current.selectedPriceRange[1]}
  //             minData = {plotPrefs.current.priceRange[0]}
  //             maxData = {plotPrefs.current.priceRange[1]}
  //             updateMinPrice = {updateMinPrice}
  //             updateMaxPrice = {updateMaxPrice}
  //             setPrefs = {setPrefs}
  //           />
  //         </div>
  // }

  // const ModelTab = {
  //   name:"Model",
  //   body: <div className='TopBar'>
  //           <ModelInputForm
  //             plotData = {plotData}
  //             handleInput = {handleInput}
  //             setPrefs = {setPrefs}
  //           />
  //           <ModelSampleForm
  //             plotData = {plotData}
  //             handleInput = {handleInput}
  //             setPrefs = {setPrefs}
  //           />
  //         </div>
  // }  

  // const TabsArray = [PlotTab,ModelTab]

  // return (
  //   <div className="App">
  //     <div className='TopBar'>
  //       <Tabs>
  //         <TabList className='TabTops'>
  //           <Tab>{TabsArray[0].name}</Tab>
  //           <Tab>{TabsArray[1].name}</Tab>
  //         </TabList>
  //         <TabPanel>
  //           {TabsArray[0].body}
  //         </TabPanel>
  //         <TabPanel>
  //           {TabsArray[1].body}
  //         </TabPanel>
  //       </Tabs>
  //     </div>
  //     <div className="MainSection">
  //       <div className='PlotArea'>
  //         <LineChart
  //           plotData = {plotData}
  //           plotPrefs = {plotPrefs}
  //         />
  //       </div>
  //       <div className='RightMenu'>
  //         <LegendContainer
  //           plotData = {plotData}
  //           removeStock = {removeStock}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <StockContextProvider>
      <div className="App">
        <div className='TopBar'>
          <Tabs>
            <TabList className='TabTops'>
              <Tab>PLOT</Tab>
              <Tab>MODEL</Tab>
            </TabList>
            <TabPanel>
              <PlotTab/>
            </TabPanel>
            <TabPanel>
              <ModelTab/>
            </TabPanel>
          </Tabs>
        </div>
        <div className="MainSection">
          <div className='PlotArea'>
            <LineChart
              plotData = {plotData}
              plotPrefs = {plotPrefs}
            />
          </div>
          <div className='RightMenu'>
            <LegendContainer/>
          </div>
        </div>
      </div>
    </StockContextProvider>
  );
}

export default App;
