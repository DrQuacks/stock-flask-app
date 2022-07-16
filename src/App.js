import React, { useState, useEffect } from 'react';
import * as d3 from "d3";
import DummyPie from "./DummyPieChart"
import LineChart from './LineChart';
import logo from './logo.svg';
import './App.css';

function App() {

  const generateData = (value, length = 5) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value: value === null || value === undefined ? Math.random() * 100 : value
    }));

  const [data, setData] = useState(generateData());
  const changeData = () => {
    setData(generateData());
  };

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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>The current time is {currentTime}.</p>
        <p>My Dummy Response is {dummyResponse}.</p>
        <div>
          <span className="label">Hooks</span>
          <DummyPie
            data={data}
            width={200}
            height={200}
            innerRadius={60}
            outerRadius={100}
          />
        </div>
        <LineChart
          chartData = {dummyData}
        />
      </header>
    </div>
  );
}

export default App;
