import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { LoaderContext } from "../contexts/loader";

interface CustomTableProps {
  headers: { name: string; value: any }[];
  items: any;
  onSelectRow: any;
  className: string;
  fontSize?: "xs" | "sm" | "xl";
  showFilters?: boolean
}

const CustomTable: React.FC<CustomTableProps> = ({
  headers,
  items,
  onSelectRow,
  className,
  fontSize,
  showFilters = true
}) => {
  const [selectedRow, setSelectedRow] = useState();
  const [selectedHeader, setSelectedHeader] = useState<any>(headers[0]);
  const [values, setValues] = useState<any[]>([]);
  const [currentSort, setCurrentSort] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const { isLoading } = useContext(LoaderContext);

  const handleSelectRow = (row: any) => {
    setSelectedRow(row);
    onSelectRow(row);
  };

  useEffect(() => {
    setValues(items);
  }, [items]);

  const convertToDateObject = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  useEffect(() => {
    if (currentSort) {
      sortRowsBy(currentSort);
    } else {
      setValues([...items]); // Copiar los elementos en lugar de revertirlos
    }
  }, [currentSort]);

  const handleHeaderClick = (header: any) => {
    setSelectedHeader(header);

    if (currentSort === header.name) {
      setCurrentSort("");
    } else {
      setCurrentSort(header.name);
    }

    setValues([...items]); // Copiar los elementos para reiniciar el filtro
    setFilterValue(""); // Reiniciar el valor del filtro
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilterValue(value);

    const filteredValues = items.filter((item: any) => {
      const headerValue = item[selectedHeader.name]?.toString().toLowerCase();
      return headerValue && headerValue.includes(value.toLowerCase());
    });

    setValues(filteredValues);
  };

  const sortRowsBy = (row: string) => {
    let sort = [];
    if (row.toLowerCase().indexOf("date") !== -1) {
      sort = [...values].sort((a: any, b: any) => {
        const dateA: any = convertToDateObject(a.startDate);
        const dateB: any = convertToDateObject(b.startDate);
        return dateA - dateB;
      });
    } else {
      sort = [...values].sort((a: any, b: any) => {
        if (typeof a[row] === "string") {
          return a[row].localeCompare(b[row]);
        }
        return a[row] - b[row];
      });
    }
    if (currentSort === row) {
      sort = sort.reverse();
    }
    setValues(sort);
  };

  return (
    <>
      {(items.length > 0 && showFilters) && (
        <div>
          <TextField
            label="Filtrar"
            type="text"
            value={filterValue}
            onChange={handleFilterChange}
            placeholder="Filtrar"
            className="w-full max-w-[200px] mb-4 leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
            variant="outlined"
            size="small"
          />
        </div>
      )}
      <TableContainer className={className}>
        <Table stickyHeader className="w-full text-left">
          <TableHead>
            <TableRow>
              {headers.map((header, key) => (
                <TableCell
                  key={key}
                  className={`${fontSize && "text-" + fontSize} ${showFilters && selectedHeader && selectedHeader.name === header.name && 'bg-teal-400 text-white'}
                  ${showFilters && 'cursor-pointer'}
                    p-3 text-gray-700 text-center bg-teal-100 select-none`}
                  onClick={() => { if (!isLoading && showFilters) handleHeaderClick(header) }}
                >
                  {header.value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {values.length > 0 && values.map((row: any, index) => (
              <TableRow
                key={index}
                onClick={() => { if (!isLoading) handleSelectRow(row) }}
                className={`${selectedRow === row && "bg-teal-50"
                  } text-center cursor-pointer hover:bg-teal-50`}
              >
                {headers.map((header, key) => (
                  <TableCell key={key} className={`${fontSize && "text-" + fontSize} ${isLoading && 'text-gray-400'} 
                    p-3 font-mono text-sm border-t border-gray-200`}>
                    {row && row[header?.name]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {values.length === 0 && <p>No se encontraron resultados pre-cargados</p>}
    </>
  );
};

export default React.memo(CustomTable);
