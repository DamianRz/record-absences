import React, {useState} from 'react'
import {InputLabel, FormControl, MenuItem, Select} from '@mui/material'

interface MySelectProps {
  label: string
  className: string
  options: { value: any, label: string }[]
  defaultValue?: any
  onChange: (value: any) => void;
  error?: boolean,
  value: any
}

const CustomSelect: React.FC<MySelectProps> = ({ 
  onChange,
  label, 
  className, 
  options, 
  defaultValue,
  value,
  error
}) => {
  // const [selectedValue, setSelectedValue] = useState(value || "")

  const handleChange = (event: any) => {
    // setSelectedValue(event.target.value)
    const selectedItem = options.filter((a) => a.value === event.target.value)
    onChange(selectedItem[0])
  };

  return (
    <FormControl className={`${className}`}>
      <InputLabel 
        className="bg-white w-max"
        htmlFor='select-label'
      >
        {label}
      </InputLabel>
      <p>{JSON.stringify(value)}</p>
      <Select
        defaultValue={value.value}
        value={value.value}
        onChange={handleChange}
        labelId="select-label"
        error={error}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CustomSelect
