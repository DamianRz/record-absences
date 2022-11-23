import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface CustomSelectFieldProps {
  name: string;
  onChange: any;
  value: any;
  label: string;
  className?: string;
  items: { name: string; value: any }[];
}

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  name,
  label,
  value,
  onChange,
  items,
}) => {
  const [item, setItem] = useState(value);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setItem(event.target.value as string);
    onChange(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel htmlFor={`${name}-select`}>{label}</InputLabel>
      <Select
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={item}
        name={name}
        onChange={handleChange}
        inputProps={{
          id: `${name}-select`,
        }}
      >
        {items.map((menuItem, key) => (
          <MenuItem value={menuItem.value} key={key}>
            {menuItem.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelectField;
