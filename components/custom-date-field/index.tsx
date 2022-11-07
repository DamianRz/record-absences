import React from "react";
import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface CustomDateFieldProps {
    name: string,
    onChange: any,
    value: any,
    label: string,
    error: boolean,
    helperText: string,
    className?: string,
}

const CustomDateField: React.FC<CustomDateFieldProps> = ({
    name,
    onChange,
    value,
    label,
    className,
    error,
    helperText,
}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                label="Date desktop"
                inputFormat="DD/MM/YYYY"
                value={value}
                onChange={onChange}
                minDate={new Date()}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        fullWidth={false}
                        variant="standard"
                        className="mr-4"
                        type="text"
                        id={name}
                        name={name}
                        onChange={onChange}
                        value={value}
                        error={error}
                        helperText={helperText}
                        label={label}
                        sx={{
                            "svg": { color: "#fff" },
                            ".MuiFormLabel-root": { color: "#fff" },
                            '.MuiInputBase-root': {
                                // borderBottomColor: '#fff',
                                // borderWidth: 1,
                            },
                            "& input": { color: "#ffff" },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    )
};

export default CustomDateField;
