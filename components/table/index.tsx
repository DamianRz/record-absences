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
}

const CustomTable: React.FC<CustomTableProps> = ({
  headers,
  items,
  onSelectRow,
}) => {
  const [selectedRow, setSelectedRow] = useState();

  const handleSelectRow = (row: any) => {
    setSelectedRow(row);
    onSelectRow(row.id);
  };

  return (
    <div className="w-full relative max-h-[400px] h-[400px]">
      <Paper
        className="w-full p-4 rounded-lg shadow-lg"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader className="w-full text-left">
            <TableHead>
              <TableRow>
                {headers.map((header, key) => (
                  <TableCell
                    key={key}
                    className="p-3 font-bold text-gray-700 bg-gray-200 select-none"
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
                    <TableCell key={key} className="p-3 font-mono text-sm border-t border-gray-200">
                      {row[header.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default CustomTable;
