import React, {useState} from 'react'
import {InputLabel, FormControl, MenuItem, Select} from '@mui/material'

interface MySelectProps {
  label: string
  className: string
  options: { value: any, label: string }[]
  initialValue: any
  onChange: (value: any) => void;
  error?: boolean
}

const CustomSelect: React.FC<MySelectProps> = ({ 
  onChange,
  label, 
  className, 
  options, 
  initialValue,
  error
}) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (event: any) => {
    setValue(event.target.value)
    const selectedItem = options.filter((a) => a.value === event.target.value)
    onChange(selectedItem[0])
  };

  return (
    <FormControl className={`${className}`}>
      <InputLabel 
        size="small"
        variant="outlined"
        className="bg-white w-max"
        htmlFor='select-label'
      >
        {label}
      </InputLabel>
      <Select
        value={value} 
        onChange={handleChange}
        labelId="select-label"
        error={error}
      >
        {/* <MenuItem disabled value="">Seleccione...</MenuItem> */}
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CustomSelect
