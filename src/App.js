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
    max:0
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
    xDomain:[(new Date()).toISOString().split('T')[0],(new Date()).toISOString().split('T')[0]]
  })

  const startDateChart = useRef(new Date())
  const endDateChart = useRef(new Date())


  const handleInput = (inputData) => {
    console.log("handleInput was called")
    if (inputData){
      console.log("inputData is: ",inputData)

      //this is where a new plot is added to plotData
      if (plotPrefs.current.overlayNew){
        const newPlotData = [...plotData,inputData]

        if (!plotPrefs.current.customDate){
          console.log('customDate is: ',plotPrefs.current.customDate)
          plotPrefs.current.xDomain = calcStartEnd(newPlotData)
        }

        console.log('xDomain in handleInput is: ',plotPrefs.current.xDomain)
        setPlotData(newPlotData)
        //setPlotData((prevData) => [...prevData,inputData])

      } else {

        if (!plotPrefs.customDate){
          console.log('customDate is: ',plotPrefs.current.customDate)
          plotPrefs.current.xDomain = calcStartEnd([inputData])
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

  const removeStock = (index) => {
    const plotDataCopy = [...plotData]
    plotDataCopy.splice(index,1)
    setPlotData(plotDataCopy)
  }

  const calcStartEnd = (stockArray) => {
    const xDomain = d3.extent(stockArray.reduce((acc,element) => {
      const thisExtent = [element.start,element.end]
      return [...acc,...thisExtent]
  },[]))
  return xDomain
}

  /*useEffect(() => { 
    if (!plotPrefs.current.customDate){
      plotPrefs.current.xDomain = calcStartEnd(plotData)
    }
    console.log('xDomain is: ',plotPrefs.current.xDomain)
  },[plotData.length,plotData[0]['name'],plotData[0]['trailingDays']])*/


  const updateStartDate = (newDate) => {
    console.log('old start date was: ',startDateChart)
    console.log('newDate is: ',newDate)
    plotPrefs.current.xDomain[0] = newDate
  }

  const updateEndDate = (newDate) => {
    plotPrefs.current.xDomain[1] = newDate
  }

  return (
    <div className="App">
      <div className='TopBar'>
        <PlotInputForm
          setPlotData = {setPlotData}
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
            setPlotData = {setPlotData}
            plotPrefs = {plotPrefs}
            setStartDate = {updateStartDate}
            startDate = {startDateChart}
            setEndDate = {updateEndDate}
            endDate = {endDateChart}
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
