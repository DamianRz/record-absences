import React, { useState } from "react";
import TitleSection from "../../title-section";
import { useFormik } from "formik";
import { loginSchema, ABSENCES_INITIAL_VALUES } from "./validation";
import Button from "@mui/material/Button";
import CustomTextField from "../../custom-text-field";
import CustomSelectField from "../../custom-select-field";
import CustomDateField from "../../custom-date-field";

const AbsencesWidget = () => {
  const [group, setGroup] = useState();
  const [matter, setMatter] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [motive, setMotive] = useState();

  const [reason, setReason] = useState("");

  interface IGroup {
    value: number;
    name: string;
  }
  interface ICourse {
    id: number;
    name: string;
  }
  interface IShift {
    id: number;
    name: string;
  }

  const reasons = [
    { value: 1, name: "enfermedad" },
    { value: 2, name: "medico" },
    { value: 3, name: "licencia" },
    { value: 4, name: "embarazo" },
    { value: 5, name: "otro" },
  ];

  const groups = [
    { value: 1, name: "1A" },
    { value: 2, name: "1B" },
    { value: 3, name: "1C" },
    { value: 4, name: "1D" },
  ];

  const matters = [
    { value: 1, name: "Matematicas" },
    { value: 2, name: "Geometria" },
  ];

  const formik = useFormik({
    initialValues: ABSENCES_INITIAL_VALUES,
    validationSchema: loginSchema,
    onSubmit: () => {
      console.log("data", formik.values);
    },
  });

  return (
    <div className="bg-zing-900">
      <TitleSection title="Ingreso de Inasistencias Docente" />
      <form onSubmit={formik.handleSubmit}>
        <span className="text-xs text-white">
          Ingrese los datos del docente, fechas, grupo, materia y turno
        </span>
        <div className="flex mt-4">
          <CustomTextField
            name="document"
            label={"Documento"}
            value={formik.values.document}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.document && Boolean(formik.errors.document)
            )}
            helperText={
              (formik.touched.document && formik.errors.document) || ""
            }
          />
        </div>
        <div className="flex mt-4 space-x-4">
          <CustomSelectField
            items={groups}
            value={group}
            label="Grupo"
            name="groups"
            onChange={setGroup}
            className=""
          />
          <CustomSelectField
            items={matters}
            value={matter}
            label="Materia"
            name="matters"
            onChange={setMatter}
          />
        </div>
        <div className="flex mt-4">
          <CustomDateField
            name="startDate"
            error={false}
            helperText={""}
            label="Fecha de inicio"
            onChange={setStartDate}
            value={startDate}
          />
          <CustomDateField
            name="endDate"
            error={false}
            helperText={""}
            label="Fecha fin"
            onChange={setEndDate}
            value={endDate}
          />
        </div>
        <div className="flex mt-4">
          <CustomSelectField
            items={reasons}
            value={reason}
            onChange={setReason}
            label="Motivo"
            name="motive"
          />
        </div>
        <Button
          className="mt-8"
          onClick={() => {}}
          color="success"
          variant="outlined"
        >
          Crear
        </Button>
      </form>
    </div>
  );
};

export default AbsencesWidget;
