import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";

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

  const handleSelectRow = (row: any) => {
    setSelectedRow(row);
    onSelectRow(row);
  };

  return (
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
          {items.map((row: any) => (
            <TableRow
              key={row.id}
              onClick={() => handleSelectRow(row)}
              className={`${selectedRow === row && "bg-teal-50"
                } text-center cursor-pointer hover:bg-teal-50`}
            >
              {headers.map((header, key) => (
                <TableCell key={key} className={`${fontSize && "text-" + fontSize} p-3 font-mono text-sm border-t border-gray-200`}>
                  {row[header.name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
