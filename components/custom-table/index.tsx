import React, { useState } from 'react'
import { LinearProgress } from '@mui/material'
import { RowProps, TableProps } from '../../types/customTable'

const CustomTable: React.FC<TableProps> = ({
  isLoading,
  headers,
  items,
  className,
  footerButtons,
  onSelectRow
}) => {
  const [selectedRow, setSelectedRow] = useState(false)

  const labels = {
    loading: 'loading results...',
    noResult: 'no results'
  }

  const CustomRow: React.FC<RowProps> = ({
    value,
    onSelect,
    isSelected
  }) => {
    const handleSelect = (): void => onSelect(value)

    return (
      <div
        onClick={handleSelect}
        className={`w-auto flex py-2 px-4 cursor-pointer
         hover:bg-blue-100 ${isSelected ? 'bg-blue-200' : ''}`}
      >
        {headers.map((header, index) => (
          <div className="min-w-[200px]" key={index}>
            <span>{value[header.name]}</span>
          </div>
        ))}
      </div>
    )
  }

  const handleSelect: any = (row: any) => {
    setSelectedRow(row)
    onSelectRow(row)
  }

  const CustomHeader = (): any => (
    <div className="flex p-4 shadow-md">
        {headers.map((header, index) => (
          <div key={index} className="min-w-[200px]">
            {header.value}
          </div>
        ))}
      </div>
  )

  const CustomFooter = (): any => (
    <div className="flex space-x-4 shadow-md p-4 mb-2 h-[64px]">
      {selectedRow && (footerButtons)}
    </div>
  )

  return (
    <>
    {isLoading
      ? (
      <>
        <div className="items-center w-full h-full mt-4 space-y-4">
          <span>{labels.loading}</span>
          <LinearProgress />
        </div>
      </>
        )
      : (items.length > 0
          ? (
        <div className={`shadow-md w-fit ${className ?? ''}`}>
          <CustomHeader />
          <div className="max-h-[400px] overflow-y-scroll">
            {items.map((row, index) => (
              <CustomRow
                value={row}
                key={index}
                onSelect={handleSelect}
                isSelected={row === selectedRow}
              />
            ))}
          </div>
          <CustomFooter />
        </div>
            )
          : (<span>{labels.noResult}</span>)
        )}
  </>
  )
}

export default CustomTable
