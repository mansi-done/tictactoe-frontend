import React, { useRef } from "react";
import "./App.css";
import Game from "./components/Game";
import { Divider } from "antd";

function App() {
  return (
    <div className="container">
      <div className="info">
        <div className="title">Tic Tac Toe</div>
        <div className="subtitle">
          No SIGN IN required. Scalable Tic Tac Toe Web application
          <div className="how-to">How to Play?</div>
          <div className="list-item">
            - Enter player name and board size
          </div>
          <div className="list-item">
            - Create a game, Copy the generated Game ID and share with your
            friend!
          </div>
          <div className="list-item">
            - Chat and Play with your friends in real time.
          </div>
        </div>
        <div className="enddetails">
          created by <a href="https://mansisaini.online/" target="_blank" style={{textDecoration:"none",color:"lightblue"}}>Mansi Saini</a>
        </div>
      </div>
      {/* <Divider type="vertical" style={{backgroundColor:"white"}} /> */}
      <Game />
    </div>
  );
}

export default App;
