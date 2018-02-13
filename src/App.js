import React, { Component } from 'react';
import './App.css';
import Skyscraper from './components/Skyscraper/Skyscraper';
import Inside from './components/Inside/Inside';
import Buttons from './components/Buttons/Buttons';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="app-left">
          <div className="app-inside">
            <Inside />
          </div>
          <div className="app-buttons">
            <Buttons />
          </div>
        </div>
        <div className="app-outside">
          <Skyscraper />
        </div>
      </div>
    );
  }
}

export default App;
