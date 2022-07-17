import React, { useState, useEffect } from 'react';
import * as d3 from "d3";
import DummyPie from "./components/DummyPieChart"
import LineChart from './components/LineChart';
import logo from './logo.svg';
import './App.css';
import NameForm from './components/NameForm';

function App() {

  const dummyPost = "7"
  useEffect(() => {
    fetch('/api/dummypost',{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      //body: JSON.stringify(dummyPost)})
      body: dummyPost})
  },[])

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  const [dummyResponse, setDummyResponse] = useState("");

  useEffect(() => {
    fetch('/api/dummyresponse').then(res => res.json()).then(data => {
      setDummyResponse(data.dummy);
    });
  }, []);

  const [dummyData, setDummyData] = useState([]);

  useEffect(() => {
    fetch('/api/dummyarray').then(res => res.json()).then(data => {
      console.log('Dummy Data: ',data)
      setDummyData(data.dummy)
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>The current time is {currentTime}.</p>
        <p>My Dummy Response is {dummyResponse}.</p>
        <NameForm />
        <LineChart
          chartData = {dummyData}
        />
      </header>
    </div>
  );
}

export default App;
