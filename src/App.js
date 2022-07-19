import React, { useState , useRef } from 'react';
import LineChart from './components/LineChart';
import './App.css';
import PlotInputForm from './components/PlotInputForm';

function App() {


  const [stockData, setStockData] = useState([[]]);
  //const [plotPrefs, setPlotPrefs] = useState({semiLog:false,overlayRaw:false,overlayNew:false});
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

  const setPrefs = (prefs) => {
    console.log("setPrefs was called")
    if (prefs){
      console.log("inputData is: ",prefs)
      //setPlotPrefs(prefs)
      plotPrefs.current = prefs
    }
  }

  return (
    <div className="App">
      <div className='TopBar'>
        <PlotInputForm
          setInput = {setInput}
          setPrefs = {setPrefs}
        />
      </div>
      <div className='PlotArea'>
        <LineChart
          chartData = {stockData}
          plotPrefs = {plotPrefs}
        />
      </div>
    </div>
  );
}

export default App;
