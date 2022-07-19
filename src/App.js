import React, { useState } from 'react';
import LineChart from './components/LineChart';
import './App.css';
import PlotInputForm from './components/PlotInputForm';

function App() {


  const [stockData, setStockData] = useState([]);
  const [plotPrefs, setPlotPrefs] = useState({semiLog:"",overlayRaw:"",overlayNew:""});

  const setInput = (inputData) => {
    console.log("setInput was called")
    if (inputData){
      console.log("inputData is: ",inputData)
      setStockData(inputData)
    }
  }

  const setPrefs = (prefs) => {
    console.log("setPrefs was called")
    if (prefs){
      console.log("inputData is: ",prefs)
      setPlotPrefs(prefs)
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
