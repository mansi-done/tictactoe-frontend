import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import qs from "qs";

import io from "socket.io-client";
import { Alert, Space } from "antd";

import { Button, notification } from "antd";

const socket = io(
  process.env.REACT_APP_SOCKET_URL ? process.env.REACT_APP_SOCKET_URL : ""
);

socket.on("connection-message", (data) => {
  console.log(data);
});

const baseURL = process.env.REACT_APP_BASE_URL;

interface GameBoard {
  gameId: string;
  visitedArray: Array<Array<number>>;
  rowMap1: Map<string, number>;
  colMap1: Map<string, number>;
  rowMap2: Map<string, number>;
  colMap2: Map<string, number>;
  diagonalValues: Array<number>; //d1,d1,ad1,ad2
  player1Chance: boolean;
  winner: number;
  round: number;
  n: number;
  message: string;
  chat: Array<Object>;
}

interface Msg {
  msg: string;
  game: string;
  playerName: string;
}

const Game = () => {
  const [game, setGame] = useState<GameBoard>();

  const [gameBoard, setGameBoard] = useState<Array<Array<number>>>([]);
  const [frontGameId, setFrontGameId] = useState<string>("");
  const [winner, setWinner] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [offline, setOffline] = useState(false);

  const [myTurn, setMyTurn] = useState(true);

  const [chat, setChat] = useState<Array<Msg>>([]);
  const [msg, setMsg] = useState("");
  const [recievedMsg, setRecievedMsg] = useState<Msg | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [size, setSize] = useState(3);
  const [gameOn, setGameOn] = useState(false);
  const [boxSize, setBoxSize] = useState((60 / size).toString() + "vh");

  const startNewGame = () => {
    if (playerName == null) {
      alert("Please Enter Player Name");
    } else {
      setGameOn(true);
      var data = qs.stringify({
        game_num: size,
      });

      var config = {
        method: "post",
        url: `${baseURL}start`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          setFrontGameId(response.data.gameId);
          socket.emit("start-new-game", {
            game: response.data.gameId,
            playerName: playerName,
          });
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const message = () => {
    const gameId = frontGameId;
    socket.emit("chat-message", {
      msg: msg,
      game: gameId,
      playerName: playerName,
    });
    const newChat = [...chat];
    newChat.push({ msg: msg, game: gameId, playerName: "You" });
    setChat(newChat);
    setMsg("");
  };

  useEffect(() => {
    if (recievedMsg) {
      const newChat = [...chat];
      newChat.push(recievedMsg);
      setChat(newChat);
    }
  }, [recievedMsg]);

  useEffect(() => {
    socket.on("update-game", (data) => {
      console.log("updating...");
      updateGame(data.gameId);
      setMyTurn(true);
    });

    socket.on("message-chat", (data) => {
      setRecievedMsg(data);
    });
  }, [socket]);

  useEffect(() => {
    updateGame(frontGameId);
  }, [frontGameId]);

  const updateGame = (gameId: string) => {
    const usedurl = `${baseURL}gameStatus?gameId=${gameId}`;
    var config = {
      method: "post",
      url: usedurl,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        if (response.data.winner != 0) setWinner(response.data.winner);
        setGame(response.data);
        setGameBoard(response.data.visitedArray);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const playMove = (i: number, j: number) => {
    setMyTurn(false);
    if (gameBoard[i][j] == 0) {
      var bodyData = qs.stringify({
        row: i,
        col: j,
      });
      var config = {
        method: "post",
        url: `${baseURL}move?gameId=${frontGameId}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: bodyData,
      };
      axios(config)
        .then(function (response) {
          console.log(response.data.winner);
          setGame(response.data);
          setGameBoard(response.data.visitedArray);
          if (response.data.message != "ongoing")
            setWinner(response.data.winner);
          const n = Number(response.data.n);
          const played = n * n - Number(response.data.round);
          socket.emit("turn-complete", { game: frontGameId, played: played });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const generateGame = () => {
    if (playerName == null) {
      alert("Please Enter Player Name");
    } else {
      setGameOn(true);
      setFrontGameId(inputVal);
      socket.emit("join-new-game", { game: inputVal, playerName: playerName });
      if (offline) {
        setOffline(false);
      }
      
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      message();
    }
  };

  useEffect(() => {
    console.log(winner);
  }, [winner]);

  return (
    <div className="home">
      <div className="game">
        <div className="nav">
          <div className="input">
            Enter Game ID{" "}
            <input
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
              style={{ height: "1.5rem", fontSize: "1rem" }}
            />{" "}
            <Button
              ghost
              onClick={generateGame}
              style={{ borderColor: "white", color: "white" }}
            >
              Generate Game
            </Button>
          </div>
        </div>

        <div className="center">
          <div className="message">{game?.message && game?.message}</div>
          {gameOn ? (
            <div className="board">
              {gameBoard?.map((array, i) => {
                return (
                  <div className="row" key={Math.random()}>
                    {array.map((item, j) => {
                      return (
                        <div
                          className="box"
                          onClick={() => playMove(i, j)}
                          key={Math.random()}
                          style={{
                            // cursor:"pointer",
                            height: boxSize,
                            width: boxSize,
                            minHeight: "5vh",
                            minWidth: "5vh",
                            cursor: !offline
                              ? myTurn
                                ? "pointer"
                                : "no-drop"
                              : "pointer",
                            pointerEvents: !offline
                              ? myTurn
                                ? "visible"
                                : "none"
                              : "visible",
                          }}
                        >
                          {item == 0 ? "" : item == 1 ? "X" : "O"}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="settings">
              <div className="playername">
                Enter Player Name: &nbsp;&nbsp;
                <input
                  value={playerName != null ? playerName : ""}
                  onChange={(e) => setPlayerName(e.target.value)}
                ></input>
              </div>

              <div className="size">
                Enter TicTacToe Size: &nbsp;
                <input
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setBoxSize((60 / Number(e.target.value)).toString() + "vh");
                  }}
                ></input>
              </div>

              <div className="offline">
                <input type="radio" onClick={() => setOffline(true)}></input>{" "}
                Select to play offline!
              </div>

              <div className="start-btn">
                <Button
                  ghost
                  onClick={startNewGame}
                  style={{ borderColor: "white", color: "white" }}
                >
                  Start Game
                </Button>
              </div>
            </div>
          )}

          {gameOn && (
            <div className="new-game-btn">
              <Button
                ghost
                onClick={() => {
                  setFrontGameId("");
                  setGameOn(false);
                }}
                style={{ borderColor: "white", color: "white" }}
              >
                New game
              </Button>
            </div>
          )}
        </div>
      </div>

      {gameOn && !offline && (
        <div className="right">
          <div className="gameid">
            {!offline && "GameId: " + frontGameId}{" "}
            <Button
              ghost
              onClick={() => navigator.clipboard.writeText(frontGameId)}
              style={{ borderColor: "white", color: "white" }}
            >
              Copy Game Id
            </Button>{" "}
          </div>
          <div className="chatbox">
            <div className="messages">
              {chat.map((chatMsg) => {
                return (
                  <div className="msg">
                    {chatMsg.playerName + ": " + chatMsg.msg}
                  </div>
                );
              })}
            </div>
            <div className="send">
              <input
                onChange={(e) => setMsg(e.target.value)}
                value={msg}
                onKeyDown={handleKeyDown}
              ></input>
              <Button
                ghost
                onClick={message}
                style={{ borderColor: "white", color: "white" }}
              >
                Send
              </Button>{" "}
            </div>
          </div>
          <div className="chat-title"> Chat with your friends!</div>
        </div>
      )}
    </div>
  );
};

export default Game;
