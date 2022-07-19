import React, { useState } from 'react';
import LineChart from './components/LineChart';
import './App.css';
import PlotInputForm from './components/PlotInputForm';

function App() {


  const [dummyData, setDummyData] = useState([]);

  const setInput = (inputData) => {
    console.log("setInput was called")
    if (inputData){
      console.log("inputData is: ",inputData)
      setDummyData(inputData)
    }
  }

  return (
    <div className="App">
      <div className='TopBar'>
        <PlotInputForm
          setInput = {setInput}
        />
      </div>
      <div className='PlotArea'>
        <LineChart
          chartData = {dummyData}
        />
      </div>
    </div>
  );
}

export default App;
