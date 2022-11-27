import { Chip } from "@mui/material";
import React, { useState, useEffect } from "react";
import CustomTable from "../../custom-table";
import TitleSection from "../../title-section";
import EditIcon from "@mui/icons-material/Edit";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { mokUsers } from "../../../api/users.mok";

const TeachersWidget = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const teacherColumns: any = [
    { field: "document", headerName: "Documento" },
    { field: "name", headerName: "Nombre" },
    { field: "lastname", headerName: "Apellido" },
  ];

  const getTeachers = async () => {
    setItems(mokUsers);
    // setIsLoading(true);
    // setTimeout(() => {
    //   setItems(mokUsers);
    //   setIsLoading(false);
    // }, 5000);
  };

  return (
    <div className="bg-zing-900">
      <TitleSection title="Ingreso de Inasistencias Docente" />
      <CustomTable
        isLoading={isLoading}
        headers={teacherColumns}
        items={items}
        className="mt-4"
        onSelectRow={setSelectedTeacher}
        footerButtons={
          <>
            <Chip
              className={` hover:bg-green-500`}
              label="Editar"
              icon={<EditIcon className=" rounded-full" />}
              onClick={() => {}}
            />
            <Chip
              icon={<ContentPasteSearchIcon />}
              label="Ver Inasistencias"
              onClick={() => {}}
            />
          </>
        }
      />
      <Chip
        label="Buscar"
        onClick={async () => {
          await getTeachers();
        }}
      />
    </div>
  );
};

export default TeachersWidget;
