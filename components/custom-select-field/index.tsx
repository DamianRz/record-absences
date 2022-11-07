import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface CustomSelectFieldProps {
    name: string,
    onChange: any,
    value: any, label: string,
    className?: string,
    items: { name: string, value: any }[],
}

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
    name,
    onChange,
    value, label,
    className,
    items,
}) => {
    return (
        <FormControl sx={{ minWidth: 150 }} className="mr-4">
            <InputLabel
                className="text-white flex items-center top-[-8px]"
                id="demo-simple-select-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label={label}
                fullWidth={false}
                onChange={onChange}
                size="small"
                sx={{
                    'svg': { color: "#fff" },
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: "#fff",
                    },
                }}
            >
                {items.map((item: any, index: number) => (
                    <MenuItem value={item.id} key={index}>
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default CustomSelectField;
