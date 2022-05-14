import {useEffect, useState} from "react";
import {shuffleArray} from "../shuffle-array";
import {SliderFlexPane} from "./slider-flex-pane";

const Instagram = () => {

    const [urls, setUrls] = useState([] as string[])
    const [started, setStarted] = useState([] as number[])
    const [contentWidth, setContentWidth] = useState(window.parent.window.innerWidth)

    const setColumns = (columns: number) => {
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

    return <>
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