import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import LineChart from './components/LineChart';
import LegendContainer from './components/LegendContainer';
import PlotTab from './components/PlotTab';
import ModelTab from './components/ModelTab';
import StatsContainer
 from './components/StatsContainer';
import { StockContextProvider } from './StockContext';
import 'react-tabs/style/react-tabs.css';
import './App.css';


function App() {

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
            <LineChart/>
          </div>
          <div className='RightMenu'>
            <LegendContainer/>
          </div>
        </div>
        <div className="StatsContainer">
        </div>

      </div>
    </StockContextProvider>
  );
}

export default App;
