import {useEffect, useState} from "react";
import {shuffleArray} from "../shuffle-array";
import {SliderFlexPane} from "./slider-flex-pane";

const Instagram = () => {

    const [urls, setUrls] = useState([] as string[])
    const [contentWidth, setContentWidth] = useState(window.parent.screen.width)

    const setColumns = (columns: number) => {
        setContentWidth(window.parent.screen.width / columns)
    }

    useEffect(() => {
        fetch("http://192.168.1.11/media/instagram/ls_json.php").then(r => r.json()).then((r: string[]) => {
            setUrls(r)
        })
    }, [])

    return <>
        <SliderFlexPane setColumns={setColumns}>
            {shuffleArray(urls).filter(e => e !== "ls_json.php").map(u => {
                return <video controls autoPlay loop muted playsInline width={contentWidth}>
                    <source src={`http://192.168.1.11/media/instagram/${u}`} type={"video/mp4"}/>
                </video>
            })}
        </SliderFlexPane>
    </>
}
export default Instagram