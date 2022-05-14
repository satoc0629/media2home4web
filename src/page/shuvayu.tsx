import {useEffect, useState} from "react";
import {shuffleArray} from "../shuffle-array";
import {SliderFlexPane} from "./slider-flex-pane";

const ShuVayu = () => {

    const [urls, setUrls] = useState([] as string[])
    const [started, setStarted] = useState([] as number[])
    const [contentWidth, setContentWidth] = useState(window.parent.window.innerWidth)

    const setColumns = (columns: number) => {
        setContentWidth(window.parent.window.innerWidth / columns)
    }

    function playVideos(videoWrappers: HTMLCollectionOf<Element>) {
        const startPosition = window.scrollY + window.innerHeight;
        for (let i = 0; i < videoWrappers.length; i++) {
            // 描画範囲全体の上からみて今の画面表示の下限位置
            const videoPosition = videoWrappers[i].getBoundingClientRect().top + window.scrollY;
            const video = videoWrappers[i].getElementsByTagName('video');
            const videoPositionBottom = videoWrappers[i].getBoundingClientRect().bottom;
            if (videoPositionBottom < 0) {
                video[0].pause()
            } else if (startPosition > videoPosition) {
                if (!started.includes(i)) {
                    video[0].src = `http://192.168.1.11/media/shuvayu/${urls[i]}`
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
        fetch("http://192.168.1.11/media/shuvayu/ls_json.php").then(r => r.json()).then((r: string[]) => {
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
        <SliderFlexPane setColumns={setColumns} defaultColumn={1}>
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
    // const [urls, setUrls] = useState([] as string[])
    // const [contentWidth, setContentWidth] = useState(window.parent.screen.width)
    //
    // const setColumns = (columns: number) => {
    //     setContentWidth(window.parent.screen.width / columns)
    // }
    // useEffect(() => {
    //     fetch("http://192.168.1.11/media/shuvayu/ls_json.php").then(r => r.json()).then((r: string[]) => {
    //         setUrls(r)
    //     })
    // }, [])
    //
    // return <>
    //     <SliderFlexPane setColumns={setColumns} defaultColumn={"1"}>
    //         {shuffleArray(urls).filter(e => e !== "ls_json.php").map(u => {
    //             return <video controls autoPlay loop muted playsInline width={contentWidth}>
    //                 <source src={`http://192.168.1.11/media/shuvayu/${u}`} type={"video/mp4"}/>
    //             </video>
    //         })}
    //     </SliderFlexPane>
    // </>
}
export default ShuVayu