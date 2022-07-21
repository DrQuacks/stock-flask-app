import React, { useState , useRef } from 'react';
import LineChart from './components/LineChart';
import './App.css';
import PlotInputForm from './components/PlotInputForm';
import LegendContainer from './components/LegendContainer';
import DateRangeContainer from './components/DateRangeContainer';

function App() {


  const [stockData, setStockData] = useState([[]]);
  const [stockKeys, setStockKeys] = useState([])
  console.log('At the start of App, stockKeys is: ',stockKeys)
  const [plotData, setPlotData] = useState([{
    name:"",
    data:[],
    trailingDays:"",
    avgType:"",
    start:(new Date()).toISOString().split('T')[0],
    end:(new Date()).toISOString().split('T')[0],
    min:0,
    max:0
  }])
  const [plotPrefsState, setPlotPrefsState] = useState({semiLog:false,overlayRaw:false,overlayNew:false});
  const plotPrefs = useRef({semiLog:false,overlayRaw:false,overlayNew:false})
  const startDateChart = useRef(new Date())
  const endDateChart = useRef(new Date())

  /*const setInput = (inputData) => {
    console.log("setInput was called")
    if (inputData){
      console.log("inputData is: ",inputData)
      console.log('plotPrefs is: ',plotPrefs)
      if (plotPrefs.current.overlayNew){
        setStockData((prevData) => [...prevData,inputData])
        console.log('overlayNew is true: ',plotPrefs.current.overlayNew)
      } else {
        console.log('overlayNew is false: ',plotPrefs.current.overlayNew)
        setStockData([inputData])
      }
    }
  }

  const setKeys = (key) => {
    console.log("setKeys was called")
    if (key){
      if (plotPrefs.current.overlayNew){
        setStockKeys((prevData) => [...prevData,key])
        console.log('overlayNew is true: ',plotPrefs.current.overlayNew)
      } else {
        console.log('overlayNew is false: ',plotPrefs.current.overlayNew)
        setStockKeys([key])
      }
    }
  }

  

  const removeStock = (index) => {
    const stockDataCopy = [...stockData]
    stockDataCopy.splice(index,1)
    setStockData(stockDataCopy)

    const stockKeysCopy = [...stockKeys]
    stockKeysCopy.splice(index,1)
    setStockKeys(stockKeysCopy)
  }*/

  const handleInput = (inputData) => {
    console.log("handleInput was called")
    if (inputData){
      console.log("inputData is: ",inputData)
      console.log('plotPrefs is: ',plotPrefs)
      if (plotPrefs.current.overlayNew){
        setPlotData((prevData) => [...prevData,inputData])
        console.log('overlayNew is true: ',plotPrefs.current.overlayNew)
      } else {
        console.log('overlayNew is false: ',plotPrefs.current.overlayNew)
        setPlotData([inputData])
      }
    }
  }

  const setPrefs = (prefs) => {
    console.log("setPrefs was called")
    if (prefs){
      console.log("inputData is: ",prefs)
      setPlotPrefsState(prefs) //this seems needless, but I wasn't getting a re-render without it
      plotPrefs.current = prefs
    }
  }

  const removeStock = (index) => {
    const plotDataCopy = [...plotData]
    plotDataCopy.splice(index,1)
    setPlotData(plotDataCopy)
  }


  const setStartDate = (newDate) => {
    console.log('old start date was: ',startDateChart)
    console.log('newDate is: ',newDate)
    startDateChart.current = newDate
  }

  const setEndDate = (newDate) => {
    endDateChart.current = newDate
  }
  let setKeys

  return (
    <div className="App">
      <div className='TopBar'>
        <PlotInputForm
          setPlotData = {setPlotData}
          plotData = {plotData}
          handleInput = {handleInput}
          setPrefs = {setPrefs}
          setKeys = {setKeys}
          stockKeys = {stockKeys}
        />
        <DateRangeContainer
          setStartDate = {setStartDate}
          startDate = {startDateChart}
          setEndDate = {setEndDate}
          endDate = {endDateChart}
        />
      </div>
      <div className="MainSection">
        <div className='PlotArea'>
          <LineChart
            plotData = {plotData}
            setPlotData = {setPlotData}
            chartData = {stockData}
            plotPrefs = {plotPrefs}
            stockKeys = {stockKeys}
            setStartDate = {setStartDate}
            startDate = {startDateChart}
            setEndDate = {setEndDate}
            endDate = {endDateChart}
          />
        </div>
        <div className='RightMenu'>
          <LegendContainer
            stockKeys = {stockKeys}
            removeStock = {removeStock}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
