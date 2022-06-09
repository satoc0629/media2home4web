import {useEffect, useLayoutEffect, useState} from "react";
import {shuffleArray} from "../shuffle-array";
import {SliderFlexPane} from "./slider-flex-pane";
import {Fab} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

const Instagram = () => {

    const [urls, setUrls] = useState([] as string[])
    const [started, setStarted] = useState([] as number[])
    const [contentWidth, setContentWidth] = useState(window.parent.window.innerWidth)
    const [autoScroll, setAutoScroll] = useState(false)
    const [autoScrollSpeed, setAutoScrollSpeed] = useState(3)
    const [autoScrollButtonX, setAutoScrollButtonX] = useState("43vw")

    const setColumns = (columns: number) => {
        switch (columns) {
            case 1:
                setAutoScrollButtonX("90vw")
                setAutoScrollSpeed(18)
                break
            case 2:
                setAutoScrollSpeed(6)
                setAutoScrollButtonX("43vw")
                break
            case 3:
            default:
                setAutoScrollSpeed(3)
                setAutoScrollButtonX("90vw")
        }
        setContentWidth(window.parent.window.innerWidth / columns)
    }

    function playVideos(videoWrappers: HTMLCollectionOf<Element>) {
        // window.innerHeight = View Height
        // window.scrollY = moved Height
        const startPosition = window.scrollY + window.innerHeight;
        for (let i = 0; i < videoWrappers.length; i++) {
            // 描画範囲全体の上からみて今の画面表示の下限位置
            // getBoundingClientRect の bottom, top, left, right は現在のウィンドウ枠からの相対位置
            const videoPositionTop = videoWrappers[i].getBoundingClientRect().top + window.scrollY;
            const videoPositionBottom = videoWrappers[i].getBoundingClientRect().bottom;
            const video = videoWrappers[i].getElementsByTagName('video');
            if (videoPositionBottom < 0) {
                video[0].pause()
            } else if (startPosition > videoPositionTop) {
                if (!started.includes(i)) {
                    video[0].src = `http://192.168.1.11/media/instagram/${urls[i]}`
                    setStarted(started => {
                        started.push(i)
                        return started
                    })
                }
                video[0].play();
            }
        }
    }

    useEffect(() => {
        fetch("http://192.168.1.11/media/instagram/ls_json.php").then(r => r.json()).then((r: string[]) => {
            setUrls(r.filter(r => r !== "ls_json.php"))
        })
    }, [])
    useEffect(() => {
        const videoWrappers = document.getElementsByClassName('video_wrapper');
        if (videoWrappers.length) {
            // 初期表示地点から呼ぶ
            playVideos(videoWrappers);
            // スクロールの都度、呼ぶ
            window.addEventListener('scroll', function () {
                playVideos(videoWrappers);
            }, false);
        }
    }, [urls])

    function playOrStop() {
        setAutoScroll(!autoScroll)
    }
    useEffect(() => {
        if (!autoScroll) {
            return
        }
        const firstScroll = setInterval(() => {
            window.scrollBy({
                top: autoScrollSpeed,
                behavior: "smooth"
            })
        }, 100)
        return () => clearTimeout(firstScroll)
    }, [autoScroll])

    return <>
        <Fab color="primary" aria-label="add" onClick={() => playOrStop()} style={{
            margin: 0,
            top: 'auto',
            right: autoScrollButtonX,
            bottom: "45vh",
            left: 'auto',
            position: 'fixed',
        }}>
            {autoScroll ? <StopIcon/> : <PlayArrowIcon/>}
        </Fab>
        <SliderFlexPane setColumns={setColumns} defaultColumn={2}>
            {shuffleArray(urls).map((url, i) => {
                return <div className={"video_wrapper"} style={{maxWidth: contentWidth, width: contentWidth}}>
                    <video controls loop muted playsInline
                           width={contentWidth}
                           preload={"none"}>
                        <source id={`source${i}`} type={"video/mp4"}/>
                    </video>
                </div>
            })}
        </SliderFlexPane>
    </>
}
export default Instagram