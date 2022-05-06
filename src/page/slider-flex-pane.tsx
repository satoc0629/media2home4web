import {Slider} from "@mui/material";
import {PropsWithChildren, useEffect, useState} from "react";

type Props = {
    setColumns: (columns: number) => {},
    defaultColumn: number
} & PropsWithChildren<any>

export const SliderFlexPane = (props: Props) => {
    const [flexColumn, setFlexColumn] = useState(4)
    const [templateColumn, setTemplateColumn] = useState("12fr")

    useEffect(() => {
        columnChange(props.defaultColumn)
    }, [])
    const columnChange = (column: number) => {
        switch (column) {
            case 1:
                props.setColumns(1)
                setTemplateColumn("12fr")
                break
            case 2:
                props.setColumns(2)
                setTemplateColumn("6fr 6fr")
                break
            case 3:
                props.setColumns(3)
                setTemplateColumn("repeat(3, 4fr)")
                break
            case 4:
                props.setColumns(4)
                setTemplateColumn("repeat(4, 3fr)")
                break
            case 6:
                props.setColumns(6)
                setTemplateColumn("repeat(6, 2fr)")
                break
            case 12:
                props.setColumns(12)
                setTemplateColumn("repeat(12, 1fr)")
                break
        }
    }
    useEffect(() => {
        const ret = 12 / flexColumn
        columnChange(ret)
    }, [flexColumn])

    let handleOnChange = (event: Event) => {
        if (event.target) {
            const element = event.target as HTMLInputElement
            setFlexColumn(Number(element.value))
        }
    };

    return <>
        <div style={{width: "97vw", marginLeft: "1vw"}}>
            <Slider
                aria-label="Temperature"
                defaultValue={4}
                onChange={handleOnChange}
                valueLabelDisplay="auto"
                step={1}
                marks={[
                    {label: 1, value: 12},
                    {label: 2, value: 6},
                    {label: 3, value: 4},
                    {label: 4, value: 3},
                    {label: 6, value: 2},
                    {label: 12, value: 1}
                ]}
                min={1}
                max={12}
            />
        </div>
        <div style={{
            display: "grid",
            gridTemplateColumns: `${templateColumn}`,
            width: "fit-content",
            maxWidth: "100vw"
        }}>
            {/*<div style={{display: "flex", flexFlow: "column"}}>*/}
            {props.children}
        </div>
    </>
}