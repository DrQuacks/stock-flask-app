import React, { useState , useRef } from 'react';
import LineChart from './components/LineChart';
import './App.css';
import PlotInputForm from './components/PlotInputForm';
import LegendContainer from './components/LegendContainer';

function App() {


  const [stockData, setStockData] = useState([[]]);
  const [stockKeys, setStockKeys] = useState([])
  console.log('At the start of App, stockKeys is: ',stockKeys)
  const [plotPrefsState, setPlotPrefsState] = useState({semiLog:false,overlayRaw:false,overlayNew:false});
  const plotPrefs = useRef({semiLog:false,overlayRaw:false,overlayNew:false})

  const setInput = (inputData) => {
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
    console.log('removing stock at index: ',index)
    console.log('stockKeys is: ',stockKeys)
    //console.log('stockKeys is gonna be: ',stockKeys.splice(index,1))
    const stockDataCopy = [...stockData]
    stockDataCopy.splice(index,1)
    const stockKeysCopy = [...stockKeys]
    stockKeysCopy.splice(index,1)
    console.log('stockData is actually gonna be: ',stockDataCopy)
    console.log('stockKeys is actually gonna be: ',stockKeysCopy)
    setStockData(stockDataCopy)
    setStockKeys(stockKeysCopy)
  }

  const setPrefs = (prefs) => {
    console.log("setPrefs was called")
    if (prefs){
      console.log("inputData is: ",prefs)
      setPlotPrefsState(prefs) //this seems needless, but I wasn't getting a re-render without it
      plotPrefs.current = prefs
    }
  }

  return (
    <div className="App">
      <div className='TopBar'>
        <PlotInputForm
          setInput = {setInput}
          setPrefs = {setPrefs}
          setKeys = {setKeys}
          stockKeys = {stockKeys}
        />
      </div>
      <div className="MainSection">
        <div className='PlotArea'>
          <LineChart
            chartData = {stockData}
            plotPrefs = {plotPrefs}
            stockKeys = {stockKeys}
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
