import React from "react";
import { DataGrid, esES, GridColDef } from "@mui/x-data-grid";
import { mokUsers } from "../../api/users.mok";

interface UserTableProps {}

const columns: GridColDef[] = [
  { field: "document", headerName: "Documento", width: 130 },
  { field: "name", headerName: "Nombre", width: 130 },
  { field: "lastname", headerName: "Apellido", width: 130 },
  { field: "active", headerName: "Activo", width: 130 },
  {
    field: "actions",
    headerName: "",
    width: 130,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
];

const rows = mokUsers;

const UserTable: React.FC<UserTableProps> = () => {
  const setSelectedRow = (item) => {
    console.log(item);
  };

  return (
    <DataGrid
      onRowClick={setSelectedRow}
      disableColumnSelector
      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      className="rounded-none border-none h-[500px]"
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
    />
  );
};

export default UserTable;
