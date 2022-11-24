import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";

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
    <StyledEngineProvider injectFirst>
      <FormControl className="min-w-[223px]">
        <InputLabel
          size="small"
          variant="outlined"
          className="bg-white w-max"
          htmlFor={`${name}-select`}
        >
          {label}
        </InputLabel>

        <Select
          labelId="`${name}-select`"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={item}
          name={name}
          onChange={handleChange}
          size="small"
        >
          {items.map((menuItem, key) => (
            <MenuItem value={menuItem.value} key={key}>
              {menuItem.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StyledEngineProvider>
  );
};

export default CustomSelectField;
