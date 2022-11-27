import React, { useState } from "react";
import { LinearProgress } from "@mui/material";

interface CustomTableProps {
  isLoading: boolean;
  headers: any[];
  items: any[];
  className?: string;
  footerButtons: any;
  onSelectRow: any;
}

interface CustomRowProps {
  row: any[];
  onSelect: any;
  isSelected: boolean;
}

const CustomTable: React.FC<CustomTableProps> = ({
  isLoading,
  headers,
  items,
  className,
  footerButtons,
  onSelectRow,
}) => {
  const [selectedRow, setSelectedRow] = useState(undefined);

  const CustomRow: React.FC<CustomRowProps> = ({
    row,
    onSelect,
    isSelected,
  }) => {
    const handleSelect = () => {
      onSelect(row);
    };

    return (
      <div
        onClick={handleSelect}
        className={`w-auto flex py-2 px-4 cursor-pointer
         hover:bg-blue-100 ${isSelected && "bg-blue-200"}`}
      >
        {headers.map((header: any, index: number) => (
          <div className="min-w-[200px]" key={index}>
            {header.field === "actions" && isSelected ? (
              <>{/* TODO  */}</>
            ) : (
              row[header.field]
            )}
          </div>
        ))}
      </div>
    );
  };

  const CustomHeader = () => {
    return (
      <div className="flex shadow-md p-4">
        {headers.map((header: any, index: number) => (
          <div key={index} className="min-w-[200px]">
            {header.headerName}
          </div>
        ))}
      </div>
    );
  };

  const CustomFooter = () => {
    return (
      <div className="flex space-x-2 shadow-md p-4 mb-2">
        {selectedRow && footerButtons}
      </div>
    );
  };

  const handleSelect = (row: any) => {
    setSelectedRow(row);
    onSelectRow(row);
  };

  return (
    <>
      {(isLoading && (
        <>
          <div className="w-full h-full mt-4 items-center space-y-4">
            <span>Cargando resultados...</span>
            <LinearProgress />
          </div>
        </>
      )) ||
        (items.length ? (
          <div className={`shadow-md w-fit min-w-[600px] ${className}`}>
            <CustomHeader />
            <div className="max-h-[400px] overflow-y-scroll">
              {items.map((row: any, index) => (
                <CustomRow
                  row={row}
                  key={index}
                  onSelect={handleSelect}
                  isSelected={row === selectedRow}
                />
              ))}
            </div>
            <CustomFooter />
          </div>
        ) : (
          <span>No se encontraron registros</span>
        ))}
    </>
  );
};

export default CustomTable;
