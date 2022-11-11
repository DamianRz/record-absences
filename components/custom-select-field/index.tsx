import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface CustomSelectFieldProps {
    name: string,
    onChange: any,
    value: any,
    label: string,
    className?: string,
    items: { name: string, value: any }[],
}

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
    name,
    onChange,
    value,
    label,
    className,
    items,
}) => {

    const [selectedItem, setSelectedItem] = useState("")

    // const handleChange = (event: SelectChangeEvent) => {
    //     // console.log("chadndfj")
    //     setSelectedItem(event.target.value as string);
    //     // onChange(selectedItem);
    // };

    const handle = (v) => {
        setSelectedItem(v)
    }

    return (
        <FormControl sx={{ minWidth: 150 }} className="mr-4">
            <InputLabel
                className="flex items-center top-[-8px]"
                id="demo-simple-select-label">{label}</InputLabel>
            <Select
                value={selectedItem}
                name={name}
                label={label}
                fullWidth={false}
                size="small"
                id={`demo-simple-select-${name}`}
                labelId={`demo-simple-select-label-${name}`}
            >
                {items.map((item: any, index: number) => (
                    <MenuItem
                        value={item.id}
                        key={index}
                        onClick={() => { handle(item.id) }}
                    >
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default CustomSelectField;
