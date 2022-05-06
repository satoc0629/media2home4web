import {useEffect, useState} from "react";
import {shuffleArray} from "../shuffle-array";
import {SliderFlexPane} from "./slider-flex-pane";

const Picture = () => {
    const [urls, setUrls] = useState([] as string[])
    const [contentWidth, setContentWidth] = useState(window.parent.screen.width)

    const setColumns = (columns: number) => {
        setContentWidth(window.parent.screen.width / columns)
    }
    useEffect(() => {
        fetch("http://192.168.1.11/media/picture/ls_json.php").then(r => r.json()).then((r: string[]) => {
            setUrls(r)
        })
    }, [])

    return <>
        <SliderFlexPane setColumns={setColumns}>
            {shuffleArray(urls).filter(e => e !== "ls_json.php").map(u => {
                return <img src={`http://192.168.1.11/media/picture/${u}`} style={{width: `${contentWidth}`}}/>
            })}
        </SliderFlexPane>
    </>
}
export default Picture