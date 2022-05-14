import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Link} from "react-router-dom";

function App() {


    return (
        <ul>
            <li>
                <Link to={"/instagram"}>instagram</Link>
            </li>
            <li>
                <Link to={"/youtube"}>youtube</Link>
            </li>
            <li>
                <Link to={"/av"}>av</Link>
            </li>
            <li>
                <Link to={"/shuVayu"}>shuVayu</Link>
            </li>
            <li>
                <Link to={"/picture"}>picture</Link>
            </li>
            <li>
                <Link to={"/gif"}>gif</Link>
            </li>
        </ul>
    );
}

export default App;
