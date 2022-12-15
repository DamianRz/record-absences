import { Button, Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTable from '../custom-table'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { TableHeader } from '../../types/customTable'
import CustomSelect from '../custom-select-field'

interface SelectListProps {
    items: any[]
    className: string
    label: string
    title: string
    name: string
    headers: TableHeader[]
    onChange: (value: any) => void
    required?: boolean
    error?: boolean
    helperText?: string 
}

const SelectList: React.FC<SelectListProps> = ({
    items,
    className, 
    label,
    title,
    name,
    headers,
    onChange,
    required,
    error,
    helperText
}) => {
    
    // table vars
    const [rows, setRows] = useState([])
    const [selectedRow, setSelectedRow] = useState(undefined)

    useEffect(() => {
        onChange(rows)
    },[rows])

    // select vars
    const [selectedItem, setSelectedItem] = useState("")

    const handleSelectItem = () => {
        setRows(data => [...data, selectedItem])
        setSelectedItem("")
    }

    const handleRemoveRow = () => {
        setRows(rows.filter((a: any) => a != selectedRow))
        setSelectedRow(undefined)
    }

    const filterItems = items.filter(a => {
        let found = true;
        rows.forEach(b => {
          if(b == a) found = false
        })
        return found
      })

  return (
    <div className={`${className}`}>
        <span className=''>{title}</span>
        <div className='flex mt-4 space-x-4'>
            <CustomSelect
                initialValue=""//{selectedItem}
                options={filterItems}
                onChange={setSelectedItem}
                label={label}
                className="min-w-[250px]"
                error={error}
            />
            <Button
                className='normal-case'
                variant='outlined'
                color='success'
                endIcon={<AddIcon />}
                onClick={handleSelectItem}
                disabled={selectedItem === ""}
            >
                Agregar
            </Button>
    </div>
    <CustomTable
      isLoading={false}
      headers={headers}
      items={rows}
      className="mt-4"
      onSelectRow={setSelectedRow}
      footerButtons={
        <>
            <Chip
                className={'hover:bg-red-300'}
                icon={<DeleteIcon />}
                label="Quitar"
                onClick={handleRemoveRow}
            />
      </>
      }
    />
    {helperText && <span className='mx-[14px] text-[12px] text-[#d32f2f]'>{helperText}</span>}
  </div>
  )
    }

export default SelectList