import React from "react";
import MDTextfield from "@mui/material/TextField";
import { string } from "yup";

interface TextFieldProps {
    label: string,
    id: string,
    name: string,
    onChange: any,
    value: any,
    error: boolean,
    helperText: string,
    type: string,
    fullWidth: boolean,
    className?: string,
}

const Textfield: React.FC<TextFieldProps> = ({
    label,
    id,
    name,
    onChange,
    value,
    error,
    helperText,
    type,
    fullWidth,
    className
}) => {
    return (
        <MDTextfield
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          error={error}
          helperText={helperText}
          label={label}
          type={type}
          fullWidth={fullWidth}
          className={className}
          size="small"
        />
    )
};

export default Textfield;
