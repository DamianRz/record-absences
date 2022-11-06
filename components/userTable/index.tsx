import React from "react";
import { DataGrid, esES, GridColDef, nlNL } from "@mui/x-data-grid";
import { mokUsers } from "../../api/users.mok";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { LocalizationProvider } from "@mui/x-date-pickers";

interface UserTableProps { }

const columns: GridColDef[] = [
  { field: "document", headerName: "Documento", width: 130 },
  { field: "name", headerName: "Nombre", width: 130 },
  { field: "lastname", headerName: "Apellido", width: 130 },
  { field: "active", headerName: "Activo", width: 130 },
];

const rows = mokUsers;

const UserTable: React.FC<UserTableProps> = () => {
  return (
    <DataGrid
      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      className="text-white rounded-none border-none h-[500px]"
      sx={{
        ".MuiDataGrid-cell": { border: "none" },
        ".MuiTablePagination-root": { color: "white" },
        ".MuiDataGrid-row:hover": { backgroundColor: "#4f4f4f", color: "white" },
      }}
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
    />
  );
};

export default UserTable;
