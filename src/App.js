import React, { useState , useRef, useEffect } from 'react';
import * as d3 from "d3";
import LineChart from './components/LineChart';
import './App.css';
import PlotInputForm from './components/PlotInputForm';
import LegendContainer from './components/LegendContainer';
import DateRangeContainer from './components/DateRangeContainer';

function App() {

  const [plotData, setPlotData] = useState([{
    name:"",
    data:[],
    trailingDays:"",
    avgType:"",
    sampleType:"",
    start:(new Date()).toISOString().split('T')[0],
    end:(new Date()).toISOString().split('T')[0],
    min:0,
    max:0,
    minDeriv:0,
    maxDeriv:0,
    minDeriv2:0,
    maxDeriv2:0,
    datePriceScale: new d3.scaleLinear(),
    daysList:[]
  }])

  const [plotPrefsState, setPlotPrefsState] = useState({
    semiLog:false,
    overlayRaw:false,
    overlayNew:false
  })

  const plotPrefs = useRef({
    semiLog:false,
    overlayRaw:false,
    overlayNew:false,
    customDate:false,
   /* xDomain:[(new Date()).toISOString().split('T')[0],(new Date()).toISOString().split('T')[0]],
    dayValues:[(new Date()).toISOString().split('T')[0]],
    selectedDayValues:[(new Date()).toISOString().split('T')[0]]*/
    xDomain:[(new Date()),(new Date())],
    dayValues:[(new Date())],
    selectedDayValues:[(new Date())]
  })


  const handleInput = (inputData) => {
    console.log("handleInput was called")
    if (inputData){
      console.log("inputData is: ",inputData)

      //this is where a new plot is added to plotData
      if (plotPrefs.current.overlayNew){
        const newPlotData = [...plotData,inputData]
        console.log('newPlotData is: ',newPlotData)

        if (!plotPrefs.current.customDate){
          console.log('customDate is: ',plotPrefs.current.customDate)
          plotPrefs.current.xDomain = calcStartEnd(newPlotData)
          plotPrefs.current.dayValues = calcDayValues(newPlotData)
          plotPrefs.current.selectedDayValues = calcSelectedDayValues()
        }

        console.log('xDomain in handleInput is: ',plotPrefs.current.xDomain)
        setPlotData(newPlotData)
        //setPlotData((prevData) => [...prevData,inputData])

      } else {

        if (!plotPrefs.current.customDate){
          console.log('customDate is: ',plotPrefs.current.customDate)
          plotPrefs.current.xDomain = calcStartEnd([inputData])
          plotPrefs.current.dayValues = inputData.daysList
          plotPrefs.current.selectedDayValues = calcSelectedDayValues()
        }

        console.log('xDomain in handleInput is: ',plotPrefs.current.xDomain)
        setPlotData([inputData])
      }
    }
  }

  const setPrefs = (prefs) => {
    console.log("setPrefs was called")
    if (prefs){
      console.log("inputPrefs is: ",prefs)
      setPlotPrefsState(prefs) //this seems needless, but I wasn't getting a re-render without it
      const oldPrefsCopy = plotPrefs.current
      plotPrefs.current = {...oldPrefsCopy,...prefs}
    }
  }

  //I need to check to see if prefs updated for persist date
  const removeStock = (index) => {
    //need to also update xDomain
    const plotDataCopy = [...plotData]
    plotDataCopy.splice(index,1)
    if (!plotPrefs.current.customDate){
      const newXDomain = calcStartEnd(plotDataCopy)
      const newDayValues = calcDayValues(plotDataCopy)
      const newSelectedDayValues = calcSelectedDayValues()
      const oldPrefsCopy = plotPrefs.current
      plotPrefs.current = {...oldPrefsCopy,xDomain:newXDomain,dayValues:newDayValues,selectedDayValues:newSelectedDayValues}
    }
    setPlotData(plotDataCopy)
  }

  const calcStartEnd = (stockArray) => {
    const xDomain = d3.extent(stockArray.reduce((acc,element) => {
      const thisExtent = [element.start,element.end]
      return [...acc,...thisExtent]
  },[]))
  return xDomain
}

  const calcDayValues = (plots) => {
    console.log("In calc day values, plots is: ",plots)
    const indexLongest = plots.reduce((acc,stock,index)=>{
      const thisLength = stock.daysList.length
        if (thisLength > acc){
          return index
        }
        return acc
    },0)
    const longestDayList = plots[indexLongest].daysList
    console.log('[Longest Day List] is: ',[longestDayList])
    return longestDayList
  }

  const calcSelectedDayValues = () => {
    const {xDomain,dayValues} = plotPrefs.current
    /*const startIndex = dayValues.indexOf(xDomain[0])
    const endIndex = dayValues.indexOf(xDomain[1])*/
    const xDomainTime = [plotPrefs.current.xDomain[0].getTime(),plotPrefs.current.xDomain[1].getTime()]
    console.log("In the start of calcSelectedDayValues, [xDomainTime,xDomain,dayValues] is: ",[xDomainTime,plotPrefs.current.xDomain,dayValues])
    const startIndex = dayValues.findIndex(day => day.getTime() === xDomainTime[0])
    const endIndex = dayValues.findIndex(day => day.getTime() === xDomainTime[1])
    console.log("In calcSelectedDayValues, startIndex and endIndex are: ",[startIndex,endIndex])
    const checkedStartIndex = startIndex === -1 ? 0:startIndex
    const checkedEndIndex = endIndex === -1 ? (dayValues.length - 1):endIndex
    console.log("In calcSelectedDayValues, checkedstartIndex and checkedendIndex are: ",[checkedStartIndex,checkedEndIndex])

    const newSelectedDays = dayValues.slice(checkedStartIndex,checkedEndIndex+1)
    console.log("In calcSelectedDayValues, [xDomain,dayValues,newSelectedDays] is: ",[plotPrefs.current.xDomain,dayValues,newSelectedDays])
    return newSelectedDays
  }


  const updateStartDate = (newDate) => {
    plotPrefs.current.xDomain[0] = newDate
    plotPrefs.current.selectedDayValues = calcSelectedDayValues()
  }

  const updateEndDate = (newDate) => {
    plotPrefs.current.xDomain[1] = newDate
    plotPrefs.current.selectedDayValues = calcSelectedDayValues()
  }

  return (
    <div className="App">
      <div className='TopBar'>
        <PlotInputForm
          plotData = {plotData}
          handleInput = {handleInput}
          setPrefs = {setPrefs}
        />
        <DateRangeContainer
          xDomain = {plotPrefs.current.xDomain}
          updateStartDate = {updateStartDate}
          updateEndDate = {updateEndDate}
        />
      </div>
      <div className="MainSection">
        <div className='PlotArea'>
          <LineChart
            plotData = {plotData}
            plotPrefs = {plotPrefs}
          />
        </div>
        <div className='RightMenu'>
          <LegendContainer
            plotData = {plotData}
            removeStock = {removeStock}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
