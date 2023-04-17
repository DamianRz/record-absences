import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { LoaderContext } from "../contexts/loader"

interface CustomTableProps {
  headers: { name: string, value: any }[];
  items: any;
  onSelectRow: any;
  className: string
  fontSize?: "xs" | "sm" | "xl"
}

const CustomTable: React.FC<CustomTableProps> = ({
  headers,
  items,
  onSelectRow,
  className,
  fontSize
}) => {
  const [selectedRow, setSelectedRow] = useState();
  const [values, setValues] = useState([])

  const { isLoading } = useContext(LoaderContext);

  const handleSelectRow = (row: any) => {
    setSelectedRow(row);
    onSelectRow(row);
  };

  useEffect(() => {
    setValues(items)
  }, [items])

  return (
    <>
      {values.length > 0 && (
        <TableContainer className={className}>
          <Table stickyHeader className="w-full text-left">
            <TableHead>
              <TableRow>
                {headers.map((header, key) => (
                  <TableCell
                    key={key}
                    className={`${fontSize && "text-" + fontSize} p-3 text-gray-700 bg-teal-100 select-none`}
                  >
                    {header.value}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {values.map((row: any) => (
                <TableRow
                  key={row.id}
                  onClick={() => { if (!isLoading) handleSelectRow(row) }}
                  className={`${selectedRow === row && "bg-teal-50"
                    } text-center cursor-pointer hover:bg-teal-50`}
                >
                  {headers.map((header, key) => (
                    <TableCell key={key} className={`${fontSize && "text-" + fontSize} ${isLoading && 'text-gray-400'} 
                    p-3 font-mono text-sm border-t border-gray-200`}>
                      {row[header.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {values.length === 0 && <p>No se encontraron resultados pre-cargados</p>}
    </>
  );
};

export default React.memo(CustomTable);
