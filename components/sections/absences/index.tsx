import React, { useState } from "react";
import TitleSection from "../../title-section";
import Textfield from "@mui/material/TextField";
import { useFormik } from "formik";
import { loginSchema, ABSENCES_INITIAL_VALUES } from "./validation";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import { FormControl, MenuItem, Select } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import styles from "./absences.module.scss";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import CustomTextField from "../../custom-text-field";
import CustomSelectField from "../../custom-select-field";
import CustomDateField from "../../custom-date-field";


const Absences = () => {
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

  const [startDate, setStartDate] = useState<any>(undefined);
  const [endDate, setEndDate] = useState<any>(undefined);
  // const [groups, setGroups] = useState<IGroup[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<undefined>(undefined);
  const [selectedShift, setSelectedShift] = useState<undefined>(undefined);


  const response = [
    {
      group: "1A",

    }
  ]

  const reasons = [
    { value: 1, name: "enfermedad" },
    { value: 2, name: "medico" },
    { value: 1, name: "licencia" },
    { value: 1, name: "embarazo" },
    { value: 1, name: "otro" },
  ]

  const groups = [
    { value: 1, name: "1A" },
    { value: 2, name: "1B" },
    { value: 3, name: "1C" },
    { value: 4, name: "1D" },
  ]

  const formik = useFormik({
    initialValues: ABSENCES_INITIAL_VALUES,
    validationSchema: loginSchema,
    onSubmit: () => {
      console.log("data", formik.values);
    },
  });

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

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
            error={Boolean(formik.touched.document && Boolean(formik.errors.document))}
            helperText={(formik.touched.document && formik.errors.document) || ""}
          />
        </div>
        <div className="flex mt-4">
          <CustomSelectField
            items={groups}
            value={undefined}
            label="Grupo"
            name="group"
            onChange={() => { }}
            className=""
          />
          <CustomSelectField
            items={groups}
            value={undefined}
            label="Materia"
            name="matter"
            onChange={() => { }}
            className=""
          />
        </div>
        <div className="flex mt-4">
          <CustomDateField
            name="startDate"
            error={false}
            helperText={""}
            label="Fecha de inicio"
            onChange={() => { }}
            value={undefined}
          />
          <CustomDateField
            name="endDate"
            error={false}
            helperText={""}
            label="Fecha fin"
            onChange={() => { }}
            value={undefined}
          />
        </div>
        <div className="flex mt-4">
          <CustomSelectField
            items={reasons}
            value={undefined}
            label="Motivo"
            name="motive"
            onChange={() => { }}
          />
        </div>
        <Button
          className="mt-8"
          onClick={() => { }}
          color="success"
          variant="outlined"
        >
          Crear
        </Button>
      </form>
    </div>
  );
};

export default Absences;
