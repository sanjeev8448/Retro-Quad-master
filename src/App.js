import './Styles/App.css';
import "./Styles/Sudoku.css"
import "./Styles/Snake2.css"
import "./Styles/Pong.css"
import "./Styles/Pacman.css"
import DataContextProvider from './Components/DataContext';
import Games from './Components/Games';
import UserCredentials from './Components/UserCredentials';
import { useEffect, useRef, useState } from 'react';

function App() {



  return (
    <DataContextProvider>
      <div className="App">
        <Games />
        <UserCredentials />
        <div className="loading-screen active "></div>
      </div>
    </DataContextProvider>
  );
}

export default App;
