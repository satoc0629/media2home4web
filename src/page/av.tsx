import {useEffect, useState} from "react";
import {shuffleArray} from "../shuffle-array";
import {SliderFlexPane} from "./slider-flex-pane";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

const AV = () => {
    const [urls, setUrls] = useState([] as string[])
    const [contentWidth, setContentWidth] = useState(window.parent.screen.width)

    const [priority, setPriority] = useState(1)

    const setColumns = (columns: number) => {
        setContentWidth(window.parent.screen.width / columns)
    }
    useEffect(() => {
        fetch(`http://192.168.1.11/media/av/priority${priority}/ls_json.php`).then(r => r.json()).then((r: string[]) => {
            setUrls(r)
        })
    }, [priority])

    let handleChangePriority = (event: SelectChangeEvent<number>)=>{
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
        <SliderFlexPane setColumns={setColumns}>
            {shuffleArray(urls).filter(e => e !== "ls_json.php").map(u => {
                return <video controls muted playsInline width={contentWidth}>
                    <source src={`http://192.168.1.11/media/av/priority${priority}/${u}`} type={"video/mp4"}/>
                </video>
            })}
        </SliderFlexPane>
    </>
}
export default AV