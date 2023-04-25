import React, { useRef } from "react";
import "./App.css";
import Game from "./components/Game";
import { Divider } from "antd";

import Logo from "./assets/logo.svg";

function App() {
  return (
    <div className="container">
      <div className="logo">
        <img src={Logo} />
      </div>
      <Game />

      <div className="game-info">
        <div className="infor">
          <div className="up">No SIGN IN required </div>
          <div className="down">Scalable Tic Tac Toe Web Application</div>
        </div>
      </div>

      <div className="howto">
        <div className="heading">How to play</div>
        <div className="instructions">
          <div className="list-item">• Enter player name and board size</div>
          <div className="list-item">
            • Create a game, Copy the generated Game ID and share with your
            friend!
          </div>
          <div className="list-item">
            • Chat and Play with your friends in real time.
          </div>
        </div>
      </div>

      <div className="enddetails">
        <div>
          This site was developed by{" "}
          <a
            href="https://mansisaini.online/"
            target="_blank"
            style={{ textDecoration: "none", color: "lightblue" }}
          >
            Mansi Saini
          </a>
          &nbsp; | &nbsp; Copyright © 2023
          &nbsp; | &nbsp; All Rights Reserved
           
        </div>
        <div>
          Designed by {" "}
          <a
            href="https://raashid.in/"
            target="_blank"
            style={{ textDecoration: "none", color: "lightblue" }}
          >
           raashid
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;

// return (
//   <div className="container">
//     <div className="info">
//       <div className="title">Tic Tac Toe</div>
//       <div className="subtitle">
//         No SIGN IN required. Scalable Tic Tac Toe Web application
//         <div className="how-to">How to Play?</div>
//         <div className="list-item">
//           - Enter player name and board size
//         </div>
//         <div className="list-item">
//           - Create a game, Copy the generated Game ID and share with your
//           friend!
//         </div>
//         <div className="list-item">
//           - Chat and Play with your friends in real time.
//         </div>
//       </div>
//       <div className="enddetails">
//         created by <a href="https://mansisaini.online/" target="_blank" style={{textDecoration:"none",color:"lightblue"}}>Mansi Saini</a>
//       </div>
//     </div>
//     {/* <Divider type="vertical" style={{backgroundColor:"white"}} /> */}
//     <Game />
//   </div>
// );
