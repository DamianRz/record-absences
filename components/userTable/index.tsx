import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { mokUsers } from "../../api/users.mok";

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
    <div className="h-[520px]">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default UserTable;
