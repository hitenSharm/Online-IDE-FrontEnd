import React, { useState, useEffect } from "react";
import "./editor.css";
import Code from "../code/code";
import Input from "../input/input";
import Output from "../output/output";
import Header from "../header/header";
import Language from "../language/language";
import Submit from "../submit/submit";
import { defaultCodeC } from "../../shared/default";
import io from "socket.io-client";
import queryString from "query-string";

const ENDPOINT = "http://localhost:3001";

let socket;

const App = ({ location }) => {
  const [code, changeCode] = useState(defaultCodeC);
  const [mode, changeMode] = useState("c_cpp");
  const [language, changeLanguage] = useState("1");
  const [input, changeInput] = useState("");
  const [result, changeRes] = useState("");
  const [fontSize, changeFontSize] = useState("17px");
  const [visi, changeVisi] = useState(true);
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    console.log(name, room);
    socket = io(ENDPOINT);
    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("code", (message) => {
      changeCode(message.text);
    });
    socket.on("input", (message) => {
      changeInput(message.text);
    });
    socket.on("output", (message) => {
      changeRes(message.text);
    });
    socket.on("font", (message) => {
      changeFontSize(message.text);
    });
    socket.on("default", (message) => {
      changeLanguage(message.text);
    });
    socket.on("lang", (message) => {
      changeMode(message.text);
    });
  }, []);

  const content = (
    <div id="main">
      <Code
        mode={mode}
        changeCode={changeCode}
        code={code}
        fontSize={fontSize}
        socket={socket}
      />
      <Input changeInput={changeInput} input={input} socket={socket} />
      <Output result={result} changeRes={changeRes} />
      <Header
        fontSize={fontSize}
        changeFontSize={changeFontSize}
        visi={visi}
        changeVisi={changeVisi}
        socket={socket}
      />
      <Language
        mode={changeMode}
        changeLanguage={changeLanguage}
        code={changeCode}
        socket={socket}
      />
      <Submit
        code={code}
        language={language}
        input={input}
        changeRes={changeRes}
        socket={socket}
      />
    </div>
  );
  return content;
};

export default App;