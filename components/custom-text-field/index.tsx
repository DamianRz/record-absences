import React from "react";
import TextField from "@mui/material/TextField";

interface CustomTextFieldProps {
    name: string,
    onChange: any,
    value: any,
    error: boolean,
    helperText: string,
    label: string,
    className?: string,
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
    name,
    onChange,
    value,
    error,
    helperText,
    label,
    className
}) => {
    return (
        <TextField
            name={name}
            onChange={onChange}
            value={value}
            error={error}
            helperText={helperText}
            label={label}
            fullWidth={false}
            className={`${className}`}
            size="small"
            sx={{
                ".MuiFormLabel-root": { color: "#fff" },
                '& input + fieldset': {
                    borderColor: '#fff',
                    borderWidth: 1,
                },
                "& input": { color: "#ffff" },
            }}
        />
    )
};

export default CustomTextField;
