import {useEffect, useState} from "react";
import {shuffleArray} from "../shuffle-array";
import {SliderFlexPane} from "./slider-flex-pane";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

const AV = () => {
    const [urls, setUrls] = useState([] as string[])
    const [contentWidth, setContentWidth] = useState(window.parent.screen.width)
    const [started, setStarted] = useState([] as number[])
    const [priority, setPriority] = useState(1)

    const setColumns = (columns: number) => {
        setContentWidth(window.parent.screen.width / columns)
    }

    function playVideos(videoWrappers: HTMLCollectionOf<Element>) {
        // 最上位位置からのスクロール幅
        const startPosition = window.scrollY + window.innerHeight;
        for (let i = 0; i < videoWrappers.length; i++) {
            // 描画範囲全体の上からみて今の画面表示の下限位置
            const videoPositionTop = videoWrappers[i].getBoundingClientRect().top + window.scrollY;
            const video = videoWrappers[i].getElementsByTagName('video');
            const videoPositionBottom = videoWrappers[i].getBoundingClientRect().bottom;
            if (videoPositionBottom < 0) {
                video[0].pause()
            } else if (startPosition > videoPositionTop) {
                if (!started.includes(i)) {
                    video[0].src = `http://192.168.1.11/media/av/priority${priority}/${urls[i]}`
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
        fetch(`http://192.168.1.11/media/av/priority${priority}/ls_json.php`).then(r => r.json()).then((r: string[]) => {
            setUrls(r.filter(r => r !== "ls_json.php"))
        })
    }, [priority])
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

    let handleChangePriority = (event: SelectChangeEvent<number>) => {
        setPriority(Number(event.target.value))
    };
    return <>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={priority}
                label="Age"
                onChange={handleChangePriority}
            >
                <MenuItem value={1}>☆☆☆☆☆</MenuItem>
                <MenuItem value={2}>☆☆☆☆</MenuItem>
                <MenuItem value={3}>☆☆☆</MenuItem>
                <MenuItem value={4}>☆☆</MenuItem>
                <MenuItem value={5}>☆</MenuItem>
            </Select>
        </FormControl>
        <SliderFlexPane setColumns={setColumns} defaultColumn={1}>
            {shuffleArray(urls).filter(e => e !== "ls_json.php").map(u => {
                return <div className={"video_wrapper"} style={{maxWidth: contentWidth, width: contentWidth}}>
                    <video controls muted playsInline width={contentWidth}>
                        <source type={"video/mp4"}/>
                    </video>
                </div>
            })}
        </SliderFlexPane>
    </>
}
export default AV