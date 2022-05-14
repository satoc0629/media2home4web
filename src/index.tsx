import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Instagram from "./page/instagram";
import Youtube from "./page/youtube";
import AV from "./page/av";
import ShuVayu from "./page/shuvayu";
import Picture from "./page/picture";
import Gif from "./page/gif";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="instagram" element={<Instagram/>}/>
                <Route path="youtube" element={<Youtube/>}/>
                <Route path="av" element={<AV/>}/>
                <Route path="shuVayu" element={<ShuVayu/>}/>
                <Route path="picture" element={<Picture/>}/>
                <Route path="gif" element={<Gif/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
